<script setup lang="ts">
// Structure d'une étoile
interface Star {
  id: number
  x: number
  y: number
  message: string
  intensity: 'small' | 'medium' | 'large'
  date: string
  animationDelay: string
}

// Liste de secours (Fallback) si l'API ne répond pas
const DEFAULT_WORDS = [
  "Espoir", "Lumière", "Force", "Amour", "Sérénité", "Joie", "Confiance", 
  "Paix", "Harmonie", "Rêve", "Courage", "Gratitude", "Liberté", "Magie", 
  "Douceur", "Calme", "Souffle", "Vie", "Beauté", "Merveille", "Éclat",
  "Horizon", "Infini", "Silence", "Présence", "Cœur", "Âme", "Lien",
  "Patience", "Respect", "Foi", "Clarté", "Vérité", "Sagesse"
]

// État
const stars = ref<Star[]>([])
const cloudWords = ref<string[]>([...DEFAULT_WORDS]) // On initialise avec le fallback
const showModal = ref(false)
const newMessage = ref('')
const selectedIntensity = ref<'small' | 'medium' | 'large'>('medium')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const clickCoordinates = ref({ x: 0, y: 0 })

// Récupération de l'API
const { fetchStars, addStarApi, removeStarApi, fetchCloudWords } = useStars()

// Chargement initial
onMounted(async () => {
  // 1. Charger les étoiles
  const loadedStars = await fetchStars()
  stars.value = loadedStars.map(s => ({
    ...s,
    animationDelay: s.animationDelay || `${Math.random() * 3}s`
  }))

  // 2. Charger les mots du nuage
  const remoteWords = await fetchCloudWords()
  if (remoteWords && remoteWords.length > 0) {
    cloudWords.value = remoteWords
  }
})

// CALCUL DU NUAGE DE MOTS
// 1 mot toutes les 3 étoiles
const wordCloud = computed(() => {
  const wordCount = Math.floor(stars.value.length / 3)
  if (wordCount === 0) return []

  const cols = 6
  const rows = 8
  const totalSlots = cols * rows
  const cellW = 90 / cols
  const cellH = 80 / rows
  const wordsToShow = []

  // On utilise cloudWords.value au lieu de la constante
  const availableWords = cloudWords.value

  for (let i = 0; i < wordCount; i++) {
    const wordText = availableWords[i % availableWords.length] || 'Lumière'
    const slotIndex = (i * 17) % totalSlots
    const col = slotIndex % cols
    const row = Math.floor(slotIndex / cols)
    const gridX = 5 + (col * cellW) 
    const gridY = 10 + (row * cellH)
    const jitterSeed = i * 99.7
    const jitterX = Math.sin(jitterSeed) * (cellW * 0.3)
    const jitterY = Math.cos(jitterSeed) * (cellH * 0.3)
    
    wordsToShow.push({
      text: wordText,
      x: gridX + (cellW / 2) + jitterX,
      y: gridY + (cellH / 2) + jitterY,
      size: ['text-xs', 'text-sm'][i % 2],
      opacity: 0.6 + (Math.sin(i) * 0.4),
      rotation: (Math.sin(i * 12) * 10),
      delay: '0s'
    })
  }
  
  return wordsToShow
})

function handleSkyClick(event: MouseEvent) {
  if (
    (event.target as HTMLElement).closest('.star-trigger') || 
    (event.target as HTMLElement).closest('.modal-content')
  ) {
    return
  }

  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  
  clickCoordinates.value = {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100
  }

  newMessage.value = ''
  selectedIntensity.value = 'medium'
  selectedDate.value = new Date().toISOString().split('T')[0]
  showModal.value = true
}

async function addStar() {
  if (!newMessage.value.trim()) return

  // Données de la nouvelle étoile
  const starData = {
    x: clickCoordinates.value.x,
    y: clickCoordinates.value.y,
    message: newMessage.value,
    intensity: selectedIntensity.value,
    // On envoie la date au format ISO (YYYY-MM-DD) pour éviter les erreurs SQL
    date: selectedDate.value, 
    animationDelay: `${Math.random() * 3}s`
  }

  try {
    // 1. Envoi au backend
    // Note: l'ID sera généré par le backend
    const savedStar = await addStarApi(starData)
    
    if (savedStar && savedStar.id) {
        // Succès : on ajoute l'étoile retournée par le serveur
        stars.value.push({
            ...savedStar,
            animationDelay: starData.animationDelay // On garde l'animation calculée front
        })
    } else {
        // Fallback optimiste (si l'API ne renvoie rien ou échoue silencieusement)
        stars.value.push({ ...starData, id: Date.now() })
    }
  } catch (e) {
    console.error("Erreur, mode hors ligne activé pour cette étoile")
    // Fallback optimiste
    stars.value.push({ ...starData, id: Date.now() })
  }
  
  showModal.value = false
}

async function deleteStar(id: number) {
  // Suppression optimiste
  const previousStars = [...stars.value]
  stars.value = stars.value.filter(s => s.id !== id)
  
  const success = await removeStarApi(id)
  if (!success) {
    console.error("Échec suppression API")
    // Optionnel : remettre l'étoile si échec critique
    // stars.value = previousStars 
  }
}
</script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-[#050505] to-black cursor-crosshair center-content" @click="handleSkyClick">
    
    <!-- Titre -->
    <div class="absolute top-6 left-0 right-0 text-center pointer-events-none z-10 opacity-70">
      <h1 class="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200 font-light tracking-[0.3em] text-xl uppercase">Ciel Intérieur</h1>
      <p class="text-[10px] text-slate-500 mt-2 tracking-widest">
        {{ stars.length }} étoiles • Prochain mot dans {{ 3 - (stars.length % 3) }} étoiles
      </p>
    </div>

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
        <span class="font-normal tracking-wider text-indigo-100 hover:text-white transition-colors cursor-default whitespace-nowrap drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{{ word.text }}</span>
      </div>
    </div>

    <!-- Les Étoiles (Moins visibles maintenant) -->
    <client-only>
      <div 
        v-for="star in stars" 
        :key="star.id"
        class="absolute star-trigger group z-20"
        :style="{ left: `${star.x}%`, top: `${star.y}%` }"
      >
        <!-- L'étoile visuelle : Opacité réduite, taille réduite -->
        <div 
          class="relative rounded-full bg-white/60 shadow-[0_0_5px_rgba(255,255,255,0.4)] animate-twinkle cursor-pointer transition-transform hover:scale-150 hover:bg-white hover:opacity-100"
          :class="{
            'w-1 h-1': star.intensity === 'small',
            'w-1.5 h-1.5': star.intensity === 'medium',
            'w-2 h-2': star.intensity === 'large'
          }"
          :style="{ animationDelay: star.animationDelay }"
        ></div>

        <!-- Le Tooltip -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 w-56 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-none group-hover:pointer-events-auto">
          <div class="bg-black/90 backdrop-blur-md border border-white/10 p-4 rounded-xl text-center shadow-2xl">
            <p class="text-xs text-slate-500 mb-1 uppercase tracking-widest">{{ star.date }}</p>
            <p class="text-base text-slate-200 font-light italic leading-relaxed">"{{ star.message }}"</p>
            <button @click.stop="deleteStar(star.id)" class="mt-2 text-[10px] text-red-500/50 hover:text-red-400">× Supprimer</button>
          </div>
        </div>
      </div>
    </client-only>

    <!-- Modale d'ajout -->
    <div v-if="showModal" class="absolute z-50 modal-content" :style="{ left: `${clickCoordinates.x}%`, top: `${clickCoordinates.y}%` }">
      <div class="relative -translate-x-1/2 -translate-y-full mb-4 w-72 bg-slate-900/95 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] animate-pop-in">
        
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Nouveau Souvenir</h3>
        
        <!-- Date Picker -->
        <div class="mb-3">
          <label class="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Date</label>
          <input 
            v-model="selectedDate"
            type="date" 
            class="w-full bg-black/40 border border-white/5 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500/40"
          />
        </div>

        <textarea 
          v-model="newMessage"
          class="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 resize-none h-20 mb-4 font-light leading-relaxed"
          placeholder="Un moment précieux..."
          autoFocus
          @keydown.enter.prevent="addStar"
        ></textarea>

        <div class="flex items-center justify-between mb-5 px-1">
          <span class="text-[10px] text-slate-500 uppercase tracking-wider">Éclat</span>
          <div class="flex gap-3 items-center">
            <button @click="selectedIntensity = 'small'" class="w-3 h-3 rounded-full bg-slate-700 hover:bg-white transition-all duration-300" :class="{'bg-white scale-125 shadow-[0_0_8px_white]': selectedIntensity === 'small'}"></button>
            <button @click="selectedIntensity = 'medium'" class="w-4 h-4 rounded-full bg-slate-700 hover:bg-white transition-all duration-300" :class="{'bg-white scale-125 shadow-[0_0_12px_white]': selectedIntensity === 'medium'}"></button>
            <button @click="selectedIntensity = 'large'" class="w-5 h-5 rounded-full bg-slate-700 hover:bg-white transition-all duration-300" :class="{'bg-white scale-125 shadow-[0_0_16px_white]': selectedIntensity === 'large'}"></button>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="showModal = false" class="flex-1 py-2 text-xs text-slate-400 hover:text-white transition-colors">Annuler</button>
          <button 
            @click="addStar" 
            class="flex-1 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
            :disabled="!newMessage"
          >
            Allumer
          </button>
        </div>
      </div>
    </div>

    <!-- Message vide -->
    <div v-if="stars.length === 0" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-40">
      <span class="text-4xl block mb-4">✨</span>
      <p class="text-xs tracking-[0.2em] uppercase text-slate-400">Le ciel attend vos lumières</p>
    </div>

  </div>
</template>

<style scoped>
@keyframes twinkle {
  0%, 100% { opacity: 0.9; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.animate-twinkle {
  animation: twinkle 4s infinite ease-in-out;
}

@keyframes word-appear {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); filter: blur(10px); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); }
}

.animate-word-appear {
  animation: word-appear 3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes pop-in {
  0% { opacity: 0; transform: translate(-50%, -40%) scale(0.95); filter: blur(5px); }
  100% { opacity: 1; transform: translate(-50%, -100%) scale(1); filter: blur(0); }
}

.animate-pop-in {
  animation: pop-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
</style>
