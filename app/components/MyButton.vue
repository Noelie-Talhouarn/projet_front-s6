<script setup lang="ts">
const props = defineProps<{
  href?: string
  variant?: 'default' | 'pink' | 'carousel'
  size?: 'default' | 'small' | 'medium' | 'large'
}>()


const emit = defineEmits(['ClickAndHover'])

function handleClickAndHover () {
  emit('ClickAndHover')
}

const baseClasses = 'inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 active:scale-95 text-center cursor-pointer'

const variantClasses = {
  default: 'bg-night-800 text-white border-2 border-spark hover:bg-night-700 hover:border-spark-light',
  pink: 'bg-gradient-to-r from-spark to-spark-pink text-white shadow-lg shadow-spark/20 hover:shadow-spark/40 hover:-translate-y-1',
  carousel: 'border-2 border-spark text-spark hover:bg-spark hover:text-white'
}

const sizeClasses = {
  small: 'px-3 py-1 text-xs',
  default: 'px-5 py-2 text-sm',
  medium: 'px-8 py-3 text-base',
  large: 'px-12 py-4 text-lg'
}
</script>

<template>
  <NuxtLink
    v-if="href"
    :to="href"
    :class="[baseClasses, variantClasses[variant || 'default'], sizeClasses[size || 'default']]"
    @click="handleClickAndHover"
    @mouseenter="handleClickAndHover"
  >
    <slot/>
  </NuxtLink>
  
  <button
    v-else
    :class="[baseClasses, variantClasses[variant || 'default'], sizeClasses[size || 'default']]"
    @click="handleClickAndHover"
    @mouseenter="handleClickAndHover"
  >
    <slot/>
  </button>
</template>
