<script setup lang="ts">
const props = defineProps<{
  as: 'h1' | 'h2' | 'h3'
  size?: 'default' | 'small' | 'medium' | 'large'
}>()

const sizeClasses = {
  small: 'text-lg md:text-xl',
  default: 'text-2xl md:text-3xl lg:text-4xl',
  medium: 'text-3xl md:text-4xl lg:text-5xl',
  large: 'text-4xl md:text-5xl lg:text-7xl'
}
</script>

<template>
  <component
    :is="as"
    class="font-bold tracking-tight bg-gradient-spark bg-clip-text text-transparent"
    :class="sizeClasses[size || 'default']"
  >
    <slot />
  </component>
</template>
