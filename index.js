import express from 'express';

const app = express();

app.get('', (req, res) => {
	res.send('Всем здрасте!');
});

app.listen(7777, (err) => {
	if (err) {
		console.log(err);
	}
	console.log('Server OK'); 
});