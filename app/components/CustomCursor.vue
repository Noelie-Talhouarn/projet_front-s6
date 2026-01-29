<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)
const dotX = ref(0)
const dotY = ref(0)
const isPointer = ref(false)
const isClicking = ref(false)
const isVisible = ref(false)

// Système de particules pour les étincelles
const sparkles = ref<{ id: number, x: number, y: number, vx: number, vy: number, size: number, opacity: number, color: string }[]>([])
let nextSparkleId = 0

const createSparkle = (cx: number, cy: number, isBurst = false) => {
  const id = nextSparkleId++
  const size = Math.random() * 4 + 2
  const colors = ['#ffffff', '#c084fc', '#ec4899', '#f97316']
  const color = colors[Math.floor(Math.random() * colors.length)] || '#fff'
  
  // Vélocité aléatoire
  const angle = Math.random() * Math.PI * 2
  const speed = isBurst ? Math.random() * 4 + 2 : Math.random() * 1 + 0.5
  
  sparkles.value.push({
    id,
    x: cx,
    y: cy,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size,
    opacity: 1,
    color
  })

  // Nettoyage automatique
  setTimeout(() => {
    sparkles.value = sparkles.value.filter(s => s.id !== id)
  }, 1000)
}

const updateMouse = (e: MouseEvent) => {
  x.value = e.clientX
  y.value = e.clientY
  isVisible.value = true
  
  if (Math.random() > 0.7) {
    createSparkle(e.clientX, e.clientY)
  }
}

const updateTouch = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (touch) {
    x.value = touch.clientX
    y.value = touch.clientY
    isVisible.value = true
    createSparkle(touch.clientX, touch.clientY, true)
  }
}

const checkPointer = () => {
  const target = document.elementFromPoint(x.value, y.value)
  if (!target) return
  
  const style = window.getComputedStyle(target)
  isPointer.value = 
    style.cursor === 'pointer' || 
    target.closest('button') !== null || 
    target.closest('a') !== null
}

const onMouseDown = () => {
  isClicking.value = true
  // Explosion d'étincelles au clic (réduit pour plus de subtilité)
  for (let i = 0; i < 8; i++) {
    createSparkle(x.value, y.value, true)
  }
}
const onMouseUp = () => isClicking.value = false

// Smooth follower logic
const animate = () => {
  const diffX = x.value - dotX.value
  const diffY = y.value - dotY.value
  
  dotX.value += diffX * 0.15
  dotY.value += diffY * 0.15
  
  // Mise à jour des particules
  sparkles.value.forEach(s => {
    s.x += s.vx
    s.y += s.vy
    s.vy += 0.05 // Gravité
    s.opacity -= 0.015
  })
  
  requestAnimationFrame(animate)
}

onMounted(() => {
  window.addEventListener('mousemove', updateMouse)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('mouseover', checkPointer)
  window.addEventListener('touchstart', updateTouch)
  
  dotX.value = window.innerWidth / 2
  dotY.value = window.innerHeight / 2
  
  animate()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('mouseover', checkPointer)
  window.removeEventListener('touchstart', updateTouch)
})
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 pointer-events-none z-[9999]">
    
    <!-- Traînée d'étincelles (Visible partout) -->
    <div 
      v-for="sparkle in sparkles" 
      :key="sparkle.id"
      class="absolute rounded-full"
      :style="{
        left: `${sparkle.x}px`,
        top: `${sparkle.y}px`,
        width: `${sparkle.size}px`,
        height: `${sparkle.size}px`,
        backgroundColor: sparkle.color,
        opacity: sparkle.opacity,
        boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
        transform: `scale(${sparkle.opacity})`
      }"
    ></div>

    <!-- Éléments du curseur (Uniquement sur desktop) -->
    <div class="hidden md:block">
      <!-- Halo de lueur -->
      <div 
        class="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out blur-xl"
        :style="{ 
          left: `${dotX}px`, 
          top: `${dotY}px`,
          width: isPointer ? '80px' : '50px',
          height: isPointer ? '80px' : '50px',
          background: isPointer ? 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)'
        }"
      ></div>

      <!-- L'Étincelle Centrale -->
      <div 
        class="absolute -translate-x-1/2 -translate-y-1/2"
        :style="{ 
          left: `${x}px`, 
          top: `${y}px`
        }"
      >
        <div 
          class="rounded-full bg-white shadow-[0_0_20px_white] transition-all duration-200"
          :class="[
            isClicking ? 'w-1 h-1' : (isPointer ? 'w-4 h-4' : 'w-2 h-2'),
            isPointer ? 'bg-spark-light' : 'bg-white'
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* On cache le vrai curseur uniquement sur desktop */
@media (min-width: 768px) {
  :global(body) {
    cursor: none !important;
  }

  :global(a, button, [role="button"]) {
    cursor: none !important;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
</style>
