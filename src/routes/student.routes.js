const express = require('express');
const QRCode = require('qrcode');
const Student = require('../models/Student');
const { baseUrl } = require('../config/env');

const router = express.Router();

// Create student and generate QR URL
router.post('/', async (req, res, next) => {
	try {
		const { name, email, rollNumber } = req.body;
		if (!name || !email || !rollNumber) {
			return res.status(400).json({ message: 'name, email, rollNumber are required' });
		}
		const existing = await Student.findOne({ $or: [{ email }, { rollNumber }] });
		if (existing) {
			return res.status(409).json({ message: 'Student with email or rollNumber already exists' });
		}
		const qrTarget = `${baseUrl}/scan?roll=${encodeURIComponent(rollNumber)}`;
		const student = await Student.create({ name, email, rollNumber, qrUrl: qrTarget });
		return res.status(201).json(student);
	} catch (err) {
		next(err);
	}
});

// List students
router.get('/', async (req, res, next) => {
	try {
		const students = await Student.find().sort({ createdAt: -1 });
		return res.json(students);
	} catch (err) {
		next(err);
	}
});

// Get a student's QR image as PNG
router.get('/:rollNumber/qr.png', async (req, res, next) => {
	try {
		const { rollNumber } = req.params;
		const student = await Student.findOne({ rollNumber });
		if (!student) {
			return res.status(404).json({ message: 'Student not found' });
		}
		const qrText = student.qrUrl || `${baseUrl}/scan?roll=${encodeURIComponent(rollNumber)}`;
		res.setHeader('Content-Type', 'image/png');
		return QRCode.toFileStream(res, qrText, { margin: 1, width: 256 });
	} catch (err) {
		next(err);
	}
});

module.exports = router;

