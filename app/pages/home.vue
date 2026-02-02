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
      const statsResponse = await $fetch<any>('/api/users/stats', {
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
const isSavingMood = ref(false)

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
        to: '/meditation?mode=breathing', 
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
        isSavingMood.value = true
        try {
            await $fetch(`${apiBase}/api/users/emotion`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${cookie.value}` },
                body: { emotion: moodId }
            })
            if (moodId) {
                localStorage.setItem('last_emotion_date', new Date().toDateString())
            }
            console.log('Emotion sauvegardée:', moodId)
        } catch (e) {
            console.error('Erreur sauvegarde emotion', e)
        } finally {
            isSavingMood.value = false
        }
    }
}

// Initialisation de l'humeur depuis le profil utilisateur
onMounted(async () => {
    // ... chargements précédents (inchangés) ...
    // On peut initialiser currentMood si le user est déjà là ou après le fetch
    if (user.value?.emotion) {
        const lastDate = localStorage.getItem('last_emotion_date')
        const today = new Date().toDateString()
        if (lastDate === today) {
            currentMood.value = user.value.emotion
        }
    }
    
    // Watcher pour mettre à jour si le user arrive plus tard
    watch(() => user.value, (u) => {
        if (u?.emotion && !currentMood.value) {
            const lastDate = localStorage.getItem('last_emotion_date')
            const today = new Date().toDateString()
            if (lastDate === today) {
                currentMood.value = u.emotion
            }
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

useSeoMeta({
  title: 'Mon Espace - L\'Étincelle',
  description: 'Retrouvez votre calme intérieur. Accédez à vos outils de méditation, respiration et créativité.',
  ogTitle: 'Mon Espace - L\'Étincelle',
  ogDescription: 'Retrouvez votre calme intérieur. Accédez à vos outils de méditation, respiration et créativité.',
})
</script>

<template>
  <div class="px-6 pb-20 pt-10 max-w-6xl mx-auto flex flex-col">
    
    <!-- 1. BONJOUR (Always First) -->
    <header class="mb-12 md:mb-16 animate-fade-in-up text-center transition-all shrink-0">
        <span class="text-xs font-bold uppercase tracking-[0.3em] text-spark-light/80 mb-3 block">Sanctuaire</span>
        <h1 class="text-white font-zen tracking-[0.2em] text-2xl md:text-3xl uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">Mon Espace</h1>
        <div class="flex flex-col items-center gap-2 mt-4 md:mt-6">
            <div class="h-1 w-12 md:w-16 bg-spark rounded-full transition-all duration-700"></div>
            <p class="text-sm text-slate-400 tracking-widest uppercase mt-4 max-w-2xl mx-auto leading-relaxed">
                Bienvenue <span class="text-white">{{ user?.prenom || 'Voyageur' }}</span>, prenez un instant pour vous reconnecter
            </p>
        </div>
    </header>

    <!-- Grid Container -->
    <div class="lg:grid lg:grid-cols-12 lg:gap-10 items-start">
      
      <!-- Content Column -->
      <div class="lg:col-span-8 flex flex-col space-y-12 md:space-y-16">
        
        <!-- 2. STREAK (Mobile Only here) -->
        <div class="lg:hidden animate-fade-in-up" style="animation-delay: 0.1s">
            <StreakCard :streak="currentStreak" />
        </div>

        <!-- 3. CITATION -->
        <section class="animate-fade-in-up" style="animation-delay: 0.2s">
          <DailyQuote />
        </section>

        <!-- 4. EMOTION (Mobile Only here) -->
        <div class="lg:hidden animate-fade-in-up mt-4" style="animation-delay: 0.3s">
            <MoodTracker :initial-mood="currentMood" :is-loading="isSavingMood" @select="handleMoodChange" />
        </div>

        <!-- 5. CARDS (Navigation Rapide) -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up transition-all duration-500" style="animation-delay: 0.4s">
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
      </div>

      <!-- DESKTOP SIDEBAR (Streak & Mood together on the right) -->
      <aside class="hidden lg:flex lg:col-span-4 flex-col gap-8 lg:sticky lg:top-24 animate-fade-in-up" style="animation-delay: 0.2s">
         <StreakCard :streak="currentStreak" />
         <MoodTracker :initial-mood="currentMood" :is-loading="isSavingMood" @select="handleMoodChange" />

         <!-- Accès Profil Rapide -->
         <div class="text-center lg:text-left pt-4">
              <NuxtLink to="/profil" class="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-slate-500 hover:text-white transition-colors group">
                 <span>Gérer mon profil</span>
                 <span class="group-hover:translate-x-1 transition-transform">→</span>
              </NuxtLink>
         </div>
      </aside>
    </div>

  </div>
</template>
