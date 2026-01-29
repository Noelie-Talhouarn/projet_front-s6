<template>
  <header class="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-night-900/80 px-6 backdrop-blur-md">
    <NuxtLink to="/" class="flex items-center gap-2 group">
      <i class="fi fi-rr-sparkles text-2xl group-hover:rotate-12 transition-transform inline-block"></i>
      <MyTitle as="h1" size="small">L'Étincelle</MyTitle>
    </NuxtLink>

    <div v-if="!token" class="flex items-center gap-3">
      <NuxtLink to="/login" class="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
        Connexion
      </NuxtLink>
      <MyButton 
        href="/register" 
        variant="pink"
        size="small"
      >
        S'inscrire
      </MyButton>
    </div>
    
    <div v-else class="flex items-center gap-4">
      <NuxtLink to="/favoris" class="p-2 rounded-full hover:bg-white/10 transition-colors text-pink-400" title="Mes favoris">
        <i class="fi fi-rr-heart text-xl"></i>
      </NuxtLink>
      <MyButton 
        variant="default"
        size="small"
        @click="logout"
      >
        Déconnexion
      </MyButton>
    </div>
  </header>
</template>

<script setup lang="ts">
const token = useCookie('auth_token')

const logout = () => {
  token.value = null // Deletes the cookie
  return navigateTo('/login')
}
</script>