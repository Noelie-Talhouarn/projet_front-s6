<script setup lang="ts">
const model = defineModel<string>()

const props = defineProps<{
  label?: string
  type: 'text' | 'email' | 'password' | 'date'
  size?: 'default' | 'small' | 'medium' | 'large'
}>()

const sizeClasses = {
  small: 'max-w-[150px]',
  default: 'w-full',
  medium: 'max-w-[260px]',
  large: 'max-w-[350px]'
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="text-xs font-bold uppercase tracking-wider text-spark-light ml-1">
      {{ label }}
    </label>

    <input
      v-model="model"
      :type="type"
      class="w-full rounded-lg border border-night-700 bg-night-800 px-4 py-3 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-spark focus:ring-1 focus:ring-spark/50"
      :class="sizeClasses[size || 'default']"
      :placeholder="label"
    >
  </div>
</template>