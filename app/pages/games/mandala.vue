<script setup lang="ts">
import { ref, onMounted } from 'vue'

useSeoMeta({
  title: 'Coloriage Mandala - L\'Étincelle',
  description: 'Coloriez des mandalas procéduraux pour vous détendre.',
  ogTitle: 'Coloriage Mandala - L\'Étincelle',
})

// --- CONFIGURATION ---
const CANVAS_SIZE = 800 

// Palettes de couleurs Zen
const PALETTES = {
  'Aurore': ['#F472B6', '#fb7185', '#E879F9', '#A78BFA', '#818CF8', '#C084FC'],
  'Forêt': ['#34D399', '#10B981', '#059669', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
  'Océan': ['#38BDF8', '#0EA5E9', '#0284C7', '#7DD3FC', '#BAE6FD', '#E0F2FE'],
  'Feu':   ['#FB923C', '#F97316', '#EA580C', '#FDBA74', '#FFEDD5', '#FFF7ED'],
}

// État du Jeu (Persistant : Cookie + API Sync)
const level = useCookie<number>('mandala_level', { default: () => 1 }) // Fallback local
const recipe_token = useCookie('auth_token') // Pour l'auth
const progress = ref(0)
const isCompleted = ref(false)

const config = useRuntimeConfig()

// État Visuel
const patternStyle = ref<'crystal' | 'pixel' | 'weave'>('crystal')
const currentPaletteName = ref('Aurore')
const currentPalette = computed(() => PALETTES[currentPaletteName.value as keyof typeof PALETTES])
const selectedColor = ref(PALETTES['Aurore'][0])
const polygons = ref<{ points: string, color: string, id: number }[]>([])
const svgRef = ref<SVGElement | null>(null)

// --- LOGIQUE DE JEU ---

function checkCompletion() {
    if (polygons.value.length === 0) return
    const coloredCount = polygons.value.filter(p => p.color !== 'transparent').length
    const totalCount = polygons.value.length
    
    // Calcul du pourcentage
    progress.value = Math.round((coloredCount / totalCount) * 100)

    if (progress.value >= 100 && !isCompleted.value) {
        completeLevel()
    }
}

async function completeLevel() {
    isCompleted.value = true
    playSound('win')
    
    // Sauvegarder la progression (niveau suivant atteint)
    if (recipe_token.value) {
        try {
            await $fetch('/api/users/mandala', {
                method: 'POST',
                headers: { Authorization: `Bearer ${recipe_token.value}` },
                body: { level: level.value + 1 }
            })
        } catch (e) {
            // Log removed
        }
    }
}

function nextLevel() {
    level.value++
    isCompleted.value = false
    progress.value = 0
    generateLevel()
}

// Génère le niveau courant selon la difficulté progressive
function generateLevel() {
    polygons.value = [] // Reset
    progress.value = 0
    isCompleted.value = false

    // 1. Déterminer la difficulté selon le niveau
    let difficulty: 'fast' | 'zen' | 'complex' = 'zen'
    if (level.value <= 3) difficulty = 'fast'
    else if (level.value > 10) difficulty = 'complex'

    // 2. Choisir un style aléatoire (ou alterné) pour la surprise
    const styles: ('crystal' | 'pixel' | 'weave')[] = ['crystal', 'pixel', 'weave']
    // On change de style à chaque niveau de façon pseudo-aléatoire basée sur le niveau
    const currentStyleIndex = (level.value - 1) % styles.length
    patternStyle.value = styles[currentStyleIndex] ?? 'crystal'

    // 3. Lancer la génération
    if (patternStyle.value === 'crystal') generateCrystal(difficulty)
    else if (patternStyle.value === 'pixel') generatePixel(difficulty)
    else if (patternStyle.value === 'weave') generateWeave(difficulty)
}


// --- ALGORITHMES DE GÉNÉRATION ---

function generateCrystal(difficulty: 'fast' | 'zen' | 'complex') {
  const pts = []
  let cols = 8; let rows = 8
  if (difficulty === 'fast') { cols = 4; rows = 4 }
  else if (difficulty === 'complex') { cols = 12; rows = 12 }

  const cellW = CANVAS_SIZE / cols; const cellH = CANVAS_SIZE / rows
  const jitter = (CANVAS_SIZE / cols) * 0.35 

  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
        let x = c * cellW; let y = r * cellH
        if (c > 0 && c < cols) x += (Math.random() - 0.5) * jitter * 2
        if (r > 0 && r < rows) y += (Math.random() - 0.5) * jitter * 2
        pts.push({ x, y })
    }
  }

  const newPolygons = []
  let idCounter = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const i = r * (cols + 1) + c 
        const p1 = pts[i]; const p2 = pts[i + 1]
        const p3 = pts[i + (cols + 1)]; const p4 = pts[i + (cols + 1) + 1]

        if (p1 && p2 && p3 && p4) {
            if ((r + c) % 2 === 0) {
               newPolygons.push({ id: idCounter++, points: `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`, color: 'transparent' })
               newPolygons.push({ id: idCounter++, points: `${p2.x},${p2.y} ${p4.x},${p4.y} ${p3.x},${p3.y}`, color: 'transparent' })
            } else {
               newPolygons.push({ id: idCounter++, points: `${p1.x},${p1.y} ${p2.x},${p2.y} ${p4.x},${p4.y}`, color: 'transparent' })
               newPolygons.push({ id: idCounter++, points: `${p1.x},${p1.y} ${p4.x},${p4.y} ${p3.x},${p3.y}`, color: 'transparent' })
            }
        }
    }
  }
  polygons.value = newPolygons
}

function generatePixel(difficulty: 'fast' | 'zen' | 'complex') {
    let cols = 10; let rows = 10
    if (difficulty === 'fast') { cols = 5; rows = 5 }
    else if (difficulty === 'complex') { cols = 15; rows = 15 }

    const cellW = CANVAS_SIZE / cols; const cellH = CANVAS_SIZE / rows
    const newPolygons = []
    let idCounter = 0

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const gap = cellW * 0.1
            const x = c * cellW + gap; const y = r * cellH + gap
            const w = cellW - (gap * 2); const h = cellH - (gap * 2)
            const jx = (Math.random() - 0.5) * (gap * 0.5); const jy = (Math.random() - 0.5) * (gap * 0.5)
            newPolygons.push({ id: idCounter++, points: `${x+jx},${y+jy} ${x+w+jx},${y+jy} ${x+w+jx},${y+h+jy} ${x+jx},${y+h+jy}`, color: 'transparent' })
        }
    }
    polygons.value = newPolygons
}

function generateWeave(difficulty: 'fast' | 'zen' | 'complex') {
    let cols = 6; let rows = 10
    if (difficulty === 'fast') { cols = 4; rows = 6 }
    else if (difficulty === 'complex') { cols = 10; rows = 16 }

    const cellW = CANVAS_SIZE / cols; const cellH = CANVAS_SIZE / rows * 2
    const newPolygons = []
    let idCounter = 0

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const centerX = c * cellW + (r % 2 === 0 ? 0 : cellW / 2)
            const centerY = r * (cellH / 2)
            const w = cellW; const h = cellH
            const p1 = { x: centerX + w/2, y: centerY }
            const p2 = { x: centerX + w, y: centerY + h/2 }
            const p3 = { x: centerX + w/2, y: centerY + h }
            const p4 = { x: centerX, y: centerY + h/2 }
            newPolygons.push({ id: idCounter++, points: `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`, color: 'transparent' })
        }
    }
    polygons.value = newPolygons
}

// --- AUDIO ---
function playSound(type: 'pop' | 'win') {
    // Placeholder pour les effets sonores
    // const audio = new Audio(\`/sounds/\${type}.mp3\`)
    // audio.play().catch(() => {})
}

// --- ACTIONS ---
function saveArt() {
  if (!svgRef.value) return
  
  const svgData = new XMLSerializer().serializeToString(svgRef.value)
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `mandala-level-${level.value}.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function resetProgression() {
  if (confirm('Voulez-vous vraiment tout effacer et retourner au niveau 1 ?')) {
    level.value = 1
    generateLevel()
    
    if (recipe_token.value) {
        try {
            await $fetch('/api/users/mandala', {
                method: 'POST',
                headers: { Authorization: `Bearer ${recipe_token.value}` },
                body: { level: 1 }
            })
        } catch (e) { console.error(e) }
    }
  }
}

function handlePolygonClick(polyId: number) {
    if (isCompleted.value) return // Bloqué si fini

    const poly = polygons.value.find(p => p.id === polyId)
    if (poly && selectedColor.value) {
        if (poly.color === selectedColor.value) {
            poly.color = 'transparent'
        } else {
            poly.color = selectedColor.value
            playSound('pop')
        }
        checkCompletion()
    }
}

function clearCanvas() {
    polygons.value.forEach(p => p.color = 'transparent')
    checkCompletion()
}

onMounted(async () => {
  // Sync depuis le serveur si connecté
  if (recipe_token.value) {
      try {
          const data = await $fetch<{ level: number }>('/api/users/mandala', {
             headers: { Authorization: `Bearer ${recipe_token.value}` } 
          })
          if (data && data.level) {
              level.value = data.level
          }
      } catch (e) {
          // Log removed
      }
  }
  generateLevel()
})
</script>

<template>
  <div class="min-h-screen bg-night-900 flex flex-col items-center pt-16 pb-32 px-4 overflow-x-hidden">
    
    <!-- En-tête -->
    <header class="mb-10 text-center animate-fade-in-up w-full max-w-md relative">
      <NuxtLink 
        to="/games" 
        class="absolute -top-14 -left-4 p-3 text-slate-400 hover:text-white transition-colors flex items-center gap-1 group"
      >
        <i class="fi fi-rr-arrow-small-left text-3xl group-hover:-translate-x-1 transition-transform"></i>
        <span class="text-xs font-bold uppercase tracking-widest hidden sm:inline">Quitter</span>
      </NuxtLink>
      <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold uppercase tracking-widest text-slate-500">Niveau {{ level }}</div>
          <div class="text-xs font-bold uppercase tracking-widest text-spark-light">{{ progress }}%</div>
      </div>
      
      <!-- Barre de progression -->
      <div class="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-spark transition-all duration-500 ease-out" 
            :style="{ width: `${progress}%` }"
          ></div>
      </div>
      
      <h1 class="mt-4 text-2xl font-bold font-zen tracking-wide text-white">
        <span v-if="patternStyle === 'crystal'"><i class="fi fi-rr-gem mr-2"></i>Cristal</span>
        <span v-else-if="patternStyle === 'pixel'"><i class="fi fi-rr-apps mr-2"></i>Pavés</span>
        <span v-else><i class="fi fi-rr-interlace mr-2"></i>Tissage</span>
      </h1>
    </header>

    <!-- Zone de Dessin (Responsive) -->
    <div class="relative w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-night-800 animate-fade-in-up md:max-w-xl">
        <svg 
            ref="svgRef"
            viewBox="0 0 800 800" 
            class="w-full h-full cursor-pointer touch-none"
            preserveAspectRatio="xMidYMid slice"
        >
            <polygon 
                v-for="poly in polygons" 
                :key="poly.id"
                :points="poly.points"
                :fill="poly.color"
                stroke="rgba(255,255,255,0.3)"
                stroke-width="1.5"
                stroke-linejoin="round"
                :class="[
                    'transition-all duration-75', 
                    poly.color === 'transparent' ? 'fill-white/[0.03] hover:fill-white/10' : 'hover:brightness-110'
                ]"
                @pointerdown="handlePolygonClick(poly.id)"
            />
        </svg>

        <!-- Overlay : NIVEAU TERMINÉ -->
        <div 
            v-if="isCompleted"
            class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-night-900/80 backdrop-blur-sm animate-fade-in"
        >
            <h2 class="text-3xl font-bold font-zen tracking-wide text-white mb-2">Magnifique !</h2>
            <p class="text-slate-300 mb-8">Niveau {{ level }} complété</p>
            
            <MyButton variant="default" size="large" @click="nextLevel">
                Niveau Suivant →
            </MyButton>
        </div>
    </div>

    <!-- Palette de Couleurs (Masquée si fini) -->
    <div v-if="!isCompleted" class="mt-6 w-full max-w-md animate-fade-in-up" style="animation-delay: 0.2s">
        <!-- Palette Couleurs -->
        <div class="flex justify-center gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
             <button 
                v-for="(colors, name) in PALETTES" 
                :key="name"
                @click="currentPaletteName = name; selectedColor = colors[0]"
                class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors"
                :class="currentPaletteName === name ? 'bg-white text-black border-white' : 'bg-transparent text-slate-500 border-white/10 hover:border-white/30'"
            >
                {{ name }}
            </button>
        </div>

        <div class="flex justify-center gap-3 flex-wrap">
            <button 
                v-for="color in currentPalette" 
                :key="color"
                @click="selectedColor = color"
                class="w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 active:scale-95 shadow-lg"
                :class="selectedColor === color ? 'border-white scale-110 shadow-white/30' : 'border-transparent'"
                :style="{ backgroundColor: color }"
            ></button>
            <button 
                @click="selectedColor = 'transparent'"
                class="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center bg-night-800 hover:bg-night-700 transition-[colors,transform]"
                title="Gomme"
            >
                <i class="fi fi-rr-eraser"></i>
            </button>
            <button 
                @click="saveArt"
                class="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center bg-night-800 hover:bg-night-700 transition-[colors,transform]"
                title="Sauvegarder"
            >
                <i class="fi fi-rr-disk"></i>
            </button>
        </div>
        
        <div class="mt-6 flex flex-col items-center gap-2">
            <button @click="clearCanvas" class="text-xs text-red-500/50 hover:text-red-400 transition-colors">Recommencer ce niveau</button>
            <button @click="resetProgression" class="text-[10px] text-slate-600 hover:text-red-500 transition-colors flex items-center gap-1">
                <i class="fi fi-rr-skull text-[8px]"></i>
                Réinitialiser toute ma progression
            </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
