// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse : Il est important de valider les variables d'environnement au démarrage pour s'assurer que toutes les configurations nécessaires sont présentes et correctes avant que l'application ne commence à fonctionner. Cela permet d'éviter des erreurs inattendues et des comportements imprévisibles pendant l'exécution de l'application. La validation des variables d'environnement garantit que l'application dispose de toutes les informations nécessaires pour se connecter aux services externes (comme les bases de données et les services de cache) et pour fonctionner correctement.

// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse : Si une variable requise est manquante, l'application peut rencontrer des erreurs critiques qui peuvent empêcher son bon fonctionnement. Par exemple, si l'URI de la base de données MongoDB n'est pas définie, l'application ne pourra pas se connecter à la base de données, ce qui entraînera des échecs lors des opérations de lecture et d'écriture. En validant les variables d'environnement au démarrage, on peut détecter ces problèmes tôt et fournir des messages d'erreur explicites, ce qui facilite le dépannage et la correction des problèmes de configuration.

const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is missing.`);
    }
  });
}

validateEnv();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};