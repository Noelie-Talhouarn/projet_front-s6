<script setup lang="ts">
const props = defineProps<{
    initialMood?: string | null,
    isLoading?: boolean
}>()

const emit = defineEmits(['select'])
const selectedMood = ref<string | null>(props.initialMood || null)

// Watcher pour réagir si le parent envoie la donnée un peu plus tard (après le fetch)
watch(() => props.initialMood, (newVal) => {
    if (newVal !== undefined) {
        selectedMood.value = newVal
    }
})

const moods = [
  { 
    id: 'anxious', 
    label: 'Anxieux', 
    icon: 'fi-rr-cloud-showers-heavy', 
    color: 'text-blue-300'
  },
  { 
    id: 'tired', 
    label: 'Fatigué', 
    icon: 'fi-rr-moon-stars', 
    color: 'text-indigo-300'
  },
  { 
    id: 'calm', 
    label: 'Serein', 
    icon: 'fi-rr-leaf', 
    color: 'text-emerald-300'
  },
  { 
    id: 'joyful', 
    label: 'Joyeux', 
    icon: 'fi-rr-sun', 
    color: 'text-amber-300'
  }
]

function selectMood(id: string) {
  // Toggle : si on clique sur le même, on désélectionne
  if (selectedMood.value === id) {
      selectedMood.value = null
      emit('select', null)
  } else {
      selectedMood.value = id
      emit('select', id)
  }
}
</script>

<template>
  <div class="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/[0.07]">
    <div class="animate-fade-in-up">
        <h3 v-if="!selectedMood" class="text-lg font-zen tracking-wide text-white mb-4 text-center">Comment vous sentez-vous maintenant ?</h3>
        <h3 v-else class="text-lg font-zen tracking-wide text-white mb-4 text-center flex items-center justify-center gap-2">
            Votre intention : <span class="text-spark-light">{{ moods.find(m => m.id === selectedMood)?.label }}</span>
            <div v-if="isLoading" class="h-4 w-4 border-2 border-spark-light/30 border-t-spark-light rounded-full animate-spin inline-block"></div>
        </h3>
        
        <div class="grid grid-cols-4 gap-2 md:flex md:justify-center md:gap-4">
            <button 
                v-for="mood in moods" 
                :key="mood.id"
                @click="selectMood(mood.id)"
                class="group flex flex-col items-center justify-center w-full md:w-20 h-20 rounded-xl border transition-all duration-300"
                :class="[
                    selectedMood 
                        ? (selectedMood === mood.id ? 'bg-white/20 border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-transparent border-transparent opacity-40 scale-90')
                        : 'bg-night-800 border-white/5 hover:border-white/20 hover:scale-105'
                ]"
            >
                <i :class="['fi text-2xl mb-2 transition-transform', mood.icon, mood.color, selectedMood === mood.id ? 'scale-110' : '']"></i>
                <span class="text-[10px] uppercase tracking-wider group-hover:text-white" :class="selectedMood === mood.id ? 'text-white font-bold' : 'text-slate-400'">{{ mood.label }}</span>
            </button>
        </div>
    </div>
  </div>
</template>
