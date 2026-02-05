<template>
  <header class="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-night-900/80 px-6 backdrop-blur-md">
    <NuxtLink to="/" class="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
      <IconLogoEtincelle class="h-6 w-auto" />
    </NuxtLink>

    <!-- Navigation Desktop -->
    <nav v-if="token" class="hidden md:flex items-center gap-8 translate-x-12">
      <NuxtLink to="/home" class="text-sm font-bold uppercase tracking-widest text-white hover:text-white transition-colors" exact-active-class="text-spark-light">Accueil</NuxtLink>
      <NuxtLink to="/meditation" class="text-sm font-bold uppercase tracking-widest text-white hover:text-white transition-colors" active-class="text-emerald-400">Méditation</NuxtLink>
      <NuxtLink to="/games" class="text-sm font-bold uppercase tracking-widest text-white hover:text-white transition-colors" active-class="text-pink-400">Jeux</NuxtLink>
      <NuxtLink to="/ciel" class="text-sm font-bold uppercase tracking-widest text-white hover:text-white transition-colors" active-class="text-indigo-400">Espace Ciel</NuxtLink>
    </nav>

    <div v-if="!token" class="flex items-center gap-3">
      <NuxtLink to="/login" class="text-sm font-semibold text-white hover:text-white transition-colors">
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
      <NuxtLink to="/favoris" class="p-2 rounded-full hover:bg-white/10 transition-colors text-[#D946EF]" title="Mes favoris">
        <i class="fi fi-rr-heart text-xl"></i>
      </NuxtLink>
      <NuxtLink to="/profil" class="hidden md:flex p-2 rounded-full hover:bg-white/10 transition-colors text-white" title="Mon profil">
        <i class="fi fi-rr-user text-xl"></i>
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