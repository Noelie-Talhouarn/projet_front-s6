Voici une version mise à jour de ton fichier gemini.md, intégrant toutes les évolutions récentes de ton projet L'Étincelle : le passage à MongoDB Atlas, l'architecture Nuxt 3 / Express, et l'implémentation de l'authentification par JWT/Cookies.

Contexte Général
Ce fichier permet à Gemini de comprendre l'état actuel et les objectifs du projet "L'Étincelle", une plateforme de bien-être numérique.

L'utilisateur est en plein développement d'une architecture Fullstack JavaScript et souhaite un accompagnement pédagogique, calme et structuré pour transformer ses idées poétiques en fonctionnalités techniques robustes.

====== 01. Aperçu du Projet ======
Nom du Projet : L'Étincelle

Développeur : (Utilisateur)

Objectif : Créer un sanctuaire numérique proposant des rituels quotidiens (citations, respiration) et des mini-jeux sensoriels pour réenchanter le quotidien.

Technologies Utilisées :

Frontend : Nuxt 3 (Vue.js) avec Tailwind CSS pour un design moderne et épuré.

Backend : Node.js avec Express (Architecture MVC : Routes, Contrôleurs, Modèles).

Base de Données : MongoDB Atlas (NoSQL) pour la flexibilité des documents.

Authentification : JSON Web Token (JWT) côté serveur et Cookies (useCookie) côté Nuxt.

====== 02. Fonctionnalités Implémentées ======
🔐 Authentification & Profil
Inscription/Connexion : Flux complet avec hachage des mots de passe (Bcrypt) et génération de token.

Gestion de Session : Cookies configurés pour une durée de 7 jours, alignés sur l'expiration du JWT.

Dashboard : Espace personnel sécurisé affichant les données de l'utilisateur (récupérées via /api/users/me).

🕯️ Rituels & Mini-Jeux
Citation du Jour : Système hybride récupérant une citation via l'API ZenQuotes, puis la stockant dans MongoDB pour éviter les appels inutiles et créer un historique.

Barre de Respiration : Outil de cohérence cardiaque intégré au frontend.

Catalogue de Jeux : Collection MongoDB games prête, contenant des titres comme "L'Alchimiste des Couleurs" ou "Le Coloriage Organique".

📸 Le Journal (Sparks)
Modèle de données prêt pour stocker des "Étincelles" (photos, notes d'intention, couleurs extraites) liées à l'ID de l'utilisateur.

====== 03. Architecture & Conventions ======
Style CSS : Utilisation intensive de Tailwind CSS pour le Dashboard et les composants UI.

Git : Workflow basé sur des commits descriptifs (feat, fix, correction) avec une branche principale main synchronisée sur GitHub.

Base de Données : La base par défaut test a été migrée vers une base nommée etincelle pour plus de clarté.

====== 04. Comportement Attendu de Gemini ======
Gemini doit :

Expliquer les concepts techniques (ex: pourquoi utiliser un cookie plutôt que le localStorage).

Proposer du code commenté en français et structuré selon les standards ES Modules (import/export).

Aider au débogage, notamment sur les problèmes de synchronisation Git ou de connexion à la base de données.

Maintenir la vision "bien-être" du projet dans ses suggestions d'UI/UX.