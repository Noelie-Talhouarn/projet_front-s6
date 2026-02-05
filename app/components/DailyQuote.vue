<script setup lang="ts">
const { data: quote, pending, error, refresh } = await useFetch<{ citation: string, auteur: string }>('/api/quotes/daily')

// Le backend renvoie directement l'objet { citation, auteur }, pas besoin de chercher dans un tableau
const displayQuote = computed(() => {
  return quote.value
})

const { fetchFavorites } = useFavorites()

onMounted(() => {
    fetchFavorites()
})
</script>

<template>
  <div class="relative w-full max-w-2xl mx-auto">
    
    <!-- Chargement -->
    <div v-if="pending" class="flex flex-col items-center justify-center py-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-spark border-t-transparent mb-4"></div>
      <p class="text-sm uppercase tracking-widest text-white">Inspiration en cours...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="text-center p-8 rounded-2xl bg-red-500/5 border border-red-500/20">
      <p class="text-red-400 text-sm mb-4">Impossible de charger la citation du jour.</p>
      <MyButton @click="refresh" size="small" variant="outline">Réessayer</MyButton>
    </div>

    <!-- Citation -->
    <QuoteCard 
      v-else-if="displayQuote" 
      :quote="displayQuote" 
      class="animate-fade-in-up"
    />

  </div>
</template>

