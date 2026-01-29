<script setup lang="ts">


const props = defineProps<{
  session: Meditation
  autoPlay?: boolean
}>()

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
}>()

const { isMeditationFavorite, toggleMeditationFavorite, fetchFavorites } = useFavorites()


// État local du lecteur
const audioPlayer = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
let sessionSaved = false // Flag pour éviter les doublons
let lastSavedTime = 0 // Dernier temps sauvegardé
let autoSaveInterval: NodeJS.Timeout | null = null // Intervalle de sauvegarde automatique

// Fonction pour enregistrer la session de méditation
async function saveMeditationSession(timeListened: number, isIncremental = false) {
  // Ne pas enregistrer si aucun temps écouté
  if (timeListened <= 0) {
    console.log('⏭️ Aucun temps écouté, non enregistrée')
    return
  }

  // Pour les sauvegardes incrémentielles, enregistrer seulement le nouveau temps
  const timeToSave = isIncremental ? timeListened - lastSavedTime : timeListened
  
  if (timeToSave <= 0) {
    console.log('⏭️ Aucun nouveau temps à enregistrer')
    return
  }

  try {
    const seconds = Math.floor(timeToSave)
    const token = useCookie('auth_token')
    
    if (!token.value) {
      console.error('❌ Pas de token, impossible d\'enregistrer')
      return
    }

    console.log(`📝 Enregistrement de ${seconds}s de méditation...`)

    await $fetch(`${apiBase}/api/meditations/session`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        duration: seconds,
        type: 'meditation',
        meditationId: props.session.id
      }
    })
    
    console.log('✅ Session de méditation enregistrée')
    lastSavedTime = timeListened // Mettre à jour le dernier temps sauvegardé
    if (!isIncremental) {
      sessionSaved = true // Marquer comme enregistré seulement pour la sauvegarde finale
    }
  } catch (e) {
    console.error('❌ Erreur sauvegarde séance', e)
  }
}

// Démarrer la sauvegarde automatique périodique
function startAutoSave() {
  // Sauvegarder toutes les 30 secondes pendant la lecture
  if (autoSaveInterval) clearInterval(autoSaveInterval)
  
  autoSaveInterval = setInterval(() => {
    if (audioPlayer.value && isPlaying.value) {
      const currentListenedTime = audioPlayer.value.currentTime
      console.log('⏱️ Sauvegarde automatique périodique:', Math.floor(currentListenedTime), 's')
      saveMeditationSession(currentListenedTime, true) // true = sauvegarde incrémentielle
    }
  }, 30000) // 30 secondes
}

// Arrêter la sauvegarde automatique
function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
  }
}

// Gestion du chargement
function loadSession() {
  if (audioPlayer.value && props.session) {
    audioPlayer.value.src = props.session.audioUrl
    audioPlayer.value.load()
    sessionSaved = false // Réinitialiser pour la nouvelle session
    lastSavedTime = 0 // Réinitialiser le temps sauvegardé
    if (props.autoPlay) {
      play()
    } else {
      isPlaying.value = false
    }
  }
}

onMounted(() => {
  fetchFavorites()
  loadSession()
})

watch(() => props.session, () => {
  sessionSaved = false // Nouvelle méditation = nouveau flag
  lastSavedTime = 0
  stopAutoSave() // Arrêter l'ancien intervalle
  loadSession()
})

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
        startAutoSave() // Démarrer la sauvegarde automatique
        emit('play')
      })
      .catch(error => { 
        // Autoplay bloqué par le navigateur (normal si pas d'interaction préalable)
        if (error.name === 'NotAllowedError') {
            isPlaying.value = false
        } else {
            console.error("Erreur lecture:", error)
            isPlaying.value = false 
        }
      })
  }
}

function pause() {
  if (!audioPlayer.value) return
  audioPlayer.value.pause()
  isPlaying.value = false
  stopAutoSave() // Arrêter la sauvegarde automatique en pause
  emit('pause')
}

// Events Audio
function onTimeUpdate() {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime
    if (audioPlayer.value.duration) duration.value = audioPlayer.value.duration
  }
}

// CAS 3 : Audio terminé complètement
async function onEnded() {
  isPlaying.value = false
  stopAutoSave() // Arrêter la sauvegarde automatique
  emit('ended')

  if (audioPlayer.value) {
    const timeListened = audioPlayer.value.currentTime
    console.log('🎵 Audio terminé, temps écouté:', Math.floor(timeListened), 's')
    await saveMeditationSession(timeListened, true) // Sauvegarder le temps restant
  }
  
  currentTime.value = 0
}

// Nettoyage lors de la destruction du composant
onBeforeUnmount(() => {
  stopAutoSave() // Arrêter l'intervalle
  
  // Sauvegarder le temps restant si l'utilisateur quitte
  if (audioPlayer.value && currentTime.value > 0) {
    const timeListened = audioPlayer.value.currentTime
    const remainingTime = timeListened - lastSavedTime
    if (remainingTime > 0) {
      console.log('🧹 Sauvegarde finale avant destruction:', Math.floor(remainingTime), 's')
      // Sauvegarde synchrone rapide
      saveMeditationSession(timeListened, true)
    }
  }
})

// Fonction pour terminer manuellement la session
async function finishSession() {
  if (audioPlayer.value) {
    const timeListened = audioPlayer.value.currentTime
    console.log('🏁 Fin manuelle de la session, temps écouté:', Math.floor(timeListened), 's')
    
    // Arrêter la lecture
    pause()
    
    // Sauvegarder le temps écouté
    await saveMeditationSession(timeListened, true)
    
    // Réinitialiser
    currentTime.value = 0
    sessionSaved = true
    
    // Notification visuelle (optionnel)
    console.log('✅ Session terminée et enregistrée !')
  }
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
      
      <h2 class="text-2xl font-bold text-white mb-1 drop-shadow-lg flex items-center gap-3">
        {{ session.title }}
        <FavoriteButton 
          type="meditation"
          :item="session.id"
        />
      </h2>
      <p class="text-sm text-white/70 mb-8 font-light uppercase tracking-widest">{{ session.category }}</p>

      <!-- Boutons de contrôle -->
      <div class="flex flex-col items-center gap-4">
        <!-- Bouton Play/Pause -->
        <button 
          @click="togglePlay"
          class="w-20 h-20 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 hover:scale-110 hover:bg-white/20 transition-all duration-300 group shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-20"
        >
          <span v-if="!isPlaying" class="text-3xl ml-1 text-white">▶</span>
          <span v-else class="text-3xl text-white">⏸</span>
        </button>

        <!-- Bouton Terminer la session (visible si du temps a été écouté) -->
        <button
          v-if="currentTime > 0"
          @click="finishSession"
          class="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/50"
        >
          ✓ Terminer la session
        </button>
      </div>

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
