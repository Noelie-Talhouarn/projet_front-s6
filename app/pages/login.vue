<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

useSeoMeta({
  title: 'Connexion - L\'Étincelle',
  description: 'Connectez-vous pour retrouver votre espace de sérénité.',
  ogTitle: 'Connexion - L\'Étincelle',
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string // On récupère l'adresse de Render

const email = ref('')
const mot_de_passe = ref('')
const errorMessage = ref('')

async function onSubmit () {
  errorMessage.value = ''

  try {
    // Utilisation de baseURL pour pointer vers api-letincelle...
    const response = await $fetch<{ token: string }>(`${apiBase}/api/users/login`, {
      method: 'POST',
      body: {
        email: email.value,
        mot_de_passe: mot_de_passe.value
      }
    })

    const cookie = useCookie('auth_token')
    cookie.value = response.token
    navigateTo('/home')

  } catch (err: any) {
    errorMessage.value = err.data?.message || 'Email ou mot de passe incorrect ❌'
  }
}
</script>


<template>
  <div class="flex items-center justify-center p-4">
    <div class="w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-night-900/50 p-8 shadow-2xl backdrop-blur-xl">
      
      <MyTitle as="h1" size="medium" class="mb-8 text-center font-zen tracking-wide">
        Connexion
      </MyTitle>

      <form class="flex flex-col gap-6" @submit.prevent="onSubmit">

        <!-- Message erreur -->
        <div v-if="errorMessage" class="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400">
          {{ errorMessage }}
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
        <div class="flex flex-col gap-1">
          <MyInput 
            id="mot_de_passe" 
            v-model="mot_de_passe" 
            type="password" 
            label="Mot de passe" 
            placeholder="••••••••" 
            required 
          />
          <div class="text-right">
            <a href="#" class="text-xs text-slate-400 hover:text-spark-light transition-colors">Mot de passe oublié ?</a>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-4 flex flex-col gap-4">
          <MyButton size="large" type="submit" class="w-full group">
            Se connecter
            <span class="ml-2 transition-transform group-hover:translate-x-1">➜</span>
          </MyButton>
          
          <p class="text-center text-sm text-slate-400">
            Pas encore de compte ? 
            <NuxtLink to="/register" class="font-bold text-spark-light hover:text-spark-pink hover:underline">
              S'inscrire
            </NuxtLink>
          </p>
        </div>

      </form>
    </div>
  </div>
</template>
