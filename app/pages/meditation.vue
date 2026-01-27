<script setup lang="ts">
import { useMeditations } from '~/composables/useMeditations'

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
    <header class="mb-6 animate-fade-in-up">
      <div class="flex items-center gap-3 mb-2">
        <i class="fi fi-rr-spa text-3xl inline-block mt-1"></i>
        <MyTitle as="h1" size="medium">Méditation</MyTitle>
      </div>
      <p class="text-slate-400 text-sm">Votre collection personnelle de sérénité</p>
    </header>

    <!-- MENU SELECTION -->
    <div v-if="viewMode === 'menu'" class="grid gap-6 md:grid-cols-2 mt-8 animate-fade-in-up max-w-4xl mx-auto">
      
      <!-- Carte : Méditation -->
      <button 
        @click="viewMode = 'player'"
        class="group relative flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-night-800/50 p-12 text-center shadow-lg transition-all hover:scale-105 hover:bg-night-800 hover:shadow-spark/20"
      >
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/20 text-4xl group-hover:bg-indigo-500/30 transition-colors">
          <i class="fi fi-rr-spa inline-block"></i>
        </div>
        <div>
          <h3 class="text-xl font-zen tracking-wide text-white mb-2">Méditation Guidée</h3>
          <p class="text-slate-400 text-sm">Explorez notre bibliothèque de séances apaisantes pour l'esprit.</p>
        </div>
      </button>

      <!-- Carte : Souffle -->
      <button 
        @click="viewMode = 'breathing'"
        class="group relative flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-night-800/50 p-12 text-center shadow-lg transition-all hover:scale-105 hover:bg-night-800 hover:shadow-pink-500/20"
      >
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-pink-500/20 text-4xl group-hover:bg-pink-500/30 transition-colors">
          <i class="fi fi-rr-wind inline-block"></i>
        </div>
        <div>
          <h3 class="text-xl font-zen tracking-wide text-white mb-2">Respiration</h3>
          <p class="text-slate-400 text-sm">Cohérence cardiaque pour calmer votre rythme intérieur.</p>
        </div>
      </button>

    </div>

    <!-- CONTENU RESPIRATION -->
    <div v-else-if="viewMode === 'breathing'" class="animate-fade-in-up">
      <button @click="viewMode = 'menu'" class="mb-6 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
        <i class="fi fi-rr-arrow-small-left text-lg inline-block"></i> Retour au choix
      </button>

      <BreathingExercise />
    </div>

    <!-- CONTENU MEDITATION -->
    <div v-else-if="viewMode === 'player'" class="animate-fade-in-up">
      <button @click="viewMode = 'menu'" class="mb-6 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
        <i class="fi fi-rr-arrow-small-left text-lg inline-block"></i> Retour au choix
      </button>

      <!-- 1. Le Lecteur -->
      <MeditationPlayer 
        v-if="currentSession" 
        :session="currentSession" 
        :autoPlay="false"
      />

      <!-- 2. La Liste -->
      <MeditationList 
        :sessions="sessions" 
        :currentSessionId="currentSession?.id" 
        :isLoading="isLoading"
        @select="selectSession"
      />
    </div>

  </div>
</template>
