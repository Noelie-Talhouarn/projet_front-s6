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
const categories = [
  { id: 'all', label: 'Tout' },
  { id: 'sommeil', label: 'Sommeil' },
  { id: 'nature', label: 'Nature' },
  { id: 'musique', label: 'Musique' },
]
const selectedCategory = ref('all')

const filteredSessions = computed(() => {
  if (selectedCategory.value === 'all') return props.sessions
  return props.sessions.filter(s => s.category === selectedCategory.value)
})
</script>

<template>
  <div>
    <!-- Filtres -->
    <div class="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar animate-fade-in-up" style="animation-delay: 0.15s">
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
             :style="{ backgroundImage: `url(${session.imageUrl || 'https://images.unsplash.com/photo-1519681393797-a1205ee31c33?q=80&w=1000'})` }">
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
      <div v-if="isLoading" class="text-center py-10 text-slate-500 text-xs animate-pulse">
        Chargement de vos vibrations...
      </div>
      
      <div v-else-if="filteredSessions.length === 0" class="text-center py-10">
        <p class="text-slate-500 text-xs uppercase tracking-widest mb-4">Aucune séance trouvée</p>
        <button @click="selectedCategory = 'all'" class="text-indigo-400 text-xs hover:text-white underline">Voir tout</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
