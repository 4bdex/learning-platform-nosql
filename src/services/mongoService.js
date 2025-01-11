// Question: Pourquoi créer des services séparés ?
// Réponse: Créer des services séparés permet de structurer le code de manière modulaire et réutilisable. 
// Cela facilite la maintenance et les tests en isolant les fonctionnalités spécifiques dans des modules distincts. 
// De plus, cela permet de respecter le principe de responsabilité unique, où chaque service a une responsabilité claire et définie.



const { ObjectId } = require("mongodb");

// Retrieves a document by its ID.
async function findOneById(collection, id) {
  return await collection.findOne({ _id: new ObjectId(`${id}`) });  // ObjectId() expects a string as an argument , ObjectId(number) is deprecated
}

// Retrieves all documents.
async function findAll(collection) {
  return await collection.find().toArray();
}

// Creates a new document.
async function createDocument(collection, document) {
  return await collection.insertOne(document);
}

// Updates an existing document.
async function updateDocument(collection, id, update) {
  return await collection.updateOne({ _id: new ObjectId(`${id}`) }, { $set: update }, { returnDocument: "after" });
}

// Deletes a document by its ID.
async function deleteDocument(collection, id) {
  return await collection.deleteOne({ _id: new ObjectId(`${id}`) });
}


module.exports = {
  findOneById,
  findAll,
  createDocument,
  updateDocument,
  deleteDocument
};