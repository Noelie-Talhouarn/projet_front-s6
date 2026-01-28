<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Contact - L\'Étincelle',
  description: 'Une question ou une suggestion ? Contactez l\'équipe de L\'Étincelle.',
  ogTitle: 'Contact - L\'Étincelle',
})
</script>

<template>
  <div class=" bg-night-900 pt-24 px-6 pb-20 relative overflow-hidden flex items-center justify-center">
      
      <!-- Background Elements -->
      <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2  relative z-10 animate-fade-in-up">
          
          <!-- Infos & Texte -->
          <div class="flex flex-col justify-center">
              <span class="text-xs font-bold uppercase tracking-[0.3em] text-spark-light/80 mb-3 block font-sans">Contact</span>
              <h1 class="text-4xl md:text-5xl font-zen tracking-wide text-white mb-6">Parlons un peu</h1>
              
              <p class="text-slate-400 leading-relaxed mb-8 text-lg">
                  Une suggestion pour améliorer L'Étincelle ? Un problème technique ? Ou simplement envie de partager votre expérience ? <br><br>
                  Nous sommes à votre écoute pour rendre ce sanctuaire encore plus apaisant.
              </p>

              
          </div>

          <!-- Formulaire Email Simple -->
          <div class="bg-night-800/50 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl relative overflow-hidden group flex flex-col items-center justify-center text-center">
              <!-- Glow effect on card -->
              <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-colors"></div>

              <div class="relative z-10 space-y-6">
                  <div class="w-20 h-20 mx-auto rounded-full bg-gradient-spark flex items-center justify-center text-3xl text-white shadow-lg mb-4">
                      <i class="fi fi-rr-paper-plane"></i>
                  </div>
                  
                  <h2 class="text-2xl font-bold font-zen tracking-wide text-white">Envoyez-nous un message</h2>
                  <p class="text-slate-400 max-w-sm mx-auto mb-8">
                      Votre voix est importante. Cliquez ci-dessous pour ouvrir votre messagerie et nous écrire directement.
                  </p>
                  
                  <a 
                      href="mailto:bonjour@letincelle.app?subject=Hello%20L'Étincelle" 
                      class="text-lg md:text-xl font-bold text-white hover:text-spark-light transition-colors border-b-2 border-white/20 hover:border-spark-light pb-2"
                  >
                      contact@letincelle.com
                  </a>
              </div>
          </div>

      </div>
  </div>
</template>
