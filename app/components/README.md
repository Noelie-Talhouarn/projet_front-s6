# 📱 Composants Mobile Header & Footer - Documentation

## ✨ Vue d'ensemble

Votre projet contient maintenant deux composants modernes utilisant **Tailwind CSS** :
- **MobileHeader** : Navigation mobile en bas de page (style app native)
- **SimpleFooter** : Footer élégant et responsive

---

## 🎨 Technologies utilisées

- **Nuxt 3** - Framework Vue.js
- **Tailwind CSS** - Framework CSS utility-first
- **@nuxt/icon** - Icônes Material Design
- **TypeScript** - Typage statique

---

## 📱 MobileHeader

### Design

Le composant reproduit exactement le style de navigation mobile moderne que vous avez fourni :

- ✅ Fond blanc avec coins arrondis en haut
- ✅ 5 boutons de navigation : Home, Wishlist, Search, Notification, More
- ✅ Bouton Search central surélevé avec dégradé violet/rose
- ✅ Icônes qui changent entre outline/filled selon l'état actif
- ✅ Labels sous chaque icône
- ✅ Support des encoches (safe-area)

### Utilisation

```vue
<template>
  <MobileHeader @navigate="handleNavigation" />
</template>

<script setup>
const handleNavigation = (tabId) => {
  console.log('Navigation:', tabId)
  // Ajoutez votre logique ici
}
</script>
```

### Événements

- `@navigate` : Émis lors du clic sur un onglet, retourne l'ID ('home', 'wishlist', 'search', 'notification', 'menu')

### Personnalisation des icônes

Modifiez les icônes dans `MobileHeader.vue` :

```vue
<!-- Exemple pour Home -->
<Icon 
  :name="activeTab === 'home' ? 'mdi:home' : 'mdi:home-outline'" 
  class="nav-icon"
/>
```

Icônes disponibles sur [Iconify - Material Design Icons](https://icon-sets.iconify.design/mdi/)

---

## 🦶 SimpleFooter

### Design

Footer moderne avec :
- Sections : Marque, Navigation, Réseaux sociaux
- Dégradé de fond sombre
- Animations d'entrée progressives
- Liens avec effets hover élégants
- Responsive (mobile/desktop)

### Utilisation

```vue
<template>
  <SimpleFooter />
</template>
```

### Personnalisation

#### Modifier le nom de marque

```vue
<h3 class="...">Votre Marque</h3>
<p class="...">Votre slogan</p>
```

#### Ajouter des liens

```vue
<li>
  <a href="/votre-page" class="footer-link group">
    <span class="relative">
      Votre Lien
      <span class="link-underline"></span>
    </span>
  </a>
</li>
```

---

## 🎨 Palette de couleurs Tailwind

Votre projet utilise une palette personnalisée définie dans `tailwind.config.js` :

### Couleurs principales

```javascript
primary: {
  400: '#a78bfa',  // Violet clair
  500: '#8b5cf6',  // Violet
  600: '#7c3aed',  // Violet foncé
}
```

### Utilisation dans le code

```html
<!-- Classe Tailwind -->
<div class="bg-primary-400 text-white">...</div>

<!-- Dégradé -->
<div class="bg-gradient-to-r from-primary-400 to-pink-500">...</div>
```

---

## 🛠️ Classes utilitaires personnalisées

Le fichier `assets/css/main.css` contient des classes réutilisables :

### Boutons

```html
<!-- Bouton primaire avec dégradé -->
<button class="btn-primary">Cliquez-moi</button>

<!-- Bouton secondaire glassmorphism -->
<button class="btn-secondary">Secondaire</button>
```

### Cartes

```html
<!-- Carte avec effet de verre -->
<div class="glass-card p-6">
  Contenu de la carte
</div>
```

### Inputs

```html
<!-- Input stylisé -->
<input type="text" class="input-field" placeholder="Votre texte">
```

### Effets de texte

```html
<!-- Dégradé de texte -->
<h1 class="text-gradient">Titre avec dégradé</h1>

<!-- Effet de lueur -->
<div class="glow-primary">Élément avec lueur</div>
```

### Animations

```html
<!-- Animation de flottement -->
<div class="animate-float">Flotte doucement</div>
```

---

## 📱 Responsive Design

### Points de rupture Tailwind

- `sm:` - 640px et plus
- `md:` - 768px et plus
- `lg:` - 1024px et plus
- `xl:` - 1280px et plus

### Exemple

```html
<!-- Caché sur mobile, visible sur desktop -->
<div class="hidden md:block">Desktop seulement</div>

<!-- Visible sur mobile, caché sur desktop -->
<div class="block md:hidden">Mobile seulement</div>
```

### MobileHeader

- **Mobile** : Visible et fixé en bas
- **Desktop** (≥768px) : Automatiquement caché via `md:hidden`

---

## 🚀 Intégration dans votre app

### Structure actuelle

```
app/
  app.vue          # Page principale avec les composants
components/
  MobileHeader.vue # Navigation mobile
  SimpleFooter.vue # Footer
assets/
  css/
    main.css       # Styles globaux + Tailwind
```

### Créer un layout global

Pour utiliser les composants sur toutes vos pages :

```vue
<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <slot />
    <SimpleFooter />
    <MobileHeader @navigate="handleNav" />
  </div>
</template>

<script setup>
const router = useRouter()

const handleNav = (tabId) => {
  router.push(`/${tabId}`)
}
</script>
```

Puis dans vos pages :

```vue
<!-- pages/index.vue -->
<template>
  <NuxtLayout>
    <div class="p-6">
      Votre contenu ici
    </div>
  </NuxtLayout>
</template>
```

---

## 💡 Conseils et bonnes pratiques

### 1. Espacement pour le menu mobile

Ajoutez toujours un padding-bottom à votre contenu principal :

```html
<main class="pb-24 md:pb-8">
  <!-- pb-24 sur mobile, pb-8 sur desktop -->
</main>
```

### 2. Utiliser les classes Tailwind

Au lieu de CSS personnalisé, privilégiez Tailwind :

```html
<!-- ❌ Éviter -->
<div style="background: red; padding: 20px;">

<!-- ✅ Préférer -->
<div class="bg-red-500 p-5">
```

### 3. Composition de classes

Utilisez `@apply` dans vos styles pour réutiliser des classes :

```css
.mon-composant {
  @apply bg-white/10 backdrop-blur-md rounded-xl p-6;
  @apply hover:bg-white/20 transition-all;
}
```

### 4. Dark mode (optionnel)

Tailwind supporte le dark mode nativement :

```html
<div class="bg-white dark:bg-gray-900">
  Contenu qui s'adapte
</div>
```

---

## 🎯 Prochaines étapes

1. **Routing** : Connecter la navigation à vos pages Nuxt
2. **Authentification** : Afficher/masquer des éléments selon l'utilisateur
3. **Notifications** : Ajouter des badges sur l'icône Notification
4. **Animations** : Ajouter plus de micro-interactions
5. **Thème** : Créer un système de thème clair/sombre

---

## 📚 Ressources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Nuxt Icon](https://nuxt.com/modules/icon)
- [Material Design Icons](https://icon-sets.iconify.design/mdi/)
- [Nuxt 3 Documentation](https://nuxt.com/docs)

---

## 🐛 Dépannage

### Les styles Tailwind ne s'appliquent pas

1. Vérifiez que le serveur dev est redémarré
2. Vérifiez `nuxt.config.ts` contient `@nuxtjs/tailwindcss`
3. Vérifiez que `main.css` est importé

### Les icônes ne s'affichent pas

1. Vérifiez que `@nuxt/icon` est installé
2. Utilisez le bon format : `mdi:nom-icone`
3. Consultez [Iconify](https://icon-sets.iconify.design/)

### Le menu mobile ne s'affiche pas

1. Vérifiez la classe `md:hidden` sur le header
2. Testez en mode responsive dans le navigateur
3. Vérifiez qu'il n'y a pas de `z-index` qui le cache
