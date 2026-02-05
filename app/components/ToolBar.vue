<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:hidden">
    <div class="mx-auto flex max-w-md items-center justify-around rounded-[2rem] border border-white/10 bg-night-900/90 py-3 shadow-xl backdrop-blur-lg">
      
      <NuxtLink to="/home" class="flex flex-col items-center gap-1 transition-all active:scale-95 group">
        <div class="rounded-xl p-2 group-[.router-link-active]:bg-spark/20 group-[.router-link-active]:text-spark-light text-white transition-colors">
          <i class="fi fi-rr-home text-xl inline-block"></i>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-white group-[.router-link-active]:text-spark-light transition-colors">Home</span>
      </NuxtLink>

      <NuxtLink to="/meditation" class="flex flex-col items-center gap-1 transition-all active:scale-95 group">
        <div class="rounded-xl p-2 group-[.router-link-active]:bg-emerald-500/20 group-[.router-link-active]:text-emerald-400 text-white transition-colors">
          <i class="fi fi-rr-spa text-xl inline-block"></i>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-white group-[.router-link-active]:text-emerald-400 transition-colors">Zen</span>
      </NuxtLink>

      <NuxtLink to="/games" class="flex flex-col items-center gap-1 transition-all active:scale-95 group">
        <div class="rounded-xl p-2 group-[.router-link-active]:bg-spark/20 group-[.router-link-active]:text-spark-light text-white transition-colors">
          <i class="fi fi-rr-gamepad text-xl inline-block"></i>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-white group-[.router-link-active]:text-spark-light transition-colors">Jeux</span>
      </NuxtLink>

      <NuxtLink to="/ciel" class="flex flex-col items-center gap-1 transition-all active:scale-95 group">
        <div class="rounded-xl p-2 group-[.router-link-active]:bg-indigo-500/20 group-[.router-link-active]:text-indigo-300 text-white transition-colors">
          <i class="fi fi-rr-moon-stars text-xl inline-block"></i>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-white group-[.router-link-active]:text-indigo-300 transition-colors">Ciel</span>
      </NuxtLink>

      <NuxtLink to="/profil" class="flex flex-col items-center gap-1 transition-all active:scale-95 group">
        <div class="rounded-xl p-2 group-[.router-link-active]:bg-slate-700 group-[.router-link-active]:text-white text-white transition-colors">
          <i class="fi fi-rr-user text-xl inline-block"></i>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-white group-[.router-link-active]:text-white transition-colors">Profil</span>
      </NuxtLink>

    </div>
  </nav>
</template>