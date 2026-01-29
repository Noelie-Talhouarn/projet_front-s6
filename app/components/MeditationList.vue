<script setup lang="ts">


const props = defineProps<{
  sessions: Meditation[]
  currentSessionId?: string | number
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', session: Meditation): void
}>()

// Catégories
// Catégories
const { isMeditationFavorite } = useFavorites()

const { fetchCategories } = useMeditations()
const categories = ref<{ id: string, label: string }[]>([])

onMounted(async () => {
  categories.value = await fetchCategories()
})
const selectedCategory = ref('all')
const showOnlyFavorites = ref(false)

const filteredSessions = computed(() => {
  let filtered = props.sessions
  
  if (showOnlyFavorites.value) {
    filtered = filtered.filter(s => isMeditationFavorite(s.id))
  }
  
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(s => s.category === selectedCategory.value)
  }
  
  return filtered
})
</script>

<template>
  <div>
    <!-- Filtres -->
    <div class="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar animate-fade-in-up" style="animation-delay: 0.15s">
      <!-- Filtre Favoris -->
      <button 
        @click="showOnlyFavorites = !showOnlyFavorites"
        class="whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-2"
        :class="showOnlyFavorites 
          ? 'bg-pink-500 text-white border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]' 
          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'"
      >
        <i :class="showOnlyFavorites ? 'fi fi-sr-heart' : 'fi fi-rr-heart'"></i>
        Favoris
      </button>

      <div class="w-[1px] h-4 bg-white/10 self-center mx-1 shrink-0"></div>

      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="selectedCategory = cat.id"
        class="whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border"
        :class="selectedCategory === cat.id 
          ? 'bg-white text-black border-white' 
          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Liste -->
    <div class="space-y-3 animate-fade-in-up pb-10" style="animation-delay: 0.2s">
      <button
        v-for="session in filteredSessions"
        :key="session.id"
        @click="emit('select', session)"
        class="w-full flex items-center p-3 rounded-xl border border-white/5 bg-night-800 hover:bg-night-700 transition-all text-left group active:scale-98"
        :class="{'ring-1 ring-indigo-500 bg-night-700': currentSessionId === session.id}"
      >
        <!-- Mini Cover -->
        <div class="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 mr-4 opacity-80 group-hover:opacity-100 transition-opacity" 
             :style="{ backgroundImage: `url(${session.imageUrl})` }">
            <!-- Petit indicateur si c'est la piste en cours (Optionnel) -->
             <div v-if="currentSessionId === session.id" class="w-full h-full flex items-center justify-center bg-black/30 rounded-lg">
                <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-slate-200 truncate group-hover:text-white transition-colors"
             :class="{'text-indigo-300': currentSessionId === session.id}">
             {{ session.title }}
          </h3>
          <p class="text-xs text-slate-500 truncate">{{ session.description }}</p>
        </div>

        <div class="text-xs text-slate-600 font-mono ml-4">{{ session.duration }}</div>
      </button>

      <!-- États vides -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-10 text-slate-500 text-xs">
        <div class="h-6 w-6 border-2 border-slate-700 border-t-slate-400 rounded-full animate-spin mb-3"></div>
        Chargement de vos vibrations...
      </div>
      
      <div v-else-if="filteredSessions.length === 0" class="text-center py-10">
        <template v-if="showOnlyFavorites">
            <i class="fi fi-rr-heart text-white/20 text-3xl mb-4 block"></i>
            <p class="text-slate-500 text-xs uppercase tracking-widest mb-4">Aucun favori pour le moment</p>
            <button @click="showOnlyFavorites = false" class="text-pink-400 text-xs hover:text-white underline">Parcourir les séances</button>
        </template>
        <template v-else>
            <p class="text-slate-500 text-xs uppercase tracking-widest mb-4">Aucune séance trouvée</p>
            <button @click="selectedCategory = 'all'" class="text-indigo-400 text-xs hover:text-white underline">Voir tout</button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
