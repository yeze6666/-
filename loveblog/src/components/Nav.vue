<template>
    <header class="candy-header">
        <h1 class="magic-logo">🍬糖果乐园</h1>
        <nav class="bounce-nav">
            <Router-link to="/Home" active-class="active">🍭首页</Router-link>
            <Router-link to="/Picture" active-class="active">📸照片</Router-link>
            <Router-link to="/Article" active-class="active">💌留言</Router-link>
        </nav>
    </header>
</template>

<script setup>
    import { RouterLink } from 'vue-router'
</script>

<style scoped>
    .candy-header {
        background: linear-gradient(135deg, #ff9de2 0%, #ffe3f3 100%);
        height: 90px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 50px;
        box-shadow: 0 8px 20px rgba(255, 182, 193, 0.25);
        border-radius: 12px 12px 25px 25px;
        position: relative;
        overflow: hidden;
    }

    .candy-header::before {
        content: '';
        position: absolute;
        width: 150%;
        height: 40px;
        background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 15px,
            rgba(255,255,255,0.3) 15px,
            rgba(255,255,255,0.3) 30px
        );
        bottom: -10px;
        animation: sparkleFlow 20s linear infinite;
    }

    .magic-logo {
        font-family: 'Baloo 2', cursive;
        color: #ff6b6b;
        font-size: 2.2rem;
        text-shadow: 2px 2px 0 #fff,
                    4px 4px 0 rgba(255, 107, 107, 0.2);
        transform-style: preserve-3d;
        animation: logoFloat 3s ease-in-out infinite;
    }

    .bounce-nav {
        display: flex;
        gap: 35px;
        position: relative;
        z-index: 2;
    }

    a {
        color: #ff85a2;
        text-decoration: none;
        font-weight: 700;
        padding: 12px 25px;
        border-radius: 35px;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 4px 15px rgba(255, 133, 162, 0.2);
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.1rem;
    }

    a:hover {
        transform: translateY(-5px) rotate(3deg);
        background: white;
        box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
        color: #ff6b6b;
    }

    a.active {
        background: white;
        color: #ff6b6b;
        transform: scale(1.1) rotate(-5deg);
        box-shadow: 0 0 0 4px #ff9de2,
                    0 10px 20px rgba(255, 157, 226, 0.3);
        animation: buttonPop 0.4s ease-out;
    }

    a.active::after {
        content: '🌟';
        position: absolute;
        right: -15px;
        top: -10px;
        animation: starTwinkle 1.5s infinite;
    }

    a::before {
        content: '';
        position: absolute;
        width: 0;
        height: 100%;
        background: linear-gradient(45deg, #ff9de2, #ffe3f3);
        left: 0;
        top: 0;
        transition: width 0.3s ease;
        z-index: -1;
        border-radius: 35px;
    }

    a:hover::before {
        width: 100%;
    }

    @keyframes logoFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(3deg); }
    }

    @keyframes sparkleFlow {
        0% { transform: translateX(-30%); }
        100% { transform: translateX(0); }
    }

    @keyframes buttonPop {
        0% { transform: scale(0.9) rotate(10deg); }
        50% { transform: scale(1.15) rotate(-8deg); }
        100% { transform: scale(1.1) rotate(-5deg); }
    }

    @keyframes starTwinkle {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
    }

    @media (max-width: 768px) {
        .candy-header {
            padding: 0 20px;
            height: 80px;
        }
        .bounce-nav {
            gap: 15px;
        }
        a {
            padding: 8px 15px;
            font-size: 1rem;
        }
    }
</style>