<script setup lang="ts">
const props = defineProps<{
  streak: number
}>()

// Message incitatif
const getMessage = () => {
  if (props.streak === 0) {
    return {
      main: 'Commence ta série aujourd\'hui',
      sub: 'Une pratique quotidienne pour progresser'
    }
  }
  if (props.streak === 1) {
    return {
      main: 'Reviens demain',
      sub: 'pour garder ta flamme allumée 🔥'
    }
  }
  if (props.streak < 7) {
    return {
      main: 'Continue demain',
      sub: `pour atteindre 7 jours de suite`
    }
  }
  if (props.streak < 30) {
    return {
      main: 'Ne casse pas ta série !',
      sub: `${30 - props.streak} jours avant le palier de 30`
    }
  }
  return {
    main: 'Série impressionnante !',
    sub: 'Continue sur ta lancée'
  }
}

const message = computed(() => getMessage())
</script>

<template>
  <div 
    class="relative overflow-hidden rounded-lg border-[1.5px] transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-black/10"
    :class="streak > 0 
      ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-400/30 hover:border-orange-400/50' 
      : 'bg-white/[0.05] border-[#D645EC]/20 hover:border-[#D645EC]/40'"
  >
    <!-- Glow effect subtil -->
    <div 
      v-if="streak > 0"
      class="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
    ></div>

    <div class="relative p-3 flex items-center gap-3">
      <!-- Flamme -->
      <div class="flex-shrink-0">
        <div 
          class="text-2xl transition-all duration-300"
          :class="streak > 0 ? 'text-orange-400' : 'text-slate-600'"
        >
          <i v-if="streak > 0" class="fi fi-rr-flame animate-pulse inline-block"></i>
          <i v-else class="fi fi-rr-flame inline-block"></i>
        </div>
      </div>

      <!-- Contenu -->
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-2">
          <span 
            class="font-semibold text-base"
            :class="streak > 0 ? 'text-orange-400' : 'text-white/40'"
          >
            {{ streak > 0 ? `${streak} jour${streak > 1 ? 's' : ''}` : 'Aucune série' }}
          </span>
          <span class="text-sm text-white/60 truncate">
            {{ message.main }}
          </span>
        </div>
        <p class="text-xs text-white/40 mt-0.5">
          {{ message.sub }}
        </p>
      </div>

      <!-- Badge optionnel pour les paliers -->
      <div 
        v-if="streak >= 7"
        class="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
        :class="{
          'bg-orange-500/20 text-orange-300': streak >= 7 && streak < 30,
          'bg-yellow-500/20 text-yellow-300': streak >= 30 && streak < 100,
          'bg-purple-500/20 text-purple-300': streak >= 100
        }"
      >
        <i class="fi" :class="streak >= 100 ? 'fi-rr-trophy' : streak >= 30 ? 'fi-rr-star' : 'fi-rr-flame'"></i>
      </div>
    </div>
  </div>
</template>
