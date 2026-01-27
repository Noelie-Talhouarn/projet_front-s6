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
        class="group relative p-6 rounded-2xl bg-night-800 border border-white/5 transition-all overflow-hidden flex flex-col justify-center"
        :class="[
            bg,
            // Si mis en avant, on agrandit la carte
            isFeatured ? 'md:col-span-3 md:py-10 border-white/20 bg-white/[0.03]' : ''
        ]"
    >
        <div class="absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity" :class="gradient"></div>
        
        <div class="relative z-10 flex flex-row items-center text-left gap-6">
            <i :class="['fi text-4xl opacity-80 group-hover:scale-110 transition-transform duration-500 flex-shrink-0', icon, color, isFeatured ? 'text-5xl' : '']"></i>
            
            <div>
                <h3 class="text-xl font-bold font-zen tracking-wide text-white mb-2 flex items-center gap-2">
                    {{ title }}
                    <span v-if="isFeatured" class="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full font-sans tracking-normal font-normal">Recommandé pour vous</span>
                </h3>
                <p class="text-sm text-slate-400">{{ desc }}</p>
            </div>
            
            <!-- Bouton d'action visible uniquement sur la carte mise en avant -->
            <div v-if="isFeatured" class="ml-auto hidden md:block">
                <span class="px-4 py-2 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">Commencer</span>
            </div>
        </div>
    </NuxtLink>
</template>
