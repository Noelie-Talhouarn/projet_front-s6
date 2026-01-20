<script setup lang="ts">
const model = defineModel<string>()

const props = defineProps<{
  label?: string
  type: 'text' | 'email' | 'password' | 'date'
  size?: 'default' | 'small' | 'medium' | 'large'
  placeholder?: string
}>()

const sizeClasses = {
  small: 'max-w-[150px]',
  default: 'w-full',
  medium: 'max-w-[260px]',
  large: 'max-w-[350px]'
}
</script>

<template>
  <div class="flex flex-col gap-2 group">
    <label v-if="label" class="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 transition-colors group-focus-within:text-spark-light">
      {{ label }}
    </label>

    <input
      v-model="model"
      :type="type"
      class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-spark focus:bg-white/10 focus:shadow-[0_0_15px_rgba(124,58,237,0.3)] focus:ring-1 focus:ring-spark/50"
      :class="sizeClasses[size || 'default']"
      :placeholder="placeholder || label"
    >
  </div>
</template>