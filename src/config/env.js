const dotenv = require('dotenv');
dotenv.config();

const required = (value, name) => {
	if (!value) {
		throw new Error(`Missing required env var: ${name}`);
	}
	return value;
};

module.exports = {
	port: process.env.PORT || 3000,
	mongoUri: required(process.env.MONGODB_URI, 'MONGODB_URI'),
	baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
};

