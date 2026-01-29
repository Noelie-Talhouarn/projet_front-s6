<template>
  <footer class="bg-gradient-to-br from-night-900 to-night-800 text-white border-t border-night-700">
    <div class="mx-auto px-6 py-3 lg:py-16">
      <!-- Contenu principal du footer -->
      <div class="flex items-center justify-center mb-12">
        <!-- Section Marque -->
        <div class="footer-section animate-fade-in-up text-center" style="animation-delay: 0.1s">
          <div class="flex items-center justify-center gap-2 mb-4">
            <i class="fi fi-rr-sparkles text-2xl text-spark"></i>
            <MyTitle as="h3" size="medium">L'Étincelle</MyTitle>
          </div>
          <p class="text-slate-400 text-sm italic leading-relaxed max-w-md mx-auto">
            Votre sanctuaire numérique conçu pour cultiver le calme, explorer la créativité et reconnecter avec l'essentiel.
          </p>
        </div>
      </div>

      <!-- Bas du footer -->
      <div class="pt-8 border-t border-night-700 flex flex-col items-center gap-4 text-center">
        
        <!-- Navigation Principale -->
        <div class="flex items-center gap-6 text-sm font-medium">
          <NuxtLink to="/about" class="text-slate-300 hover:text-white transition-colors underline">À propos</NuxtLink>
          <NuxtLink to="/contact" class="text-slate-300 hover:text-white transition-colors underline">Contact</NuxtLink>
        </div>

        <!-- Mentions Légales -->
        <div class="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-500">
           <NuxtLink to="/mentions-legales" class="hover:text-slate-300 transition-colors">Mentions Légales</NuxtLink>
           <span>•</span>
           <NuxtLink to="/cgu" class="hover:text-slate-300 transition-colors">CGU</NuxtLink>
           <span>•</span>
           <NuxtLink to="/politique-confidentialite" class="hover:text-slate-300 transition-colors">Confidentialité</NuxtLink>
        </div>

        <p class="text-slate-600 text-xs mt-2">
          Projet réalisé par Noélie Talhouarn dans le cadre d’un exercice pédagogique au département MMI de Montbéliard
          <br>
          © {{ currentYear }} L'Étincelle. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
/* Animation des sections */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out backwards;
}

/* Liens du footer */
.footer-link {
  @apply text-gray-400 text-sm transition-all duration-300;
  @apply hover:text-white hover:translate-x-1;
  display: inline-block;
}

.link-underline {
  @apply absolute bottom-0 left-0 w-0 h-0.5;
  @apply bg-gradient-to-r from-spark-light to-spark-pink;
  @apply transition-all duration-300;
}

.footer-link:hover .link-underline {
  @apply w-full;
}

/* Liens sociaux */
.social-link {
  @apply w-10 h-10 rounded-full flex items-center justify-center;
  @apply bg-white/5 text-gray-400 border border-white/10;
  @apply transition-all duration-300;
  @apply hover:bg-gradient-to-br hover:from-spark-light/20 hover:to-spark-pink/20;
  @apply hover:text-white hover:border-spark-light/30;
  @apply hover:-translate-y-1 hover:shadow-lg hover:shadow-spark/20;
}


/* Liens légaux */
.legal-link {
  @apply text-gray-500 transition-colors duration-300;
  @apply hover:text-gray-300;
}

/* Responsive - Espace pour le menu mobile */
@media (max-width: 768px) {
  footer {
    /* Augmentation du padding pour éviter que le contenu soit caché par la toolbar */
    padding-bottom: 140px;
  }
  
  .footer-section {
    @apply text-center;
  }
  
  .footer-section ul {
    @apply flex flex-col items-center;
  }
  
  .social-link {
    @apply mx-auto;
  }
}
</style>
