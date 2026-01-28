<script setup lang="ts">
// Page À Propos
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="min-h-screen px-6 py-12 md:py-20 max-w-5xl mx-auto space-y-24">
    
    <!-- HERO SECTION -->
    <section class="text-center space-y-6 animate-fade-in-up">
      <div class="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-tr from-spark/20 to-spark-pink/20 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
        <i class="fi fi-rr-sparkles text-4xl text-spark-light"></i>
      </div>
      <h1 class="text-4xl md:text-6xl font-bold font-zen tracking-wide text-white">
        L'Étincelle
      </h1>
      <p class="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Votre sanctuaire numérique pour explorer le calme, cultiver la créativité et reconnecter avec soi-même.
      </p>
    </section>

    <!-- NOTRE MISSION -->
    <section class="grid md:grid-cols-2 gap-12 items-center animate-fade-in-up" style="animation-delay: 0.1s">
      <div class="space-y-6">
        <MyTitle as="h2" size="medium" class="flex items-center gap-3">
          <i class="fi fi-rr-bulb text-spark-pink"></i>
          Notre Mission
        </MyTitle>
        <p class="text-slate-400 leading-relaxed">
          Dans un monde hyper-connecté et bruyant, il est parfois difficile de trouver un moment de répit. 
          <strong class="text-white">L'Étincelle</strong> est née de l'envie d'offrir une parenthèse de douceur.
        </p>
        <p class="text-slate-400 leading-relaxed">
          Nous croyons que le bien-être ne doit pas être une corvée, mais une exploration ludique. Que ce soit à travers la respiration guidée ou la création artistique, chaque interaction est conçue pour apaiser l'esprit.
        </p>
      </div>
      <div class="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden border border-white/10 bg-night-800/50 backdrop-blur-sm shadow-2xl flex items-center justify-center group overflow-hidden">
        <!-- Abstract Visual -->
        <div class="absolute inset-0 bg-gradient-radial from-spark/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-1000"></div>
        <div class="w-32 h-32 rounded-full bg-gradient-spark blur-[50px] animate-pulse"></div>
        <div class="absolute z-10 text-center space-y-2">
            <span class="text-5xl">🧘‍♀️</span>
            <p class="text-xs font-bold uppercase tracking-widest text-white/50">Ralentir • Respirer • Créer</p>
        </div>
      </div>
    </section>

    <!-- FONCTIONNALITÉS -->
    <section class="space-y-12 animate-fade-in-up" style="animation-delay: 0.2s">
      <div class="text-center">
         <MyTitle as="h2" size="medium">L'Expérience</MyTitle>
         <p class="text-slate-400 mt-2">Quatre piliers pour votre bien-être</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Card 1: Méditation -->
        <div class="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 hover:bg-white/[0.07] transition-all hover:-translate-y-1">
          <div class="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-300 group-hover:scale-110 transition-transform">
            <i class="fi fi-rr-spa text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Méditation</h3>
          <p class="text-sm text-slate-400">
            Des ambiances sonores et guidées pour vous accompagner vers le sommeil ou la relaxation profonde.
          </p>
        </div>

        <!-- Card 2: Respiration -->
        <div class="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-400/30 hover:bg-white/[0.07] transition-all hover:-translate-y-1">
          <div class="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-4 text-sky-300 group-hover:scale-110 transition-transform">
            <i class="fi fi-rr-wind text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Respiration</h3>
          <p class="text-sm text-slate-400">
            Pratiquez la cohérence cardiaque avec un guide visuel intuitif pour réguler votre stress en quelques minutes.
          </p>
        </div>

        <!-- Card 3: Espace Créatif -->
        <div class="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-400/30 hover:bg-white/[0.07] transition-all hover:-translate-y-1">
          <div class="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4 text-pink-300 group-hover:scale-110 transition-transform">
            <i class="fi fi-rr-palette text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Créativité</h3>
          <p class="text-sm text-slate-400">
            Libérez votre esprit avec nos Mandalas génératifs et nos Puzzles Zen. L'art comme thérapie.
          </p>
        </div>

        <!-- Card 4: Suivi -->
        <div class="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/30 hover:bg-white/[0.07] transition-all hover:-translate-y-1">
          <div class="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-300 group-hover:scale-110 transition-transform">
             <i class="fi fi-rr-chart-histogram text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Progression</h3>
          <p class="text-sm text-slate-400">
            Suivez votre humeur et débloquez des badges bienveillants au fil de votre voyage.
          </p>
        </div>

      </div>
    </section>

    <!-- CONTEXTE PROJET -->
    <section class="rounded-3xl bg-night-800/50 border border-white/10 p-8 md:p-12 text-center animate-fade-in-up" style="animation-delay: 0.3s">
      <h3 class="text-2xl font-zen tracking-wide text-white mb-4">Un Projet Étudiant</h3>
      <p class="text-slate-400 max-w-2xl mx-auto mb-8">
        Cette application a été réalisée dans le cadre du projet <span class="text-spark-light font-bold">Réenchanter le monde</span>. 
        Elle explore l'intersection entre le développement web moderne (Nuxt 3, Tailwind, TypeScript) et le design d'interface émotionnel.
      </p>
    </section>

  </div>
</template>
