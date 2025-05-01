const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

// CORS配置
app.use(cors());

app.use(express.json());

// 文件上传配置
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

mongoose.connect('mongodb://localhost/talking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB连接成功'))
  .catch(err => console.error('MongoDB连接失败:', err));

// 数据模型
const Talking = mongoose.model('Talking', new mongoose.Schema({
  name: { type: String, default: '神秘访客' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

// 文件存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = allowedTypes.test(file.mimetype);
    extValid && mimeValid ? cb(null, true) : cb(new Error('仅支持图片文件'));
  }
});

// 证明开启
app.get('/', (req, res) => {
  res.send('欢迎访问甜蜜留言墙后台服务！');
});

// 静态资源服务
app.use('/uploads', express.static(uploadDir));

// 获取照片列表
app.get('/api/getphotos', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: '无法读取照片列表' });
    
    const photos = files
      .filter(file => ['.jpg','.jpeg','.png','.gif','.webp'].includes(path.extname(file).toLowerCase()))
      .map(file => ({
        url: `http://${req.headers.host}/uploads/${file}`, // 动态获取host
        filename: file,
        timestamp: fs.statSync(path.join(uploadDir, file)).mtimeMs
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    res.json(photos);
  });
});

// 照片上传功能 ✅
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '请选择要上传的图片' });
  }
  
  res.status(201).json({
    message: '图片上传成功',
    url: `http://${req.headers.host}/uploads/${req.file.filename}`,
    filename: req.file.filename
  });
});



// 获取留言列表
app.get('/api/getdate', async (req, res) => {
  try {
    const data = await Talking.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error('获取留言失败:', err);
    res.status(500).json({ message: "获取留言失败" });
  }
});

// 提交新留言
app.post('/api/postdate', async (req, res) => {
  try {
    const { name, message } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: "留言内容不能为空" });
    }

    const newMessage = await Talking.create({
      name: name || '神秘访客',
      message: message.trim()
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error('提交留言失败:', err);
    res.status(500).json({ message: "留言提交失败" });
  }
});


// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? '图片大小不能超过5MB' 
        : '文件上传错误' 
    });
  }
  
  res.status(500).json({ message: '服务器错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Upload directory: ${uploadDir}`);
});