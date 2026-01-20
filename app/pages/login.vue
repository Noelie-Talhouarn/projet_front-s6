<script setup lang="ts">
const email = ref('')
const mot_de_passe = ref('')
const errorMessage = ref('')

// const config = useRuntimeConfig() // Plus besoin grâce au proxy

async function onSubmit () {
  console.log('🔵 Tentative de connexion...')
  errorMessage.value = ''

  try {
    console.log('🔵 Envoi de la requête POST vers /api/users/login')
    
    // Utilisation de $fetch pour gérer automatiquement le JSON et les erreurs
    const response = await $fetch<{ token: string }>('/api/users/login', {
      method: 'POST',
      body: {
        email: email.value,
        mot_de_passe: mot_de_passe.value
      }
    })

    console.log('🟢 Connexion réussie ! Token reçu.')

    // 🔐 Stockage du JWT
    const cookie = useCookie('recipe_token')
    cookie.value = response.token

    console.log('🔵 Redirection vers le dashboard...')
    navigateTo('/dashboard')

  } catch (err: any) {
    console.error('🔴 Erreur de connexion :', err)
    errorMessage.value = err.data?.message || 'Email ou mot de passe incorrect ❌'
  }
}
</script>


<template>
  <div class="flex items-center justify-center p-4">
    <div class="w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-night-900/50 p-8 shadow-2xl backdrop-blur-xl">
      
      <MyTitle as="h1" size="medium" class="mb-8 text-center">
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
