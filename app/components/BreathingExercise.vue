<script setup lang="ts">
import { ref, onBeforeUnmount, computed } from 'vue'

const isRunning = ref(false)
const instruction = ref('Prêt ?')
const currentPhase = ref<'inhale' | 'hold' | 'exhale'>('inhale')
const elapsedTime = ref(0) 

let breathingInterval: NodeJS.Timeout | null = null
let timerInterval: NodeJS.Timeout | null = null
let cycleTimeout: NodeJS.Timeout | null = null

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60)
  const seconds = elapsedTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const startBreathing = () => {
  isRunning.value = true
  elapsedTime.value = 0
  
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    elapsedTime.value++
  }, 1000)

  runCycle()
}

const stopBreathing = () => {
  isRunning.value = false
  instruction.value = 'Pause'
  if (timerInterval) clearInterval(timerInterval)
  if (cycleTimeout) clearTimeout(cycleTimeout)
}

const finishSession = async () => {
  // Arrêter l'exercice
  stopBreathing()
  
  // Sauvegarder la session si du temps a été écouté
  if (elapsedTime.value > 0) {
    try {
      const seconds = elapsedTime.value
      const token = useCookie('auth_token')
      
      if (token.value) {
        console.log("🏁 Fin de session cohérence, temps écouté:", seconds, 's')
        await $fetch('/api/meditations/session', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          },
          body: {
            duration: seconds,
            type: 'coherence_cardiaque'
          }
        })
        console.log("✅ Séance de respiration enregistrée 🌬️")
      }
    } catch (e) {
      console.error("❌ Erreur sauvegarde respiration", e)
    }
  }
  
  // Réinitialiser
  elapsedTime.value = 0
  instruction.value = 'Prêt ?'
}

const toggleBreathing = () => {
  if (isRunning.value) {
    stopBreathing()
  } else {
    startBreathing()
  }
}

const runCycle = () => {
  // Inspiration (5s)
  instruction.value = 'Inspirez...'
  currentPhase.value = 'inhale'
  
  cycleTimeout = setTimeout(() => {
    if (!isRunning.value) return
    
    // Expiration (5s)
    instruction.value = 'Expirez...'
    currentPhase.value = 'exhale'

    cycleTimeout = setTimeout(() => {
      if (!isRunning.value) return
      runCycle()
    }, 5000)

  }, 5000)
}

onBeforeUnmount(() => {
  isRunning.value = false
  if (timerInterval) clearInterval(timerInterval)
  if (cycleTimeout) clearTimeout(cycleTimeout)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 text-center">
    
    <!-- EXERCICE DE RESPIRATION CIRCULAIRE -->
    <div class="flex w-full flex-col items-center justify-center animate-fade-in-up">
      
      <h2 class="text-3xl font-bold tracking-widest text-white transition-all duration-500 h-10">
        {{ instruction }}
      </h2>

      <!-- Visualization Container -->
      <div class="relative flex items-center justify-center h-80 w-96">
        
        <!-- Outer Glow (Ripple effect 1) -->
        <div 
          class="absolute h-80 w-80 rounded-full border border-spark/20 bg-spark/5 transition-all ease-in-out will-change-transform"
          :class="{
            'scale-100 opacity-100 duration-[5000ms]': currentPhase === 'inhale' && isRunning,
            'scale-50 opacity-50 duration-[5000ms]': currentPhase === 'exhale' && isRunning,
            'scale-75 opacity-30 duration-1000' : !isRunning
          }"
        ></div>

        <!-- Middle Glow (Ripple effect 2) -->
        <div 
          class="absolute h-60 w-60 rounded-full border border-spark/40 bg-spark/10 transition-all ease-in-out will-change-transform"
          :class="{
            'scale-100 opacity-100 duration-[5000ms]': currentPhase === 'inhale' && isRunning,
            'scale-50 opacity-60 duration-[5000ms]': currentPhase === 'exhale' && isRunning,
            'scale-75 opacity-40 duration-1000' : !isRunning
          }"
        ></div>

        <!-- Main Breathing Orb -->
        <div 
          class="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-spark shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all ease-in-out will-change-transform"
          :class="{
            'scale-150 shadow-[0_0_100px_rgba(236,72,153,0.6)] duration-[5000ms]': currentPhase === 'inhale' && isRunning,
            'scale-75 shadow-[0_0_30px_rgba(124,58,237,0.3)] duration-[5000ms]': currentPhase === 'exhale' && isRunning,
            'scale-100 shadow-[0_0_40px_rgba(124,58,237,0.4)] duration-1000' : !isRunning
          }"
        >
          <span class="text-4xl filter drop-shadow-lg">✨</span>
        </div>

      </div>

      <div class="flex flex-col items-center gap-6">
        <div class="text-2xl font-mono font-bold text-slate-400 tracking-wider">
          {{ formattedTime }}
        </div>
        
        <div class="flex gap-3">
          <MyButton 
            :variant="isRunning ? 'default' : 'pink'" 
            size="large" 
            @click="toggleBreathing"
          >
            {{ isRunning ? 'Pause' : (elapsedTime > 0 ? 'Reprendre' : 'Commencer la séance') }}
          </MyButton>

          <MyButton 
            v-if="elapsedTime > 0"
            variant="pink" 
            size="large" 
            @click="finishSession"
          >
            ✓ Terminer
          </MyButton>
        </div>

        <p v-if="!isRunning && elapsedTime === 0" class="text-slate-400 text-sm max-w-sm">
            Inspirez quand la lumière grandit, expirez quand elle rétrécit.
        </p>
      </div>

    </div>
  </div>
</template>
