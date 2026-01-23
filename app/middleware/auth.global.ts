export default defineNuxtRouteMiddleware((to, from) => {
    // 1. Récupérer le token d'authentification
    const token = useCookie('auth_token')

    // 2. Liste des pages accessibles à tout le monde (Public)
    const publicPages = ['/', '/login', '/register']

    // Normalisation du chemin (pour éviter les soucis avec les slashs finaux)
    const path = to.path

    // CAS 1 : L'utilisateur N'EST PAS connecté
    if (!token.value) {
        // S'il essaie d'aller sur une page protégée (qui n'est pas dans la liste publique)
        if (!publicPages.includes(path)) {
            // On le renvoie sur la Landing Page (ou Login)
            return navigateTo('/login')
        }
    }

    // CAS 2 : L'utilisateur EST connecté
    else {
        // S'il essaie d'aller sur la Landing, Login ou Register alors qu'il est déjà connecté
        if (publicPages.includes(path)) {
            // On le redirige vers son tableau de bord
            return navigateTo('/home')
        }
    }
})
