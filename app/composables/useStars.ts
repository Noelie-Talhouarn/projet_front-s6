export const useStars = () => {
    const token = useCookie('recipe_token')
    // On pointe vers votre backend sur le port 3002
    const apiBase = 'http://localhost:3002'

    // Récupérer les étoiles
    const fetchStars = async (): Promise<Star[]> => {
        try {
            const data = await $fetch<Star[]>(`${apiBase}/api/stars`, {
                headers: { Authorization: `Bearer ${token.value}` }
            })
            return data || []
        } catch (e) {
            console.error('Erreur chargement étoiles (API hors ligne ?)', e)
            return []
        }
    }

    // Ajouter une étoile
    const addStarApi = async (star: Omit<Star, 'id'>) => {
        try {
            const newStar = await $fetch<Star>(`${apiBase}/api/stars`, {
                method: 'POST',
                body: star,
                headers: { Authorization: `Bearer ${token.value}` }
            })
            return newStar
        } catch (e) {
            console.error('Erreur sauvegarde étoile', e)
            throw e
        }
    }

    // Supprimer une étoile
    const removeStarApi = async (id: number) => {
        try {
            await $fetch(`${apiBase}/api/stars/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token.value}` }
            })
            return true
        } catch (e) {
            console.error('Erreur suppression étoile', e)
            return false
        }
    }

    // Récupérer les mots du nuage (nouveau)
    const fetchCloudWords = async () => {
        try {
            const words = await $fetch<string[]>(`${apiBase}/api/cloud-words`, {
                // Pas forcément besoin d'auth pour lire des mots génériques, mais on laisse au cas où
                headers: { Authorization: `Bearer ${token.value}` }
            })
            return words
        } catch (e) {
            console.warn('Impossible de charger les mots, utilisation par défaut')
            return null // On retournera null pour utiliser le fallback
        }
    }

    return {
        fetchStars,
        addStarApi,
        removeStarApi,
        fetchCloudWords
    }
}
