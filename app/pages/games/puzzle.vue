<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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
const PIECE_WIDTH = 100
const GAP = 12

// --- API ---
const { fetchCloudWords } = useStars()
const token = useCookie('auth_token')

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

// Gestion de la progression
async function loadProgress() {
  if (!token.value) return
  try {
     const data = await $fetch<{ level: number }>(`${apiBase}/api/users/puzzle`, {
        headers: { Authorization: `Bearer ${token.value}` }
     })
     // Si l'utilisateur est niveau 3, cela veut dire qu'il joue le niveau 3 -> index 2
     if (data && data.level > 1) {
        currentLevelIdx.value = data.level - 1
     }
  } catch (e) {
     console.error("Erreur chargement progression", e)
  }
}

async function saveProgress(newLevel: number) {
  if (!token.value) return
  try {
     await $fetch(`${apiBase}/api/users/puzzle`, {
        method: 'POST',
        body: { level: newLevel },
        headers: { Authorization: `Bearer ${token.value}` }
     })
  } catch (e) {
      console.error("Erreur sauvegarde progression", e)
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

  // Mélanger l'ordre initial
  const shuffled = [...Array(temp.length).keys()].sort(() => Math.random() - 0.5)
  pieces.value = temp.map((p, i) => ({ ...p, order: shuffled[i]! }))
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

  // Calculer le décalage d'index (combien de places on a bougé)
  const offset = Math.round(deltaX / (PIECE_WIDTH + GAP))
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
  await loadProgress()
  setTimeout(initLevel, 100)
})

</script>

<template>
  <div 
    class="bg-night-950 flex flex-col items-center pt-12 pb-32 px-4 overflow-hidden relative"
    @touchmove.prevent
  >
    <!-- Background Decorations -->
    <div class="absolute top-1/4 -left-20 w-80 h-80 bg-spark/10 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-1/4 -right-20 w-80 h-80 bg-glow/5 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- En-tête -->
    <header class="relative z-10 mb-8 text-center animate-fade-in-down">
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

    <!-- Zone de Jeu : Fil de Lumière -->
    <div class="relative z-10 w-full max-w-5xl px-4 flex justify-center py-4 animate-fade-in-up">
      <!-- Container du Fil -->
      <div 
        class="relative flex items-center justify-center bg-night-900/40 rounded-3xl border border-white/10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)]"
        :style="{ 
          width: '100%',
          maxWidth: (pieces.length * (PIECE_WIDTH + GAP) + 120) + 'px',
          height: '180px'
        }"
      >
        <!-- Le "Fil" Magique -->
        <div class="absolute h-[1px] inset-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div class="absolute h-[6px] inset-x-20 bg-spark/10 blur-xl rounded-full"></div>

        <!-- Socles de guidage (Slots visibles en fond) -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="flex gap-[12px]">
            <div 
              v-for="i in pieces.length" :key="'slot-'+i"
              class="border-2 border-dashed border-white/5 bg-white/[0.02] rounded-2xl"
              :style="{ width: PIECE_WIDTH + 'px', height: '100px' }"
            ></div>
          </div>
        </div>

        <!-- Les Pièces (Perles) -->
        <div 
          v-for="(piece, idx) in pieces" 
          :key="piece.id"
          class="absolute touch-none select-none transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
          :class="[
            draggedPieceIdx === idx ? 'z-50 duration-0 scale-105' : 'z-10',
            isCompleted ? 'pointer-events-none' : ''
          ]"
          :style="{
            width: PIECE_WIDTH + 'px',
            height: '100px',
            transform: `translateX(${(piece.order - (pieces.length-1)/2) * (PIECE_WIDTH + GAP) + (draggedPieceIdx === idx ? dragX : 0)}px)`,
          }"
          @pointerdown="onPointerDown($event, idx)"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <!-- Corps de la Perle (Visibilité boostée) -->
          <div 
            class="w-full h-full rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative group overflow-hidden shadow-2xl"
            :class="[
              draggedPieceIdx === idx 
                ? 'bg-night-700 border-glow shadow-[0_20px_40px_rgba(252,211,77,0.3)] scale-110' 
                : (piece.id === piece.order 
                    ? 'bg-night-800 border-spark shadow-[0_10px_25px_rgba(217,70,239,0.25)]' 
                    : 'bg-night-800 border-white/20 hover:border-white/40 shadow-lg')
            ]"
          >
            <!-- Overlay léger pour le relief -->
            <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

            <!-- Lueur de réussite (Spotlight) -->
            <div 
              v-if="piece.id === piece.order" 
              class="absolute inset-0 bg-gradient-to-tr from-spark/30 via-transparent to-transparent animate-pulse"
            ></div>

            <span 
              class="text-3xl md:text-4xl font-zen font-black tracking-widest uppercase transition-all duration-500"
              :class="[
                piece.id === piece.order 
                  ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] scale-105' 
                  : 'text-slate-200 opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
              ]"
            >
              {{ piece.content }}
            </span>
            
            <!-- Indicateur de position Correcte -->
            <div 
              class="absolute bottom-3 flex gap-1"
            >
              <div 
                v-for="i in 3" :key="i"
                class="w-1 h-1 rounded-full transition-all duration-500"
                :class="piece.id === piece.order ? 'bg-glow shadow-[0_0_8px_theme(colors.glow.DEFAULT)] scale-125' : 'bg-white/5'"
              ></div>
            </div>

            <!-- Overlay d'interaction -->
            <div v-if="draggedPieceIdx !== idx" class="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors"></div>
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

* {
    user-select: none;
    -webkit-user-drag: none;
}
</style>
