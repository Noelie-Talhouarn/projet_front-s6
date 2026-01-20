<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:hidden">
    <div class="mx-auto flex max-w-md items-center justify-around rounded-[2rem] border border-white/10 bg-night-900/90 py-3 shadow-xl backdrop-blur-lg">
      
      <NuxtLink to="/dashboard" class="flex flex-col items-center gap-1 transition-all active:scale-95 group">
        <div class="rounded-xl p-2 group-[.router-link-active]:bg-spark/20 group-[.router-link-active]:text-spark-light text-slate-500 transition-colors">
          <span class="text-xl">🏠</span>
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-[.router-link-active]:text-spark-light transition-colors">Home</span>
      </NuxtLink>

      <NuxtLink to="/games" class="flex flex-col items-center gap-1 transition-all active:scale-95 group">
        <div class="rounded-xl p-2 group-[.router-link-active]:bg-glow/20 group-[.router-link-active]:text-glow-light text-slate-500 transition-colors">
          <span class="text-xl">🎮</span>
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-[.router-link-active]:text-glow-light transition-colors">Jeux</span>
      </NuxtLink>

      <NuxtLink to="/sparks/new" class="relative -mt-12 flex flex-col items-center group">
        <div class="flex h-16 w-16 items-center justify-center rounded-full border-4 border-night-900 bg-gradient-spark text-2xl shadow-lg shadow-spark/40 transition-all group-hover:scale-110 group-active:scale-95 group-hover:shadow-spark/60">
          ✨
        </div>
        <span class="mt-1 text-[10px] font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-spark">Lueur</span>
      </NuxtLink>

      <NuxtLink to="/breathing" class="flex flex-col items-center gap-1 transition-all active:scale-95 group">
        <div class="rounded-xl p-2 group-[.router-link-active]:bg-spark-pink/20 group-[.router-link-active]:text-spark-pink text-slate-500 transition-colors">
          <span class="text-xl">🌬️</span>
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-[.router-link-active]:text-spark-pink transition-colors">Souffle</span>
      </NuxtLink>

      <NuxtLink to="/profile" class="flex flex-col items-center gap-1 transition-all active:scale-95 group">
        <div class="rounded-xl p-2 group-[.router-link-active]:bg-slate-700 group-[.router-link-active]:text-slate-200 text-slate-500 transition-colors">
          <span class="text-xl">👤</span>
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-[.router-link-active]:text-slate-300 transition-colors">Profil</span>
      </NuxtLink>

    </div>
  </nav>
</template>