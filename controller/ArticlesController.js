import Article from '../models/Article.js';

export const getAll = async (req, res) => {
	try {
		const posts = await Article.find().populate('user').exec();

			res.json(posts);
		} catch (err) {
				console.log(err);
				res.status(500).json({
				message: 'НЕ УДАЛОСЬ ПОЛУЧИТЬ СТАТЬЮ',
		});
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;
		const posts = await Article.find().populate('user').exec();
			res.json(posts);
		} catch (err) {
				console.log(err);
				res.status(500).json({
				message: 'НЕ УДАЛОСЬ ПОЛУЧИТЬ СТАТЬЮ',
		});
	}
};

export const create =  async (req, res) => {
	try {
		const doc = new Article({
			title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
		});

		const post = await doc.save();
		res.json(post);

	} catch (err) {
		console.log(err);
	res.status(500).json({
		message: 'НЕ УДАЛОСЬ СОЗДАТЬ СТАТЬЮ',
		});
	}
};