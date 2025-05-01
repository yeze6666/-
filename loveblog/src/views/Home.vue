<template>
    <div class="home-container">
      <!-- 背景装饰元素 -->
      <div class="deco-cloud"></div>
      <div class="deco-heart">💖</div>
  
      <!-- 主要内容区 -->
      <main class="love-content">
        <!-- 欢迎标题 -->
        <h1 class="magic-title">
          🎀 欢迎来到我们的甜蜜小窝 🎀
        </h1>
  
        <!-- 恋爱计时器 -->
        <div class="love-timer">
          <div class="timer-box">
            <span class="days">{{ togetherDays }}</span>
            <div class="timer-label">
              <span>❤️ 恋爱天数 ❤️</span>
              <p>从 {{ startDate }} 开始</p>
            </div>
          </div>
        </div>
  
        <!-- 功能入口 -->
        <div class="function-grid">
          <router-link to="/Picture" class="func-card photo-card">
            📸 今日甜蜜瞬间
          </router-link>
          <router-link to="/Article" class="func-card message-card">
            💌 发送心动讯息
          </router-link>
        </div>
  
        <!-- 每日寄语 -->
        <div class="daily-msg">
          🌈 今日恋爱小任务：{{ dailyTask }}
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  // 恋爱开始日期（根据实际修改）
  const startDate = ref('2025-04-25')
  const togetherDays = ref(0)
  
  // 每日任务列表
  const tasks = [
    '互相分享今天的云朵形状',
    '一起回忆第一次约会',
    '为对方准备小惊喜',
    '给对方一个温暖的拥抱',
    '共同制作爱心晚餐',
    '写下想说的情话',
    '一起分享彩虹屁',
    '一起看电影',
    '一起去海边',
    '一起去野餐',
    '一起去动物园',
    '说宝宝我爱你'
  ]
  
  // 计算恋爱天数
  const calculateDays = () => {
    const start = new Date(startDate.value)
    const today = new Date()
    const diff = today - start
    togetherDays.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  }
  
  // 获取每日任务
  const dailyTask = ref('')
  const getDailyTask = () => {
    const dayIndex = new Date().getDay()
    dailyTask.value = tasks[dayIndex % tasks.length]
  }
  
  // 初始化
  onMounted(() => {
    calculateDays()
    getDailyTask()
    // 每天更新计时器
    setInterval(() => {
      const now = new Date()
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        calculateDays()
        getDailyTask()
      }
    }, 60000)
  })
  </script>
  
  <style scoped>
  .home-container {
    min-height: 100vh;
    background: linear-gradient(150deg, #ffe6f0 0%, #fff0f7 100%);
    padding: 40px 20px;
    position: relative;
    overflow: hidden;
    margin-top: 1rem;
    border-radius: 25px;
  }
  
  .magic-title {
    text-align: center;
    color: #ff6b6b;
    font-family: 'Baloo 2', cursive;
    font-size: 2.5rem;
    margin-bottom: 40px;
    text-shadow: 2px 2px 0px #fff;
    animation: titleFloat 3s ease-in-out infinite;
  }
  
  .love-timer {
    display: flex;
    justify-content: center;
    margin: 30px 0;
  }
  
  .timer-box {
    background: rgba(255, 255, 255, 0.9);
    padding: 25px 40px;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(255, 133, 162, 0.2);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: transform 0.3s ease;
  }
  
  .timer-box:hover {
    transform: translateY(-5px);
  }
  
  .days {
    font-size: 3.5rem;
    font-weight: 800;
    color: #ff85a2;
    text-shadow: 2px 2px 0px #fff;
    min-width: 120px;
    text-align: center;
  }
  
  .timer-label {
    font-family: 'Comic Sans MS', cursive;
    color: #ff6b6b;
  }
  
  .timer-label span {
    font-size: 1.4rem;
    display: block;
    margin-bottom: 5px;
  }
  
  .timer-label p {
    font-size: 0.9rem;
    color: #ff9de2;
    margin: 0;
  }
  
  .function-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    max-width: 800px;
    margin: 40px auto;
  }
  
  .func-card {
    padding: 30px 20px;
    border-radius: 20px;
    text-align: center;
    font-size: 1.3rem;
    font-weight: 600;
    color: white;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    text-decoration: none;
    position: relative;
    overflow: hidden;
  }
  
  .photo-card {
    background: linear-gradient(45deg, #ff9de2, #ff6b6b);
  }
  
  .message-card {
    background: linear-gradient(45deg, #ff6b6b, #ff9de2);
  }
  
  .func-card:hover {
    transform: scale(1.05) rotate(3deg);
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
  }
  
  .daily-msg {
    text-align: center;
    font-size: 1.2rem;
    color: #ff6b6b;
    padding: 25px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    max-width: 600px;
    margin: 10vh auto;
    animation: pulse 2s infinite;
  }
  
  .deco-cloud {
    position: absolute;
    width: 200px;
    height: 80px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 40px;
    top: 10%;
    left: -50px;
    animation: cloudMove 20s linear infinite;
  }
  
  .deco-cloud::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 60px;
    background: inherit;
    border-radius: 50%;
    top: -30px;
    left: 30px;
  }
  
  .deco-heart {
    position: absolute;
    font-size: 3rem;
    right: 5%;
    top: 15%;
    animation: heartBeat 1.5s ease-in-out infinite;
  }
  
  @keyframes titleFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes cloudMove {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(100vw + 200px)); }
  }
  
  @keyframes heartBeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  @media (max-width: 768px) {
    .magic-title {
      font-size: 2rem;
    }
    
    .timer-box {
      flex-direction: column;
      padding: 20px;
    }
    
    .days {
      font-size: 2.5rem;
    }
  }
  </style>