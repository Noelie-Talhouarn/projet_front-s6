export const useAuth = () => {
    // useState permet de partager l'état 'user' entre tous les composants
    const user = useState<User | null>('user', () => null)
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase as string

    // Fonction pour charger l'utilisateur
    const fetchUser = async () => {
        const token = useCookie('auth_token')

        // Si on a déjà l'utilisateur, pas besoin de refetch (optionnel)
        if (user.value) return

        if (!token.value) {
            user.value = null
            return
        }

        try {
            const response = await $fetch<User>('/api/users/profile', {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })
            user.value = response
        } catch (error) {
            console.error('Erreur chargement user:', error)
            user.value = null
        }
    }

    // Fonction de déconnexion
    const logout = () => {
        const token = useCookie('auth_token')
        token.value = null
        user.value = null // Reset de l'état global
        navigateTo('/login')
    }

    return {
        user,
        fetchUser,
        logout
    }
}
