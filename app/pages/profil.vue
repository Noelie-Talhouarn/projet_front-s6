<script setup lang="ts">
// État de l'utilisateur
const user = ref({
  prenom: '',
  nom: '',
  email: '',
  date_inscription: '',
  avatar: ''
})

const config = useRuntimeConfig()

// Mode édition
const isEditing = ref(false)
const editForm = ref({
  prenom: '',
  nom: '',
  email: ''
})

// Messages
const errorMessage = ref('')
const successMessage = ref('')
const isSaving = ref(false)

// Statistiques
// Statistiques
const stats = ref<UserStats>({
  // Globales (en secondes)
  stars_count: 0,
  breathing_sessions: 0,
  total_breathing_time: 0,
  total_coherence_time: 0,
  total_meditation_time: 0,
  games_played: 0,
  days_active: 0,
  sparks_count: 0,
  
  // Hebdomadaires (en secondes)
  weekly_stars_count: 0,
  weekly_breathing_sessions_count: 0,
  weekly_games_played_count: 0,
  weekly_meditation_time: 0,
  weekly_coherence_time: 0,
  weekly_breathing_time: 0,
  
  // Badges
  badges: undefined
})


// Préférences
const preferences = ref({
  notifications: true,
  daily_quote: true,
  dark_mode: true
})

// Chargement des données utilisateur
const loading = ref(true)

// Modale de suppression
const showDeleteModal = ref(false)
const deleteConfirmText = ref('')
const isDeleting = ref(false)

// Avatar
const isUpdatingAvatar = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  await loadUserProfile()
  await loadUserStats()
})



async function handleCustomUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  
  // Validation de taille (2Mo)
  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'L\'image est trop lourde (max 2Mo)'
    return
  }

  try {
    const token = useCookie('auth_token')
    if (!token.value) return

    isUpdatingAvatar.value = true
    
    // 1. Upload vers Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/image/upload`
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', config.public.cloudinaryUploadPreset as string)

    const uploadRes = await $fetch<any>(cloudinaryUrl, {
      method: 'POST',
      body: formData
    })

    const imageUrl = uploadRes.secure_url

    // 2. Enregistrement de l'URL dans MongoDB
    await $fetch('/api/users/avatar', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { avatar: imageUrl }
    })

    user.value.avatar = imageUrl
    successMessage.value = 'Votre photo de profil a été mise à jour !'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: any) {
    console.error('Erreur upload photo Cloudinary:', err)
    errorMessage.value = 'Erreur lors de la mise à jour de la photo'
  } finally {
    isUpdatingAvatar.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function loadUserProfile() {
  try {
    const token = useCookie('auth_token')
    if (!token.value) {
      navigateTo('/login')
      return
    }

    const response = await $fetch<any>('/api/users/profile', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    user.value = response
    editForm.value = {
      prenom: response.prenom,
      nom: response.nom,
      email: response.email
    }
    
    loading.value = false
  } catch (err: any) {
    console.error('Erreur lors du chargement du profil:', err)
    errorMessage.value = 'Impossible de charger votre profil'
    loading.value = false
  }
}

async function loadUserStats() {
  try {
    const token = useCookie('auth_token')
    if (!token.value) return

    const response = await $fetch<any>('/api/users/stats', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    // Log removed

    stats.value = {
        // Globales (en secondes)
        stars_count: response.stars_count || 0,
        breathing_sessions: response.breathing_sessions || 0,
        total_breathing_time: response.total_breathing_time || 0,
        total_coherence_time: response.total_coherence_time || 0,
        total_meditation_time: response.total_meditation_time || 0,
        games_played: response.games_played || 0,
        days_active: response.days_active || 0,
        sparks_count: response.sparks_count || 0,
        
        // Hebdomadaires (en secondes)
        weekly_stars_count: response.weekly_stars_count || 0,
        weekly_breathing_sessions_count: response.weekly_breathing_sessions_count || 0,
        weekly_games_played_count: response.weekly_games_played_count || 0,
        weekly_meditation_time: response.weekly_meditation_time || 0,
        weekly_coherence_time: response.weekly_coherence_time || 0,
        weekly_breathing_time: response.weekly_breathing_time || 0,
        
        // Badges
        badges: response.badges || null
    }
    
    // Log removed
  } catch (err) {
    console.error('Erreur lors du chargement des statistiques:', err)
  }
}

// Fonction pour formater le temps intelligemment
function formatTime(seconds: number) {
  if (!seconds || seconds === 0) return '0s'
  
  if (seconds < 60) {
    // Moins d'une minute : afficher en secondes
    return `${seconds}s`
  } else {
    // Plus d'une minute : afficher en minutes (et secondes si nécessaire)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (remainingSeconds === 0) {
      return `${minutes} min`
    } else {
      return `${minutes} min ${remainingSeconds}s`
    }
  }
}

function startEditing() {
  isEditing.value = true
  errorMessage.value = ''
  successMessage.value = ''
}

function cancelEditing() {
  isEditing.value = false
  editForm.value = {
    prenom: user.value.prenom,
    nom: user.value.nom,
    email: user.value.email
  }
  errorMessage.value = ''
  successMessage.value = ''
}

async function saveProfile() {
  try {
    const token = useCookie('auth_token')
    if (!token.value) return

    isSaving.value = true
    await $fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: editForm.value
    })

    user.value.prenom = editForm.value.prenom
    user.value.nom = editForm.value.nom
    user.value.email = editForm.value.email

    successMessage.value = 'Profil mis à jour avec succès'
    isEditing.value = false

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: any) {
    console.error('Erreur lors de la mise à jour:', err)
    errorMessage.value = err.data?.message || 'Erreur lors de la mise à jour'
  } finally {
    isSaving.value = false
  }
}

async function updatePreferences() {
  try {
    const token = useCookie('auth_token')
    if (!token.value) return

    await $fetch('/api/users/preferences', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: preferences.value
    })

    successMessage.value = 'Préférences enregistrées'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('Erreur lors de la mise à jour des préférences:', err)
  }
}

function formatDuration(seconds: number) {
  if (!seconds) return '0 s'
  
  // Si moins d'une minute, afficher en secondes
  if (seconds < 60) {
    return `${seconds} s`
  }
  
  // Sinon convertir en minutes/heures
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${mins}min`
  }
  return `${mins} min`
}

function formatDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function getInitials() {
  return `${user.value.prenom?.charAt(0) || ''}${user.value.nom?.charAt(0) || ''}`.toUpperCase()
}

function openDeleteModal() {
  showDeleteModal.value = true
  deleteConfirmText.value = ''
  errorMessage.value = ''
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deleteConfirmText.value = ''
  errorMessage.value = ''
}

async function deleteAccount() {
  // Vérifier que l'utilisateur a tapé "SUPPRIMER"
  if (deleteConfirmText.value !== 'SUPPRIMER') {
    errorMessage.value = 'Veuillez taper "SUPPRIMER" pour confirmer'
    return
  }

  isDeleting.value = true
  errorMessage.value = ''

  try {
    const token = useCookie('auth_token')
    if (!token.value) return

    await $fetch('/api/users/account', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    // Supprimer le cookie
    const cookie = useCookie('auth_token')
    cookie.value = null

    // Rediriger vers la page de connexion
    navigateTo('/login')
  } catch (err: any) {
    console.error('Erreur lors de la suppression du compte:', err)
    errorMessage.value = err.data?.message || 'Erreur lors de la suppression du compte'
    isDeleting.value = false
  }
}

function getBadgeIcon(badge: Badge | undefined, type: string) {
    if (!badge) return 'fi fi-rr-trophy'
    
    // Gestion spécifique des étoiles pour varier les icônes
    if (type === 'star' || badge.category === 'stars') {
        const name = badge.name?.toLowerCase() || ''
        
        // Mapping basé sur le nom
        if (name.includes('constellation')) return 'fi fi-rr-stars'
        if (name.includes('filante') || name.includes('vitesse')) return 'fi fi-rr-comet'
        if (name.includes('magique') || name.includes('créateur')) return 'fi fi-rr-magic-wand'
        if (name.includes('lumière') || name.includes('éclat') || name.includes('maître')) return 'fi fi-rr-sparkles'
        
        // Variation basée sur l'ID pour la diversité automatique
        if (badge.id) {
             const id = Number(badge.id)
             if (id % 4 === 1) return 'fi fi-rr-stars'
             if (id % 4 === 2) return 'fi fi-rr-sparkles'
             if (id % 4 === 3) return 'fi fi-rr-comet'
        }
        return 'fi fi-rr-star'
    }

    // Gestion Méditation
    if (type === 'spa' || badge.category === 'meditation') {
        const name = badge.name?.toLowerCase() || ''
        
        if (name.includes('temps') || name.includes('heure') || name.includes('durée')) return 'fi fi-rr-clock-five'
        if (name.includes('maître') || name.includes('sage') || name.includes('expert')) return 'fi fi-rr-gem'
        if (name.includes('nature') || name.includes('racine')) return 'fi fi-rr-leaf'
        
        if (badge.id) {
             const id = Number(badge.id)
             if (id % 4 === 1) return 'fi fi-rr-flower'
             if (id % 4 === 2) return 'fi fi-rr-leaf'
             if (id % 4 === 3) return 'fi fi-rr-yin-yang'
        }
        return 'fi fi-rr-spa'
    }

    // Gestion Cohérence
    if (type === 'heart' || badge.category === 'coherence') {
        const name = badge.name?.toLowerCase() || ''

        if (name.includes('souffle') || name.includes('air')) return 'fi fi-rr-wind'
        if (name.includes('rythme') || name.includes('cœur') || name.includes('pulsation')) return 'fi fi-rr-pulse'
        if (name.includes('temps') || name.includes('minute')) return 'fi fi-rr-stopwatch'

        if (badge.id) {
             const id = Number(badge.id)
             if (id % 4 === 1) return 'fi fi-rr-wind'
             if (id % 4 === 2) return 'fi fi-rr-pulse'
             if (id % 4 === 3) return 'fi fi-rr-heart-arrow'
        }
        return 'fi fi-rr-heart'
    }
    
    return 'fi fi-rr-trophy'
}
    


useSeoMeta({
  title: 'Mon Profil - L\'Étincelle',
  description: 'Consultez vos statistiques de méditation et vos badges de progression.',
  ogTitle: 'Mon Profil - L\'Étincelle',
})

</script>

<template>
  <div class="p-4 pb-24 md:pb-20 pt-8 md:pt-16">
    <div class="mx-auto max-w-6xl space-y-8 md:space-y-12">
      
      <!-- Header -->
      <header class="mb-12 md:mb-16 animate-fade-in-up text-center">
        <span class="text-xs font-bold uppercase tracking-[0.3em] text-spark-light/80 mb-3 block">Réglages</span>
        <h1 class="text-white font-zen tracking-[0.2em] text-2xl md:text-3xl uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">Mon Profil</h1>
        <div class="flex flex-col items-center gap-2 mt-4 md:mt-6">
          <div class="h-1 w-12 md:w-16 bg-spark rounded-full transition-all duration-700"></div>
          <p class="text-sm text-white tracking-widest uppercase mt-4">Gérez vos informations et préférences</p>
        </div>
      </header>

      <!-- Messages -->
      <div v-if="errorMessage" class="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-center text-sm font-medium text-red-400 animate-fade-in-up">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center text-sm font-medium text-green-400 animate-fade-in-up">
        {{ successMessage }}
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center space-y-4">
          <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-spark border-t-transparent"></div>
          <p class="text-white">Chargement de votre profil...</p>
        </div>
      </div>

      <template v-else>
        <!-- Carte Profil Principal -->
        <div class="rounded-2xl border-[1.5px] border-[#D946EF]/30 bg-night-900/80 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-fade-in-up">
          
          <!-- Avatar et Nom -->
          <div class="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div class="relative group cursor-pointer" @click="fileInput?.click()" title="Changer de photo">
              <div class="h-24 w-24 rounded-full bg-night-800 border-2 border-white/10 overflow-hidden flex items-center justify-center shadow-lg shadow-spark/20 transition-all group-hover:scale-105 group-hover:border-spark/50">
                <img v-if="user.avatar" :src="user.avatar" :alt="user.prenom" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-gradient-spark flex items-center justify-center text-3xl font-bold text-white">
                  {{ getInitials() }}
                </div>
                
                <!-- Overlay de chargement -->
                <div v-if="isUpdatingAvatar" class="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div class="h-8 w-8 border-4 border-spark border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <div class="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-night-800 border-2 border-white/20 flex items-center justify-center text-white shadow-lg group-hover:bg-spark transition-colors">
                <i class="fi fi-rr-camera text-xs"></i>
              </div>
              
              <!-- Input Fichier Caché -->
              <input 
                ref="fileInput"
                type="file" 
                class="hidden" 
                accept="image/*"
                @change="handleCustomUpload"
              />
            </div>

            <div class="flex-1 text-center md:text-left">
              <h2 class="text-2xl font-zen tracking-wide text-white mb-1">
                {{ user.prenom }} {{ user.nom }}
              </h2>
              <p class="text-white mb-2">{{ user.email }}</p>
              <p class="text-sm text-white">
                Membre depuis le {{ formatDate(user.date_inscription) }}
              </p>
            </div>

            <div v-if="!isEditing" class="flex items-center gap-3">
              <MyButton @click="startEditing" variant="outline" size="medium">
                <i class="fi fi-rr-pencil mr-2 inline-block"></i>
                Modifier
              </MyButton>

              <button 
                @click="openDeleteModal" 
                class="h-10 w-10 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors" 
                title="Supprimer mon compte"
              >
                <i class="fi fi-rr-trash text-xl inline-block"></i>
              </button>
            </div>
          </div>



          <!-- Formulaire d'édition -->
          <div v-if="isEditing" class="space-y-6 border-t border-white/10 pt-6 animate-fade-in-up">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MyInput 
                id="edit-prenom" 
                v-model="editForm.prenom" 
                type="text" 
                label="Prénom" 
                placeholder="Votre prénom"
                required 
              />
              <MyInput 
                id="edit-nom" 
                v-model="editForm.nom" 
                type="text" 
                label="Nom" 
                placeholder="Votre nom"
                required 
              />
            </div>

            <MyInput 
              id="edit-email" 
              v-model="editForm.email" 
              type="email" 
              label="Email" 
              placeholder="exemple@email.com"
              required 
            />

            <div class="flex gap-3 justify-end">
              <MyButton @click="cancelEditing" variant="outline" size="medium" :disabled="isSaving">
                Annuler
              </MyButton>
              <MyButton @click="saveProfile" variant="pink" size="medium" :disabled="isSaving" class="flex items-center gap-2">
                <template v-if="!isSaving">
                  <i class="fi fi-rr-disk mr-1"></i>
                  Enregistrer
                </template>
                <template v-else>
                  <div class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enregistrement...
                </template>
              </MyButton>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="space-y-4 animate-fade-in-up" style="animation-delay: 0.1s">
          
          <!-- Méditation -->
          <div class="rounded-xl border-[1.5px] border-[#D946EF]/25 bg-night-900/80 p-6 backdrop-blur-xl hover:border-[#D946EF]/50 transition-all shadow-xl shadow-black/20">
            <div class="flex items-center gap-3 mb-4">
              <i class="fi fi-rr-spa text-4xl text-purple-300 inline-block"></i>
              <h3 class="text-xl font-zen tracking-wide text-white">Méditation</h3>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div class="text-xs text-purple-300 uppercase tracking-wider mb-1">Cette semaine</div>
                <div class="text-2xl font-bold text-purple-400">{{ formatTime(stats.weekly_meditation_time) }}</div>
              </div>
              <div class="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div class="text-xs text-yellow-300 uppercase tracking-wider mb-1">Total</div>
                <div class="text-2xl font-bold text-yellow-400">{{ formatTime(stats.total_meditation_time) }}</div>
              </div>
            </div>
          </div>

          <!-- Cohérence Cardiaque -->
          <div class="rounded-xl border-[1.5px] border-[#D946EF]/25 bg-night-900/80 p-6 backdrop-blur-xl hover:border-[#D946EF]/50 transition-all shadow-xl shadow-black/20">
            <div class="flex items-center gap-3 mb-4">
              <i class="fi fi-rr-heart text-4xl text-pink-300 inline-block"></i>
              <h3 class="text-xl font-zen tracking-wide text-white">Cohérence Cardiaque</h3>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div class="text-xs text-purple-300 uppercase tracking-wider mb-1">Cette semaine</div>
                <div class="text-2xl font-bold text-purple-400">{{ formatTime(stats.weekly_coherence_time) }}</div>
              </div>
              <div class="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div class="text-xs text-yellow-300 uppercase tracking-wider mb-1">Total</div>
                <div class="text-2xl font-bold text-yellow-400">{{ formatTime(stats.total_coherence_time) }}</div>
              </div>
            </div>
          </div>

          <!-- Grille des autres stats -->
          <div class="grid grid-cols-2 gap-4">
            
            <div class="rounded-xl border-[1.5px] border-[#D946EF]/20 bg-night-900/80 p-4 backdrop-blur-xl hover:border-[#D946EF]/40 transition-all hover:scale-105 shadow-lg shadow-black/20">
              <i class="fi fi-rr-star text-3xl mb-2 text-amber-400 inline-block"></i>
              <div class="text-2xl font-bold text-amber-400 mb-1">{{ stats.stars_count || 0 }}</div>
              <div class="text-xs text-white uppercase tracking-wider">Étoiles Créées</div>
            </div>

            <div class="rounded-xl border-[1.5px] border-[#D946EF]/20 bg-night-900/80 p-4 backdrop-blur-xl hover:border-[#D946EF]/40 transition-all hover:scale-105 shadow-lg shadow-black/20">
              <i class="fi fi-rr-calendar text-3xl mb-2 text-blue-400 inline-block"></i>
              <div class="text-2xl font-bold text-blue-400 mb-1">{{ stats.days_active || 0 }}</div>
              <div class="text-xs text-white uppercase tracking-wider">Jours Actifs</div>
            </div>
          </div>
        </div>

        <!-- Badges Dynamiques -->
        <div class="rounded-2xl border-[1.5px] border-[#D946EF]/30 bg-night-900/80 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-fade-in-up" style="animation-delay: 0.3s">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <i class="fi fi-rr-trophy text-2xl inline-block"></i>
              <MyTitle as="h2" size="small">Mes Badges</MyTitle>
            </div>
            <div class="text-sm text-white/60">
              {{ stats.badges?.total || 0 }} / {{ stats.badges?.totalPossible || 15 }} débloqués
            </div>
          </div>

          <!-- Barre de progression globale -->
          <div class="mb-8" v-if="stats.badges">
            <div class="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-purple-500 to-yellow-400 transition-all duration-500"
                :style="{ width: `${(stats.badges.total / stats.badges.totalPossible * 100) || 0}%` }"
              ></div>
            </div>
          </div>

          <!-- Badges débloqués récents (dernier de chaque catégorie) -->
          <div v-if="(stats.badges?.unlocked?.length || 0) > 0" class="mb-8">
            <h4 class="text-lg font-zen tracking-wide text-white mb-4 flex items-center gap-2">
                <i class="fi fi-rr-star text-yellow-400"></i>
                Derniers badges débloqués
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <!-- Dernier badge Étoiles -->
              <div 
                v-if="stats.badges?.unlocked?.filter((b: Badge) => b.category === 'stars').length"
                v-for="badge in [stats.badges?.unlocked?.filter((b: Badge) => b.category === 'stars').slice(-1)[0]]"
                :key="badge?.id || 'star'"
                class="flex flex-col items-center p-4 bg-gradient-to-br from-yellow-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border-2 border-yellow-400/50 hover:scale-105 transition-transform cursor-pointer group"
                :title="badge?.description"
              >
                <div class="text-5xl mb-2 group-hover:scale-110 transition-transform">
                   <i :class="getBadgeIcon(badge, 'star')" class="fi inline-block"></i>
                </div>
                <div class="text-center">
                  <p class="text-sm font-medium text-white">{{ badge?.name }}</p>
                  <p class="text-xs text-white/60 mt-1">{{ badge?.description }}</p>
                  <p class="text-xs text-yellow-400 mt-1 flex items-center justify-center gap-1">
                    <i class="fi fi-rr-star"></i> Étoiles
                  </p>
                </div>
              </div>

              <!-- Dernier badge Méditation -->
              <div 
                v-if="stats.badges?.unlocked?.filter((b: Badge) => b.category === 'meditation').length"
                v-for="badge in [stats.badges?.unlocked?.filter((b: Badge) => b.category === 'meditation').slice(-1)[0]]"
                :key="badge?.id || 'meditation'"
                class="flex flex-col items-center p-4 bg-gradient-to-br from-yellow-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border-2 border-yellow-400/50 hover:scale-105 transition-transform cursor-pointer group"
                :title="badge?.description"
              >
                <div class="text-5xl mb-2 group-hover:scale-110 transition-transform">
                   <i :class="getBadgeIcon(badge, 'spa')" class="fi inline-block"></i>
                </div>
                <div class="text-center">
                  <p class="text-sm font-medium text-white">{{ badge?.name }}</p>
                  <p class="text-xs text-white/60 mt-1">{{ badge?.description }}</p>
                  <p class="text-xs text-purple-400 mt-1 flex items-center justify-center gap-1">
                    <i class="fi fi-rr-spa"></i> Méditation
                  </p>
                </div>
              </div>

              <!-- Dernier badge Cohérence -->
              <div 
                v-if="stats.badges?.unlocked?.filter((b: Badge) => b.category === 'coherence').length"
                v-for="badge in [stats.badges?.unlocked?.filter((b: Badge) => b.category === 'coherence').slice(-1)[0]]"
                :key="badge?.id || 'coherence'"
                class="flex flex-col items-center p-4 bg-gradient-to-br from-yellow-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border-2 border-yellow-400/50 hover:scale-105 transition-transform cursor-pointer group"
                :title="badge?.description"
              >
                <div class="text-5xl mb-2 group-hover:scale-110 transition-transform">
                   <i :class="getBadgeIcon(badge, 'heart')" class="fi inline-block"></i>
                </div>
                <div class="text-center">
                  <p class="text-sm font-medium text-white">{{ badge?.name }}</p>
                  <p class="text-xs text-white/60 mt-1">{{ badge?.description }}</p>
                  <p class="text-xs text-blue-400 mt-1 flex items-center justify-center gap-1">
                    <i class="fi fi-rr-wind"></i> Cohérence
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Prochains badges à débloquer -->
          <div v-if="stats.badges?.next && (stats.badges.next.stars || stats.badges.next.meditation || stats.badges.next.coherence)" class="mb-8">
            <h4 class="text-lg font-zen tracking-wide text-white mb-4 flex items-center gap-2">
                <i class="fi fi-rr-target text-pink-400"></i>
                Prochains objectifs
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Prochain badge Étoiles -->
              <div 
                v-if="stats.badges?.next?.stars"
                class="p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div class="text-3xl opacity-50"><i :class="getBadgeIcon(stats.badges.next.stars, 'star')" class="fi inline-block"></i></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-white">{{ stats.badges.next.stars.name }}</p>
                    <p class="text-xs text-white/60">{{ stats.badges.next.stars.description }}</p>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-xs text-white/60">
                    <span>Progression</span>
                    <span>{{ stats.badges.next.stars.progress }}%</span>
                  </div>
                  <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-yellow-400 transition-all duration-500"
                      :style="{ width: `${stats.badges.next.stars.progress}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-white/60 text-center">
                    Encore {{ stats.badges.next.stars.remaining }} étoile{{ (stats.badges.next.stars.remaining || 0) > 1 ? 's' : '' }}
                  </p>
                </div>
              </div>

              <!-- Prochain badge Méditation -->
              <div 
                v-if="stats.badges?.next?.meditation"
                class="p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div class="text-3xl opacity-50"><i :class="getBadgeIcon(stats.badges.next.meditation, 'spa')" class="fi inline-block"></i></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-white">{{ stats.badges.next.meditation.name }}</p>
                    <p class="text-xs text-white/60">{{ stats.badges.next.meditation.description }}</p>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-xs text-white/60">
                    <span>Progression</span>
                    <span>{{ stats.badges.next.meditation.progress }}%</span>
                  </div>
                  <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-purple-400 transition-all duration-500"
                      :style="{ width: `${stats.badges.next.meditation.progress}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-white/60 text-center">
                    Encore {{ formatTime(stats.badges.next.meditation.remaining || 0) }}
                  </p>
                </div>
              </div>

              <!-- Prochain badge Cohérence -->
              <div 
                v-if="stats.badges?.next?.coherence"
                class="p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div class="text-3xl opacity-50"><i :class="getBadgeIcon(stats.badges.next.coherence, 'heart')" class="fi inline-block"></i></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-white">{{ stats.badges.next.coherence.name }}</p>
                    <p class="text-xs text-white/60">{{ stats.badges.next.coherence.description }}</p>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-xs text-white/60">
                    <span>Progression</span>
                    <span>{{ stats.badges.next.coherence.progress }}%</span>
                  </div>
                  <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-blue-400 transition-all duration-500"
                      :style="{ width: `${stats.badges.next.coherence.progress}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-white/60 text-center">
                    Encore {{ formatTime(stats.badges.next.coherence.remaining || 0) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tous les badges par catégorie -->
          <div v-if="stats.badges?.unlocked || stats.badges?.locked">
            <h4 class="text-lg font-zen tracking-wide text-white mb-4 flex items-center gap-2">
                <i class="fi fi-rr-list text-indigo-400"></i>
                Tous les badges
            </h4>
            
            <!-- Badges Étoiles -->
            <div class="mb-6">
              <h5 class="text-sm font-medium text-yellow-400 mb-3 flex items-center gap-2">
                <i class="fi fi-rr-star inline-block"></i> Badges Étoiles
              </h5>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <!-- Badges étoiles débloqués -->
                <div 
                  v-for="badge in [...(stats.badges?.unlocked || []), ...(stats.badges?.locked || [])].filter(b => b.category === 'stars')" 
                  :key="badge.id"
                  :class="stats.badges?.unlocked?.find(u => u.id === badge.id) 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-purple-500/20 border-2 border-yellow-400/50' 
                    : 'bg-white/5 border border-white/10 opacity-50'"
                  class="flex flex-col items-center p-4 backdrop-blur-lg rounded-2xl"
                >
                  <div class="text-4xl mb-2" :class="!stats.badges?.unlocked?.find(u => u.id === badge.id) ? 'grayscale' : ''">
                    <i :class="getBadgeIcon(badge, 'star')" class="fi inline-block"></i>
                  </div>
                  <p class="text-xs font-medium text-center" :class="stats.badges?.unlocked?.find(u => u.id === badge.id) ? 'text-white' : 'text-white/60'">
                    {{ badge.name }}
                  </p>
                  <div v-if="!stats.badges?.unlocked?.find(u => u.id === badge.id) && badge.progress !== undefined" class="w-full mt-2">
                    <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-white/30"
                        :style="{ width: `${badge.progress}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Badges Méditation -->
            <div class="mb-6">
              <h5 class="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                <i class="fi fi-rr-spa inline-block"></i> Badges Méditation
              </h5>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div 
                  v-for="badge in [...(stats.badges?.unlocked || []), ...(stats.badges?.locked || [])].filter(b => b.category === 'meditation')" 
                  :key="badge.id"
                  :class="stats.badges?.unlocked?.find(u => u.id === badge.id) 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-purple-500/20 border-2 border-yellow-400/50' 
                    : 'bg-white/5 border border-white/10 opacity-50'"
                  class="flex flex-col items-center p-4 backdrop-blur-lg rounded-2xl"
                >
                  <div class="text-4xl mb-2" :class="!stats.badges?.unlocked?.find(u => u.id === badge.id) ? 'grayscale' : ''">
                    <i :class="getBadgeIcon(badge, 'spa')" class="fi inline-block"></i>
                  </div>
                  <p class="text-xs font-medium text-center" :class="stats.badges?.unlocked?.find(u => u.id === badge.id) ? 'text-white' : 'text-white/60'">
                    {{ badge.name }}
                  </p>
                  <div v-if="!stats.badges?.unlocked?.find(u => u.id === badge.id) && badge.progress !== undefined" class="w-full mt-2">
                    <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-white/30"
                        :style="{ width: `${badge.progress}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Badges Cohérence Cardiaque -->
            <div>
              <h5 class="text-sm font-medium text-blue-400 mb-3 flex items-center gap-2">
                <i class="fi fi-rr-heart inline-block"></i> Badges Cohérence Cardiaque
              </h5>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div 
                  v-for="badge in [...(stats.badges?.unlocked || []), ...(stats.badges?.locked || [])].filter(b => b.category === 'coherence')" 
                  :key="badge.id"
                  :class="stats.badges?.unlocked?.find(u => u.id === badge.id) 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-purple-500/20 border-2 border-yellow-400/50' 
                    : 'bg-white/5 border border-white/10 opacity-50'"
                  class="flex flex-col items-center p-4 backdrop-blur-lg rounded-2xl"
                >
                  <div class="text-4xl mb-2" :class="!stats.badges?.unlocked?.find(u => u.id === badge.id) ? 'grayscale' : ''">
                    <i :class="getBadgeIcon(badge, 'heart')" class="fi inline-block"></i>
                  </div>
                  <p class="text-xs font-medium text-center" :class="stats.badges?.unlocked?.find(u => u.id === badge.id) ? 'text-white' : 'text-white/60'">
                    {{ badge.name }}
                  </p>
                  <div v-if="!stats.badges?.unlocked?.find(u => u.id === badge.id) && badge.progress !== undefined" class="w-full mt-2">
                    <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-white/30"
                        :style="{ width: `${badge.progress}%` }"
                      ></div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Modale de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" @click.self="closeDeleteModal">
      <div class="w-full max-w-md rounded-2xl border border-red-500/30 bg-night-900 p-6 shadow-2xl animate-scale-in">
        <div class="mb-6 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-3xl">
             <i class="fi fi-rr-exclamation text-3xl text-red-400 inline-block"></i>
          </div>
          <h3 class="mb-2 text-2xl font-medium text-white">Supprimer votre compte ?</h3>
          <p class="text-white">
            Cette action est <span class="font-medium text-red-400">irréversible</span>. Toutes vos données seront définitivement supprimées :
          </p>
        </div>

        <div class="mb-6 space-y-2 rounded-lg bg-red-500/10 p-4 text-sm text-white">
          <div class="flex items-center gap-2">
            <i class="fi fi-rr-star text-yellow-400"></i>
            <span>{{ stats.stars_count }} lueurs créées</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fi fi-rr-wind text-blue-400"></i>
            <span>{{ stats.breathing_sessions }} sessions de respiration</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fi fi-rr-interlace text-pink-400"></i>
            <span>{{ stats.games_played }} jeux joués</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fi fi-rr-user text-indigo-400"></i>
            <span>Votre profil et toutes vos préférences</span>
          </div>
        </div>

        <div class="flex gap-3">
          <MyButton
            @click="closeDeleteModal"
            variant="outline"
            size="medium"
            class="flex-1 text-white border-white/20 hover:bg-white/5"
            :disabled="isDeleting"
          >
            Non, annuler
          </MyButton>
          <button
            @click="deleteAccount"
            class="flex-1 h-10 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting" class="flex items-center gap-2">
              <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Suppression...
            </span>
            <span v-else>Oui, supprimer mon compte</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out forwards;
}
</style>

