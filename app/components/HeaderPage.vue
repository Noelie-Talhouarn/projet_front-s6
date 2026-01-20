<template>
  <header class="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-night-900/80 px-6 backdrop-blur-md">
    <NuxtLink to="/" class="flex items-center gap-2 group">
      <span class="text-2xl group-hover:rotate-12 transition-transform">✨</span>
      <span class="text-lg font-bold tracking-tight bg-gradient-spark bg-clip-text text-transparent">L'Étincelle</span>
    </NuxtLink>

    <div v-if="!token" class="flex items-center gap-3">
      <NuxtLink to="/login" class="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
        Connexion
      </NuxtLink>
      <NuxtLink 
        to="/register" 
        class="rounded-full bg-gradient-spark px-4 py-2 text-sm font-bold text-white shadow-lg shadow-spark/20 active:scale-95 transition-all hover:shadow-spark/40"
      >
        S'inscrire
      </NuxtLink>
    </div>
    
    <NuxtLink v-else to="/profile" class="h-10 w-10 overflow-hidden rounded-full border-2 border-spark/50 hover:border-spark-light transition-colors">
      <img src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" alt="Profil" />
    </NuxtLink>
  </header>
</template>

<script setup>
const token = useCookie('auth_token')
</script>