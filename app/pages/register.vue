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

async function onSubmit () {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    await $fetch(`${apiBase}/api/users/register`, {
      method: 'POST',
      body: {
        prenom: prenom.value,
        nom: nom.value,
        email: email.value,
        mot_de_passe: mot_de_passe.value,
      }
    })

    successMessage.value = 'Compte créé avec succès 🎉 Connexion en cours...'

    const loginResponse = await $fetch<{ token: string }>(`${apiBase}/api/users/login`, {
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
