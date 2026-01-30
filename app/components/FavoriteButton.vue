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
    class="p-2 transition-all duration-300 active:scale-95 group/fav"
    :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
  >
    <i 
      class="fi text-2xl transition-all duration-300 inline-block" 
      :class="[
        isFavorite ? 'fi-sr-heart text-[#D645EC] scale-110' : 'fi-rr-heart text-white/40 group-hover/fav:text-pink-400',
        loading ? 'opacity-40' : ''
      ]"
    ></i>
  </button>
</template>

<style scoped>
.fi-sr-heart {
    /* Nouveau rose améthyste vif */
    color: #D645EC !important; 
    filter: drop-shadow(0 0 8px rgba(214, 69, 236, 0.4));
}
</style>
