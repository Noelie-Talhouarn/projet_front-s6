<script setup lang="ts">
const { favorites, fetchFavorites, isMeditationFavorite } = useFavorites()
const { fetchMeditations } = useMeditations()
const allMeditations = ref<Meditation[]>([])
const isLoading = ref(true)

onMounted(async () => {
    isLoading.value = true
    try {
        await fetchFavorites()
        allMeditations.value = await fetchMeditations()
    } catch (e) {
        console.error('Erreur chargement favoris page:', e)
    } finally {
        isLoading.value = false
    }
})

const favoriteMeditations = computed(() => {
    return allMeditations.value.filter(s => isMeditationFavorite(s.id))
})

const activeTab = ref<'quotes' | 'meditations'>(favoriteMeditations.value.length > 0 ? 'meditations' : 'quotes')

useSeoMeta({
    title: 'Mes Favoris - L\'Étincelle',
    description: 'Retrouvez toutes vos citations et méditations préférées au même endroit.',
})
</script>

<template>
  <div class="px-6 pb-20 pt-10 max-w-5xl mx-auto">
    
    <header class="mb-12 md:mb-16 animate-fade-in-up text-center">
        <span class="text-xs font-bold uppercase tracking-[0.3em] text-spark-light/80 mb-3 block">Trésors</span>
        <h1 class="text-white font-zen tracking-[0.2em] text-2xl md:text-3xl uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">Ma Collection</h1>
        <div class="flex flex-col items-center gap-2 mt-4 md:mt-6">
            <div class="h-1 w-12 md:w-16 bg-spark rounded-full transition-all duration-700"></div>
            <p class="text-sm text-slate-400 tracking-widest uppercase mt-4">Vos éclats de sérénité sauvegardés</p>
        </div>
    </header>

    <!-- Navigation Onglets -->
    <div class="flex justify-center gap-4 mb-12 animate-fade-in-up" style="animation-delay: 0.1s">
        <button 
            @click="activeTab = 'meditations'"
            class="px-6 py-2 rounded-xl text-base font-medium transition-all border"
            :class="activeTab === 'meditations' ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'"
        >
            Méditations ({{ favoriteMeditations.length }})
        </button>
        <button 
            @click="activeTab = 'quotes'"
            class="px-6 py-2 rounded-xl text-base font-medium transition-all border"
            :class="activeTab === 'quotes' ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'"
        >
            Citations ({{ favorites.quotes.length }})
        </button>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 opacity-50">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
        <p class="mt-4 text-sm uppercase tracking-widest">Récupération de vos trésors...</p>
    </div>

    <div v-else class="animate-fade-in-up" style="animation-delay: 0.2s">
        
        <!-- Section Méditations -->
        <div v-if="activeTab === 'meditations'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            <template v-if="favoriteMeditations.length > 0">
                <div 
                    v-for="session in favoriteMeditations" 
                    :key="session.id"
                    class="relative group rounded-3xl border-[1.5px] border-white/20 bg-night-900/80 overflow-hidden hover:bg-night-800 transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-black/20"
                >
                    <div class="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity" :style="{ backgroundImage: `url(${session.imageUrl})` }"></div>
                    <div class="relative p-6 flex flex-col h-full">
                        <div class="flex justify-between items-start mb-10">
                            <span class="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm uppercase tracking-tighter text-white/70">{{ session.category }}</span>
                            <FavoriteButton type="meditation" :item="session.id" />
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">{{ session.title }}</h3>
                        <p class="text-slate-400 text-base line-clamp-2 mb-6">{{ session.description }}</p>
                        <div class="mt-auto flex justify-between items-center">
                            <NuxtLink :to="`/meditation?mode=player&id=${session.id}`" class="text-sm font-medium text-white group-hover:text-pink-400 transition-colors">
                                Écouter →
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </template>
            <div v-else class="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <i class="fi fi-rr-spa text-3xl text-white/20 mb-4 block"></i>
                <p class="text-slate-400">Vous n'avez pas encore de méditations favorites.</p>
                <NuxtLink to="/meditation" class="mt-4 inline-block text-pink-400 text-base hover:underline">Découvrir les séances</NuxtLink>
            </div>
        </div>

        <!-- Section Citations -->
        <div v-if="activeTab === 'quotes'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            <template v-if="favorites.quotes.length > 0">
                <QuoteCard 
                    v-for="quote in favorites.quotes" 
                    :key="quote.citation"
                    :quote="quote"
                    class="h-full"
                />
            </template>
            <div v-else class="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <i class="fi fi-rr-quote-right text-3xl text-white/20 mb-4 block"></i>
                <p class="text-slate-400">Votre carnet de citations est vide.</p>
                <NuxtLink to="/home" class="mt-4 inline-block text-pink-400 text-base hover:underline">Voir la citation du jour</NuxtLink>
            </div>
        </div>

    </div>

  </div>
</template>
