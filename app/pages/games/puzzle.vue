<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

useSeoMeta({
  title: 'Puzzle Zen - L\'Étincelle',
  description: 'Reconstituez des phrases poétiques dans ce puzzle de mots apaisant.',
  ogTitle: 'Puzzle Zen - L\'Étincelle',
})

// --- TYPES ---
type Piece = {
  id: number // Index correct
  content: string
  order: number // Position actuelle dans la liste (0, 1, 2...)
}

type LevelData = {
  id: number
  type: 'word' | 'image'
  content: string // Le mot complet ou l'URL de l'image
  grid: [number, number] // [cols, rows]
}

// --- CONFIG ---


function generateLevelConfig(levelIndex: number): LevelData {
  // Mode texte uniquement
  const cols = levelIndex > 10 ? 4 : 3
  const rows = 1

  // Pour les mots, on va fetcher depuis l'API
  return { id: levelIndex, type: 'word', content: '', grid: [cols, rows] } 
}

// --- STATE ---
const isLoading = ref(false)
const currentLevelIdx = ref(0)
const isCompleted = ref(false)
const pieces = ref<Piece[]>([])
const containerRef = ref<HTMLElement | null>(null)

const draggedPieceIdx = ref<number | null>(null)
const dragX = ref(0)
const startX = ref(0)
const initialOrder = ref<number[]>([])

const currentWord = ref('')
const PIECE_WIDTH = ref(140)
const GAP = ref(-20)

function updateDimensions() {
  if (process.client) {
    const screenWidth = window.innerWidth
    if (screenWidth < 480) {
      PIECE_WIDTH.value = 90
      GAP.value = -15
    } else if (screenWidth < 1024) {
      PIECE_WIDTH.value = 120
      GAP.value = -20
    } else {
      PIECE_WIDTH.value = 160
      GAP.value = -25
    }
  }
}


// --- API ---
const { fetchCloudWords } = useStars()
const token = useCookie('auth_token')

const config = useRuntimeConfig()

// Gestion de la progression
async function loadProgress() {
  if (!token.value) return
  try {
     const data = await $fetch<{ level: number }>('/api/users/puzzle', {
        headers: { Authorization: `Bearer ${token.value}` }
     })
     // Si l'utilisateur est niveau 3, cela veut dire qu'il joue le niveau 3 -> index 2
     if (data && data.level > 1) {
        currentLevelIdx.value = data.level - 1
     }
  } catch (e) {
     // Log removed
  }
}

async function saveProgress(newLevel: number) {
  if (!token.value) return
  try {
     await $fetch('/api/users/puzzle', {
        method: 'POST',
        body: { level: newLevel },
        headers: { Authorization: `Bearer ${token.value}` }
     })
  } catch (e) {
      // Log removed
  }
}

// --- LOGIC ---

// 1. Initialiser le niveau
async function initLevel() {
  isCompleted.value = false
  pieces.value = []
  
  // Générer le niveau courant
  const levelData = generateLevelConfig(currentLevelIdx.value)
  if (!levelData) return

  let content = levelData.content
  let cols = levelData.grid[0]
  const rows = levelData.grid[1]

  // Fetch depuis le backend (via useStars pour cohérence avec le Ciel)
  // On récupère la liste complète des "mots du nuage" (cloudword) et on en pioche un au hasard
  if (true) {
      isLoading.value = true
      try {
          const words = await fetchCloudWords()
          
          if (words && words.length > 0) {
             const randomWord = words[Math.floor(Math.random() * words.length)]
             content = (randomWord || 'LUMIÈRE').toUpperCase()
          } else {
             content = 'LUMIÈRE'
          }

          // Ajuster la grille selon la longueur du mot reçu
          cols = content.length > 7 ? 4 : (content.length > 4 ? 3 : 2)
      } catch (e) {
          content = 'ESPOIR' // Fallback ultime
      } finally {
          isLoading.value = false
      }
  }
  
  // On sauvegarde le mot pour l'affichage de victoire
  currentWord.value = content

  const containerW = containerRef.value?.clientWidth || 350
  const pieceW = containerW / cols
  const pieceH = 100 / rows

  // Génération des pièces
  let idCounter = 0
  
  // Pour les mots, on découpe grossièrement la chaîne
  let textParts: string[] = []
  if (levelData.type === 'word') {
     const len = content.length
     // Découpe un peu plus intelligente : répartir les lettres
     // if (content.length > 0) { // This line was incomplete in the instruction, removing it.
     // const len = content.length // Already defined above
     // Pour les mots longs, on peut augmenter le nombre de pièces
     const cols = len > 8 ? 4 : 3 // This redefines cols, which was already defined earlier based on levelIndex
     const lettersPerPiece = Math.ceil(len / cols)
     for (let i = 0; i < cols; i++) {
        const start = i * lettersPerPiece
        const end = Math.min(start + lettersPerPiece, len)
        textParts.push(content.slice(start, end))
     }
  }

  const contentLen = content.length
  const lettersPerPiece = Math.ceil(contentLen / cols)
  const temp: Piece[] = []

  for (let i = 0; i < cols; i++) {
    const start = i * lettersPerPiece
    const end = Math.min(start + lettersPerPiece, contentLen)
    const textPart = content.slice(start, end)
    if (textPart) {
      temp.push({ id: i, content: textPart, order: i })
    }
  }

  // Mélanger l'ordre initial (Garanti non-résolu)
  let shuffledIndexes = [...Array(temp.length).keys()];
  let isSorted = true;
  
  while (isSorted && temp.length > 1) {
    shuffledIndexes.sort(() => Math.random() - 0.5);
    isSorted = shuffledIndexes.every((val, index) => val === index);
  }
  
  pieces.value = temp.map((p, i) => ({ ...p, order: shuffledIndexes[i]! }))
}

// 2. Logique de Drag Sortable
function onPointerDown(e: PointerEvent, index: number) {
  if (isCompleted.value) return
  draggedPieceIdx.value = index
  startX.value = e.clientX
  dragX.value = 0
  initialOrder.value = pieces.value.map(p => p.order)
  
  // Capturer le pointeur pour continuer à tracker même si on sort de la pièce
  const target = e.currentTarget as HTMLElement
  target.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (draggedPieceIdx.value === null) return
  
  const deltaX = e.clientX - startX.value
  dragX.value = deltaX 

  const offset = Math.round(deltaX / (PIECE_WIDTH.value + GAP.value))
  const draggedPiece = pieces.value[draggedPieceIdx.value]!
  const newOrder = Math.max(0, Math.min(pieces.value.length - 1, initialOrder.value[draggedPieceIdx.value]! + offset))

  if (draggedPiece.order !== newOrder) {
    // Shifter les autres pièces
    const oldOrder = draggedPiece.order
    pieces.value.forEach((p, i) => {
      if (i === draggedPieceIdx.value) {
        p.order = newOrder
      } else {
        if (oldOrder < newOrder && p.order <= newOrder && p.order > oldOrder) {
          p.order--
        } else if (oldOrder > newOrder && p.order >= newOrder && p.order < oldOrder) {
          p.order++
        }
      }
    })
  }
}

function onPointerUp(e: PointerEvent) {
  if (draggedPieceIdx.value === null) return
  draggedPieceIdx.value = null
  dragX.value = 0
  checkWin()
}

function checkWin() {
  const isCorrect = pieces.value.every(p => p.id === p.order)
  if (isCorrect) {
    setTimeout(() => {
      isCompleted.value = true
      saveProgress(currentLevelIdx.value + 2)
    }, 500)
  }
}

function nextLevel() {
    currentLevelIdx.value++
    initLevel()
}



onMounted(async () => {
  updateDimensions()
  window.addEventListener('resize', updateDimensions)
  await loadProgress()
  setTimeout(initLevel, 100)
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', updateDimensions)
  }
})

</script>

<template>
  <div 
    class="bg-night-900 flex flex-col items-center pt-12 pb-32 px-4 overflow-hidden relative"
    @touchmove.prevent
  >
    <!-- Background Decorations -->
    <div class="absolute top-1/4 -left-20 w-80 h-80 bg-spark/10 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-1/4 -right-20 w-80 h-80 bg-glow/5 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- En-tête -->
    <header class="relative z-10 mb-8 text-center animate-fade-in-down w-full max-w-md mx-auto">
       <NuxtLink 
         to="/games" 
         class="absolute -top-4 -left-2 p-3 text-slate-400 hover:text-white transition-colors flex items-center gap-1 group"
       >
         <i class="fi fi-rr-arrow-small-left text-3xl group-hover:-translate-x-1 transition-transform"></i>
         <span class="text-xs font-bold uppercase tracking-widest hidden sm:inline">Quitter</span>
       </NuxtLink>
       <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 group cursor-default">
         <i class="fi fi-rr-puzzle-piece text-spark-light group-hover:rotate-12 transition-transform"></i>
         <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Voyage Poétique</span>
       </div>
       <h1 class="text-3xl md:text-4xl font-zen font-black tracking-tight text-white drop-shadow-sm">
         Niveau <span class="bg-clip-text text-transparent bg-gradient-spark">{{ currentLevelIdx + 1 }}</span>
       </h1>
       
       <!-- Consigne remontée -->
       <div class="mt-6 flex flex-col items-center">
         <p class="text-slate-500 text-[10px] tracking-[0.3em] font-bold max-w-xs leading-loose uppercase">
           Glissez les fragments pour rétablir l'ordre.
         </p>
         <div class="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4"></div>
       </div>
    </header>

    <!-- Zone de Jeu : Éclats de Cristal -->
    <div class="relative z-10 w-full max-w-5xl px-4 flex justify-center py-20 animate-fade-in-up">
      <!-- Container -->
      <div 
        class="relative flex items-center justify-center bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-2xl"
        :style="{ 
          width: '100%',
          maxWidth: (pieces.length * (PIECE_WIDTH + GAP) + 80) + 'px',
          height: PIECE_WIDTH > 100 ? '200px' : '150px'
        }"
      >
        <!-- Lueur de fond -->
        <div class="absolute inset-x-10 h-px bg-gradient-to-r from-transparent via-spark/40 to-transparent"></div>

        <!-- Les Pièces (Vraies formes de puzzle emboîtables) -->
        <div 
          v-for="(piece, idx) in pieces" 
          :key="piece.id"
          class="absolute touch-none select-none transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
          :class="[
            draggedPieceIdx === idx ? 'z-50 duration-0 scale-105 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]' : 'z-10',
            isCompleted ? 'pointer-events-none' : ''
          ]"
          :style="{
            width: PIECE_WIDTH + 'px',
            height: PIECE_WIDTH + 'px',
            transform: `translateX(${(piece.order - (pieces.length-1)/2) * (PIECE_WIDTH + GAP) + (draggedPieceIdx === idx ? dragX : 0)}px)`,
          }"
          @pointerdown="onPointerDown($event, idx)"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <div class="relative w-full h-full group">
            <!-- Forme de Puzzle SVG -->
            <svg 
              viewBox="0 0 140 140" 
              class="absolute inset-0 w-full h-full transition-all duration-500"
            >
              <defs>
                <linearGradient :id="'puzzle-grad-' + idx" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" :stop-color="piece.id === piece.order ? '#D946EF' : '#291947'" stop-opacity="0.95" />
                  <stop offset="100%" :stop-color="piece.id === piece.order ? '#A21CAF' : '#1A0E2E'" stop-opacity="0.85" />
                </linearGradient>
                <filter :id="'glow-' + idx">
                   <feGaussianBlur stdDeviation="3" result="blur" />
                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              <!-- Ombre et Corps de la pièce -->
              <path 
                d="M 20,20 
                   H 120 
                   V 50
                   A 20,20 0 1 1 120,90
                   V 120 
                   H 20
                   V 90
                   A 20,20 0 1 0 20,50
                   V 20 Z" 
                :fill="`url(#puzzle-grad-${idx})`"
                :stroke="piece.id === piece.order ? '#FF7FF3' : 'rgba(255,255,255,0.15)'"
                stroke-width="2"
                class="transition-all duration-500"
                :style="{
                  fillOpacity: piece.id === piece.order ? 0.9 : 0.6,
                  filter: piece.id === piece.order ? `url(#glow-${idx})` : 'none'
                }"
              />
              
              <!-- Reflet supérieur pour le volume -->
              <path 
                d="M 25,25 H 115 V 35 H 25 Z" 
                fill="rgba(255,255,255,0.05)"
              />
            </svg>

            <!-- Contenu (Texte centré dans le corps principal) -->
            <div class="absolute inset-x-[20px] inset-y-0 flex flex-col items-center justify-center">
              <span 
                class="font-zen font-black tracking-widest uppercase transition-all duration-500"
                :class="[
                  piece.id === piece.order 
                    ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-110' 
                    : 'text-slate-200/40',
                  PIECE_WIDTH > 100 ? 'text-3xl md:text-4xl' : 'text-xl'
                ]"
              >
                {{ piece.content }}
              </span>

              <!-- Petites étoiles de validation -->
              <div v-if="piece.id === piece.order" class="flex gap-1 mt-2">
                <div v-for="i in 3" :key="i" class="w-1 h-1 rounded-full bg-spark shadow-[0_0_8px_theme(colors.spark.DEFAULT)] animate-pulse"></div>
              </div>
            </div>

            <!-- Overlay d'interaction -->
            <div v-if="draggedPieceIdx !== idx" class="absolute inset-0 cursor-grab active:cursor-grabbing"></div>
          </div>
        </div>
      </div>
    </div>
        
    <!-- Footer poétique supprimé car déplacé en haut -->

    <!-- Overlay Victoire (Design Affiné & Inter) -->
    <Transition name="fade">
      <div 
        v-if="isCompleted"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night-950/95 backdrop-blur-2xl px-6"
      >
          <!-- Cercles de fond subtils -->
          <div class="absolute w-80 h-80 border border-spark/5 rounded-full animate-[spin_12s_linear_infinite]"></div>
          <div class="absolute w-96 h-96 border border-glow/5 rounded-full animate-[spin_18s_linear_infinite_reverse]"></div>

          <div class="relative z-10 flex flex-col items-center max-w-sm w-full">
            <div class="text-center space-y-3 mb-10">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] font-sans">Harmonie Retrouvée</p>
              <h2 class="text-4xl md:text-5xl font-sans font-black text-white tracking-tight uppercase">
                {{ currentWord }}
              </h2>
            </div>
            
            <MyButton 
              variant="pink" 
              size="medium" 
              @click="nextLevel" 
              class="w-full font-sans font-bold tracking-widest uppercase"
            >
              Niveau Suivant
            </MyButton>
          </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Animations de transition */
.piece-move-enter-active,
.piece-move-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.piece-move-enter-from {
  opacity: 0;
  transform: translateY(100px) scale(0.5);
}
.piece-move-leave-to {
  opacity: 0;
  transform: translateY(100px) scale(0.5);
}

.piece-fade-enter-active,
.piece-fade-leave-active {
  transition: all 0.3s ease;
}
.piece-fade-enter-from,
.piece-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

* {
    user-select: none;
    -webkit-user-drag: none;
}
</style>
