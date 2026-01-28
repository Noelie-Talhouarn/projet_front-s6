export const useMeditations = () => {
    const token = useCookie('auth_token')
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase as string

    // Données de secours (MP3 libres de droits pour tester)
    // Sources: Pixabay, mélodies libres.
    const FALLBACK_MEDITATIONS: Meditation[] = [
        {
            id: 'demo1',
            title: 'Pluie Apaisante',
            description: 'Le son de la pluie pour s\'endormir.',
            // Lien de test fiable (bruit blanc/nature)
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            category: 'sommeil',
            duration: '06:12',
            imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1000&auto=format&fit=crop'
        },
        {
            id: 'demo2',
            title: 'Piano Doux',
            description: 'Une mélodie pour le calme intérieur.',
            // Lien de test fiable
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
            category: 'musique',
            duration: '04:30',
            imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1000&auto=format&fit=crop'
        },
        {
            id: 'demo3',
            title: 'Forêt Mystique',
            description: 'Chant des oiseaux au petit matin.',
            // Lien de test fiable
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            category: 'nature',
            duration: '05:45',
            imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop'
        }
    ]

    const fetchMeditations = async (): Promise<Meditation[]> => {
        try {
            // Requête API
            const response = await $fetch<any[]>(`${apiBase}/api/meditations`, {
                headers: { Authorization: `Bearer ${token.value}` },
                ignoreResponseError: true
            }).catch(() => null)

            // Validation et Mapping des données
            if (response && Array.isArray(response) && response.length > 0) {
                return response.map((item: any) => ({
                    id: item.id || item._id, // Support Mongo (_id) et SQL (id)
                    title: item.title,
                    description: item.description,
                    // Traduction auto des champs (Backend -> Frontend)
                    audioUrl: item.audioUrl || item.audio_url || item.file_url,
                    imageUrl: item.imageUrl || item.image_url || item.cover,
                    category: item.category || 'musique',
                    duration: item.duration || '05:00'
                }))
            }

            // Fallback si l'API renvoie vide
            return FALLBACK_MEDITATIONS
        } catch (e) {
            console.warn('Utilisation du mode démo (API absente ou erreur mapping)')
            return FALLBACK_MEDITATIONS
        }
    }

    const fetchCategories = async (): Promise<{ id: string, label: string }[]> => {
        try {
            const response = await $fetch<any[]>(`${apiBase}/api/meditations/categories`, {
                headers: { Authorization: `Bearer ${token.value}` },
                ignoreResponseError: true
            }).catch(() => null)

            if (response && Array.isArray(response) && response.length > 0) {
                // Add 'all' option if not present
                const cats = response.map((item: any) => ({
                    id: item.id || item.slug || item.code,
                    label: item.label || item.name || item.title
                }))

                // Ensure "Tout" is first
                return [{ id: 'all', label: 'Tout' }, ...cats]
            }

            // Fallback
            return [
                { id: 'all', label: 'Tout' },
                { id: 'sommeil', label: 'Sommeil' },
                { id: 'nature', label: 'Nature' },
                { id: 'musique', label: 'Musique' },
            ]
        } catch (e) {
            return [
                { id: 'all', label: 'Tout' },
                { id: 'sommeil', label: 'Sommeil' },
                { id: 'nature', label: 'Nature' },
                { id: 'musique', label: 'Musique' },
            ]
        }
    }

    return {
        fetchMeditations,
        fetchCategories
    }
}
