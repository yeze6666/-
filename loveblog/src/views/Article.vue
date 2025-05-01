<template>
  <div class="message-container">
    <!-- 动态背景元素 -->
    <div class="bg-heart"></div>
    <div class="bg-sparkle"></div>
    
    <!-- 飘落元素 -->
    <div class="falling-elements">
      <div v-for="n in 20" :key="n" class="fall-item">
        <span v-if="n%3 === 0">🌸</span>
        <span v-else-if="n%3 === 1">💖</span>
        <span v-else>🌟</span>
      </div>
    </div>

    <!-- 留言板主体 -->
    <div class="message-board">
      <h1 class="magic-title">
        <span class="title-text">💌 甜蜜留言墙</span>
        <div class="title-deco"></div>
      </h1>

      <!-- 输入区域 -->
      <div class="input-wrapper">
        <div class="input-container">
          <textarea
            v-model="messageInput"
            placeholder="写下你的甜蜜留言..."
            class="magic-input"
            rows="3"
            :disabled="isSubmitting"
          ></textarea>
          <input
            v-model="authorInput"
            placeholder="你的昵称（可选）"
            class="magic-input author-input"
          >
          <button 
            @click="addMessage" 
            class="send-btn"
            :disabled="isSubmitting"
          >
            <span class="btn-text">{{ isSubmitting ? '发送中...' : '发送甜蜜留言' }}</span>
          </button>
        </div>
      </div>

      <!-- 留言列表 -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-heart">💗</div>
        <div class="loading-text">正在加载甜蜜回忆...</div>
      </div>
      
      <transition-group v-else name="list" tag="div" class="message-list">
        <div 
          v-for="(msg, index) in messages" 
          :key="msg._id"
          class="message-card"
          :class="{ 'left-card': index % 2 === 0, 'right-card': index % 2 !== 0 }"
        >
          <div class="card-content">
            <div class="card-header">
              <div class="meta-info">
                <div class="message-author">{{ msg.name || "神秘访客" }}</div>
                <div class="message-date">{{ formatTime(msg.createdAt) }}</div>
              </div>
            </div>
            <div class="card-body">
              {{ msg.message }}
            </div>
            <div class="card-footer">
              <div class="deco-line"></div>
              <div class="reaction-btn">💖</div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const messages = ref([])
const messageInput = ref('')
const authorInput = ref('')
const isLoading = ref(true)
const isSubmitting = ref(false)

const API_BASE = 'http://localhost:3000/api'

const loadMessages = async () => {
  try {
    const response = await axios.get(`${API_BASE}/getdate`)
    messages.value = response.data
  } catch (error) {
    console.error('加载留言失败:', error)
    alert('无法加载留言，请刷新重试')
  } finally {
    isLoading.value = false
  }
}

const addMessage = async () => {
  if (!messageInput.value.trim() || isSubmitting.value) return

  isSubmitting.value = true
  try {
    await axios.post(`${API_BASE}/postdate`, {
      name: authorInput.value.trim() || undefined,
      message: messageInput.value.trim()
    })
    await loadMessages()
    messageInput.value = ''
    authorInput.value = ''
  } catch (error) {
    console.error('提交失败:', error)
    alert('留言提交失败：' + (error.response?.data?.message || '服务器错误'))
  } finally {
    isSubmitting.value = false
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return '未知时间'
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

onMounted(() => {
  loadMessages()
})
</script>

<style scoped>
.message-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff0f7 0%, #ffe6f3 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  border-radius: 25px;
  margin-top: 1rem;
}

.bg-heart {
  position: fixed;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(255,182,193,0.1) 0%, transparent 70%);
  top: -300px;
  left: -200px;
  z-index: 1;
}

.bg-sparkle {
  position: fixed;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.1;
  z-index: 1;
}

.falling-elements .fall-item {
  position: absolute;
  animation: fall 8s linear infinite;
  opacity: 0.3;
  z-index: 1;
  font-size: 1.5rem;
}

@keyframes fall {
  0% { transform: translateY(-10vh) rotate(0deg); }
  100% { transform: translateY(110vh) rotate(360deg); }
}

.magic-title {
  text-align: center;
  margin: 0 auto 50px;
  position: relative;
  z-index: 3;
  max-width: 600px;
}

.title-text {
  display: inline-block;
  font-family: 'Baloo 2', cursive;
  font-size: 2.8rem;
  color: #ff6b6b;
  text-shadow: 2px 2px 0px #fff;
  padding: 0 30px;
  background: linear-gradient(45deg, #ff9de2, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 2;
}

.title-deco {
  position: absolute;
  width: 120%;
  height: 40px;
  background: rgba(255,255,255,0.3);
  bottom: -10px;
  left: -10%;
  border-radius: 20px;
  filter: blur(15px);
  z-index: 1;
}

.input-wrapper {
  max-width: 800px;
  margin: 0 auto 40px;
  position: relative;
  z-index: 2;
}

.input-container {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(255,107,107,0.1);
  border: 2px solid #fff;
}

.magic-input {
  width: 95%;
  border: none;
  background: #fff5f8;
  border-radius: 15px;
  padding: 15px 20px;
  font-size: 1.1rem;
  color: #ff6b6b;
  resize: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 5px rgba(255,107,107,0.1);
}

.magic-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px #ffd9e6, inset 0 2px 5px rgba(255,107,107,0.1);
}

.author-input {
  margin-top: 15px;
  width: 50% !important;
  padding: 12px 20px !important;
}

.send-btn {
  position: relative;
  background: linear-gradient(45deg, #ff6b6b, #ff9de2);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 1.1rem;
  margin-top: 20px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.send-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255,255,255,0.3),
    transparent
  );
  transition: 0.5s;
}

.send-btn:hover::before {
  left: 100%;
}

.send-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(255,107,107,0.3);
}

.message-card {
  max-width: 600px;
  margin: 0 auto 25px;
  perspective: 1000px;
}

.card-content {
  background: white;
  border-radius: 20px;
  padding: 25px;
  position: relative;
  transition: transform 0.3s ease;
  box-shadow: 0 5px 15px rgba(255,107,107,0.1);
}

.left-card .card-content {
  transform: rotateZ(-1deg);
}

.right-card .card-content {
  transform: rotateZ(1deg);
}

.message-card:hover .card-content {
  transform: rotateZ(0) translateY(-5px);
}

.card-header {
  margin-bottom: 15px;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-author {
  font-weight: 600;
  color: #ff6b6b;
  font-size: 1.1rem;
}

.message-date {
  color: #ff9de2;
  font-size: 0.9rem;
}

.card-body {
  margin: 15px 0;
  padding: 15px;
  background: #fff5f8;
  border-radius: 10px;
  color: #ff6b6b;
  line-height: 1.6;
}

.deco-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff9de2, transparent);
  margin: 10px 0;
}

.reaction-btn {
  display: inline-block;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.reaction-btn:hover {
  transform: scale(1.2);
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #ff6b6b;
}

.loading-heart {
  font-size: 3rem;
  animation: heartbeat 1.2s infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 768px) {
  .magic-title {
    font-size: 2rem;
  }
  
  .input-container {
    padding: 15px;
  }
  
  .message-card {
    max-width: 90%;
  }

  .magic-input {
    font-size: 1rem;
  }

  .message-author {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .message-container {
    padding: 20px 10px;
  }

  .title-text {
    font-size: 2rem;
    padding: 0 15px;
  }

  .author-input {
    width: 100% !important;
  }

  .send-btn {
    width: 100%;
    padding: 12px;
  }
}
</style>