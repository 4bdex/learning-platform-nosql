// Question: Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse: Créer un module séparé pour les connexions aux bases de données permet de séparer les responsabilités, ce qui rend le code plus modulaire et maintenable. Cela facilite également la gestion des connexions, le traitement des erreurs et les retries, ainsi que la configuration centralisée des paramètres de connexion.
// Question: Comment gérer proprement la fermeture des connexions ?
// Réponse: Pour gérer proprement la fermeture des connexions, il est recommandé d'implémenter des fonctions de fermeture spécifiques pour chaque type de connexion (par exemple, MongoDB et Redis). Ces fonctions doivent être appelées lors de l'arrêt de l'application ou en cas d'erreur critique. Utiliser des gestionnaires d'événements pour détecter les signaux de terminaison (comme SIGINT) peut également aider à s'assurer que les connexions sont fermées correctement.

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo() {
  try {
    mongoClient = new MongoClient(config.mongodb.uri);
    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function connectRedis() {
  return new Promise((resolve, reject) => {
    redisClient = redis.createClient({ url: config.redis.uri });
    redisClient.on('error', (error) => {
      console.error('Error connecting to Redis:', error);
      reject(error);
    });
    redisClient.on('connect', () => {
      console.log('Connected to Redis');
      resolve(redisClient);
    });
  });
}

function closeConnections() {
  if (mongoClient) {
    mongoClient.close().then(() => console.log('MongoDB connection closed'));
  }
  if (redisClient) {
    redisClient.quit(() => console.log('Redis connection closed'));
  }
}

process.on('SIGINT', () => {
  closeConnections();
  process.exit(0);
});

module.exports = {
  connectMongo,
  connectRedis,
  closeConnections,
  getMongoClient: () => mongoClient,
  getRedisClient: () => redisClient,
};