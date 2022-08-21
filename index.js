import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {registerValidation, loginValidation} from './validations/authLogin.js';
import {articlesValidation} from './validations/articles.js';

import {validationResult} from 'express-validator';
import UserModel from './models/User.js'; 
import checkAuth from './checkAuth.js';
import validationsError from './validationsError.js';
import * as ArticlesController from './controller/ArticlesController.js'; 

mongoose
.connect('mongodb+srv://vandal:vvvvvv@cluster0.yfxbmvd.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('Database OK:'))
.catch((err) => console.log('Database ERROR:', err));

const app = express();

const storageImg = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({storageImg});

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/login', loginValidation, validationsError, async (req, res) => {
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


// 
app.post('/register', registerValidation, validationsError, async (req, res) => {
	try {
	// const errors = validationResult(req);
	// if (!errors.isEmpty()) {
	// 	return res.status(400).json(errors.array());
	const password = req.body.password;
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const doc =  new UserModel ({
		fullName: req.body.fullName,
		email: req.body.email,
		avatarUrl: req.body.avatarUrl,
		passwordHash: hash,
	});

// 
	// const password = req.body.password;
	// const salt = await bcrypt.genSalt(10);
	// const hash = await bcrypt.hash(password, salt);

	// const doc =  new UserModel ({
	// 	fullName: req.body.fullName,
	// 	email: req.body.email,
	// 	avatarUrl: req.body.avatarUrl,
	// 	passwordHash: hash,
	// });

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



// 
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
		console.log(err);
		return res.status(500).json({
			message: 'НЕТ ДОСТУПА',
		});
	}
});

app.get('/articles', ArticlesController.getAll);
app.get('/articles:id', ArticlesController.getOne);
app.post('/articles', checkAuth, articlesValidation, ArticlesController.create);
app.delete('/articles:id', checkAuth, ArticlesController.remove);
app.patch('/articles:id', checkAuth, ArticlesController.update);

app.post('/uploads', checkAuth, upload.single('image'), (req, res) =>{
	res.json({
		url: `/uploads${req.file.originalname}`,
	});
});

app.listen(7777, (err) => {
	if (err) {
		console.log(err);
	}
	console.log('Server OK:'); 
});