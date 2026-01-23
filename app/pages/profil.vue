<script setup lang="ts">
// État de l'utilisateur
const user = ref({
  prenom: '',
  nom: '',
  email: '',
  date_inscription: '',
  avatar: ''
})

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

// Statistiques
const stats = ref({
  sparks_count: 0,
  breathing_sessions: 0,
  total_breathing_time: 0,
  games_played: 0,
  days_active: 0
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

onMounted(async () => {
  await loadUserProfile()
  await loadUserStats()
})

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

    stats.value = response
  } catch (err) {
    console.error('Erreur lors du chargement des statistiques:', err)
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

    successMessage.value = 'Profil mis à jour avec succès ✨'
    isEditing.value = false

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: any) {
    console.error('Erreur lors de la mise à jour:', err)
    errorMessage.value = err.data?.message || 'Erreur lors de la mise à jour'
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

    successMessage.value = 'Préférences enregistrées ✓'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('Erreur lors de la mise à jour des préférences:', err)
  }
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}min`
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
</script>

<template>
  <div class="min-h-screen p-4 pb-24 md:pb-8">
    <div class="mx-auto max-w-4xl space-y-6">
      
      <!-- Header -->
      <div class="text-center mb-8 animate-fade-in-up">
        <MyTitle as="h1" size="large">Mon Profil</MyTitle>
        <p class="text-slate-400 mt-2">Gérez vos informations personnelles et vos préférences</p>
      </div>

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
          <p class="text-slate-400">Chargement de votre profil...</p>
        </div>
      </div>

      <template v-else>
        <!-- Carte Profil Principal -->
        <div class="rounded-2xl border border-white/10 bg-night-900/50 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-fade-in-up">
          
          <!-- Avatar et Nom -->
          <div class="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div class="relative group">
              <div class="h-24 w-24 rounded-full bg-gradient-spark flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-spark/40 transition-all group-hover:scale-105">
                {{ getInitials() }}
              </div>
              <div class="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 border-4 border-night-900 shadow-lg"></div>
            </div>

            <div class="flex-1 text-center md:text-left">
              <h2 class="text-2xl font-bold text-white mb-1">
                {{ user.prenom }} {{ user.nom }}
              </h2>
              <p class="text-slate-400 mb-2">{{ user.email }}</p>
              <p class="text-sm text-slate-500">
                Membre depuis le {{ formatDate(user.date_inscription) }}
              </p>
            </div>

            <div v-if="!isEditing">
              <MyButton @click="startEditing" variant="outline" size="medium">
                <span class="mr-2">✏️</span>
                Modifier
              </MyButton>
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
              <MyButton @click="cancelEditing" variant="outline" size="medium">
                Annuler
              </MyButton>
              <MyButton @click="saveProfile" variant="pink" size="medium">
                <span class="mr-2">💾</span>
                Enregistrer
              </MyButton>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style="animation-delay: 0.1s">
          
          <div class="rounded-xl border border-white/10 bg-night-900/50 p-4 backdrop-blur-xl hover:border-spark/50 transition-all hover:scale-105">
            <div class="text-3xl mb-2">✨</div>
            <div class="text-2xl font-bold text-spark-light mb-1">{{ stats.sparks_count }}</div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">Lueurs créées</div>
          </div>

          <div class="rounded-xl border border-white/10 bg-night-900/50 p-4 backdrop-blur-xl hover:border-spark-pink/50 transition-all hover:scale-105">
            <div class="text-3xl mb-2">🌬️</div>
            <div class="text-2xl font-bold text-spark-pink mb-1">{{ stats.breathing_sessions }}</div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">Sessions</div>
          </div>

          <div class="rounded-xl border border-white/10 bg-night-900/50 p-4 backdrop-blur-xl hover:border-glow/50 transition-all hover:scale-105">
            <div class="text-3xl mb-2">⏱️</div>
            <div class="text-2xl font-bold text-glow-light mb-1">{{ formatDuration(stats.total_breathing_time) }}</div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">Méditation</div>
          </div>

          <div class="rounded-xl border border-white/10 bg-night-900/50 p-4 backdrop-blur-xl hover:border-purple-400/50 transition-all hover:scale-105">
            <div class="text-3xl mb-2">🎮</div>
            <div class="text-2xl font-bold text-purple-400 mb-1">{{ stats.games_played }}</div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">Jeux joués</div>
          </div>
        </div>

        <!-- Préférences -->
        <div class="rounded-2xl border border-white/10 bg-night-900/50 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-fade-in-up" style="animation-delay: 0.2s">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">⚙️</span>
            <MyTitle as="h2" size="small">Préférences</MyTitle>
          </div>

          <div class="space-y-4">
            
            <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div class="flex items-center gap-3">
                <span class="text-xl">🔔</span>
                <div>
                  <div class="font-medium text-white">Notifications</div>
                  <div class="text-sm text-slate-400">Recevoir des rappels quotidiens</div>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="preferences.notifications" 
                  @change="updatePreferences"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-spark/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-spark"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div class="flex items-center gap-3">
                <span class="text-xl">💬</span>
                <div>
                  <div class="font-medium text-white">Citation du jour</div>
                  <div class="text-sm text-slate-400">Afficher une citation inspirante</div>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="preferences.daily_quote" 
                  @change="updatePreferences"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-spark/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-spark"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div class="flex items-center gap-3">
                <span class="text-xl">🌙</span>
                <div>
                  <div class="font-medium text-white">Mode sombre</div>
                  <div class="text-sm text-slate-400">Thème de l'application</div>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="preferences.dark_mode" 
                  @change="updatePreferences"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-spark/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-spark"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Progression et Badges -->
        <div class="rounded-2xl border border-white/10 bg-night-900/50 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-fade-in-up" style="animation-delay: 0.3s">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">🏆</span>
            <MyTitle as="h2" size="small">Badges et Réalisations</MyTitle>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div class="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer" :class="stats.sparks_count >= 1 ? 'opacity-100' : 'opacity-40'">
              <div class="text-4xl mb-2">✨</div>
              <div class="text-xs font-bold text-spark-light">Première Lueur</div>
              <div class="text-[10px] text-slate-500 mt-1">Créer votre première lueur</div>
            </div>

            <div class="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer" :class="stats.breathing_sessions >= 5 ? 'opacity-100' : 'opacity-40'">
              <div class="text-4xl mb-2">🧘</div>
              <div class="text-xs font-bold text-spark-pink">Zen Master</div>
              <div class="text-[10px] text-slate-500 mt-1">5 sessions de respiration</div>
            </div>

            <div class="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer" :class="stats.days_active >= 7 ? 'opacity-100' : 'opacity-40'">
              <div class="text-4xl mb-2">🔥</div>
              <div class="text-xs font-bold text-orange-400">Série de 7</div>
              <div class="text-[10px] text-slate-500 mt-1">7 jours consécutifs</div>
            </div>

            <div class="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer" :class="stats.games_played >= 10 ? 'opacity-100' : 'opacity-40'">
              <div class="text-4xl mb-2">🎨</div>
              <div class="text-xs font-bold text-purple-400">Artiste</div>
              <div class="text-[10px] text-slate-500 mt-1">10 jeux complétés</div>
            </div>
          </div>
        </div>

        <!-- Actions du compte -->
        <div class="rounded-2xl border border-white/10 bg-night-900/50 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-fade-in-up" style="animation-delay: 0.4s">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">🔐</span>
            <MyTitle as="h2" size="small">Sécurité et Compte</MyTitle>
          </div>

          <div class="space-y-3">
            <button class="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <span class="text-xl">🔑</span>
                <span class="font-medium text-white">Changer le mot de passe</span>
              </div>
              <span class="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button class="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <span class="text-xl">📧</span>
                <span class="font-medium text-white">Gérer les emails</span>
              </div>
              <span class="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button @click="openDeleteModal" class="w-full text-left p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <span class="text-xl">🗑️</span>
                <span class="font-medium text-red-400">Supprimer mon compte</span>
              </div>
              <span class="text-red-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

      </template>
    </div>

    <!-- Modale de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" @click.self="closeDeleteModal">
      <div class="w-full max-w-md rounded-2xl border border-red-500/30 bg-night-900 p-6 shadow-2xl animate-scale-in">
        <div class="mb-6 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-3xl">
            ⚠️
          </div>
          <h3 class="mb-2 text-2xl font-bold text-white">Supprimer votre compte ?</h3>
          <p class="text-slate-400">
            Cette action est <span class="font-bold text-red-400">irréversible</span>. Toutes vos données seront définitivement supprimées :
          </p>
        </div>

        <div class="mb-6 space-y-2 rounded-lg bg-red-500/10 p-4 text-sm text-slate-300">
          <div class="flex items-center gap-2">
            <span>✨</span>
            <span>{{ stats.sparks_count }} lueurs créées</span>
          </div>
          <div class="flex items-center gap-2">
            <span>🌬️</span>
            <span>{{ stats.breathing_sessions }} sessions de respiration</span>
          </div>
          <div class="flex items-center gap-2">
            <span>🎮</span>
            <span>{{ stats.games_played }} jeux joués</span>
          </div>
          <div class="flex items-center gap-2">
            <span>👤</span>
            <span>Votre profil et toutes vos préférences</span>
          </div>
        </div>

        <div class="mb-6">
          <label class="mb-2 block text-sm font-medium text-slate-300">
            Pour confirmer, tapez <span class="font-bold text-red-400">SUPPRIMER</span>
          </label>
          <input
            v-model="deleteConfirmText"
            type="text"
            placeholder="Tapez SUPPRIMER"
            class="w-full rounded-lg border border-red-500/30 bg-night-800 px-4 py-3 text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            @keyup.enter="deleteAccount"
          />
        </div>

        <div class="flex gap-3">
          <MyButton
            @click="closeDeleteModal"
            variant="outline"
            size="medium"
            class="flex-1"
            :disabled="isDeleting"
          >
            Annuler
          </MyButton>
          <MyButton
            @click="deleteAccount"
            size="medium"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white"
            :disabled="isDeleting || deleteConfirmText !== 'SUPPRIMER'"
          >
            <span v-if="isDeleting" class="flex items-center gap-2">
              <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Suppression...
            </span>
            <span v-else>Supprimer définitivement</span>
          </MyButton>
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

