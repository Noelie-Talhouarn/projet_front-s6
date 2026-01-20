<script setup lang="ts">
// Correction URL : /api/quotes/daily
const { data: quote, pending, error, refresh } = await useFetch<{ citation: string, auteur: string }>('/api/quotes/daily')

// Le backend renvoie directement l'objet { citation, auteur }, pas besoin de chercher dans un tableau
const displayQuote = computed(() => {
  return quote.value
})
</script>

<template>
  <div class="relative w-full max-w-2xl mx-auto p-1">
    
    <!-- Effet de bordure dégradée -->
    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-spark/50 via-spark-pink/50 to-spark/50 blur opacity-75"></div>
    
    <div class="relative flex flex-col gap-4 rounded-2xl bg-night-900/80 backdrop-blur-xl border border-white/10 p-8 text-center shadow-2xl">
      
      <!-- Titre décoratif -->
      <div class="flex justify-center mb-2">
        <span class="text-3xl">❝</span>
      </div>

      <!-- Chargement -->
      <div v-if="pending" class="flex justify-center py-4">
        <div class="h-6 w-6 animate-spin rounded-full border-2 border-spark border-t-transparent"></div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="text-red-400 text-sm">
        Impossible de charger la citation inspirante du jour.
        <br>
        <button @click="refresh" class="text-white hover:underline mt-2 text-xs">Réessayer</button>
      </div>

      <!-- Citation -->
      <div v-else-if="displayQuote" class="flex flex-col gap-4">
        <blockquote class="text-xl md:text-2xl font-medium text-white leading-relaxed font-serif italic">
          {{ displayQuote.citation }}
        </blockquote>
        
        <cite class="text-spark-light font-bold not-italic tracking-wider uppercase text-sm">
          — {{ displayQuote.auteur }}
        </cite>
      </div>

      <div class="flex justify-center mt-2">
        <span class="text-3xl rotate-180">❝</span>
      </div>

    </div>
  </div>
</template>
