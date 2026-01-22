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
}
