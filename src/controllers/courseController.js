// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Un contrôleur est responsable de la logique métier d'une application, tandis qu'une route est responsable de la gestion des requêtes HTTP et des réponses. Les contrôleurs encapsulent la logique métier et les opérations sur les données, tandis que les routes définissent les points d'entrée de l'application et les actions à effectuer en fonction des requêtes reçues. Les routes sont essentiellement des mappages entre les URL et les fonctions du contrôleur. Par exemple, une route peut spécifier qu'une requête GET sur "/courses" doit être gérée par une fonction spécifique dans le contrôleur de cours.

// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : Séparer la logique métier des routes permet de rendre le code plus modulaire, réutilisable et maintenable. Cela facilite également la gestion des dépendances, la répartition des tâches entre les différents modules et la mise à l'échelle de l'application. En séparant la logique métier des routes, on peut également tester plus facilement les différentes parties de l'application de manière isolée. Par exemple, les tests unitaires peuvent se concentrer sur la logique métier dans les contrôleurs sans avoir à se soucier des détails de la gestion des requêtes HTTP. De plus, cela permet de suivre le principe de responsabilité unique, où chaque module a une responsabilité clairement définie.


const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");
const mongoService = require("../services/mongoService");

// Create a new course
async function createCourse(req, res) {
  try {
    const { title, description, category, startDate, endDate, instructor } = req.body;

    if (!title || !description || !category || !instructor || !startDate || !endDate) {
      res.status(400).json({
        error: "Please provide title, description, category, instructor, startDate, and endDate.",
      });
      return;
    }

    const newCourse = await mongoService.createDocument(
      getDb().collection("courses"),
      {
        title,
        description,
        category,
        instructor,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
        updatedAt: null,
      }
    );

    res
      .status(201)
      .json({ message: "Course created successfully.", data: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// Retrieve all courses
async function getAllCourses(req, res) {
  try {
    const courses = await mongoService.findAll(getDb().collection("courses"));

    if (courses.length === 0) {
      res.status(404).json({ message: "No courses found." });
      return;
    }

    res.status(200).json({
      message: "Courses retrieved successfully.",
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Error retrieving courses:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}


// Retrieve a course by ID
async function getCourse(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid course ID." });
      return;
    }

    const course = await mongoService.findOneById(
      getDb().collection("courses"),
      id
    );

    if (!course) {
      res.status(404).json({ error: "Course not found." });
      return;
    }

    res
      .status(200)
      .json({ message: "Course retrieved successfully.", data: course });
  } catch (error) {
    console.error("Error retrieving course by ID:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// Retrieve course statistics
async function getCourseStats(req, res) {
  try {
    const courses = await mongoService.findAll(getDb().collection("courses"));

    if (courses.length === 0) {
      res.status(404).json({ error: "No courses found." });
      return;
    }

    const stats = {
      totalCourses: courses.length,
      // TODO: Add more statistics
    };

    res.status(200).json({
      message: "Course statistics retrieved successfully.",
      data: stats,
    });
  } catch (error) {
    console.error("Error retrieving course statistics:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// modify Course
async function modifyCourse(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, instructor, startDate, endDate } = req.body;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid course ID." });
      return;
    }

    const course = await mongoService.findOneById(
      getDb().collection("courses"),
      id
    );

    if (!course) {
      res.status(404).json({ error: "Course not found." });
      return;
    }

    const update = {
      title,
      description,
      category,
      instructor,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      updatedAt: new Date(),
    };

    const updatedCourse = await mongoService.updateDocument(getDb().collection("courses"),id, update);

    res
      .status(200)
      .json({ message: "Course updated successfully.", data: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// delete Course
async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid course ID." });
      return;
    }

    const course = await mongoService.findOneById(
      getDb().collection("courses"),
      id
    );

    if (!course) {
      res.status(404).json({ error: "Course not found." });
      return;
    }

    await mongoService.deleteDocument(getDb().collection("courses"), id);

    res.status(200).json({ message: "Course deleted successfully." });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}



module.exports = {
  createCourse,
  getCourse,
  getCourseStats,
  getAllCourses,
  modifyCourse,
  deleteCourse
};
