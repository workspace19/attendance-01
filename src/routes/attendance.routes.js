const express = require('express');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { getTodayKey } = require('../utils/date');

const router = express.Router();

// POST attendance: { rollNumber, date? }
router.post('/', async (req, res, next) => {
	try {
		const { rollNumber, date } = req.body;
		if (!rollNumber) {
			return res.status(400).json({ message: 'rollNumber is required' });
		}
		const student = await Student.findOne({ rollNumber });
		if (!student) {
			return res.status(404).json({ message: 'Student not found' });
		}
		const dateKey = date || getTodayKey();
		const record = await Attendance.findOneAndUpdate(
			{ student: student._id, date: dateKey },
			{ $setOnInsert: { status: 'present' } },
			{ new: true, upsert: true }
		);
		const created = record.createdAt && record.updatedAt && record.createdAt.getTime() === record.updatedAt.getTime();
		return res.status(created ? 201 : 200).json({
			message: created ? 'Attendance marked' : 'Attendance already marked',
			attendance: record,
		});
	} catch (err) {
		next(err);
	}
});

// GET /scan?roll=ROLLNUMBER - mark attendance and show simple HTML
router.get('/scan', async (req, res, next) => {
	try {
		const rollNumber = req.query.roll;
		if (!rollNumber) {
			return res.status(400).send('<h2>Missing roll parameter</h2>');
		}
		const student = await Student.findOne({ rollNumber });
		if (!student) {
			return res.status(404).send('<h2>Student not found</h2>');
		}
		const dateKey = getTodayKey();
		const result = await Attendance.updateOne(
			{ student: student._id, date: dateKey },
			{ $setOnInsert: { status: 'present' } },
			{ upsert: true }
		);
		const created = result.upsertedCount && result.upsertedCount > 0;
		return res.send(
			`<html><body style="font-family: sans-serif;">
				<h2>${created ? 'Attendance marked ✅' : 'Already marked today ℹ️'}</h2>
				<p>Name: ${student.name}</p>
				<p>Roll: ${student.rollNumber}</p>
				<p>Date: ${dateKey}</p>
			</body></html>`
		);
	} catch (err) {
		next(err);
	}
});

module.exports = router;

