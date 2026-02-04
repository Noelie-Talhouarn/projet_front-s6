<script setup lang="ts">
// Liste de secours (Fallback) si l'API ne répond pas
const DEFAULT_WORDS = [
  "Espoir", "Lumière", "Force", "Amour", "Sérénité", "Joie", "Confiance", 
  "Paix", "Harmonie", "Rêve", "Courage", "Gratitude", "Liberté", "Magie", 
  "Douceur", "Calme", "Souffle", "Vie", "Beauté", "Merveille", "Éclat",
  "Horizon", "Infini", "Silence", "Présence", "Cœur", "Âme", "Lien",
  "Patience", "Respect", "Foi", "Clarté", "Vérité", "Sagesse"
]

useSeoMeta({
  title: 'Le Ciel Étoilé - L\'Étincelle',
  description: 'Partagez vos pensées positives et éclairez le ciel de la communauté.',
  ogTitle: 'Le Ciel Étoilé - L\'Étincelle',
})

definePageMeta({
  layout: false
})

// État
interface WordCloudItem {
  text: string
  x: number
  y: number
  size: string
  opacity: number
  rotation: number
  delay: string
}

const stars = ref<Star[]>([])
const cloudWords = ref<string[]>([...DEFAULT_WORDS])
const showModal = ref(false)
const newMessage = ref('')
const showInfoModal = ref(false)
const selectedIntensity = ref<'small' | 'medium' | 'large'>('medium')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const clickCoordinates = ref({ x: 0, y: 0 })
const isSending = ref(false)

// Récupération de l'API
const { fetchStars, addStarApi, removeStarApi, fetchCloudWords } = useStars()

// Chargement initial
onMounted(async () => {
  const loadedStars = await fetchStars()
  stars.value = loadedStars.map(s => ({
    ...s,
    animationDelay: s.animationDelay || `${Math.random() * 3}s`
  }))

  const remoteWords = await fetchCloudWords()
  if (remoteWords && remoteWords.length > 0) {
    cloudWords.value = remoteWords
  }

  if (stars.value.length === 0) {
    showInfoModal.value = true
  }
})

function closeInfoModal() {
  showInfoModal.value = false
}

const wordCloud = computed(() => {
  const wordCount = Math.min(50, Math.floor(stars.value.length / 3))
  if (wordCount === 0) return []

  const cols = 6
  const rows = 8
  const totalSlots = cols * rows
  const cellW = 90 / cols
  const cellH = 80 / rows
  const wordsToShow: WordCloudItem[] = []

  const availableWords = cloudWords.value

  for (let i = 0; i < wordCount; i++) {
    const wordText = (availableWords && availableWords.length > 0) 
      ? availableWords[i % availableWords.length] 
      : 'Lumière'
    const slotIndex = (i * 17) % totalSlots
    const col = slotIndex % cols
    const row = Math.floor(slotIndex / cols)
    const gridX = 10 + (col * cellW * 0.8) 
    const gridY = 40 + (row * cellH * 0.5)
    const jitterSeed = i * 99.7
    const jitterX = Math.sin(jitterSeed) * (cellW * 0.3)
    const jitterY = Math.cos(jitterSeed) * (cellH * 0.3)
    
    wordsToShow.push({
      text: wordText as string,
      x: gridX + (cellW / 2) + jitterX,
      y: gridY + (cellH / 2) + jitterY,
      size: (['text-xs', 'text-sm'][i % 2]) as string,
      opacity: 0.6 + (Math.sin(i) * 0.4),
      rotation: (Math.sin(i * 12) * 10),
      delay: '0s'
    })
  }
  
  return wordsToShow
})

function handleSkyClick(event: MouseEvent) {
  // Empêcher d'ouvrir la modale d'ajout si une modale est déjà ouverte
  if (showModal.value || showInfoModal.value) return

  if (
    (event.target as HTMLElement).closest('.star-trigger') || 
    (event.target as HTMLElement).closest('.modal-content')
  ) {
    return
  }

  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  
  clickCoordinates.value = {
    x: Math.max(5, Math.min(95, ((event.clientX - rect.left) / rect.width) * 100)),
    y: Math.max(35, Math.min(90, ((event.clientY - rect.top) / rect.height) * 100))
  }

  newMessage.value = ''
  selectedIntensity.value = 'medium'
  selectedDate.value = new Date().toISOString().split('T')[0]
  showModal.value = true
}

async function addStar() {
  if (!newMessage.value.trim() || isSending.value) return

  isSending.value = true
  const starData = {
    x: clickCoordinates.value.x,
    y: clickCoordinates.value.y,
    message: newMessage.value,
    intensity: selectedIntensity.value,
    date: selectedDate.value || new Date().toISOString(), 
    animationDelay: `${Math.random() * 3}s`
  }

  try {
    const savedStar = await addStarApi(starData)
    
    if (savedStar && savedStar.id) {
        stars.value.push({
            ...savedStar,
            animationDelay: starData.animationDelay
        })
        showInfoModal.value = false 
    } else {
        stars.value.push({ ...starData, id: Date.now() })
    }
  } catch (e) {
    stars.value.push({ ...starData, id: Date.now() })
  } finally {
    isSending.value = false
  }
  
  showModal.value = false
}

async function deleteStar(id: number) {
  stars.value = stars.value.filter((s: Star) => s.id !== id)
  await removeStarApi(id)
}
</script>

<template>
  <div class="h-[100dvh] w-full overflow-hidden bg-night-900 relative text-slate-200">
    <HeaderPage />
    <ToolBar />

    <div class="relative h-full w-full cursor-crosshair" @click="handleSkyClick">
    
    <!-- Lueur subtile en fond -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-spark/10 blur-[150px] rounded-full pointer-events-none"></div>

    <!-- Titre -->
    <div class="absolute top-24 left-0 right-0 text-center pointer-events-none z-10 animate-fade-in px-4">
      <span class="text-xs font-bold uppercase tracking-[0.3em] text-spark-light/80 mb-3 block">Mémoire</span>
      <h1 class="text-white font-zen tracking-[0.2em] text-2xl md:text-3xl uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">Ciel Intérieur</h1>
      <div class="flex flex-col items-center gap-2 mt-4 md:mt-6">
        <div class="h-1 w-12 md:w-16 bg-spark rounded-full transition-all duration-700"></div>
        <p class="text-sm text-slate-400 tracking-widest uppercase mt-4">
          {{ stars.length }} lumières intérieures
        </p>

      </div>
    </div>

    <!-- Info Button -->
    <button 
      @click.stop="showInfoModal = true"
      class="absolute top-24 right-8 z-40 text-slate-400 hover:text-white transition-all p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20"
      title="À propos du Ciel"
    >
      <i class="fi fi-rr-info text-xl"></i>
    </button>

    <!-- NUAGE DE MOTS -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div 
        v-for="word in wordCloud" 
        :key="word.text + word.x"
        class="absolute transform -translate-x-1/2 -translate-y-1/2 animate-word-appear transition-all duration-1000"
        :class="[word.size]"
        :style="{ 
          left: `${word.x}%`, 
          top: `${word.y}%`, 
          opacity: word.opacity,
          transform: `translate(-50%, -50%) rotate(${word.rotation}deg)` 
        }"
      >
        <span class="font-normal tracking-wider text-spark-light/60 italic cursor-default whitespace-nowrap drop-shadow-[0_0_8px_rgba(214,69,236,0.2)]">{{ word.text }}</span>
      </div>
    </div>

    <!-- Les Étoiles -->
    <client-only>
      <div 
        v-for="star in stars" 
        :key="star.id"
        class="absolute star-trigger group z-20"
        :style="{ left: `${star.x}%`, top: `${star.y}%` }"
      >
        <div class="relative flex items-center justify-center">
            <div class="absolute inset-0 bg-spark/40 blur-lg rounded-full scale-0 group-hover:scale-[3] transition-transform duration-500"></div>
            
            <div 
              class="relative rounded-full bg-white shadow-[0_0_10px_white] animate-twinkle cursor-pointer transition-all duration-500 group-hover:scale-150 group-hover:bg-spark-light"
              :class="{
                'w-1 h-1': star.intensity === 'small',
                'w-1.5 h-1.5': star.intensity === 'medium',
                'w-2 h-2': star.intensity === 'large'
              }"
              :style="{ animationDelay: star.animationDelay }"
            ></div>
        </div>

        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-none group-hover:pointer-events-auto">
          <div class="bg-night-900/90 backdrop-blur-xl border border-[#D946EF]/30 p-6 rounded-2xl text-center shadow-2xl relative overflow-hidden">
            <div class="absolute inset-0 bg-spark/5 pointer-events-none"></div>
            <p class="text-xs text-spark-light/60 mb-2 uppercase tracking-[0.2em] font-medium">{{ star.date }}</p>
            <p class="text-base text-slate-100 font-light italic leading-relaxed relative z-10">"{{ star.message }}"</p>
            <button @click.stop="deleteStar(star.id)" class="mt-4 text-xs text-red-400/50 hover:text-red-400 uppercase tracking-widest font-bold transition-colors">× Supprimer</button>
          </div>
        </div>
      </div>
    </client-only>

    <!-- Modale d'ajout -->
    <div 
      v-if="showModal" 
      class="modal-content fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:block md:absolute md:inset-auto md:p-0" 
      :style="{ '--cx': `${clickCoordinates.x}%`, '--cy': `${clickCoordinates.y}%` }"
    >
      <div 
        class="relative w-full max-w-sm bg-night-900/40 backdrop-blur-2xl border border-spark/30 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(214,69,236,0.15)] animate-pop-in 
               md:w-80 md:fixed-desktop-pos md:-translate-x-1/2 md:-translate-y-full md:mb-6"
        @click.stop
      >
        <div class="absolute -top-12 left-1/2 -translate-x-1/2">
            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_white]">
                <i class="fi fi-rr-sparkles text-black text-xl"></i>
            </div>
        </div>

        <h3 class="text-sm font-bold text-spark-light uppercase tracking-[0.2em] mb-6 text-center">Nouveau Souvenir</h3>
        
        <div class="mb-4 text-left">
          <label class="block text-xs text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Date du moment</label>
          <input 
            v-model="selectedDate"
            type="date" 
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-spark/50 transition-colors"
          />
        </div>

        <textarea 
          v-model="newMessage"
          class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-base text-white placeholder-slate-600 focus:outline-none focus:border-spark/50 transition-colors resize-none h-28 mb-6 font-light leading-relaxed"
          placeholder="Racontez ce moment précieux..."
          autoFocus
          @keydown.enter.prevent="addStar"
        ></textarea>

        <div class="mb-8">
          <div class="flex items-center justify-between mb-3 px-1">
            <span class="text-xs text-slate-500 uppercase tracking-[0.2em]">Éclat de l'étoile</span>
          </div>
          <div class="flex gap-4 justify-center items-center bg-white/5 p-4 rounded-xl border border-white/5">
            <button @click="selectedIntensity = 'small'" class="flex flex-col items-center gap-2 group">
                <div class="w-3 h-3 rounded-full bg-slate-700 transition-all duration-300" :class="{'bg-white scale-125 shadow-[0_0_10px_white]': selectedIntensity === 'small'}"></div>
            </button>
            <div class="h-4 w-px bg-white/10"></div>
            <button @click="selectedIntensity = 'medium'" class="flex flex-col items-center gap-2 group">
                <div class="w-4 h-4 rounded-full bg-slate-700 transition-all duration-300" :class="{'bg-white scale-125 shadow-[0_0_15px_white]': selectedIntensity === 'medium'}"></div>
            </button>
            <div class="h-4 w-px bg-white/10"></div>
            <button @click="selectedIntensity = 'large'" class="flex flex-col items-center gap-2 group">
                <div class="w-5 h-5 rounded-full bg-slate-700 transition-all duration-300" :class="{'bg-white scale-125 shadow-[0_0_20px_white]': selectedIntensity === 'large'}"></div>
            </button>
          </div>
        </div>

        <div class="flex gap-4">
          <button @click="showModal = false" class="flex-1 py-3 text-sm text-slate-500 hover:text-white transition-colors uppercase tracking-widest font-bold">Fermer</button>
          <button 
            @click="addStar" 
            class="flex-[2] py-4 bg-white text-black rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-spark-light transition-all shadow-xl hover:shadow-white/20 flex items-center justify-center gap-2 active:scale-95"
            :disabled="!newMessage || isSending"
          >
            <div v-if="isSending" class="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            {{ isSending ? 'Allumage...' : 'Allumer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Message vide -->
    <div v-if="stars.length === 0" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
      <div class="relative mb-8 flex justify-center">
        <div class="absolute inset-0 bg-spark/20 blur-3xl rounded-full scale-[3] animate-pulse"></div>
        <i class="fi fi-rr-sparkles text-6xl text-white relative z-10"></i>
      </div>
      <p class="text-xl font-zen tracking-[0.3em] uppercase text-white mb-2">Le ciel est vide</p>
      <p class="text-sm tracking-[0.1em] uppercase text-slate-500">Cliquez pour allumer une nouvelle lueur</p>
    </div>

    <div 
      v-if="showInfoModal" 
      class="modal-content fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      @click.self="closeInfoModal"
    >
      <div class="bg-night-900 border border-spark/30 p-8 rounded-[2rem] max-w-sm text-center shadow-[0_0_50px_rgba(214,69,236,0.2)] relative overflow-hidden">
        <div class="absolute top-0 right-0 p-2">
            <button 
              @click="closeInfoModal"
              class="text-slate-500 hover:text-white transition-colors p-2"
            >
              <i class="fi fi-rr-cross-small text-xl"></i>
            </button>
        </div>

        <div class="mb-4 inline-flex p-3 rounded-2xl bg-spark/10 text-spark-light">
            <i class="fi fi-rr-stars text-3xl"></i>
        </div>
        <h2 class="text-xl font-zen text-white mb-3 uppercase tracking-wider">Le Ciel Intérieur</h2>
        <p class="text-slate-300 text-sm leading-relaxed mb-5">
          Ce ciel est votre <strong>sanctuaire personnel</strong> de gratitude. Chaque étoile représente un moment précieux.
        </p>
        <div class="bg-spark/5 border border-spark/20 rounded-xl p-3 mb-5 text-left">
            <p class="text-spark-light text-[11px] font-medium flex items-start gap-2">
                <i class="fi fi-rr-sparkles mt-0.5 shrink-0"></i>
                <span>Tous les 3 souvenirs, un nouveau mot de lumière apparaît.</span>
            </p>
        </div>
        <div class="space-y-3 text-left mb-6">
            <div class="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <p class="text-[11px] text-slate-400 leading-snug">Cliquez pour créer un souvenir.</p>
            </div>
            <div class="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <p class="text-[11px] text-slate-400 leading-snug">Cliquer sur une étoile pour redécouvrir l'instant.</p>
            </div>
        </div>

        <button 
          @click="closeInfoModal"
          class="w-full py-3 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
        >
          Commencer mon voyage
        </button>
      </div>
    </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes twinkle {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
    box-shadow: 0 0 10px white;
  }
  50% { 
    opacity: 0.3; 
    transform: scale(0.6);
    box-shadow: 0 0 5px white;
  }
}

.animate-twinkle {
  animation: twinkle 5s infinite ease-in-out;
}

@keyframes word-appear {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); filter: blur(15px); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); }
}

.animate-word-appear {
  animation: word-appear 4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.9) translateY(10px); filter: blur(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}

@media (min-width: 768px) {
  .fixed-desktop-pos {
    position: absolute;
    left: var(--cx);
    top: var(--cy);
  }
}

.animate-pop-in {
  animation: pop-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fade-in {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
    animation: fade-in 1s ease-out forwards;
}
</style>
