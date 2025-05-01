const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());

// 数据库连接
mongoose.connect('mongodb://localhost/talking')
  .then(() => console.log('成功连接到MongoDB'))
  .catch(err => console.error('数据库连接失败:', err));

// 数据模型
const talkingSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '神秘访客'
  },
  message: {
    type: String,
    required: [true, '留言内容不能为空']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Talking = mongoose.model('Talking', talkingSchema);

// 路由配置
app.get('/', (req, res) => {
  res.send('欢迎访问甜蜜留言墙后台服务！');
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

// 启动服务器
const PORT =  3000;
app.listen(PORT, () => {
  console.log(`服务已启动在 http://localhost:${PORT}`);
});