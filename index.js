import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {registerValidation} from './validations/auth.js';
import {validationResult} from 'express-validator';
import UserModel from './models/User.js'; 
import checkAuth from './checkAuth.js'; 

mongoose
.connect('mongodb+srv://vandal:vvvvvv@cluster0.yfxbmvd.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('Database OK:'))
.catch((err) => console.log('Database ERROR:', err));

const app = express();

app.use(express.json());

app.post('/login', async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email});
		if (!user) {
			return res.status(404).json({
				message: 'ПОЛЬЗОВАТЕЛЬ НЕ НАЙДЕН',
			});
		}
		const ValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
		if (!ValidPassword) {
			return res.status(404).json({
				message: 'НЕВЕРНЫЙ ПАРОЛЬ ИЛИ ЛОГИН',
			});
		}

		const token = jwt.sign(
	{
		_id: user._id,
	},
	'secret1407',
	{
		expiresIn: '30d',
	},
	);

		const {passwordHash, ...userData } = user._doc;

	res.json({
		...userData,
		token,
	});
	} catch (err) {
		console.log(err);
	res.status(500).json({
		message: 'НЕ УДАЛОСЬ АВТОРИЗОВАТЬСЯ',
		});
	}
});

app.post('/register', registerValidation, async (req, res) => {
	try {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}

	const password = req.body.password;
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const doc =  new UserModel ({
		fullName: req.body.fullName,
		email: req.body.email,
		avatarUrl: req.body.avatarUrl,
		passwordHash: hash,
	});

	const user = await doc.save();

	const token = jwt.sign(
	{
		_id: user._id,
	},
	'secret1407',
	{
		expiresIn: '30d',
	},
	);

	const {passwordHash, ...userData } = user._doc;

	res.json({
		...userData,
		token,
	});
} catch (err) {
	console.log(err);
	res.status(500).json({
		message: 'НЕ УДАЛОСЬ ЗАРЕГИСТРИРОВАТЬСЯ',
		});
	}
});

app.get('/me', checkAuth, async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);
		if (!user) {
			return res.status(404).json({
				message: 'ПОЛЬЗОВАТЕЛЬ НЕ НАЙДЕН'
			});
		}
		const {passwordHash, ...userData } = user._doc;

	res.json(userData);
	} catch(err) {
		return res.status(500).join({
			message: 'НЕТ ДОСТУПА',
		});
	}
});

app.listen(7777, (err) => {
	if (err) {
		console.log(err);
	}
	console.log('Server OK:'); 
});