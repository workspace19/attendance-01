const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			index: true,
		},
		rollNumber: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			index: true,
		},
		qrUrl: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);

