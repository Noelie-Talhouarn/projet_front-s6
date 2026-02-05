<script setup lang="ts">
import { useSeoMeta } from 'nuxt/app'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: "Mentions Légales - L'Étincelle",
  description: "Mentions légales et informations juridiques de L'Étincelle.",
  ogTitle: "Mentions Légales - L'Étincelle",
})
</script>

<template>
    <main class="min-h-screen bg-night-900 text-white">
        <div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <!-- Header -->
            <header class="mb-12 text-center animate-fade-in-up">
                <i class="fi fi-rr-scale text-4xl text-indigo-400 mb-4 inline-block"></i>
                <h1 class="text-3xl md:text-4xl font-zen text-white mb-2">
                    Mentions Légales
                </h1>
                <p class="mt-2 text-sm text-white">
                    Dernière mise à jour : <span class="font-medium text-indigo-300">28 janvier 2026</span>
                </p>
            </header>

            <!-- Content card -->
            <section class="bg-night-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-xl sm:p-10 space-y-12 animate-fade-in-up" style="animation-delay: 0.1s;">
                <!-- Identité -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                         <span class="text-indigo-400 text-sm font-mono">01.</span> Identification
                    </h2>
                    <dl class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div class="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <dt class="text-xs uppercase tracking-wider text-indigo-400 bg-indigo-500/10 inline-block px-2 py-1 rounded mb-2">Éditeur</dt>
                            <dd class="text-sm font-medium text-white">Noélie Talhouarn</dd>
                            <dd class="text-xs text-white mt-1">Étudiante MMI</dd>
                        </div>
                        <div class="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <dt class="text-xs uppercase tracking-wider text-indigo-400 bg-indigo-500/10 inline-block px-2 py-1 rounded mb-2">Statut</dt>
                            <dd class="text-sm font-medium text-white">Projet Étudiant</dd>
                            <dd class="text-xs text-white mt-1">Département MMI Montbéliard</dd>
                        </div>
                        <div class="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <dt class="text-xs uppercase tracking-wider text-indigo-400 bg-indigo-500/10 inline-block px-2 py-1 rounded mb-2">Adresse</dt>
                            <dd class="text-sm font-medium text-white">
                                4 Pl. Lucien Tharradin<br>25200 Montbéliard
                            </dd>
                        </div>
                        <div class="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <dt class="text-xs uppercase tracking-wider text-indigo-400 bg-indigo-500/10 inline-block px-2 py-1 rounded mb-2">Contact</dt>
                            <dd class="mt-1 text-sm">
                                <a class="text-indigo-300 hover:text-white transition-colors underline decoration-indigo-500/30 underline-offset-4"
                                    href="mailto:noelie.talhouarn@edu.univ-fcomte.fr">
                                    noelie.talhouarn@edu.univ-fcomte.fr
                                </a>
                            </dd>
                        </div>
                    </dl>
                </section>

                <!-- Hébergeur -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">02.</span> Hébergement
                    </h2>
                    <div class="mt-4 text-sm leading-relaxed text-white">
                        <p>
                            L'application et l'API sont hébergées par <span class="text-white font-medium">Vercel Inc.</span>, <span class="text-white font-medium">Render</span> et <span class="text-white font-medium">Infomaniak</span>.
                        </p>
                        <ul class="mt-4 list-disc pl-4 space-y-2">
                            <li><strong class="text-white">Vercel Inc.</strong> : 340 S Lemon Ave #4133 Walnut, CA 91789, USA.</li>
                            <li><strong class="text-white">Render</strong> : San Francisco, California, USA.</li>
                            <li><strong class="text-white">Infomaniak Network SA</strong> : Rue Eugène-Marziano 25, 1227 Genève, Suisse.</li>
                        </ul>
                    </div>
                </section>

                <!-- Objet du site -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">03.</span> Objet du site
                    </h2>
                    <p class="mt-4 text-sm leading-relaxed text-white">
                        L'Étincelle est une application web dédiée au bien-être numérique. Elle propose des outils de relaxation (cohérence cardiaque, méditation) et des activités créatives (coloriage, écriture) dans un cadre apaisant et non-compétitif.
                    </p>
                </section>

                <!-- Propriété intellectuelle -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                         <span class="text-indigo-400 text-sm font-mono">04.</span> Propriété Intellectuelle
                    </h2>

                    <div class="mt-4 space-y-3 text-sm leading-relaxed text-white">
                        <p>
                            L’ensemble du contenu du site (structure, design, code, logo) est la propriété exclusive de l'autrice, sauf mention contraire (icônes Flaticon, ressources libres de droit).
                        </p>
                        <p class="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 text-indigo-200">
                            <i class="fi fi-rr-info mr-2 inline-block translate-y-0.5"></i>
                            Toute reproduction totale ou partielle de ce site, sans l'accord exprès de l'autrice, est interdite et constituerait une contrefaçon sanctionnée par le Code de la Propriété Intellectuelle.
                        </p>
                    </div>
                </section>

                <!-- Protection des données -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">05.</span> Données Personnelles
                    </h2>
                    <div class="mt-4 space-y-3 text-sm leading-relaxed text-white">
                        <p>
                            Conformément au RGPD, nous minimisons la collecte de données.
                        </p>
                        <ul class="list-disc pl-4 space-y-2 mt-2">
                            <li><span class="text-white">Données collectées :</span> Email, Pseudo, mot de passe (haché), données de progression.</li>
                            <li><span class="text-white">Finalité :</span> Gestion du compte utilisateur et sauvegarde de la progression personnelle.</li>
                            <li><span class="text-white">Durée de conservation :</span> Jusqu'à suppression du compte par l'utilisateur.</li>
                        </ul>
                        <p class="mt-2">
                            Aucune donnée n'est partagée avec des tiers publicitaires.
                        </p>
                    </div>
                </section>

                <!-- Footer -->
                <footer class="border-t border-white/10 pt-6 text-center">
                    <p class="text-xs text-white">
                        © {{ new Date().getFullYear() }} L'Étincelle — Mentions légales.
                    </p>
                </footer>
            </section>
        </div>
    </main>
</template>
