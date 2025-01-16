# Modèle de plateforme d'apprentissage

## Description
Ce projet est une API backend pour une plateforme d'apprentissage en ligne. Il est développé avec **Node.js**, **Express**, **MongoDB** et **Redis**. Le projet intègre des mécanismes de mise en cache pour améliorer les performances.

---

## Installation et lancement du projet

### Prérequis
- **Node.js** (version 14 ou supérieure)
- **MongoDB**
- **Redis**

### Étapes d'installation
1. **Clonez le dépôt :**
   ```bash
   git clone https://github.com/4bdex/learning-platform-nosql.git
   cd learning-platform-nosql
   ```

2. **Installez les dépendances :**
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement :**
Créez un fichier `.env` à la racine du répertoire et ajoutez ce qui suit :

   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=learning_platform
   REDIS_URI=redis://localhost:6379
   PORT=3000

   REDIS_KEY_ALL_COURSES=all_courses
   REDIS_KEY_COURSE_PREFIX=course:
   REDIS_KEY_COURSE_STATS=course_stats

   REDIS_KEY_ALL_STUDENTS=student:all
   REDIS_KEY_STUDENT_PREFIX=student:
   REDIS_KEY_STUDENT_STATS=stats:student
   ```

4. **Lancez l'application :**
   ```bash
   npm start
   ```

---

## Structure du projet
```
.env
.gitignore
package.json
README.md
src/
    app.js
    config/
        db.js
        env.js
    controllers/
        courseController.js
    routes/
        courseRoutes.js
    services/
        mongoService.js
        redisService.js
```

- **src/app.js :** Point d'entrée principal de l'application. Configure les connexions aux bases de données, initialise les middlewares et monte les routes.
- **config/ :** Contient les fichiers de configuration pour les variables d'environnement et la connexion aux bases de données.
- **controllers/ :** Gère la logique métier pour les différentes routes.
- **routes/ :** Définit les points de terminaison (endpoints) et les associe aux fonctions des contrôleurs.
- **services/ :** Regroupe des modules réutilisables pour interagir avec MongoDB et Redis.

---

## Endpoints de l'API

### Cours
- **POST /courses** : Créer un nouveau cours.
- **GET /courses** : Récupérer tous les cours.
- **GET /courses/:id** : Récupérer un cours spécifique par ID.
- **PUT /courses/:id** : Mettre à jour un cours par ID.
- **DELETE /courses/:id** : Supprimer un cours par ID.
- **GET /courses/stats** : Récupérer les statistiques des cours.

### Étudiants
- **POST /students** : Créer un nouvel étudiant.
- **GET /students** : Récupérer tous les étudiants.
- **GET /students/:id** : Récupérer un étudiant spécifique par ID.
- **PUT /students/:id** : Mettre à jour un étudiant par ID.
- **DELETE /students/:id** : Supprimer un étudiant par ID.
- **GET /students/stats** : Récupérer les statistiques des étudiants.

---

## **Choix Techniques**
### **Stratégie de Caching**

Ce projet utilise la stratégie **Cache-Aside** pour améliorer les performances et réduire la charge sur la base de données.

![Cache aside](https://cdn-images-1.medium.com/max/800/1*3DDetzMbVd7HfLU_xrCCbA.png)


#### **Pourquoi Cache-Aside ?**
- **Flexibilité** : Cache-Aside permet de ne stocker les données dans le cache que lorsqu'elles sont nécessaires, évitant ainsi une utilisation excessive de la mémoire.
- **Cohérence** : Le cache est mis à jour ou invalidé uniquement lorsque la base de données est modifiée, garantissant ainsi que les données restent précises.
- **Performance** : Les données fréquemment consultées sont stockées dans le cache, ce qui améliore considérablement les temps de réponse.

#### **Comment Ça Fonctionne**
1. **Opérations de Lecture** :
   - L'application vérifie d'abord si les données sont disponibles dans le cache.
   - Si les données sont trouvées dans le cache, elles sont renvoyées directement.
   - Si les données ne sont pas dans le cache, elles sont récupérées depuis la base de données, stockées dans le cache, puis retournées.

2. **Opérations d'Écriture/Mise à Jour/Suppression** :
   - Lorsque des données sont modifiées dans la base de données, les entrées correspondantes dans le cache sont invalidées ou mises à jour.
   - Cela garantit que des données obsolètes ne sont pas servies depuis le cache.

En utilisant cette stratégie, l'application assure une gestion efficace et cohérente des données tout en minimisant les requêtes vers la base de données.

---

## Questions

### db.js
- **Question** : Pourquoi créer un module séparé pour les connexions aux bases de données ?  
-  **Réponse** : Un module séparé pour les connexions aux bases de données permet de clarifier les responsabilités dans votre code. Cela rend l'application plus modulaire et facile à maintenir. Ce module centralise également la gestion des connexions, facilite le traitement des erreurs, les tentatives de reconnexion, et simplifie la configuration des paramètres comme les URL et les ports.

- **Question** : Comment gérer proprement la fermeture des connexions ?  
-  **Réponse** : Pour garantir une fermeture propre des connexions, vous devriez implémenter des fonctions spécifiques à chaque type de connexion, comme MongoDB ou Redis. Ces fonctions doivent être appelées lors de l'arrêt de l'application ou en cas d'erreur critique. Il est également utile de configurer des gestionnaires d'événements pour détecter des signaux tels que `SIGINT` ou `SIGTERM`, afin de fermer correctement toutes les connexions en cas de terminaison forcée.


### env.js
- **Question** : Pourquoi valider les variables d'environnement au démarrage de l'application ?  
-  **Réponse** : Valider les variables d'environnement dès le démarrage garantit que l'application dispose des informations essentielles pour fonctionner correctement (comme les connexions à la base de données ou au cache). Cela prévient des erreurs imprévues liées à des configurations manquantes ou incorrectes.

- **Question** : Que se passe-t-il si une variable nécessaire est absente ?  
-  **Réponse** : Si une variable essentielle manque, l'application risque de rencontrer des erreurs graves, comme l'impossibilité de se connecter à la base de données ou à Redis. En validant ces variables au démarrage, vous pouvez identifier rapidement le problème et fournir un message d'erreur clair pour faciliter la correction.


### courseController.js
- **Question** : Quelle est la différence entre un contrôleur et une route ?  
-  **Réponse** : Les routes définissent les points d'entrée de l'application (comme `GET /courses` ou `POST /students`) et dirigent les requêtes vers les bonnes fonctions. Les contrôleurs, eux, contiennent la logique métier, c'est-à-dire les traitements nécessaires pour répondre aux requêtes. En résumé, les routes connectent les utilisateurs à l'application, tandis que les contrôleurs gèrent le "comment" de leurs requêtes.

- **Question** : Pourquoi séparer la logique métier des routes ?  
-  **Réponse** : Séparer la logique métier des routes rend le code plus clair, réutilisable et maintenable. Cela facilite aussi les tests unitaires, car vous pouvez tester la logique métier isolément, sans avoir à simuler des requêtes HTTP. Enfin, cette séparation respecte le principe de responsabilité unique, ce qui est crucial pour construire des applications robustes et évolutives.


### courseRoutes.js
- **Question** : Pourquoi séparer les routes dans différents fichiers ?  
  **Réponse** : Organiser les routes dans des fichiers distincts rend le code plus lisible et plus facile à gérer. Par exemple, regrouper toutes les routes liées aux cours dans `courseRoutes.js` et celles liées aux étudiants dans `studentRoutes.js` permet de naviguer plus rapidement dans le projet. Cela réduit aussi le risque de duplication de code et facilite la collaboration dans une équipe.

- **Question** : Comment organiser les routes de manière cohérente ?  
-  **Réponse** : Regroupez les routes par fonctionnalités ou domaines (par exemple, `studentRoutes.js` pour les utilisateurs et `courseRoutes.js` pour les cours). Suivez une convention de nommage claire et documentez les routes pour que chaque membre de l'équipe comprenne facilement leur usage. Une structure de dossiers bien pensée rend le projet plus simple à maintenir à long terme.

### mongoService.js
- **Question** : Pourquoi créer des services séparés ?  
-  **Réponse** : Les services séparés permettent de découper l'application en modules autonomes, ce qui rend le code plus facile à maintenir et à tester. Par exemple, un service MongoDB peut gérer toutes les opérations sur la base de données, tandis qu'un service Redis s'occupera du cache. Cela réduit les dépendances entre les différentes parties du projet et favorise la réutilisabilité.

### redisRoutes.js
- **Question :** Comment gérer efficacement le cache avec Redis ?
- **Réponse :** Pour gérer efficacement le cache avec Redis, il est important de suivre certaines bonnes pratiques :
1. Utiliser des TTL (Time To Live) pour s'assurer que les données expirent et ne restent pas indéfiniment dans le cache.
2. Utiliser des clés structurées et hiérarchiques pour organiser les données de manière logique.
3. Surveiller l'utilisation de la mémoire et configurer des politiques d'éviction pour gérer les dépassements de mémoire.
4. Utiliser des transactions ou des pipelines pour effectuer des opérations atomiques et améliorer les performances.
5. Mettre en place des mécanismes de sauvegarde et de restauration pour éviter la perte de données en cas de panne.

- **Question** : Quelles sont les bonnes pratiques pour nommer les clés Redis ?  
-  **Réponse** : Pour nommer les clés Redis efficacement :  
1. Utilisez des noms descriptifs pour faciliter leur compréhension et leur gestion.  
2. Évitez les clés trop longues pour économiser de la mémoire.  
3. Adoptez des préfixes cohérents, comme `student:` ou `course:`, pour regrouper les données logiquement.  
4. Ne mettez pas de caractères spéciaux dans les clés, car cela peut provoquer des erreurs inattendues.  
5. Standardisez les conventions de nommage dans toute l'application pour garantir la cohérence.
### app.js

- **Question :** Comment organiser le point d'entrée de l'application ?

- **Réponse :** Pour bien organiser le point d'entrée de l'application, il est essentiel de structurer les fichiers de manière logique et cohérente. Par exemple, les fichiers de configuration peuvent être regroupés dans un dossier config, les services dans un dossier services, et les routes dans un dossier routes. Chaque partie du code doit être modulée en fonction de sa fonctionnalité, ce qui facilite sa maintenance et sa réutilisation. Une bonne documentation et le respect des bonnes pratiques de développement sont aussi cruciaux pour garantir la lisibilité, la qualité et la fiabilité du code.

- **Question :** Quelle est la meilleure façon de gérer le démarrage de l'application ?

- **Réponse :** Pour gérer le démarrage de l'application de manière optimale, il faut adopter une approche modulaire et bien structurée. Cela signifie séparer les différentes parties du code en modules distincts, configurer les connexions aux bases de données, définir les routes et les middlewares Express, puis démarrer le serveur. Il est aussi important de prendre en compte la gestion des erreurs et d'implémenter des mécanismes de fermeture propre, afin d’assurer une exécution fiable et prévisible de l’application. En suivant ces principes, on s'assure que l'application soit bien organisée, facile à maintenir et prête à évoluer.

### .env
- **Question** : Quelles sont les informations sensibles à ne jamais committer ?  
  **Réponse** : Les informations sensibles comme les mots de passe, les clés API, les tokens, les URL des bases de données, ou toute autre donnée pouvant compromettre la sécurité doivent rester confidentielles. Ces informations doivent être stockées dans des fichiers `.env` et exclues des commits grâce à un fichier `.gitignore`.

- **Question** : Pourquoi utiliser des variables d'environnement ?  
  **Réponse** : Les variables d'environnement permettent de séparer les données de configuration du code source, ce qui rend l'application plus flexible. Cela facilite la gestion des environnements (développement, test, production) et limite les risques d'exposer des informations sensibles dans le code.

---
