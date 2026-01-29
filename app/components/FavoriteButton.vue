<script setup lang="ts">
const props = defineProps<{
    type: 'quote' | 'meditation'
    item: { citation: string; auteur: string } | string | number
}>()

const { 
    toggleQuoteFavorite, 
    toggleMeditationFavorite, 
    isQuoteFavorite, 
    isMeditationFavorite, 
    loading 
} = useFavorites()

const token = useCookie('auth_token')

const isFavorite = computed(() => {
    if (props.type === 'quote' && typeof props.item === 'object') {
        return isQuoteFavorite(props.item.citation)
    }
    return isMeditationFavorite(props.item as string | number)
})

async function handleToggle() {
    if (loading.value) return
    
    if (props.type === 'quote' && typeof props.item === 'object') {
        await toggleQuoteFavorite(props.item.citation, props.item.auteur)
    } else {
        await toggleMeditationFavorite(props.item as string | number)
    }
}
</script>

<template>
  <button 
    v-if="token"
    @click.stop="handleToggle" 
    :disabled="loading"
    class="p-2 transition-all duration-300 active:scale-90 group/fav"
    :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
  >
    <i 
      class="fi text-2xl transition-all duration-300" 
      :class="[
        isFavorite ? 'fi-sr-heart text-pink-500 scale-110' : 'fi-rr-heart text-white/40 group-hover/fav:text-pink-400',
        loading ? 'opacity-50 animate-pulse' : ''
      ]"
    ></i>
  </button>
</template>

<style scoped>
.fi-sr-heart {
    filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.3));
}
</style>
