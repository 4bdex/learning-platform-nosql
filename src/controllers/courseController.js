// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Un contrôleur est responsable de la logique métier d'une application, tandis qu'une route est responsable de la gestion des requêtes HTTP et des réponses. Les contrôleurs encapsulent la logique métier et les opérations sur les données, tandis que les routes définissent les points d'entrée de l'application et les actions à effectuer en fonction des requêtes reçues. Les routes sont essentiellement des mappages entre les URL et les fonctions du contrôleur. Par exemple, une route peut spécifier qu'une requête GET sur "/courses" doit être gérée par une fonction spécifique dans le contrôleur de cours.

// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : Séparer la logique métier des routes permet de rendre le code plus modulaire, réutilisable et maintenable. Cela facilite également la gestion des dépendances, la répartition des tâches entre les différents modules et la mise à l'échelle de l'application. En séparant la logique métier des routes, on peut également tester plus facilement les différentes parties de l'application de manière isolée. Par exemple, les tests unitaires peuvent se concentrer sur la logique métier dans les contrôleurs sans avoir à se soucier des détails de la gestion des requêtes HTTP. De plus, cela permet de suivre le principe de responsabilité unique, où chaque module a une responsabilité clairement définie.


const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");
const mongoService = require("../services/mongoService");
const redisService = require("../services/redisService");

const CACHE_KEYS = {
  ALL_COURSES: process.env.REDIS_KEY_ALL_COURSES || "all_courses",
  COURSE_PREFIX: process.env.REDIS_KEY_COURSE_PREFIX || "course:",
  STATS: process.env.REDIS_KEY_COURSE_STATS || "course_stats",
};


// Create a new course
async function createCourse(req, res) {
  try {
    const { title, description, category, startDate, endDate, instructor } = req.body;

    if (!title || !description || !category || !instructor || !startDate || !endDate) {
      return res.status(400).json({
        error: "Please provide title, description, category, instructor, startDate, and endDate.",
      });
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

    // Invalidate all courses and stats cache
    await redisService.deleteCachedData(CACHE_KEYS.ALL_COURSES);
    await redisService.deleteCachedData(CACHE_KEYS.STATS);

    res.status(201).json({ message: "Course created successfully.", data: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// Retrieve all courses
async function getAllCourses(req, res) {
  try {
    const cachedCourses = await redisService.getCachedData(CACHE_KEYS.ALL_COURSES);

    if (cachedCourses) {
      return res.status(200).json({
        message: "Courses retrieved successfully from cache.",
        count: JSON.parse(cachedCourses).length,
        data: JSON.parse(cachedCourses),
      });
    }

    const courses = await mongoService.findAll(getDb().collection("courses"));

    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found." });
    }

    // Cache the courses with a TTL of 1 hour
    await redisService.cacheData(CACHE_KEYS.ALL_COURSES, JSON.stringify(courses));

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
      return res.status(400).json({ error: "Invalid course ID." });
    }

    const cacheKey = redisService.getCachedData(id);
    const cachedCourse = await redisService.getCachedData(cacheKey);

    if (cachedCourse) {
      return res.status(200).json({
        message: "Course retrieved successfully from cache.",
        data: JSON.parse(cachedCourse),
      });
    }

    const course = await mongoService.findOneById(getDb().collection("courses"), id);

    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    // Cache the course with a TTL of 1 hour
    await redisService.cacheData(cacheKey, JSON.stringify(course));

    res.status(200).json({ message: "Course retrieved successfully.", data: course });
  } catch (error) {
    console.error("Error retrieving course by ID:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// Modify a course
async function modifyCourse(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, instructor, startDate, endDate } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID." });
    }

    const course = await mongoService.findOneById(getDb().collection("courses"), id);

    if (!course) {
      return res.status(404).json({ error: "Course not found." });
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

    const updatedCourse = await mongoService.updateDocument(getDb().collection("courses"), id, update);

    // Update individual course cache
    await redisService.cacheData(redisService.getCachedData(id), JSON.stringify(updatedCourse));

    // Invalidate all courses and stats cache
    await redisService.deleteCachedData(CACHE_KEYS.ALL_COURSES);
    await redisService.deleteCachedData(CACHE_KEYS.STATS);

    res.status(200).json({ message: "Course updated successfully.", data: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// Delete a course
async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID." });
    }

    const course = await mongoService.findOneById(getDb().collection("courses"), id);

    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    await mongoService.deleteDocument(getDb().collection("courses"), id);

    // Remove individual course cache
    await redisService.deleteCachedData(redisService.getCachedData(id));

    // Invalidate all courses and stats cache
    await redisService.deleteCachedData(CACHE_KEYS.ALL_COURSES);
    await redisService.deleteCachedData(CACHE_KEYS.STATS);

    res.status(200).json({ message: "Course deleted successfully." });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// Retrieve course statistics
async function getCourseStats(req, res) {
  try {
    const cachedStats = await redisService.getCachedData(CACHE_KEYS.STATS);

    if (cachedStats) {
      return res.status(200).json({
        message: "Course statistics retrieved successfully from cache.",
        data: JSON.parse(cachedStats),
      });
    }

    const courses = await mongoService.findAll(getDb().collection("courses"));

    if (courses.length === 0) {
      return res.status(404).json({ error: "No courses found." });
    }

    const stats = {
      totalCourses: courses.length,
      // Additional stats can be calculated here
    };

    // Cache the stats with a TTL of 1 hour
    await redisService.cacheData(CACHE_KEYS.STATS, JSON.stringify(stats));

    res.status(200).json({ message: "Course statistics retrieved successfully.", data: stats });
  } catch (error) {
    console.error("Error retrieving course statistics:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

module.exports = {
  createCourse,
  getCourse,
  getAllCourses,
  modifyCourse,
  deleteCourse,
  getCourseStats,
};
