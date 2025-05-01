<template>
  <div class="photo-wall-container">
    <h1 class="candy-title">📸 我们的甜蜜瞬间</h1>

    <!-- 上传表单 -->
    <div class="upload-section">
      <input 
        type="file" 
        @change="handleFileSelect" 
        accept="image/*"
        ref="fileInput"
        class="file-input"
      >
      <button 
        @click="uploadPhoto" 
        class="upload-btn"

        :disabled="!selectedFile || isUploading"
      >
        {{ isUploading ? '上传中...' : '上传照片' }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-heart">💗</div>
      <div class="loading-text">加载甜蜜回忆中...</div>
    </div>

    <!-- 照片展示 -->
    <div class="photo-grid">
      <div 
        v-for="(photo, index) in photos" 
        :key="index"
        class="photo-item"
        @click="showFullscreen(photo.url)"
      >
        <img 
          :src="photo.url" 
          class="photo-thumb"
          loading="lazy"
        >
        <div class="photo-meta">
          <span class="photo-date">📅 {{ formatDate(photo.timestamp) }}</span>
        </div>
      </div>
    </div>

    <!-- 空状态提示 -->
    <div v-if="!isLoading && photos.length === 0" class="empty-state">
      还没有照片，快来上传第一张吧！✨
    </div>

    <!-- 全屏预览 -->
    <div 
      v-if="currentPhoto"
      class="photo-viewer"
      @click.self="closeFullscreen"
    >
      <div class="photo-content">
        <img :src="currentPhoto" class="photo-full">
        <button class="close-btn" @click="closeFullscreen">
          <span class="close-icon">×</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const photos = ref([])
const isLoading = ref(true)
const selectedFile = ref(null)
const isUploading = ref(false)
const currentPhoto = ref(null)
const fileInput = ref(null)

// 获取照片列表
const getPhotos = async () => {
  try {
    isLoading.value = true
    const { data } = await axios.get('http://localhost:3000/api/getphotos')
    photos.value = data
  } catch (err) {
    console.error('获取照片失败:', err)
    alert('获取照片失败，请刷新重试')
  } finally {
    isLoading.value = false
  }
}

// 处理文件选择
const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('请选择有效的图片文件')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过5MB')
    return
  }

  selectedFile.value = file
}

// 上传照片
const uploadPhoto = async () => {
  if (!selectedFile.value) return

  const formData = new FormData()
  formData.append('photo', selectedFile.value)

  try {
    isUploading.value = true
    const { data } = await axios.post('http://localhost:3000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    photos.value.unshift(data)
    selectedFile.value = null
    fileInput.value.value = ''
    alert('上传成功！🎉')
  } catch (err) {
    console.error('上传失败:', err)
    const errorMessage = err.response?.data?.message || '上传失败，请重试'
    alert(errorMessage)
  } finally {
    isUploading.value = false
  }
}

// 日期格式化
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 全屏查看
const showFullscreen = (url) => {
  currentPhoto.value = url
  document.body.style.overflow = 'hidden'
}

const closeFullscreen = () => {
  currentPhoto.value = null
  document.body.style.overflow = 'auto'
}

// 初始化加载
onMounted(() => {
  getPhotos()
})
</script>

<style scoped>
.photo-wall-container {
  padding: 30px 20px;
  min-height: 100vh;
  background: linear-gradient(150deg, #fff0f7 0%, #ffe6f0 100%);
  border-radius: 25px;
  margin-top: 1rem;
}

.candy-title {
  text-align: center;
  color: #ff6b6b;
  font-family: 'Baloo 2', cursive;
  font-size: 2.5rem;
  margin-bottom: 40px;
  text-shadow: 2px 2px 0px #fff;
  position: relative;
  z-index: 2;
}

.upload-section {
  max-width: 600px;
  margin: 0 auto 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  display: flex;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(255, 133, 162, 0.2);
  border: 2px solid #fff;
}

.file-input {
  flex: 1;
  padding: 12px;
  border: 2px dashed #ff9de2;
  border-radius: 12px;
  background: #fff5f8;
  color: #ff6b6b;
  font-size: 16px;
  transition: all 0.3s ease;
}

.file-input:hover {
  border-color: #ff6b6b;
  background: #fff0f5;
}

.upload-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #ff6b6b, #ff9de2);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
}

.upload-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
}

.upload-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: linear-gradient(135deg, #ff9de2, #ff6b6b);
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.photo-item {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(255, 133, 162, 0.2);
  background: white;
}

.photo-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
}

.photo-thumb {
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: white;
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.photo-date {
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #ff6b6b;
  font-size: 1.2rem;
  margin-top: 30px;
}

.loading-state {
  text-align: center;
  padding: 50px 0;
  color: #ff6b6b;
}

.loading-heart {
  font-size: 3rem;
  animation: heartbeat 1.2s infinite;
}

.loading-text {
  margin-top: 15px;
  font-size: 1.1rem;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.photo-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.photo-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(255, 182, 193, 0.5);
}

.photo-full {
  max-width: 100%;
  max-height: 80vh;
  display: block;
  margin: 0 auto;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  font-size: 28px;
  line-height: 1;
  margin-bottom: 2px;
}

.close-btn:hover {
  background: #ff5252;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 15px;
  }

  .photo-thumb {
    height: 200px;
  }

  .candy-title {
    font-size: 2rem;
  }

  .upload-section {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .photo-grid {
    grid-template-columns: 1fr;
  }

  .photo-thumb {
    height: 250px;
  }

  .upload-section {
    flex-direction: column;
  }

  .file-input {
    width: 100%;
  }

  .upload-btn {
    width: 100%;
  }
}
</style>