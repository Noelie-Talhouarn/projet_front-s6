<script setup lang="ts">
const props = defineProps<{
  quote: { citation: string; auteur: string }
}>()
</script>

<template>
  <div class="relative w-full max-w-2xl mx-auto p-1 group">
    
    <!-- Effet de bordure dégradée (Design d'avant, bien vibrant) -->
    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-spark/50 via-spark-pink/50 to-spark/50 blur opacity-75 transition-opacity group-hover:opacity-100"></div>
    
    <div class="relative flex flex-col gap-1 rounded-2xl bg-night-800/90 backdrop-blur-xl border border-white/20 p-4 text-center shadow-2xl">
      
      <div class="flex justify-center relative">
        <span class="text-3xl text-white/20">❝</span>
        
        <!-- Like Button -->
        <div class="absolute right-0 top-0">
          <FavoriteButton 
            type="quote"
            :item="quote"
          />
        </div>
      </div>

      <!-- Citation -->
      <div class="flex flex-col gap-4 py-2">
        <blockquote class="text-xl md:text-2xl font-medium text-white leading-relaxed font-serif italic">
          {{ quote.citation }}
        </blockquote>
        
        <cite class="text-spark-light font-medium not-italic tracking-wider uppercase text-base">
          — {{ quote.auteur }}
        </cite>
      </div>

      <div class="flex justify-center">
        <span class="text-3xl rotate-180 text-white/20">❝</span>
      </div>

    </div>
  </div>
</template>
