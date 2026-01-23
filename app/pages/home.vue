<script setup lang="ts">
definePageMeta({
    middleware: (to, from) => {
        // Redirection simple si pas connecté, mais ici c'est la page d'accueil protégée
        // Le middleware global devrait gérer ça, mais on peut forcer ici
    }
})

// Récupération de l'utilisateur
const cookie = useCookie('auth_token')
// Idéalement on récupérerait le profil utilisateur ici pour afficher "Bonjour Prénom"
</script>

<template>
  <div class="px-6 pb-20 pt-10 max-w-5xl mx-auto">
    
    <!-- Hero / Citation du jour -->
    <section class="mb-12 animate-fade-in-up">
       <header class="mb-8">
           <h1 class="text-3xl font-light text-white mb-2">Bienvenue dans votre espace,</h1>
           <p class="text-slate-400">Prenez un instant pour vous reconnecter.</p>
       </header>

       <DailyQuote />
    </section>

    <!-- Navigation Rapide (Dashboard) -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style="animation-delay: 0.1s">
        
        <!-- Carte Méditation -->
        <NuxtLink to="/meditation" class="group relative p-6 rounded-2xl bg-night-800 border border-white/5 hover:border-indigo-500/30 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10">
                <div class="text-4xl mb-4 opacity-80 group-hover:scale-110 transition-transform duration-500">🧘‍♀️</div>
                <h3 class="text-lg font-bold text-white mb-2">Méditation</h3>
                <p class="text-sm text-slate-400">Explorez nos séances guidées pour retrouver le calme.</p>
            </div>
        </NuxtLink>

        <!-- Carte Respiration -->
        <NuxtLink to="/breathing" class="group relative p-6 rounded-2xl bg-night-800 border border-white/5 hover:border-sky-500/30 transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.1)] overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10">
                <div class="text-4xl mb-4 opacity-80 group-hover:scale-110 transition-transform duration-500">💨</div>
                <h3 class="text-lg font-bold text-white mb-2">Respiration</h3>
                <p class="text-sm text-slate-400">Cohérence cardiaque et exercices de souffle.</p>
            </div>
        </NuxtLink>

        <!-- Carte Jeux -->
        <NuxtLink to="/games" class="group relative p-6 rounded-2xl bg-night-800 border border-white/5 hover:border-pink-500/30 transition-all hover:shadow-[0_0_20px_rgba(236,72,153,0.1)] overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10">
                <div class="text-4xl mb-4 opacity-80 group-hover:scale-110 transition-transform duration-500">🎨</div>
                <h3 class="text-lg font-bold text-white mb-2">Espace Créatif</h3>
                <p class="text-sm text-slate-400">Mandala, Puzzles et expériences interactives.</p>
            </div>
        </NuxtLink>

    </section>

    <!-- Accès Profil Rapide -->
    <section class="mt-12 text-center animate-fade-in-up" style="animation-delay: 0.2s">
         <NuxtLink to="/profil" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
            <span>Gérer mon profil</span>
            <span>→</span>
         </NuxtLink>
    </section>

  </div>
</template>
