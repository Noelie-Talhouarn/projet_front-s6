<script setup lang="ts">
import { ref, onMounted } from 'vue'

const games = ref<Array<{ title: string, type: string, description: string, difficulty: string, link: string }>>([])
const isLoading = ref(true)

async function fetchGames() {
    try {
        const token = useCookie('recipe_token')
        const data = await $fetch('/api/games', {
            headers: token.value ? { Authorization: `Bearer ${token.value}` } : {}
        }) as any[]
        
        // Mapping des données brutes vers le format UI
        // Mapping des données brutes vers le format UI
        games.value = data.map((g: any) => ({
             title: g.title,
             type: g.type,
             description: g.description,
             difficulty: g.difficulty || 'Moyen',
             link: g.link || (g.type === 'mandala' ? '/games/mandala' : '/games/puzzle')
        }))

        // SAFETY: Si le backend ne renvoie pas le Mandala (car pas encore en BDD), on l'ajoute manuellement pour le client
        if (!games.value.find(g => g.type === 'mandala')) {
            games.value.unshift({ 
                title: 'Mandala de Lumière', 
                type: 'mandala', 
                description: 'Coloriez pour apaiser votre esprit.', 
                difficulty: 'Facile', 
                link: '/games/mandala' 
            })
        }
    } catch (e) {
        // Fallback local si l'API n'est pas encore prête
        games.value = [
            { title: 'Mandala de Lumière', type: 'mandala', description: 'Coloriez pour apaiser votre esprit.', difficulty: 'Facile', link: '/games/mandala' },
            { title: 'Puzzle Zen', type: 'puzzle', description: 'Recomposez l\'harmonie des mots.', difficulty: 'Moyen', link: '/games/puzzle' }
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
  <div class="min-h-screen bg-night-900 pt-20 px-6 pb-32">
      <header class="mb-10 text-center animate-fade-in-up">
          <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-spark-light to-white mb-2">Espace de Jeu</h1>
          <p class="text-slate-400 text-sm">Détendez-vous avec nos expériences interactives.</p>
      </header>

      <div v-if="isLoading" class="flex justify-center mt-12">
          <div class="w-8 h-8 border-2 border-spark-light border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <NuxtLink 
            v-for="game in games" 
            :key="game.title"
            :to="game.link"
            class="group relative block p-6 rounded-2xl bg-night-800 border border-white/5 hover:border-spark/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] overflow-hidden"
          >
              <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div class="relative z-10 flex flex-col h-full">
                  <div class="flex justify-between items-start mb-4">
                      <div class="bg-white/10 p-3 rounded-lg text-2xl group-hover:scale-110 transition-transform duration-300">
                          {{ game.type === 'mandala' ? '🎨' : '🧩' }}
                      </div>
                      <span class="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full border border-white/10 text-slate-400">
                          {{ game.difficulty }}
                      </span>
                  </div>

                  <h2 class="text-xl font-bold text-white mb-2 group-hover:text-spark-light transition-colors">{{ game.title }}</h2>
                  <p class="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{{ game.description }}</p>

                  <div class="text-spark-light text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                      Jouer Maintenant <span>→</span>
                  </div>
              </div>
          </NuxtLink>
      </div>
  </div>
</template>
