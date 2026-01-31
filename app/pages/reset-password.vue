<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

useSeoMeta({
  title: 'Raviver la Flamme - L\'Étincelle',
  description: 'Choisissez un nouveau secret pour protéger votre sanctuaire intérieur.',
})

const route = useRoute()
const router = useRouter()

const token = computed(() => route.query.token as string)
const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const isError = ref(false)
const isLoading = ref(false)
const isSuccess = ref(false)

async function onSubmit() {
  if (!token.value) {
    isError.value = true
    message.value = 'Le souffle de réinitialisation est manquant.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    isError.value = true
    message.value = 'Les deux secrets ne se ressemblent pas... (Mots de passe différents)'
    return
  }

  if (newPassword.value.length < 6) {
    isError.value = true
    message.value = 'Votre nouveau secret doit être plus profond (minimum 6 caractères).'
    return
  }

  message.value = ''
  isError.value = false
  isLoading.value = true

  try {
    await $fetch('/api/users/reset-password', {
      method: 'POST',
      body: { 
        token: token.value,
        newPassword: newPassword.value 
      }
    })
    
    isSuccess.value = true
    message.value = 'Votre chemin est à nouveau éclairé. Redirection vers la connexion...'
    
    setTimeout(() => {
      router.push('/login')
    }, 3000)

  } catch (err: any) {
    isError.value = true
    message.value = err.data?.message || 'Le lien semble s’être éteint... Il est peut-être expiré. 🥀'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!token.value) {
    isError.value = true
    message.value = 'Cette clé est brisée ou absente. Demandez une nouvelle lueur.'
  }
})
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center p-6 overflow-hidden">
    <!-- Fond poétique avec lueurs animées -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[10%] right-[15%] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-[10%] left-[15%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-spark/5 blur-[150px]"></div>
    </div>

    <!-- Conteneur principal -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo ou icône symbolique -->
      <div class="mb-10 flex flex-col items-center animate-fade-in-down">
        <div class="relative mb-6">
          <div class="absolute inset-0 scale-150 bg-spark/20 blur-2xl rounded-full"></div>
          <div class="relative h-20 w-20 flex items-center justify-center rounded-3xl border border-white/10 bg-night-900/60 shadow-2xl backdrop-blur-3xl">
            <i class="fi fi-rr-key text-4xl text-spark-light animate-bounce" style="animation-duration: 3s"></i>
          </div>
        </div>
        <h1 class="font-zen text-3xl md:text-4xl text-white tracking-wide text-center">Nouveau Souffle</h1>
      </div>

      <!-- Carte Glassmorphism -->
      <div class="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-night-900/40 p-8 md:p-10 shadow-2xl backdrop-blur-2xl transition-all duration-700 hover:border-white/20">
        <div class="absolute -inset-1 bg-gradient-to-r from-spark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div class="relative z-10">
          <Transition name="fade-scale" mode="out-in">
            <!-- État Succès -->
            <div v-if="isSuccess" class="py-6 text-center">
              <div class="mb-6 flex justify-center">
                <div class="h-20 w-20 flex items-center justify-center rounded-full bg-spark/10 border border-spark/20 text-spark-light">
                  <i class="fi fi-sr-sparkles text-4xl"></i>
                </div>
              </div>
              <p class="text-xl text-white font-medium leading-relaxed mb-6">
                {{ message }}
              </p>
              <div class="flex justify-center flex-col items-center gap-4">
                <div class="h-1 w-48 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full bg-spark animate-progress origin-left"></div>
                </div>
                <p class="text-xs text-slate-500 uppercase tracking-widest font-bold">Retour imminent au sanctuaire</p>
              </div>
            </div>

            <!-- Formulaire de réinitialisation -->
            <div v-else>
              <div class="mb-10 text-center">
                <h2 class="text-2xl font-zen text-white mb-3">Raviver ma route</h2>
                <p class="text-slate-400 font-light px-4 leading-relaxed">
                  Scellez un nouveau secret pour retrouver votre chemin parmi les étoiles.
                </p>
              </div>

              <!-- Message d'erreur -->
              <div v-if="isError" class="mb-8 rounded-2xl border border-violet-400/20 bg-violet-400/5 p-4 text-center text-sm font-medium text-violet-300 backdrop-blur-sm animate-shake">
                <i class="fi fi-rr-circle-warning mr-2"></i>
                {{ message }}
              </div>

              <form v-if="token" class="space-y-6" @submit.prevent="onSubmit">
                <!-- Nouveau Mot de Passe -->
                <div class="space-y-3">
                  <label for="newPassword" class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Nouveau Secret</label>
                  <div class="relative group/input">
                    <input 
                      id="newPassword" 
                      v-model="newPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      required
                      class="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white placeholder:text-slate-600 focus:border-spark/40 focus:bg-white/10 focus:outline-none focus:ring-[6px] focus:ring-spark/5 transition-all duration-500"
                    />
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 transition-opacity group-focus-within/input:opacity-100">
                      <i class="fi fi-rr-lock text-spark-light"></i>
                    </div>
                  </div>
                </div>

                <!-- Confirmation -->
                <div class="space-y-3">
                  <label for="confirmPassword" class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Confirmer le Secret</label>
                  <div class="relative group/input">
                    <input 
                      id="confirmPassword" 
                      v-model="confirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      required
                      class="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white placeholder:text-slate-600 focus:border-spark/40 focus:bg-white/10 focus:outline-none focus:ring-[6px] focus:ring-spark/5 transition-all duration-500"
                    />
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 transition-opacity group-focus-within/input:opacity-100">
                      <i class="fi fi-rr-shield-check text-spark-light"></i>
                    </div>
                  </div>
                </div>

                <div class="pt-4">
                  <button 
                    type="submit" 
                    :disabled="isLoading"
                    class="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-medium text-white shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/30 active:scale-[0.98] disabled:opacity-50 group"
                  >
                    <div class="relative z-10 flex items-center justify-center gap-3">
                      <span v-if="!isLoading">Rallumer mon Étincelle</span>
                      <span v-else class="flex items-center gap-2">
                        <span class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Scellement en cours...
                      </span>
                      <i v-if="!isLoading" class="fi fi-rr-sparkles text-lg transition-transform group-hover:rotate-12"></i>
                    </div>
                    <!-- Effet de brillance -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></div>
                  </button>
                </div>
              </form>

              <!-- Cas où le token manque -->
              <div v-else class="text-center py-4">
                 <NuxtLink to="/forgot-password" class="inline-flex items-center gap-2 text-spark-light hover:text-white transition-colors duration-300">
                    <i class="fi fi-rr-refresh"></i>
                    <span>Demander une nouvelle lueur</span>
                 </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      
      <!-- Signature discrète -->
      <footer class="mt-12 text-center animate-fade-in" style="animation-delay: 1s;">
        <p class="text-[10px] uppercase tracking-[0.3em] text-slate-600">L'Étincelle • Sanctuaire de sérénité</p>
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

@keyframes progress {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
}
.animate-progress {
    animation: progress 3s linear forwards;
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
