<script setup lang="ts">


const props = defineProps<{
  session: Meditation
  autoPlay?: boolean
}>()

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
}>()

// État local du lecteur
const audioPlayer = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// Gestion du chargement
watch(() => props.session, (newSession) => {
  if (audioPlayer.value && newSession) {
    audioPlayer.value.src = newSession.audioUrl
    audioPlayer.value.load()
    if (props.autoPlay) {
      play()
    } else {
      isPlaying.value = false
    }
  }
}, { immediate: true }) // important pour le premier chargement

function togglePlay() {
  if (!audioPlayer.value) return
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

function play() {
  if (!audioPlayer.value) return
  const playPromise = audioPlayer.value.play()
  if (playPromise !== undefined) {
    playPromise
      .then(() => { 
        isPlaying.value = true
        emit('play')
      })
      .catch(error => { 
        console.error("Erreur lecture:", error)
        isPlaying.value = false 
      })
  }
}

function pause() {
  if (!audioPlayer.value) return
  audioPlayer.value.pause()
  isPlaying.value = false
  emit('pause')
}

// Events Audio
function onTimeUpdate() {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime
    if (audioPlayer.value.duration) duration.value = audioPlayer.value.duration
  }
}

function onEnded() {
  isPlaying.value = false
  currentTime.value = 0
  emit('ended')
}

function onError(e: Event) {
  console.error("Erreur chargement audio", e)
}

function seek(event: Event) {
  const input = event.target as HTMLInputElement
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = Number(input.value)
  }
}

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="mb-8 relative w-full aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 group animate-fade-in-up transition-all duration-500">
    
    <!-- Audio Element -->
    <audio 
      ref="audioPlayer" 
      @timeupdate="onTimeUpdate" 
      @ended="onEnded"
      @loadedmetadata="onTimeUpdate"
      @error="onError"
      crossorigin="anonymous"
    ></audio>

    <!-- Image de fond -->
    <div class="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-110" 
         :style="{ backgroundImage: `url(${session.imageUrl || 'https://images.unsplash.com/photo-1519681393797-a1205ee31c33?q=80&w=1000'})` }">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
    </div>

    <!-- Interface -->
    <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
      
      <h2 class="text-2xl font-bold text-white mb-1 drop-shadow-lg">{{ session.title }}</h2>
      <p class="text-sm text-white/70 mb-8 font-light uppercase tracking-widest">{{ session.category }}</p>

      <!-- Bouton Play -->
      <button 
        @click="togglePlay"
        class="w-20 h-20 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 hover:scale-110 hover:bg-white/20 transition-all duration-300 group shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-20"
      >
        <span v-if="!isPlaying" class="text-3xl ml-1 text-white">▶</span>
        <span v-else class="text-3xl text-white">⏸</span>
      </button>

      <!-- Respiration -->
      <div 
        class="absolute w-20 h-20 rounded-full border border-white/30 pointer-events-none transition-transform duration-[4000ms] ease-in-out"
        :class="{'scale-[2.5] opacity-0': isPlaying, 'scale-100 opacity-50': !isPlaying}"
        style="animation: breathing 8s infinite ease-in-out"
        v-show="isPlaying"
      ></div>
      
      <!-- Barre de progression -->
      <div class="absolute bottom-8 left-8 right-8">
        <div class="flex justify-between text-[10px] text-white/50 mb-2 font-mono">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          :max="duration" 
          :value="currentTime" 
          @input="seek"
          class="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white transition-all hover:h-2"
        />
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes breathing {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.5); opacity: 0; }
}
</style>
