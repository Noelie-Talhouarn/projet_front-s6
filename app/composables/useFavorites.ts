type Quote = { citation: string; auteur: string; addedAt?: string }

export const useFavorites = () => {
    const favorites = useState<{ quotes: Quote[]; meditationIds: (string | number)[] }>('favorites_data', () => ({
        quotes: [],
        meditationIds: []
    }))

    const loading = useState<boolean>('favorites_loading', () => false)
    const hasFetched = useState<boolean>('favorites_has_fetched', () => false)

    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase as string

    const fetchFavorites = async (force = false) => {
        const token = useCookie('auth_token').value
        if (!token) return

        if (hasFetched.value && !force) return

        loading.value = true
        try {
            const data = await $fetch<any>(`${apiBase}/api/users/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data) {
                favorites.value = {
                    quotes: data.quotes || [],
                    meditationIds: data.meditationIds || []
                }
                hasFetched.value = true
            }
        } catch (e) {
            console.error('Erreur chargement favoris:', e)
        } finally {
            loading.value = false
        }
    }

    const toggleQuoteFavorite = async (citation: string, auteur: string) => {
        const token = useCookie('auth_token').value
        if (!token || loading.value) return

        const wasLiked = isQuoteFavorite(citation)

        if (wasLiked) {
            favorites.value.quotes = favorites.value.quotes.filter(q => q.citation !== citation)
        } else {
            favorites.value.quotes.push({ citation, auteur })
        }

        loading.value = true
        try {
            const res = await $fetch<any>(`${apiBase}/api/users/favorites`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: { type: 'quote', item: { citation, auteur } }
            })
            if (res?.favorites) {
                favorites.value.quotes = res.favorites.quotes
            }
        } catch (e) {
            fetchFavorites(true)
        } finally {
            loading.value = false
        }
    }

    const toggleMeditationFavorite = async (id: string | number) => {
        const token = useCookie('auth_token').value
        if (!token || loading.value) return

        const wasLiked = isMeditationFavorite(id)

        if (wasLiked) {
            favorites.value.meditationIds = favorites.value.meditationIds.filter(mId => String(mId) !== String(id))
        } else {
            favorites.value.meditationIds.push(id)
        }

        loading.value = true
        try {
            const res = await $fetch<any>(`${apiBase}/api/users/favorites`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: { type: 'meditation', item: id }
            })
            if (res?.favorites) {
                favorites.value.meditationIds = res.favorites.meditationIds
            }
        } catch (e) {
            fetchFavorites(true)
        } finally {
            loading.value = false
        }
    }

    const isQuoteFavorite = (citation: string) => favorites.value.quotes.some(q => q.citation === citation)
    const isMeditationFavorite = (id: string | number) => favorites.value.meditationIds.some(mId => String(mId) === String(id))

    return {
        favorites,
        loading,
        fetchFavorites,
        toggleQuoteFavorite,
        toggleMeditationFavorite,
        isQuoteFavorite,
        isMeditationFavorite
    }
}
