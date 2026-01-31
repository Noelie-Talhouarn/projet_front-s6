<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

useSeoMeta({
  title: 'Rallumer mon Étincelle - L\'Étincelle',
  description: 'Retrouvez votre lueur de secours pour vous reconnecter à votre sanctuaire.',
})

const email = ref('')
const message = ref('')
const isError = ref(false)
const isLoading = ref(false)
const isSubmitted = ref(false)

async function onSubmit() {
  message.value = ''
  isError.value = false
  isLoading.value = true

  try {
    await $fetch('/api/users/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    
    isSubmitted.value = true
    message.value = 'Une lueur de secours a été envoyée vers votre boîte aux lettres ✨'
  } catch (err: any) {
    isError.value = true
    message.value = err.data?.message || 'Cette étoile ne semble pas figurer dans notre constellation... (Email introuvable)'
    console.error('Erreur de réinitialisation:', err.data)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center p-6 overflow-hidden">
    <!-- Fond poétique avec lueurs animées -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[10%] left-[15%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-[10%] right-[15%] h-[500px] w-[500px] rounded-full bg-spark/10 blur-[120px] animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-[150px]"></div>
    </div>

    <!-- Conteneur principal -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo ou icône symbolique -->
      <div class="mb-12 flex flex-col items-center animate-fade-in-down">
        <div class="relative mb-6">
          <div class="absolute inset-0 scale-150 bg-spark/20 blur-2xl rounded-full"></div>
          <div class="relative h-20 w-20 flex items-center justify-center rounded-3xl border border-white/10 bg-night-900/60 shadow-2xl backdrop-blur-3xl">
            <i class="fi fi-rr-leaf text-4xl text-spark-light animate-pulse"></i>
          </div>
        </div>
        <h1 class="font-zen text-3xl md:text-4xl text-white tracking-wide text-center">L'Étincelle</h1>
      </div>

      <!-- Carte Glassmorphism -->
      <div class="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-night-900/40 p-8 md:p-10 shadow-2xl backdrop-blur-2xl transition-all duration-700 hover:border-white/20">
        <div class="absolute -inset-1 bg-gradient-to-r from-spark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div class="relative z-10">
          <Transition name="fade-scale" mode="out-in">
            <!-- État Succès -->
            <div v-if="isSubmitted" class="py-6 text-center">
              <div class="mb-6 flex justify-center">
                <div class="h-20 w-20 flex items-center justify-center rounded-full bg-spark/10 border border-spark/20 text-spark-light">
                  <i class="fi fi-sr-check-circle text-4xl"></i>
                </div>
              </div>
              <p class="text-xl text-white font-medium leading-relaxed mb-8">
                {{ message }}
              </p>
              <NuxtLink 
                to="/login" 
                class="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
              >
                <i class="fi fi-rr-arrow-left text-sm transition-transform group-hover:-translate-x-1"></i>
                Retour au sanctuaire
              </NuxtLink>
            </div>

            <!-- Formulaire initial -->
            <div v-else>
              <div class="mb-10 text-center">
                <h2 class="text-2xl font-zen text-white mb-3">Retrouver ma voie</h2>
                <p class="text-slate-400 font-light px-4 leading-relaxed">
                  Confiez-nous votre e-mail pour que nous puissions raviver votre lueur.
                </p>
              </div>

              <!-- Message d'erreur poétique -->
              <div v-if="isError" class="mb-8 rounded-2xl border border-violet-400/20 bg-violet-400/5 p-4 text-center text-sm font-medium text-violet-300 backdrop-blur-sm animate-shake">
                <i class="fi fi-rr-cloud-warning mr-2"></i>
                {{ message }}
              </div>

              <form class="space-y-8" @submit.prevent="onSubmit">
                <div class="space-y-3">
                  <label for="email" class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Espace de connexion</label>
                  <div class="relative group/input">
                    <input 
                      id="email" 
                      v-model="email" 
                      type="email" 
                      placeholder="eclat@sanctuaire.com" 
                      required
                      class="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white placeholder:text-slate-600 focus:border-spark/40 focus:bg-white/10 focus:outline-none focus:ring-[6px] focus:ring-spark/5 transition-all duration-500"
                    />
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 transition-opacity group-focus-within/input:opacity-100">
                      <i class="fi fi-rr-envelope text-spark-light"></i>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  :disabled="isLoading"
                  class="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-medium text-white shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/30 active:scale-[0.98] disabled:opacity-50 group"
                >
                  <div class="relative z-10 flex items-center justify-center gap-3">
                    <span v-if="!isLoading">Rallumer mon Étincelle</span>
                    <span v-else class="flex items-center gap-2">
                      <span class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Invocation en cours...
                    </span>
                    <i v-if="!isLoading" class="fi fi-rr-magic-wand text-lg transition-transform group-hover:rotate-12"></i>
                  </div>
                  <!-- Effet de brillance -->
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></div>
                </button>
                
                <div class="flex justify-center pt-2">
                  <NuxtLink to="/login" class="flex items-center gap-2 text-sm text-slate-500 hover:text-spark-light transition-all duration-300">
                    <span>Je me souviens de ma route</span>
                  </NuxtLink>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </div>
      
      <!-- Signature discrète -->
      <footer class="mt-12 text-center animate-fade-in" style="animation-delay: 1s;">
        <p class="text-[10px] uppercase tracking-[0.3em] text-slate-600">L'Étincelle • Votre sanctuaire intérieur</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(-10px);
}

@keyframes shine {
  0% { transform: translateX(-150%) skewX(-20deg); }
  100% { transform: translateX(150%) skewX(-20deg); }
}
.group-hover\:animate-shine:hover {
  animation: shine 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}

@keyframes fade-in-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
}
</style>
