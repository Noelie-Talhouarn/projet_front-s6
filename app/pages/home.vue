<script setup lang="ts">
definePageMeta({
    middleware: (to, from) => {
        // Redirection simple si pas connecté, mais ici c'est la page d'accueil protégée
        // Le middleware global devrait gérer ça, mais on peut forcer ici
    }
})

// Récupération de l'utilisateur
// Récupération de l'utilisateur via le state global
const { user, fetchUser } = useAuth()
const cookie = useCookie('auth_token')
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

// Streak
const currentStreak = ref(0)

// Charger les données (streak + profil via composable)
onMounted(async () => {
  try {
    const token = useCookie('auth_token')
    
    // 1. Charger l'utilisateur (global)
    await fetchUser()

    // 2. Stats pour le streak (spécifique à cette page for now)
    if (token.value) {
      const statsResponse = await $fetch<any>(`${apiBase}/api/users/stats`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      currentStreak.value = statsResponse.current_streak || 0
    }
  } catch (err) {
    console.error('Erreur chargement données home:', err)
  }
})

// Etat de l'humeur
const currentMood = ref<string | null>(null)

// Définition des cartes
const rawCards = [
    { 
        id: 'meditation',
        to: '/meditation', 
        title: 'Méditation', 
        desc: 'Explorez nos séances guidées pour retrouver le calme.', 
        icon: 'fi-rr-spa', 
        color: 'text-indigo-300',
        bg: 'hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]',
        gradient: 'from-indigo-500/10'
    },
    { 
        id: 'breathing',
        to: '/breathing', 
        title: 'Respiration', 
        desc: 'Cohérence cardiaque et exercices de souffle.', 
        icon: 'fi-rr-wind', 
        color: 'text-sky-300', 
        bg: 'hover:border-sky-500/30 hover:shadow-[0_0_20px_rgba(14,165,233,0.1)]',
        gradient: 'from-sky-500/10'
    },
    { 
        id: 'games',
        to: '/games', 
        title: 'Espace Créatif', 
        desc: 'Mandala, Puzzles et expériences interactives.', 
        icon: 'fi-rr-palette', 
        color: 'text-pink-300', 
        bg: 'hover:border-pink-500/30 hover:shadow-[0_0_20px_rgba(236,72,153,0.1)]',
        gradient: 'from-pink-500/10'
    }
]

// Logique de tri dynamique
const orderedCards = computed(() => {
    // Si pas d'humeur sélectionnée, on regarde si l'utilisateur en a une sauvegardée en base (chargée initialement)
    const activeMood = currentMood.value 
    
    if (!activeMood) return rawCards

    const cards = [...rawCards]
    let recommendedId = ''

    if (activeMood === 'anxious') recommendedId = 'breathing'
    else if (activeMood === 'tired') recommendedId = 'meditation'
    else if (activeMood === 'calm' || activeMood === 'joyful') recommendedId = 'games'

    // On met la carte recommandée en premier
    const recommended = cards.find(c => c.id === recommendedId)
    const others = cards.filter(c => c.id !== recommendedId)

    return recommended ? [recommended, ...others] : cards 
})

async function handleMoodChange(moodId: string | null) {
    currentMood.value = moodId
    
    // Mise à jour locale du user pour la réactivité immédiate (si on l'utilise ailleurs)
    if (user.value) {
        user.value.emotion = moodId || undefined
    }

    // Sauvegarde en base
    if (cookie.value) {
        try {
            await $fetch(`${apiBase}/api/users/emotion`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${cookie.value}` },
                body: { emotion: moodId }
            })
            console.log('Emotion sauvegardée:', moodId)
        } catch (e) {
            console.error('Erreur sauvegarde emotion', e)
        }
    }
}

// Initialisation de l'humeur depuis le profil utilisateur
onMounted(async () => {
    // ... chargements précédents (inchangés) ...
    // On peut initialiser currentMood si le user est déjà là ou après le fetch
    if (user.value?.emotion) {
        currentMood.value = user.value.emotion
    }
    
    // Watcher pour mettre à jour si le user arrive plus tard
    watch(() => user.value, (u) => {
        if (u?.emotion && !currentMood.value) {
            currentMood.value = u.emotion
        }
    })
})

// Message selon le streak
function getStreakMessage(streak: number) {
  // ... (inchangé)
  if (streak === 0) return 'Commence une nouvelle série dès aujourd\'hui !'
  if (streak < 7) return `Série de ${streak} jours !`
  return `${streak} jours !`
}
</script>

<template>
  <div class="px-6 pb-20 pt-10 max-w-5xl mx-auto">
    
    <!-- Hero / Citation du jour -->
    <section class="mb-12 animate-fade-in-up">
       <header class="mb-8">
           <h1 class="text-3xl font-zen tracking-wide text-white mb-2">Bienvenue {{ user?.prenom || 'Voyageur' }} dans votre espace,</h1>
           <p class="text-slate-400">Prenez un instant pour vous reconnecter.</p>
       </header>

       <!-- Streak Compact -->
       <StreakCard :streak="currentStreak" class="mb-6" />

       <DailyQuote class="mb-8" />

       <!-- Météo Intérieure -->
       <MoodTracker class="mb-8" :initial-mood="currentMood" @select="handleMoodChange" />
    </section>

    <!-- Navigation Rapide (Dashboard Dynamique) -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up transition-all duration-500" style="animation-delay: 0.1s">
        
        <DashboardCard 
            v-for="(card, index) in orderedCards"
            :key="card.id"
            :to="card.to"
            :title="card.title"
            :desc="card.desc"
            :icon="card.icon"
            :color="card.color"
            :bg="card.bg"
            :gradient="card.gradient"
            :is-featured="!!(currentMood && index === 0)"
        />

    </section>

    <!-- Accès Profil Rapide -->
    <section class="mt-12 text-center animate-fade-in-up" style="animation-delay: 0.2s">
         <NuxtLink to="/profil" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
            <span>Gérer mon profil</span>
            <span>→</span>
         </NuxtLink>
    </section>

  </div>
</template>
