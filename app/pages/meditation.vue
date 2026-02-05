<script setup lang="ts">
import { useMeditations } from '~/composables/useMeditations'

useSeoMeta({
  title: 'Méditation - L\'Étincelle',
  description: 'Bibliothèque de sons et méditations pour la relaxation.',
  ogTitle: 'Méditation - L\'Étincelle',
})

// Composables & État


const { fetchMeditations } = useMeditations()
const sessions = ref<Meditation[]>([])
const currentSession = ref<Meditation | null>(null)
const isLoading = ref(true)
const route = useRoute()
const router = useRouter()

// Valid modes
type ViewMode = 'menu' | 'player' | 'breathing'
const validModes: ViewMode[] = ['menu', 'player', 'breathing']

// Initialize from URL or default to 'menu'
const initialMode = (route.query.mode as ViewMode)
const viewMode = ref<ViewMode>(validModes.includes(initialMode) ? initialMode : 'menu')

// Sync state -> URL
watch(viewMode, (newMode) => {
  router.replace({ query: { ...route.query, mode: newMode } })
})


// Chargement initial
onMounted(async () => {
  isLoading.value = true
  try {
    const rawSessions = await fetchMeditations()
    const validSessions = rawSessions.filter(s => s && s.audioUrl && s.audioUrl.length > 5)
    
    if (validSessions.length > 0) {
        sessions.value = validSessions
    }
  } catch (e) {
    console.error("Erreur critique chargement", e)
  } finally {
    isLoading.value = false
    // Initialisation
    if (sessions.value.length > 0 && !currentSession.value) {
        const first = sessions.value[0]
        if (first) selectSession(first)
    }
  }
})

// Actions
function selectSession(session: Meditation) {
  currentSession.value = session
  // Scroll to top smooth
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="bg-night-900 pb-32 pt-8 px-6 overflow-x-hidden transition-colors duration-1000">
    
    <!-- En-tête -->
    <header class="mb-12 md:mb-16 animate-fade-in-up text-center">
      <span class="text-xs font-bold uppercase tracking-[0.3em] text-spark-light/80 mb-3 block">Sérénité</span>
      <h1 class="text-white font-zen tracking-[0.2em] text-2xl md:text-3xl uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">Méditation</h1>
      <div class="flex flex-col items-center gap-2 mt-4 md:mt-6">
        <div class="h-1 w-12 md:w-16 bg-spark rounded-full transition-all duration-700"></div>
        <p class="text-sm text-white tracking-widest uppercase mt-4 max-w-2xl mx-auto">Votre collection personnelle de sérénité</p>
      </div>
    </header>

    <!-- MENU SELECTION -->
    <div v-if="viewMode === 'menu'" class="grid gap-6 md:grid-cols-2 mt-8 animate-fade-in-up max-w-5xl mx-auto">
      
      <!-- Carte : Méditation -->
      <button 
        @click="viewMode = 'player'"
        class="group relative flex flex-col items-center justify-center gap-4 md:gap-6 rounded-[2.5rem] border-[1.5px] border-white/20 bg-night-900/80 p-10 md:p-12 text-center shadow-xl transition-all duration-500 hover:scale-[1.02] hover:bg-night-800 hover:shadow-spark/20"
      >
        <div class="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-indigo-500/20 text-3xl md:text-4xl group-hover:bg-indigo-500/30 transition-all duration-500 group-hover:rotate-12">
          <i class="fi fi-rr-spa inline-block"></i>
        </div>
        <div>
          <h3 class="text-xl md:text-2xl font-zen tracking-wide text-white mb-2 md:mb-3">Méditation</h3>
          <p class="text-white text-sm md:text-base leading-relaxed">Explorez notre bibliothèque de séances apaisantes pour l'esprit.</p>
        </div>
      </button>

      <!-- Carte : Souffle -->
      <button 
        @click="viewMode = 'breathing'"
        class="group relative flex flex-col items-center justify-center gap-4 md:gap-6 rounded-[2.5rem] border-[1.5px] border-white/20 bg-night-900/80 p-10 md:p-12 text-center shadow-xl transition-all duration-500 hover:scale-[1.02] hover:bg-night-800 hover:shadow-spark/20"
      >
        <div class="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-spark/20 text-3xl md:text-4xl group-hover:bg-spark/30 transition-all duration-500 group-hover:-rotate-12">
          <i class="fi fi-rr-wind inline-block text-spark"></i>
        </div>
        <div>
          <h3 class="text-xl md:text-2xl font-zen tracking-wide text-white mb-2 md:mb-3">Respiration</h3>
          <p class="text-white text-sm md:text-base leading-relaxed">Cohérence cardiaque pour calmer votre rythme intérieur.</p>
        </div>
      </button>

    </div>

    <!-- CONTENU RESPIRATION -->
    <div v-else-if="viewMode === 'breathing'" class="animate-fade-in-up">
      <button @click="viewMode = 'menu'" class="mb-6 flex items-center gap-2 text-base text-white transition-colors hover:text-white">
        <i class="fi fi-rr-arrow-small-left text-lg inline-block"></i> Retour au choix
      </button>

      <BreathingExercise />
    </div>

    <!-- CONTENU MEDITATION -->
    <div v-else-if="viewMode === 'player'" class="animate-fade-in-up">
      <button @click="viewMode = 'menu'" class="mb-6 flex items-center gap-2 text-base text-white transition-colors hover:text-white">
        <i class="fi fi-rr-arrow-small-left text-lg inline-block"></i> Retour au choix
      </button>

      <!-- Desktop Layout: Player (Left/Sticky) + List (Right) -->
      <div class="lg:grid lg:grid-cols-12 lg:gap-10 items-start">
        
        <!-- Player Column -->
        <div class="lg:col-span-7 xl:col-span-8 lg:sticky lg:top-24">
          <MeditationPlayer 
            v-if="currentSession" 
            :session="currentSession" 
            :autoPlay="false"
          />
        </div>

        <!-- List Column -->
        <div class="lg:col-span-5 xl:col-span-4 mt-6 lg:mt-0">
          <div class="bg-night-900/60 rounded-[2rem] border-[1.5px] border-white/15 p-6 backdrop-blur-md shadow-2xl shadow-black/20">
            <h2 class="text-lg font-zen text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <i class="fi fi-rr-list text-spark"></i>
              Ma Playlist
            </h2>
            <MeditationList 
              :sessions="sessions" 
              :currentSessionId="currentSession?.id" 
              :isLoading="isLoading"
              @select="selectSession"
            />
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
