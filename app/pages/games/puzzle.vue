<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// --- TYPES ---
type Piece = {
  id: number
  content: string // Texte ou URL d'image background
  x: number
  y: number
  targetX: number // Position correcte (relative à la zone de drop)
  targetY: number // Position correcte
  isPlaced: boolean
  width: number
  height: number
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
const pieces = ref<Piece[]>([])
const containerRef = ref<HTMLElement | null>(null)
const isCompleted = ref(false)
const isDragging = ref(false)
const draggedPieceId = ref<number | null>(null)

// Offset pour le drag (souris par rapport au coin de la pièce)
const dragOffset = ref({ x: 0, y: 0 })

// --- LOGIC ---

// 1. Initialiser le niveau
async function initLevel() {
  isCompleted.value = false
  pieces.value = []
  isCompleted.value = false
  pieces.value = []
  
  // Générer le niveau courant
  const levelData = generateLevelConfig(currentLevelIdx.value)
  if (!levelData) return

  let content = levelData.content
  let cols = levelData.grid[0]
  const rows = levelData.grid[1]

  // Fetch depuis le backend
  if (true) {
      isLoading.value = true
      try {
          const response = await $fetch<{ word: string, theme?: string }>('/api/games/words/random') // Appel Proxy vers Backend
          content = response.word?.toUpperCase() || 'LUMIÈRE'
          // Ajuster la grille selon la longueur du mot reçu
          cols = content.length > 7 ? 4 : (content.length > 4 ? 3 : 2)
      } catch (e) {
          content = 'ESPOIR' // Fallback si API offline
      } finally {
          isLoading.value = false
      }
  }

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

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const targetX = c * pieceW
      const targetY = r * pieceH
      
      // Position initiale aléatoire dans la zone "brouillon" (en bas)
      const randomX = Math.random() * (containerW - pieceW)
      const randomY = 120 + Math.random() * 150 

      pieces.value.push({
        id: idCounter++,
        content: (textParts[c + r*cols] || ''),
        x: randomX,
        y: randomY,
        targetX,
        targetY,
        isPlaced: false,
        width: pieceW,
        height: pieceH,
      })
    }
  }
}

// 2. Drag & Drop Logic (Touch & Mouse)
function startDrag(e: MouseEvent | TouchEvent, piece: Piece) {
  if (piece.isPlaced) return
  
  isDragging.value = true
  draggedPieceId.value = piece.id
  
  // Get pointer pos
  // Get pointer pos
  let clientX, clientY
  if ((e as TouchEvent).touches && (e as TouchEvent).touches.length > 0) {
      clientX = (e as TouchEvent).touches[0].clientX
      clientY = (e as TouchEvent).touches[0].clientY
  } else {
      clientX = (e as MouseEvent).clientX
      clientY = (e as MouseEvent).clientY
  }

  // Calculer l'offset pour que la pièce ne saute pas sous le doigt
  // Nécessite de connaître la pos absolue de la pièce dans le DOM, 
  // ici on simplifie en manipulant les coords relatives au conteneur parent
  // On va recréer un mouvement relatif simple
  
  // Hack simple : on stocke la pos souris initiale
  dragOffset.value = { x: clientX, y: clientY }
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value || draggedPieceId.value === null) return
  
  let clientX, clientY
  if ((e as TouchEvent).touches && (e as TouchEvent).touches.length > 0) {
      clientX = (e as TouchEvent).touches[0].clientX
      clientY = (e as TouchEvent).touches[0].clientY
  } else {
      clientX = (e as MouseEvent).clientX
      clientY = (e as MouseEvent).clientY
  }

  const deltaX = clientX - dragOffset.value.x
  const deltaY = clientY - dragOffset.value.y
  
  const piece = pieces.value.find(p => p.id === draggedPieceId.value)
  if (piece) {
    piece.x += deltaX
    piece.y += deltaY
  }

  dragOffset.value = { x: clientX, y: clientY }
}

function endDrag() {
  if (!isDragging.value || draggedPieceId.value === null) return
  
  const piece = pieces.value.find(p => p.id === draggedPieceId.value)
  if (piece) {
    // Check magnetisme
    const dist = Math.sqrt(Math.pow(piece.x - piece.targetX, 2) + Math.pow(piece.y - piece.targetY, 2))
    
    if (dist < 40) { // Seuil de "snap"
      piece.x = piece.targetX
      piece.y = piece.targetY
      piece.isPlaced = true
      // Petit feedback sonore ?
    }
  }

  isDragging.value = false
  draggedPieceId.value = null
  checkWin()
}

function checkWin() {
  if (pieces.value.every(p => p.isPlaced)) {
    isCompleted.value = true
  }
}

function nextLevel() {
    currentLevelIdx.value++
    initLevel()
}



onMounted(() => {
  // Petit délai pour assurer que le conteneur est rendu
  setTimeout(initLevel, 100)
  
  // Global listeners pour le drag (pour ne pas perdre la pièce si on sort de la div)
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('touchmove', onDrag, { passive: false })
  window.addEventListener('touchend', endDrag)
})

</script>

<template>
  <div 
    class="min-h-screen bg-night-900 flex flex-col items-center pt-8 pb-32 px-4 overflow-hidden select-none"
    @touchmove.prevent
  > <!-- @touchmove.prevent block le scroll natif pour mieux jouer -->

    <header class="mb-8 text-center animate-fade-in-up">
       <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Puzzle Zen</span>
       <h1 class="text-2xl font-bold text-white mt-2">Niveau {{ currentLevelIdx + 1 }}</h1>
    </header>

    <!-- Zone de Jeu -->
    <div 
      ref="containerRef"
      class="relative w-full max-w-sm h-[500px] border-2 border-dashed border-white/10 rounded-xl bg-night-800/50"
    >
        <!-- Grille cible (Feedback visuel des emplacements) -->
        <div 
            v-for="piece in pieces" 
            :key="'target-'+piece.id"
            class="absolute border border-white/5 bg-white/5 flex items-center justify-center text-white/10 font-black text-2xl"
            :style="{
                left: piece.targetX + 'px',
                top: piece.targetY + 'px',
                width: piece.width + 'px',
                height: piece.height + 'px'
            }"
        >
          <!-- Optionnel : Afficher l'ombre du texte ou de l'image -->
        </div>

        <!-- État chargement (Invocation API) -->
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center z-20">
            <div class="text-spark-light animate-pulse text-sm tracking-widest uppercase">Invocation du mot...</div>
        </div>

        <!-- Pièces Mobiles -->
        <div 
            v-for="piece in pieces" 
            :key="piece.id"
            class="absolute cursor-grab active:cursor-grabbing shadow-xl transition-transform active:scale-110 flex items-center justify-center overflow-hidden"
            :class="[
                piece.isPlaced ? 'z-0 transition-all duration-500 ease-out border-none' : 'z-10 bg-night-700 border border-spark/50 rounded-lg',
            ]"
            :style="{
                transform: `translate(${piece.x}px, ${piece.y}px)`,
                width: piece.width + 'px',
                height: piece.height + 'px',
            }"
            @mousedown="startDrag($event, piece)"
            @touchstart.passive="startDrag($event, piece)"
        >
            <span class="text-spark-light font-black text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {{ piece.content }}
            </span>
            
            <!-- Highlight si Placé -->
            <div v-if="piece.isPlaced" class="absolute inset-0 bg-spark/10 animate-pulse"></div>
        </div>
        
        <!-- Overlay Victoire -->
        <div 
            v-if="isCompleted"
            class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-night-900/90 backdrop-blur-sm animate-fade-in"
        >
             <div class="text-6xl mb-4 animate-bounce">✨</div>
             <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-spark mb-6">Harmonie</h2>
             <MyButton variant="pink" size="medium" @click="nextLevel">
                Continuer
             </MyButton>
        </div>

    </div>

    <p class="mt-8 text-center text-slate-500 text-xs max-w-xs leading-relaxed">
        Assemblez les fragments pour rétablir la lumière.
        <br>Laissez les pièces s'aimanter à leur juste place.
    </p>

  </div>
</template>

<style scoped>
/* Empêcher la sélection de texte accidentelle */
* {
    user-select: none;
    -webkit-user-drag: none;
}
</style>
