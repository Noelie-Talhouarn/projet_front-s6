<script setup lang="ts">
defineProps<{
    to: string
    title: string
    desc: string
    icon: string
    color: string
    bg: string
    gradient: string
    isFeatured?: boolean // Pour la carte mise en avant (recommandée)
}>()
</script>

<template>
    <NuxtLink 
        :to="to" 
        class="group relative p-6 rounded-2xl bg-night-800/90 border-[1.5px] border-[#D946EF]/40 transition-all duration-300 overflow-hidden flex flex-col justify-center shadow-xl shadow-black/40 hover:bg-night-700/90 hover:border-[#D946EF]/60"
        :class="[
            bg,
            // Si mis en avant, on agrandit la carte
            isFeatured ? 'md:col-span-3 md:py-8 border-[#D946EF]/30 bg-white/[0.05]' : ''
        ]"
    >
        <div class="absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity" :class="gradient"></div>
        
        <div class="relative z-10 flex flex-row items-center text-left gap-6">
            <i :class="['fi text-4xl opacity-80 group-hover:scale-110 transition-transform duration-500 flex-shrink-0', icon, color, isFeatured ? 'text-5xl' : '']"></i>
            
            <div>
                <h3 class="text-xl font-medium font-zen tracking-wide text-white mb-2 flex items-center gap-2">
                    {{ title }}
                    <span v-if="isFeatured" class="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full font-sans tracking-normal font-normal">Recommandé pour vous</span>
                </h3>
                <p class="text-base text-white">{{ desc }}</p>
            </div>
            
            <!-- Bouton d'action visible uniquement sur la carte mise en avant -->
            <div v-if="isFeatured" class="ml-auto hidden md:block">
                <span class="px-4 py-2 bg-white text-black rounded-full text-xs font-medium uppercase tracking-widest hover:bg-slate-200 transition-colors">Commencer</span>
            </div>
        </div>
    </NuxtLink>
</template>
