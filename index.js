import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {registerValidation} from './validations/auth.js';
import {validationResult} from 'express-validator';
import UserModel from './models/User.js';


mongoose.connect('mongodb+srv://vandal:ovjfmxa6@cluster0.sgvqocw.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('Database OK:'))
.catch((err) => console.log('Database ERROR:', err));

const app = express();

app.use(express.json());

app.get('', (req, res) => {
	res.send('Всем здрасте!');
});

app.post('/login', registerValidation, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}
	res.json({
		success: true,
	});
});

app.listen(7777, (err) => {
	if (err) {
		console.log(err);
	}
	console.log('Server OK'); 
});