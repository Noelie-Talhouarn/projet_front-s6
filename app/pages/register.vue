<script setup lang="ts">
const prenom = ref('')
const nom = ref('')
const email = ref('')
const mot_de_passe = ref('')

const errorMessage = ref('')
const successMessage = ref('')

// On utilise $fetch directement, pas besoin de config pour le proxy relatif
async function onSubmit () {
  console.log('🔵 Tentative d\'inscription...')
  errorMessage.value = ''
  successMessage.value = ''

  try {
    console.log('🔵 Envoi de la requête POST vers /api/users/register')
    
    // 1. Inscription
    // Utilisation de $fetch qui gère mieux les erreurs et le JSON
    await $fetch('/api/users/register', {
      method: 'POST',
      body: {
        prenom: prenom.value,
        nom: nom.value,
        email: email.value,
        mot_de_passe: mot_de_passe.value,
      }
    })

    console.log('🟢 Inscription réussie !')
    successMessage.value = 'Compte créé avec succès 🎉 Connexion en cours...'

    // 2. Connexion automatique
    console.log('🔵 Tentative de connexion automatique...')
    const loginResponse = await $fetch<{ token: string }>('/api/users/login', {
      method: 'POST',
      body: {
        email: email.value,
        mot_de_passe: mot_de_passe.value
      }
    })

    console.log('🟢 Connexion réussie, récupération du token')
    
    // Stockage du cookie
    const cookie = useCookie('recipe_token')
    cookie.value = loginResponse.token

    console.log('🔵 Redirection vers l\'accueil...')
    return navigateTo('/')

  } catch (err: any) {
    console.error('🔴 Erreur :', err)
    // $fetch lance une erreur si la requête échoue, on peut récupérer le message
    errorMessage.value = err.data?.message || err.message || 'Erreur lors de l’inscription ❌'
  }
}
</script>

<template>
  <div class="flex items-center justify-center p-4">
    <div class="w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-night-900/50 p-8 shadow-2xl backdrop-blur-xl">
      
      <MyTitle as="h1" size="medium" class="mb-8 text-center">
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
          <MyButton variant="pink" size="large" class="w-full group" type="submit">
            S'inscrire
            <span class="ml-2 transition-transform group-hover:translate-x-1">✨</span>
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
