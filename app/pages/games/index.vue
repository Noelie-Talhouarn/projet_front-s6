<script setup lang="ts">
import { ref, onMounted } from 'vue'

useSeoMeta({
  title: 'Espace Créatif - L\'Étincelle',
  description: 'Jouez, coloriez et détendez-vous avec nos activités zen.',
  ogTitle: 'Espace Créatif - L\'Étincelle',
})

const games = ref<Array<{ title: string, type: string, description: string, difficulty: string, link: string }>>([])
const isLoading = ref(true)

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

async function fetchGames() {
    try {
        const token = useCookie('auth_token')
        const data = await $fetch<any[]>(`${apiBase}/api/games`, {
            headers: token.value ? { Authorization: `Bearer ${token.value}` } : {}
        })
        
        // Mapping sécurisé
        games.value = data.map((g: any) => {
            let link = g.link
            
            // Déduction du lien si non fourni par le backend
            if (!link) {
                const typeStart = g.type?.toLowerCase() || ''
                const titleLower = g.title?.toLowerCase() || ''

                // Règle spécifique demandée : L'Alchimiste -> Puzzle

                if (titleLower.includes('alchimiste') || titleLower.includes('puzzle') || titleLower.includes('mot') || typeStart.includes('puzzle')) {
                    link = '/games/puzzle'
                } 
                else if (typeStart.includes('color') || typeStart.includes('mandala')) {
                    link = '/games/mandala'
                } else {
                    link = '#'
                }
            }

            return {
                title: g.title,
                type: g.type,
                description: g.description,
                difficulty: g.difficulty || 'Moyen',
                link
            }
        })
        

    } catch (e) {
        // Fallback pour le développement ou si l'API est offline
        console.error('Erreur chargement jeux:', e)
        games.value = [
            { 
                title: 'Coloriage Organique', 
                type: 'coloriage', 
                description: 'Donnez vie à des formes apaisantes.', 
                difficulty: 'Facile', 
                link: '/games/mandala' 
            },
            { 
                title: 'Puzzle Zen', 
                type: 'puzzle', 
                description: 'Recomposez l\'harmonie des mots.', 
                difficulty: 'Moyen', 
                link: '/games/puzzle' 
            }
        ]
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchGames()
})
</script>

<template>
  <div class="bg-night-900 pt-8 px-6 pb-32 relative overflow-hidden">
      
      <!-- Background Elements -->
      <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
      <div class="absolute top-20 right-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

      <header class="mb-12 md:mb-16 text-center animate-fade-in-up relative z-10">
          <span class="text-xs font-bold uppercase tracking-[0.3em] text-spark-light/80 mb-3 block">Exploration</span>
          <h1 class="text-white font-zen tracking-[0.2em] text-2xl md:text-3xl uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">Espace Créatif</h1>
          <div class="flex flex-col items-center gap-2 mt-4 md:mt-6">
              <div class="h-1 w-12 md:w-16 bg-spark rounded-full transition-all duration-700"></div>
              <p class="text-sm text-slate-400 tracking-widest uppercase mt-4">
                  Éveillez votre créativité & nourrissez votre esprit
              </p>
          </div>
      </header>

      <div v-if="isLoading" class="flex justify-center mt-20">
          <div class="relative">
             <div class="w-12 h-12 border-2 border-slate-800 rounded-full"></div>
             <div class="absolute top-0 left-0 w-12 h-12 border-2 border-spark-light border-t-transparent rounded-full animate-spin"></div>
          </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto relative z-10">
          <DashboardCard 
            v-for="(game, index) in games" 
            :key="game.title"
            :to="game.link"
            :title="game.title"
            :desc="game.description"
            :icon="game.type.includes('color') || game.type.includes('mandala') ? 'fi-rr-palette' : (game.type.includes('puzzle') ? 'fi-rr-puzzle-piece' : (game.type.includes('musique') ? 'fi-rr-music-alt' : 'fi-rr-gamepad'))"
            :color="'text-spark'"
            :bg="'bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-spark/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]'"
            :gradient="'from-white/[0.07]'"
            :is-featured="false"
            :style="{ animationDelay: `${index * 100}ms` }"
          />
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && games.length === 0" class="text-center mt-20 opacity-50">
          <i class="fi fi-rr-ghost text-4xl mb-4 text-slate-600 block"></i>
          <p class="text-sm text-slate-500 uppercase tracking-widest">Aucun jeu trouvé</p>
      </div>
  </div>
</template>

<style scoped>
.text-spark-light {
    color: #e2e8f0; /* Fallback */
    color: theme('colors.indigo.200');
}
</style>
