// Question: Pourquoi créer des services séparés ?
// Réponse: Créer des services séparés permet de structurer le code de manière modulaire et réutilisable. 
// Cela facilite la maintenance et les tests en isolant les fonctionnalités spécifiques dans des modules distincts. 
// De plus, cela permet de respecter le principe de responsabilité unique, où chaque service a une responsabilité claire et définie.



const { ObjectId } = require("mongodb");

// Retrieves a document by its ID from the specified collection.
async function findOneById(collection, id) {
  return await collection.findOne({ _id: new ObjectId(id) });
}

// Retrieves all documents from the specified collection.
async function findAll(collection) {
  return await collection.find().toArray();
}

// Creates a new document in the specified collection.
async function createDocument(collection, document) {
  return await collection.insertOne(document);
}

module.exports = {
  findOneById,
  findAll,
  createDocument,
};