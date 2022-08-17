import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://vandal:ovjfmxa6@cluster0.sgvqocw.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('Database OK'))
.catch((err) => console.log('Database ERROR', err));

const app = express();

app.use(express.json());

app.get('', (req, res) => {
	res.send('Всем здрасте!');
});

app.post('/login', (req, res) => {
	console.log(req.body);

	const token = jwt.sign({
		email: req.body.email,
		fullName: 'Виктор Ларин',
	},
	'randompassword',
	);

	res.json({
		success: true,
		token,
	});
});

app.listen(7777, (err) => {
	if (err) {
		console.log(err);
	}
	console.log('Server OK'); 
});