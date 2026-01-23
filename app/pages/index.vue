<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center p-6 text-center z-10">
      
      <!-- Logo / Icone -->
      <div class="mb-8 animate-fade-in-up">
          <div class="w-16 h-16 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl rotate-45 blur-xl opacity-75 absolute top-0 left-1/2 -translate-x-1/2"></div>
          <div class="relative w-12 h-12 mx-auto border-2 border-white/20 rounded-xl rotate-45 flex items-center justify-center backdrop-blur-sm">
             <div class="w-6 h-6 bg-white/60 rounded-full shadow-[0_0_15px_white]"></div>
          </div>
      </div>

      <!-- Titre Principal -->
      <h1 class="text-5xl md:text-7xl font-thin tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 mb-6 animate-fade-in-up" style="animation-delay: 0.1s">
          L'Étincelle
      </h1>

      <!-- Slogan / Pitch -->
      <p class="text-lg md:text-xl text-slate-400 font-light max-w-2xl leading-relaxed mb-12 animate-fade-in-up" style="animation-delay: 0.2s">
          Votre sanctuaire numérique pour l'apaisement et la régénération.<br>
          <span class="text-indigo-300">Méditation</span> • <span class="text-purple-300">Créativité</span> • <span class="text-pink-300">Sérénité</span>
      </p>

      <!-- Actions -->
      <div class="flex flex-col md:flex-row gap-4 w-full max-w-sm animate-fade-in-up" style="animation-delay: 0.3s">
          <NuxtLink 
              to="/login" 
              class="flex-1 py-3 px-6 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
              <span>Se connecter</span>
          </NuxtLink>

          <NuxtLink 
              to="/register" 
              class="flex-1 py-3 px-6 rounded-xl bg-white text-black font-bold hover:bg-indigo-50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2"
          >
              <span>Commencer</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
          </NuxtLink>
      </div>

      <!-- Footer discret (puisqu'on a enlevé le global) -->
      <div class="absolute bottom-6 text-[10px] text-slate-600 uppercase tracking-widest animate-fade-in" style="animation-delay: 0.5s">
          © 2026 L'Étincelle • v1.0
      </div>

  </div>
</template>

<style scoped>
/* Animations Custom si pas déjà dans global CSS */
@keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
    animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0; 
}
.animate-fade-in {
    animation: fade-in-up 1s ease-out forwards;
    opacity: 0;
}
</style>