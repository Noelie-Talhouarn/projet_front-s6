<script setup lang="ts">
import { ref, onBeforeUnmount, computed } from 'vue'

useSeoMeta({
  title: 'Respiration & Cohérence Cardiaque - L\'Étincelle',
  description: 'Relaxez-vous en 5 minutes avec notre guide de cohérence cardiaque.',
  ogTitle: 'Respiration - L\'Étincelle',
})

const showIntro = ref(true)
const isRunning = ref(false)
const instruction = ref('Prêt ?')
const currentPhase = ref<'inhale' | 'hold' | 'exhale'>('inhale')
const elapsedTime = ref(0) 

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string 

let breathingInterval: NodeJS.Timeout | null = null
let timerInterval: NodeJS.Timeout | null = null
let cycleTimeout: NodeJS.Timeout | null = null

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60)
  const seconds = elapsedTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const startBreathing = () => {
  showIntro.value = false
  isRunning.value = true
  elapsedTime.value = 0
  
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    elapsedTime.value++
  }, 1000)

  runCycle()
}

const stopBreathing = async () => {
  isRunning.value = false
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
        await $fetch(`${apiBase}/api/meditations/session`, {
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
  
  // Retourner à l'intro
  showIntro.value = true
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
  <div class="px-6 pb-20 pt-10 max-w-5xl mx-auto flex flex-col items-center">
    
    <header class="mb-12 md:mb-16 animate-fade-in-up text-center">
        <span class="text-xs font-bold uppercase tracking-[0.3em] text-spark-light/80 mb-3 block">Énergie</span>
        <h1 class="text-white font-zen tracking-[0.2em] text-2xl md:text-3xl uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">Le Souffle</h1>
        <div class="flex flex-col items-center gap-2 mt-4 md:mt-6">
            <div class="h-1 w-12 md:w-16 bg-spark rounded-full transition-all duration-700"></div>
            <p class="text-sm text-slate-400 tracking-widest uppercase mt-4">Cohérence cardiaque & apaisement</p>
        </div>
    </header>

    <!-- INTRODUCTION -->
    <div v-if="showIntro" class="animate-fade-in-up w-full max-w-lg space-y-8 rounded-[2.5rem] border border-white/10 bg-night-900/50 p-10 md:p-12 shadow-2xl backdrop-blur-xl">
      <div class="flex justify-center">
        <div class="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-spark shadow-lg shadow-spark/30 animate-pulse">
            <span class="text-4xl">🌬️</span>
        </div>
      </div>
      
      <p class="text-lg leading-relaxed text-slate-300">
        Prenez quelques instants pour reconnecter avec votre souffle. 
        Suivez la lumière : inspirez quand elle grandit, expirez quand elle rétrécit.
      </p>

      <div v-if="elapsedTime > 0" class="rounded-lg bg-white/5 py-2 text-sm text-spark-light animate-fade-in-up">
        Dernière session : {{ formattedTime }}
      </div>
      
      <div class="pt-4">
        <MyButton variant="pink" size="large" @click="startBreathing">
          {{ elapsedTime > 0 ? 'Recommencer' : 'Commencer la séance' }}
        </MyButton>
      </div>
    </div>

    <!-- EXERCICE DE RESPIRATION CIRCULAIRE -->
    <div v-else class="flex w-full flex-col items-center justify-center gap-12 animate-fade-in-up">
      
      <h2 class="text-3xl font-zen tracking-widest text-white transition-all duration-500">
        {{ instruction }}
      </h2>

      <!-- Visualization Container -->
      <div class="relative flex items-center justify-center h-96 w-96">
        
        <!-- Outer Glow (Ripple effect 1) -->
        <div 
          class="absolute h-80 w-80 rounded-full border border-spark/20 bg-spark/5 transition-all ease-in-out will-change-transform"
          :class="{
            'scale-100 opacity-100 duration-[5000ms]': currentPhase === 'inhale',
            'scale-50 opacity-50 duration-[5000ms]': currentPhase === 'exhale'
          }"
        ></div>

        <!-- Middle Glow (Ripple effect 2) -->
        <div 
          class="absolute h-60 w-60 rounded-full border border-spark/40 bg-spark/10 transition-all ease-in-out will-change-transform"
          :class="{
            'scale-100 opacity-100 duration-[5000ms]': currentPhase === 'inhale',
            'scale-50 opacity-60 duration-[5000ms]': currentPhase === 'exhale'
          }"
        ></div>

        <!-- Main Breathing Orb -->
        <div 
          class="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-spark shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all ease-in-out will-change-transform"
          :class="{
            'scale-150 shadow-[0_0_100px_rgba(236,72,153,0.6)] duration-[5000ms]': currentPhase === 'inhale',
            'scale-75 shadow-[0_0_30px_rgba(124,58,237,0.3)] duration-[5000ms]': currentPhase === 'exhale'
          }"
        >
          <span class="text-4xl filter drop-shadow-lg">✨</span>
        </div>

      </div>

      <div class="flex flex-col items-center gap-4">
        <div class="text-2xl font-mono font-medium text-slate-400 tracking-wider">
          {{ formattedTime }}
        </div>
        
        <div class="flex gap-3">
          <MyButton 
            :variant="isRunning ? 'default' : 'pink'" 
            size="small" 
            @click="isRunning ? stopBreathing() : startBreathing()"
          >
            {{ isRunning ? 'Pause' : 'Reprendre' }}
          </MyButton>
          
          <MyButton 
            variant="pink" 
            size="small" 
            @click="finishSession"
          >
            ✓ Terminer la session
          </MyButton>
        </div>
      </div>

    </div>
  </div>
</template>
