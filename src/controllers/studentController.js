const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");
const mongoService = require("../services/mongoService");
const redisService = require("../services/redisService");

// Create a new student
async function createStudent(req, res) {
    try {
        const { firstName, lastName, email, dateOfBirth } = req.body;

        if (!firstName || !lastName || !email || !dateOfBirth) {
            return res.status(400).json({
                error: "firstName, lastName, email, and date of birth are required.",
            });
        }

        const newStudent = await mongoService.createDocument(
            getDb().collection("students"),
            {
                firstName,
                lastName,
                email,
                dateOfBirth,
                createdAt: new Date(),
            }
        );

        return res.status(201).json({
            message: "Student created successfully.",
            data: newStudent,
        });
    } catch (error) {
        console.error("Error creating a new student:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}

// Retrieve all students
async function getAllStudents(req, res) {
    try {
        const students = await mongoService.findAll(getDb().collection("students"));

        if (students.length === 0) {
            return res.status(404).json({ message: "No students found." });
        }

        return res.status(200).json({
            message: "Students retrieved successfully.",
            count: students.length,
            data: students,
        });
    } catch (error) {
        console.error("Error retrieving students:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}

// Retrieve a student by ID
async function getStudent(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid student ID." });
        }

        const student = await mongoService.findOneById(
            getDb().collection("students"),
            id
        );

        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }

        return res.status(200).json({
            message: "Student retrieved successfully.",
            data: student,
        });
    } catch (error) {
        console.error("Error retrieving a single student by ID:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}

// Update a student by ID
async function updateStudent(req, res) {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, dateOfBirth } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid student ID." });
        }

        if (!firstName && !lastName && !email && !dateOfBirth) {
            return res.status(400).json({
                error: "At least one field (firstName, lastName, email, dateOfBirth) is required.",
            });
        }

        const student = await mongoService.findOneById(
            getDb().collection("students"),
            id
        );

        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }

        const update = {
            firstName: firstName || student.firstName,
            lastName: lastName || student.lastName,
            email: email || student.email,
            dateOfBirth: dateOfBirth || student.dateOfBirth,
            updatedAt: new Date(),
        };

        const updatedStudent = await mongoService.updateDocument(
            getDb().collection("students"),
            id,
            update
        );

        return res.status(200).json({
            message: "Student updated successfully.",
            data: updatedStudent,
        });
    } catch (error) {
        console.error("Error updating a student by ID:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}

// Delete a student by ID
async function deleteStudent(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid student ID." });
        }

        const student = await mongoService.findOneById(
            getDb().collection("students"),
            id
        );

        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }

        await mongoService.deleteDocument(getDb().collection("students"), id);

        return res.status(200).json({ message: "Student deleted successfully." });
    } catch (error) {
        console.error("Error deleting a student by ID:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}

// Retrieve student statistics
async function getStudentStats(req, res) {
    try {
        const students = await mongoService.findAll(getDb().collection("students"));

        if (students.length === 0) {
            return res.status(404).json({ message: "No students found." });
        }

        const studentCount = students.length;
        const currentYear = new Date().getFullYear();
        const averageAge = students.reduce(
            (acc, student) => acc + (currentYear - new Date(student.dateOfBirth).getFullYear()),
            0
        );

        const studentStats = {
            studentCount,
            averageAge: Math.round(averageAge / studentCount),
        };

        return res.status(200).json({
            message: "Student statistics retrieved successfully.",
            data: studentStats,
        });

    } catch (error) {
        console.error("Error retrieving student statistics:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}

// Export the controllers
module.exports = {
    createStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    getStudentStats,
};
