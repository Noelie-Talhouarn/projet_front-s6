<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 gap-12">
    
    <!-- Hero Section -->
    <div class="text-center space-y-6 max-w-2xl animate-fade-in-up">
      <div class="inline-flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 mb-4 shadow-inner">
        <span class="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">✨</span>
      </div>

      <MyTitle as="h1" size="large">
        Bienvenue sur L'Étincelle
      </MyTitle>
      
      <p class="text-lg text-slate-300 leading-relaxed">
        Votre espace dédié au bien-être et à la sérénité. 
        Prenez le temps de respirer, de vous inspirer et de retrouver votre lumière intérieure.
      </p>

      <div class="flex gap-4 justify-center pt-4">
        <MyButton href="/breathing" variant="pink" size="medium">
          Relaxation Guidée
        </MyButton>
        <!-- Vous pourrez ajouter d'autres boutons ici pour le jeu par exemple -->
      </div>
    </div>

    <!-- Citation du jour -->
    <div class="w-full animate-fade-in-up" style="animation-delay: 0.2s">
      <DailyQuote/>
    </div>

  </div>
</template>
  