const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const env = require('./config/env');
const studentRoutes = require('./routes/student.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const scanRoutes = require('./routes/scan.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.json({ status: 'ok', message: 'Attendance Management API' });
});

app.use('/students', studentRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/scan', scanRoutes);

// Not found
app.use((req, res) => {
	res.status(404).json({ message: 'Not Found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

async function start() {
	await mongoose.connect(env.mongoUri);
	app.listen(env.port, () => {
		console.log(`Server listening on port ${env.port}`);
	});
}

start().catch((err) => {
	console.error('Failed to start server', err);
	process.exit(1);
});

