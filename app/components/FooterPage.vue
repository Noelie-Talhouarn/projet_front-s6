<template>
  <footer class="bg-gradient-to-br from-night-900 to-night-800 text-white border-t border-night-700">
    <div class="mx-auto px-6 py-3 lg:py-16">
      <!-- Contenu principal du footer -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-8">
        <!-- Section Marque -->
        <div class="footer-section animate-fade-in-up" style="animation-delay: 0.1s">
          <MyTitle as="h3" size="medium" class="mb-2">
            L'Étincelle
          </MyTitle>
          <p class="text-gray-400 text-sm italic">
            Illuminez votre créativité
          </p>
        </div>

      </div>

      <!-- Bas du footer -->
      <div class="pt-8 border-t border-night-700 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div class="flex items-center gap-3 text-sm">
          <a href="#" class="legal-link underline">Confidentialité</a>
          <span class="text-gray-600">•</span>
          <a href="#" class="legal-link underline">Conditions</a>
          <span class="text-gray-600">•</span>
          <NuxtLink to="/about" class="legal-link underline hover:text-white">À propos</NuxtLink>
          <span class="text-gray-600">•</span>
          <NuxtLink to="/contact" class="legal-link underline hover:text-white">Contact</NuxtLink>
        </div>
          <p class="text-gray-500 text-sm text-center">Projet réalisé par Noélie Talhouarn dans le cadre d’un exercice pédagogique au département MMi de Montbéliard</p>
          <p class="text-gray-500 text-sm">
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
