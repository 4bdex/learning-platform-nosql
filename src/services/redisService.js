const redis = require('redis');

// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : Pour gérer efficacement le cache avec Redis, il est important de suivre certaines bonnes pratiques :
// 1. Utiliser des TTL (Time To Live) pour s'assurer que les données expirent et ne restent pas indéfiniment dans le cache.
// 2. Utiliser des clés structurées et hiérarchiques pour organiser les données de manière logique.
// 3. Surveiller l'utilisation de la mémoire et configurer des politiques d'éviction pour gérer les dépassements de mémoire.
// 4. Utiliser des transactions ou des pipelines pour effectuer des opérations atomiques et améliorer les performances.
// 5. Mettre en place des mécanismes de sauvegarde et de restauration pour éviter la perte de données en cas de panne.

// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : Les bonnes pratiques pour les clés Redis incluent :
// 1. Utiliser des noms de clés descriptifs et cohérents pour faciliter la gestion et la compréhension des données.
// 2. Éviter les clés trop longues pour réduire l'utilisation de la mémoire et améliorer les performances.
// 3. Utiliser des préfixes pour regrouper les clés par catégorie ou par fonctionnalité.
// 4. Éviter les caractères spéciaux dans les noms de clés pour prévenir les erreurs de syntaxe.
// 5. Utiliser des conventions de nommage standardisées pour maintenir la cohérence à travers l'application.

const { getRedisClient } = require('../config/db');

let ttl = 3600; // TTL (1 hour) in seconds

// functions to cache data in Redis

// Cache data with a specific key and TTL
async function cacheData(key, data) {
  try {
    const client = getRedisClient();
    await client.set(key, JSON.stringify(data), 'EX', ttl);
    console.log(`Data cached with key: ${key}`);
  } catch (err) {
    console.error('Error caching data:', err);
  }
}

// Retrieve cached data with a specific key
async function getCachedData(key) {
  try {
    const client = getRedisClient();
    const data = await client.get(key);
    console.log(`Data retrieved with key: ${key}`);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error getting data:', err);
  }
}

// Delete cached data with a specific key
async function deleteCachedData(key) {
  try {
    const client = getRedisClient();
    await client.del(key);
    console.log(`Data deleted with key: ${key}`);
  } catch (err) {
    console.error('Error deleting data:', err);
  }
}


module.exports = {
  cacheData,
  getCachedData,
  deleteCachedData,
};