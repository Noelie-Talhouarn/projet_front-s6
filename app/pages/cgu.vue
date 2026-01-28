<script setup lang="ts">
import { useSeoMeta } from 'nuxt/app'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: "Conditions Générales d'Utilisation - L'Étincelle",
  description: "Conditions générales d'utilisation de L'Étincelle, votre sanctuaire numérique.",
  ogTitle: "CGU - L'Étincelle",
})
</script>

<template>
    <main class="min-h-screen bg-night-900 text-slate-300">
        <div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <!-- Header -->
            <header class="mb-12 text-center animate-fade-in-up">
                <i class="fi fi-rr-document-signed text-4xl text-indigo-400 mb-4 inline-block"></i>
                <h1 class="text-3xl md:text-4xl font-zen text-white mb-2">
                    Conditions Générales d’Utilisation
                </h1>
                <p class="mt-2 text-sm text-slate-400">
                    Dernière mise à jour : <span class="font-medium text-indigo-300">28 janvier 2026</span>
                </p>
            </header>

            <!-- Content -->
            <section class="bg-night-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-xl sm:p-10 space-y-12 animate-fade-in-up" style="animation-delay: 0.1s;">
                <!-- 1 -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">01.</span> Informations légales
                    </h2>

                    <div class="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
                        <div>
                            <p class="mt-2">
                                Le site <span class="font-medium text-white">L'Étincelle</span>,
                                accessible via l'application, est un projet étudiant à but non lucratif réalisé par <span class="font-medium text-white">Noélie Talhouarn</span> dans le cadre d'un exercice pédagogique au département MMI de Montbéliard.
                            </p>
                            <p class="mt-2">
                                Pour toute question, vous pouvez nous contacter par e-mail à :
                                <a href="mailto:noelie.talhouarn@edu.univ-fcomte.fr"
                                    class="text-indigo-300 hover:text-white underline decoration-indigo-500/30 underline-offset-4 transition-colors">
                                    noelie.talhouarn@edu.univ-fcomte.fr
                                </a>
                            </p>
                        </div>

                        <div>
                            <h3 class="font-semibold text-white mt-4 mb-2">Champ d’application</h3>
                            <p>
                                Les présentes Conditions Générales d’Utilisation (ci-après « les Conditions »)
                                définissent les modalités d’accès et d’utilisation du Site par tout utilisateur.
                            </p>
                            <p class="mt-2 font-medium bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20 text-indigo-200">
                                En accédant au Site ou en créant un compte, vous acceptez sans réserve ces Conditions.
                                Si vous ne les acceptez pas, veuillez ne pas utiliser le Site.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 2 -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                         <span class="text-indigo-400 text-sm font-mono">02.</span> Accès et services
                    </h2>

                    <div class="mt-4 space-y-6 text-sm leading-relaxed text-slate-300">
                        <div>
                            <h3 class="font-semibold text-white mb-2">Création de compte</h3>
                            <p>
                                Pour accéder à votre espace personnel (sauvegarde de la progression, statistiques, journal),
                                l’utilisateur doit créer un compte. Les informations demandées se limitent au strict nécessaire pour le fonctionnement du service.
                            </p>
                        </div>

                        <div>
                            <h3 class="font-semibold text-white mb-2">Fonctionnalités</h3>
                            <ul class="space-y-2 pl-2">
                                <li class="flex items-start gap-2">
                                    <i class="fi fi-rr-check text-indigo-400 mt-1"></i>
                                    <span>Suivi de votre bien-être (méditation, respiration)</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <i class="fi fi-rr-check text-indigo-400 mt-1"></i>
                                    <span>Participation au "Ciel Intérieur" (dépôt d'étoiles)</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <i class="fi fi-rr-check text-indigo-400 mt-1"></i>
                                    <span>Jeux de détente (Mandalas, Puzzle Zen)</span>
                                </li>
                            </ul>
                            <p class="mt-4 text-xs bg-slate-800 p-3 rounded text-slate-400">
                                L’accès au Site est gratuit et réservé à un usage personnel et non commercial.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 3 -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">03.</span> Espace personnel
                    </h2>
                    <p class="mt-4 text-sm text-slate-300">
                        L'Étincelle est un sanctuaire entièrement privé. Le "Ciel Intérieur" et vos autres données ne sont visibles que par vous. Aucune information n'est partagée avec d'autres utilisateurs.
                    </p>
                    <ul class="mt-4 space-y-3 pl-2 text-sm text-slate-300">
                        <li class="flex items-start gap-2 text-indigo-300/80">
                            <i class="fi fi-rr-lock mt-1"></i>
                            Vos étoiles et pensées restent strictement confidentielles.
                        </li>
                    </ul>
                </section>

                <!-- 4 -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">04.</span> Données et Cookies
                    </h2>
                    <div class="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
                        <p>
                            Nous nous engageons à protéger vos données personnelles. Les données collectées (progression, préférences) ne sont utilisées que pour le fonctionnement de l'application et ne sont jamais revendues.
                        </p>
                        <p>
                            <strong class="text-white">Cookies :</strong> L'Étincelle utilise un cookie technique essentiel (`auth_token`) pour maintenir votre connexion. Aucune publicité ni traceur tiers n'est utilisé.
                        </p>
                        <p>
                            Vous disposez d'un droit d'accès, de modification et de suppression de vos données sur simple demande ou via votre page Profil.
                        </p>
                    </div>
                </section>

                <!-- 5 -->
                <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">05.</span> Propriété intellectuelle
                    </h2>
                    <p class="mt-4 text-sm leading-relaxed text-slate-300">
                        Tous les contenus du Site (design, code, logo) sont la propriété de l'autrice dans le cadre du projet étudiant. Les mandalas et créations générées par les utilisateurs leur appartiennent.
                    </p>
                </section>

                 <!-- 6 -->
                 <section>
                    <h2 class="text-xl font-semibold text-white flex items-center gap-3">
                        <span class="text-indigo-400 text-sm font-mono">06.</span> Responsabilité
                    </h2>
                    <p class="mt-4 text-sm leading-relaxed text-slate-300">
                        Le projet étant réalisé dans un cadre académique, L'Étincelle est fourni "tel quel". Nous ne pouvons garantir une accessibilité continue ni l’absence totale de bugs, bien que nous fassions de notre mieux pour offrir une expérience fluide.
                    </p>
                </section>

                <!-- Footer -->
                <footer class="border-t border-white/10 pt-6 text-center">
                    <p class="text-xs text-slate-500">
                        © {{ new Date().getFullYear() }} L'Étincelle — Fait avec <i class="fi fi-rr-heart text-indigo-400 text-[10px] inline-block mx-1"></i> par Noélie Talhouarn
                    </p>
                </footer>
            </section>
        </div>
    </main>
</template>
