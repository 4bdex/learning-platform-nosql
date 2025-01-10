// Question: Comment organiser le point d'entrée de l'application ?
// Réponse : Pour organiser le point d'entrée de l'application, il est recommandé de suivre une structure de dossiers cohérente et logique. Par exemple, on peut regrouper les fichiers de configuration dans un dossier config, les services dans un dossier services, les routes dans un dossier routes, etc. Il est également utile de diviser le code en modules distincts en fonction de leur fonctionnalité ou de leur domaine, ce qui facilite la maintenance et la réutilisation du code. En outre, il est important de documenter le code de manière claire et de suivre les meilleures pratiques de développement pour garantir la qualité et la fiabilité de l'application.

// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?
// Réponse : La meilleure façon de gérer le démarrage de l'application est de suivre une approche modulaire et structurée. Cela implique de diviser le code en modules distincts, de configurer les dépendances et les connexions aux bases de données, de monter les routes et les middlewares Express, et enfin de démarrer le serveur. Il est également important de gérer les erreurs de manière appropriée et de mettre en place des mécanismes de fermeture propre pour garantir que l'application se comporte de manière fiable et prévisible. En suivant ces bonnes pratiques, on peut s'assurer que l'application est bien organisée, maintenable et évolutive.

const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

async function startServer() {
  try {
    // Initialiser les connexions aux bases de données
    await db.connectMongo();
    await db.connectRedis();

    // Configurer les middlewares Express
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Monter les routes
    app.use('/api/courses', courseRoutes);
    app.use('/api/students', studentRoutes);

    // Démarrer le serveur
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  try {
    await db.disconnect();
    console.log('Server gracefully terminated');
    process.exit(0);
  } catch (error) {
    console.error('Error during server termination:', error);
    process.exit(1);
  }
});

startServer();