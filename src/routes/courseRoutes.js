// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : Séparer les routes dans différents fichiers permet de mieux organiser le code, de le rendre plus modulaire et de faciliter la maintenance. Cela permet également de mieux gérer les dépendances entre les différentes parties de l'application et de rendre le code plus lisible et compréhensible. En séparant les routes dans différents fichiers, on peut également réutiliser les routes dans d'autres parties de l'application ou dans d'autres applications, ce qui permet de gagner du temps et de réduire la duplication du code. De plus, cela permet de répartir les responsabilités et de rendre le code plus facile à tester et à déboguer.

// Question : Comment organiser les routes de manière cohérente ?
// Réponse : Pour organiser les routes de manière cohérente, il est recommandé de regrouper les routes en fonction de leur fonctionnalité ou de leur domaine. Par exemple, on peut regrouper les routes liées aux utilisateurs dans un fichier userRoutes.js, les routes liées aux cours dans un fichier courseRoutes.js, etc. Cela permet de mieux structurer le code et de faciliter la navigation et la maintenance. Il est également important de suivre une convention de nommage cohérente pour les fichiers et les routes, afin de rendre le code plus prévisible et facile à comprendre. En outre, il est utile de documenter les routes et leur utilisation, et de maintenir une structure de dossiers claire et logique pour les différents fichiers de route.

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
router.post('/', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/stats', courseController.getCourseStats);
router.get('/:id', courseController.getCourse);
router.put('/:id', courseController.modifyCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;