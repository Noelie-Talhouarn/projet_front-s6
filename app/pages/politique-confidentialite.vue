<script setup lang="ts">
import { useSeoMeta } from 'nuxt/app'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: "Politique de Confidentialité - L'Étincelle",
  description: "Politique de confidentialité et protection des données personnelles sur L'Étincelle.",
  ogTitle: "Politique de Confidentialité - L'Étincelle",
})
</script>

<template>
    <main class="min-h-screen bg-night-900 text-slate-300">
        <div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <!-- Header -->
            <header class="mb-12 text-center animate-fade-in-up">
                <i class="fi fi-rr-shield-check text-4xl text-indigo-400 mb-4 inline-block"></i>
                <h1 class="text-3xl md:text-4xl font-zen text-white mb-2">
                    Politique de confidentialité
                </h1>
                <p class="mt-2 text-sm text-slate-400">
                    Dernière mise à jour : <span class="font-medium text-indigo-300">28 janvier 2026</span>
                </p>
            </header>

            <!-- Content -->
            <section class="bg-night-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-xl sm:p-10 space-y-10 animate-fade-in-up" style="animation-delay: 0.1s;">
                <!-- Intro -->
                <section class="space-y-3 text-sm leading-relaxed text-slate-300">
                    <p>
                        Bienvenue sur <span class="font-medium text-white">L'Étincelle</span>. La protection de vos données personnelles est au cœur de notre démarche de bien-être numérique.
                    </p>
                    <p>
                        Cette politique de confidentialité vise à vous expliquer en toute transparence quelles données nous collectons, pourquoi, et comment elles sont protégées.
                    </p>
                    <p class="font-medium text-indigo-200">
                        En utilisant L'Étincelle, vous acceptez les pratiques décrites ci-dessous.
                    </p>
                </section>

                <!-- 1 -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">01.</span> Données collectées
                    </h2>

                    <div class="mt-4 space-y-6">
                        <div class="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <h3 class="font-semibold text-white mb-2 flex items-center gap-2">
                                <i class="fi fi-rr-edit text-indigo-400"></i> Données fournies par vous
                            </h3>
                            <ul class="list-disc space-y-2 pl-6 text-sm text-slate-300">
                                <li><strong>Compte :</strong> e-mail, pseudonyme, mot de passe (stocké de manière sécurisée).</li>
                                <li><strong>Activité :</strong> vos étoiles dans le Ciel Intérieur, votre progression dans les jeux, vos statistiques de méditation.</li>
                            </ul>
                        </div>

                        <div class="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <h3 class="font-semibold text-white mb-2 flex items-center gap-2">
                                <i class="fi fi-rr-laptop text-indigo-400"></i> Données techniques
                            </h3>
                            <ul class="list-disc space-y-2 pl-6 text-sm text-slate-300">
                                <li><strong>Cookies :</strong> Uniquement le cookie de session technique (`auth_token`) nécessaire à votre connexion.</li>
                                <li><strong>Logs :</strong> Informations techniques standard (adresse IP, navigateur) collectées par nos hébergeurs pour la sécurité du service.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <!-- 2 -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">02.</span> Utilisation des données
                    </h2>
                    <ul class="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
                        <li>Gérer votre compte et sécuriser votre accès.</li>
                        <li>Sauvegarder votre progression (niveaux débloqués, étoiles collectées).</li>
                        <li>Afficher vos statistiques personnelles sur votre profil.</li>
                        <li>Assurer le bon fonctionnement technique de l'application.</li>
                    </ul>
                    <p class="mt-4 text-xs font-medium text-indigo-300 bg-indigo-500/10 p-3 rounded border border-indigo-500/20">
                        <i class="fi fi-rr-ban mr-1 translate-y-0.5 inline-block"></i>
                        Aucune donnée n’est utilisée à des fins commerciales ou publicitaires.
                    </p>
                </section>

                <!-- 3 -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">03.</span> Partage des données
                    </h2>
                    <p class="mt-3 text-sm text-slate-300">
                        Vos données ne sont jamais vendues. Elles sont uniquement accessibles :
                    </p>
                    <ul class="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-300">
                        <li>
                            À l'administrateur technique du projet (pour la maintenance).
                        </li>
                        <li>
                            Aux prestataires d'hébergement (Vercel, Render, Infomaniak) dans le strict cadre de l'exécution technique du service.
                        </li>
                    </ul>
                </section>

                <!-- 4 -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                         <span class="text-indigo-400 text-sm font-mono">04.</span> Sécurité
                    </h2>
                    <p class="mt-3 text-sm leading-relaxed text-slate-300">
                        Nous utilisons des standards de sécurité modernes : HTTPS (connexion chiffrée), hachage des mots de passe (vos mots de passe sont illisibles pour nous), et bases de données sécurisées.
                    </p>
                </section>

                <!-- 5 -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">05.</span> Durée de conservation
                    </h2>
                    <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
                        <li>Vos données sont conservées tant que votre compte est actif.</li>
                        <li>
                            En cas de suppression de compte, vos données personnelles sont effacées de nos bases actives.
                        </li>
                    </ul>
                </section>

                <!-- 6 -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">06.</span> Vos droits
                    </h2>
                    <p class="mt-3 text-sm text-slate-300">
                        Conformément au RGPD, vous disposez des droits d'accès, de rectification, et de suppression de vos données.
                    </p>
                    <p class="mt-3 text-sm text-slate-300">
                        Pour exercer ces droits, envoyez simplement un e-mail à :
                        <a href="mailto:noelie.talhouarn@edu.univ-fcomte.fr"
                            class="text-indigo-300 hover:text-white transition-colors underline decoration-indigo-500/30 underline-offset-4">
                            noelie.talhouarn@edu.univ-fcomte.fr
                        </a>
                    </p>
                </section>

                <!-- Footer -->
                <footer class="border-t border-white/10 pt-6 text-center">
                    <p class="text-xs text-slate-500">
                        © {{ new Date().getFullYear() }} L'Étincelle — Politique de confidentialité
                    </p>
                </footer>
            </section>
        </div>
    </main>
</template>
