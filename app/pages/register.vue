<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

useSeoMeta({
  title: 'Inscription - L\'Étincelle',
  description: 'Créez votre compte et commencez votre voyage apaisant.',
  ogTitle: 'Inscription - L\'Étincelle',
})

// On récupère l'URL de Render configurée dans nuxt.config.ts
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const prenom = ref('')
const nom = ref('')
const email = ref('')
const mot_de_passe = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// Avatar
const avatarPreview = ref('')
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'L\'image est trop lourde (max 2Mo)'
    return
  }

  selectedFile.value = file
  // Créer un aperçu local sans uploader
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

async function onSubmit () {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    let finalAvatarUrl = ''

    // 1. Upload vers Cloudinary seulement au moment de l'inscription
    if (selectedFile.value) {
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/image/upload`
      const formData = new FormData()
      formData.append('file', selectedFile.value)
      formData.append('upload_preset', config.public.cloudinaryUploadPreset as string)

      const uploadRes = await $fetch<any>(cloudinaryUrl, {
        method: 'POST',
        body: formData
      })
      finalAvatarUrl = uploadRes.secure_url
    }

    // 2. Inscription avec l'URL finale
    await $fetch('/api/users/register', {
      method: 'POST',
      body: {
        prenom: prenom.value,
        nom: nom.value,
        email: email.value,
        mot_de_passe: mot_de_passe.value,
        avatar: finalAvatarUrl
      }
    })

    successMessage.value = 'Compte créé avec succès 🎉 Connexion en cours...'

    const loginResponse = await $fetch<{ token: string }>('/api/users/login', {
      method: 'POST',
      body: {
        email: email.value,
        mot_de_passe: mot_de_passe.value
      }
    })

    const cookie = useCookie('auth_token')
    cookie.value = loginResponse.token
    return navigateTo('/home')

  } catch (err: any) {
    errorMessage.value = err.data?.message || 'Erreur lors de l’inscription ❌'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center p-4">
    <div class="w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-night-900/50 p-8 shadow-2xl backdrop-blur-xl">
      
      <MyTitle as="h1" size="medium" class="mb-8 text-center font-zen tracking-wide">
        Inscription
      </MyTitle>

      <form class="flex flex-col gap-6" @submit.prevent="onSubmit">

        <!-- Messages d'erreur/succès -->
        <div v-if="errorMessage" class="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-center text-sm font-medium text-green-400">
          {{ successMessage }}
        </div>

        <!-- Photo de profil (Optionnel) -->
        <div class="flex flex-col items-center gap-4 mb-2">
          <div 
            class="relative h-24 w-24 rounded-full bg-night-800 border-2 border-white/10 overflow-hidden flex items-center justify-center cursor-pointer group hover:border-spark/50 transition-all"
            @click="fileInput?.click()"
          >
            <img v-if="avatarPreview" :src="avatarPreview" class="h-full w-full object-cover" />
            <div v-else class="flex flex-col items-center justify-center text-slate-500 group-hover:text-slate-300">
              <i class="fi fi-rr-camera text-2xl"></i>
              <span class="text-xs mt-1 uppercase font-bold tracking-tighter">Photo</span>
            </div>
            
            <!-- Loading Overlay (pendant l'inscription) -->
            <div v-if="isLoading && selectedFile" class="absolute inset-0 bg-night-900/80 flex items-center justify-center">
              <div class="h-6 w-6 border-2 border-spark border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <p class="text-xs text-slate-500 italic">Photo de profil (optionnel)</p>
          <input 
            ref="fileInput"
            type="file" 
            class="hidden" 
            accept="image/*"
            @change="handleFileUpload"
          />
        </div>

        <!-- Prénom & Nom (Grille) -->
        <div class="grid grid-cols-2 gap-4">
          <MyInput 
            id="prenom" 
            v-model="prenom" 
            type="text" 
            label="Prénom" 
            placeholder="Votre prénom" 
            required 
          />
          <MyInput 
            id="nom" 
            v-model="nom" 
            type="text" 
            label="Nom" 
            placeholder="Votre nom" 
            required 
          />
        </div>

        <!-- Email -->
        <MyInput 
          id="email" 
          v-model="email" 
          type="email" 
          label="Email" 
          placeholder="exemple@email.com" 
          required 
        />

        <!-- Mot de passe -->
        <MyInput 
          id="mot_de_passe" 
          v-model="mot_de_passe" 
          type="password" 
          label="Mot de passe" 
          placeholder="••••••••" 
          required 
        />

        <!-- Actions -->
        <div class="mt-4 flex flex-col gap-4">
          <MyButton variant="pink" size="large" class="w-full group flex items-center justify-center gap-2" type="submit" :disabled="isLoading">
            <template v-if="!isLoading">
                S'inscrire
                <span class="ml-2 transition-transform group-hover:translate-x-1">✨</span>
            </template>
            <template v-else>
                <div class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Inscription...
            </template>
          </MyButton>
          
          <p class="text-center text-sm text-slate-400">
            Déjà un compte ? 
            <NuxtLink to="/login" class="font-bold text-spark-light hover:text-spark-pink hover:underline">
              Se connecter
            </NuxtLink>
          </p>
        </div>

      </form>
    </div>
  </div>
</template>
