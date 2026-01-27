// Pour que ces types soient vus comme globaux dans un module :
export { }

declare global {
    type Meditation = {
        id: number | string
        title: string
        description: string
        audioUrl: string
        imageUrl?: string
        category: 'guide' | 'musique' | 'nature' | 'sommeil'
        duration: string
    }

    type Star = {
        id: number
        x: number
        y: number
        message: string
        intensity: 'small' | 'medium' | 'large'
        date: string
        animationDelay: string
    }

    type User = {
        id?: string | number
        prenom: string
        nom: string
        email: string
        avatar?: string
        emotion?: string // 'anxious' | 'tired' | 'calm' | 'joyful'
        date_inscription?: string
    }

    type Badge = {
        id: number | string
        name: string
        description: string
        category: 'stars' | 'meditation' | 'coherence'
        condition_value: number
        image_url?: string
        progress?: number
        remaining?: number
    }

    type UserStats = {
        stars_count: number
        breathing_sessions: number
        total_breathing_time: number
        total_coherence_time: number
        total_meditation_time: number
        games_played: number
        days_active: number
        sparks_count: number

        weekly_stars_count: number
        weekly_breathing_sessions_count: number
        weekly_games_played_count: number
        weekly_meditation_time: number
        weekly_coherence_time: number
        weekly_breathing_time: number

        badges?: {
            total: number
            totalPossible: number
            unlocked: Badge[]
            locked: Badge[]
            next: {
                stars?: Badge
                meditation?: Badge
                coherence?: Badge
            }
        }
    }
}
