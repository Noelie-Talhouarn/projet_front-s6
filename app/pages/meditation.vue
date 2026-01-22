<script setup lang="ts">
import { useMeditations } from '~/composables/useMeditations'

// Composables & État


const { fetchMeditations } = useMeditations()
const sessions = ref<Meditation[]>([])
const currentSession = ref<Meditation | null>(null)
const isLoading = ref(true)


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
  <div class="min-h-screen bg-night-900 pb-32 pt-8 px-6 overflow-x-hidden transition-colors duration-1000">
    
    <!-- En-tête -->
    <header class="mb-6 animate-fade-in-up">
      <div class="flex items-center gap-3 mb-2">
        <span class="text-3xl">🧘‍♀️</span>
        <MyTitle as="h1" size="medium">Refuge Sonore</MyTitle>
      </div>
      <p class="text-slate-400 text-sm">Votre collection personnelle de sérénité.</p>
    </header>

    <!-- 1. Le Lecteur -->
    <MeditationPlayer 
      v-if="currentSession" 
      :session="currentSession" 
      :autoPlay="true"
    />

    <!-- 2. La Liste -->
    <MeditationList 
      :sessions="sessions" 
      :currentSessionId="currentSession?.id" 
      :isLoading="isLoading"
      @select="selectSession"
    />

  </div>
</template>
