// Question: Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse: Créer un module séparé pour les connexions aux bases de données permet de séparer les responsabilités, ce qui rend le code plus modulaire et maintenable. Cela facilite également la gestion des connexions, le traitement des erreurs et les retries, ainsi que la configuration centralisée des paramètres de connexion.
// Question: Comment gérer proprement la fermeture des connexions ?
// Réponse: Pour gérer proprement la fermeture des connexions, il est recommandé d'implémenter des fonctions de fermeture spécifiques pour chaque type de connexion (par exemple, MongoDB et Redis). Ces fonctions doivent être appelées lors de l'arrêt de l'application ou en cas d'erreur critique. Utiliser des gestionnaires d'événements pour détecter les signaux de terminaison (comme SIGINT) peut également aider à s'assurer que les connexions sont fermées correctement.


const { MongoClient, Db } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient;
let redisClient;
let db;

// Connects to the MongoDB server.
async function connectMongo() {
  try {
    mongoClient = new MongoClient(config.mongodb.uri);
    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);
    console.log("MongoDB Connected");
    return db;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

// Closes the MongoDB connection.
async function closeMongo() {
  if (mongoClient) {
    await mongoClient.close();
    console.log("MongoDB connection closed");
  }
}

// Retrieves the MongoDB database instance.
function getDb() {
  if (!db) throw new Error("Database not initialized. Call connectMongo first");
  return db;
}

// Connects to the Redis server.
async function connectRedis() {
  try {
    redisClient = redis.createClient({ url: config.redis.uri });
    await redisClient.connect();
    await redisClient.ping();
    console.log("Redis Connected");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Retrieves the Redis client instance.
function getRedisClient() {
  if (!redisClient) throw new Error("Redis not connected yet. Call connectRedis first");
  return redisClient;
}

// Closes the Redis connection.
async function closeRedis() {
  try {
    if (redisClient) await redisClient.quit();
    console.log("Redis connection closed");
  } catch (error) {
    console.error("Error closing Redis connection", error);
    throw error;
  }
}

module.exports = {
  getDb,
  connectMongo,
  closeMongo,
  connectRedis,
  getRedisClient,
  closeRedis,
};