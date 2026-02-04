<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

useSeoMeta({
  title: 'L\'Étincelle - Votre Sanctuaire de Bien-être numérique',
  description: 'Un voyage au cœur de la sérénité. Méditation, cohérence cardiaque et ciel étoilé de gratitude.',
  ogTitle: 'L\'Étincelle - Votre Sanctuaire de Bien-être numérique',
  ogDescription: 'Un voyage au cœur de la sérénité. Méditation, cohérence cardiaque et ciel étoilé de gratitude.',
})
</script>

<template>
  <div class="relative min-h-screen z-10 overflow-x-hidden overflow-y-auto pt-24 pb-12 bg-[#1A0E2E]">
    <div class="relative z-10 max-w-6xl mx-auto px-6">
      <!-- Section Hero -->
      <section class="flex flex-col items-center text-center mb-32 pt-12 animate-fade-in-up">
        <!-- Logo Principal -->
        <div class="relative mb-14 group cursor-default">
          <div class="absolute inset-0 scale-[2] bg-spark/20 blur-3xl rounded-full group-hover:bg-spark/30 transition-all duration-700"></div>
          <IconLogoEtincelle class="relative h-14 md:h-20 w-auto animate-pulse-slow" />
        </div>
        
        <p class="text-xl md:text-2xl text-slate-400 font-light max-w-3xl leading-relaxed mb-12">
          Réenchantez votre quotidien numérique. Un sanctuaire poétique pour <span class="text-white">cultiver la paix</span> et <span class="text-white">libérer votre créativité</span>.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <MyButton 
            href="/register" 
            variant="default" 
            size="large"
            class="!rounded-2xl px-10"
          >
            Commencer
          </MyButton>
          <MyButton 
            href="/login" 
            variant="outline" 
            size="large"
            class="!rounded-2xl backdrop-blur-xl px-10"
          >
            Se connecter
          </MyButton>
        </div>
      </section>

      <!-- Section Concept (Grille Poétique) -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <!-- Méditation -->
        <div class="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-10 backdrop-blur-3xl transition-all duration-700 hover:border-emerald-400/20 hover:bg-white/[0.05] animate-fade-in-up" style="animation-delay: 0.2s">
          <div class="mb-8 h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500">
            <i class="fi fi-rr-spa text-3xl"></i>
          </div>
          <h3 class="text-2xl font-zen text-white mb-4">Le Souffle Vital</h3>
          <p class="text-slate-400 leading-relaxed font-light">
            Pratiquez la cohérence cardiaque et la méditation guidée. Un retour immédiat à l'instant présent, où que vous soyez.
          </p>
        </div>

        <!-- Ciel Étoilé -->
        <div class="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-10 backdrop-blur-3xl transition-all duration-700 hover:border-indigo-400/20 hover:bg-white/[0.05] animate-fade-in-up" style="animation-delay: 0.3s">
          <div class="mb-8 h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
            <i class="fi fi-rr-moon-stars text-3xl"></i>
          </div>
          <h3 class="text-2xl font-zen text-white mb-4">La Voie Lactée</h3>
          <p class="text-slate-400 leading-relaxed font-light">
            Confiez vos gratitudes au ciel. Chaque souvenir devient une étoile, créant une constellation unique de vos moments précieux.
          </p>
        </div>

        <!-- Jeux Zen -->
        <div class="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-10 backdrop-blur-3xl transition-all duration-700 hover:border-spark/20 hover:bg-white/[0.05] animate-fade-in-up" style="animation-delay: 0.4s">
          <div class="mb-8 h-16 w-16 rounded-2xl bg-spark/10 flex items-center justify-center text-spark-light group-hover:scale-110 transition-transform duration-500">
            <i class="fi fi-rr-magic-wand text-3xl"></i>
          </div>
          <h3 class="text-2xl font-zen text-white mb-4">Éveil Créatif</h3>
          <p class="text-slate-400 leading-relaxed font-light">
            Réveillez votre artiste intérieur à travers des mandalas sonores et des jeux de mots poétiques sans pression de performance.
          </p>
        </div>
      </section>

      <!-- Section Manifeste (Texte Centré) -->
      <section class="max-w-3xl mx-auto text-center mb-32 animate-fade-in-up" style="animation-delay: 0.5s">
        <h2 class="text-3xl font-zen text-white mb-8 tracking-wider">Pourquoi L'Étincelle ?</h2>
        <p class="text-xl text-slate-400 leading-relaxed font-light mb-8 italic">
          "Dans le bruit incessant du numérique, nous avons besoin d'un espace où le temps ralentit, où chaque pixel est une invitation à la paix."
        </p>
        <div class="w-16 h-1 bg-gradient-to-r from-spark to-indigo-500 mx-auto rounded-full"></div>
      </section>

    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  opacity: 0;
}
.animate-fade-in {
  animation: fade-in-up 1.5s ease-out forwards;
  opacity: 0;
}
</style>