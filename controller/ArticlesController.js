import Article from '../models/Article.js';

export const getAll = async (req, res) => {
	try {
		const posts = await Article.find().populate('user').exec();

			res.json(posts);
		} catch (err) {
				console.log(err);
				res.status(500).json({
				message: 'НЕ УДАЛОСЬ ПОЛУЧИТЬ СТАТЬИ',
		});
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;
		Article.findOneAndUpdate(
		{
				_id: postId,
		},
		{
				$inc: {viewsCount: 1},
		},
		{
			returnDocument: 'after',
		},
		(err, doc) => {
			if (err) {
				console.log(err);
				 return res.status(500).json({
				message: 'НЕ УДАЛОСЬ ПОКАЗАТЬ СТАТЬЮ',
				});
			}
			if (!doc) {
				return res.status(404).json({
					message: 'СТАТЬЯ НЕ НАЙДЕНА',
				});
			}
			res.json(doc);
		},
	);
		} catch (err) {
				console.log(err);
				res.status(500).json({
				message: 'НЕ УДАЛОСЬ ПОЛУЧИТЬ СТАТЬЮ',
		});
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;
		Article.findOneAndDelete(
		{
			_id: postId,

		},
		(err, doc) => {
			if (err) {
				console.log(err);
				 return res.status(500).json({
				message: 'НЕ УДАЛОСЬ ПОКАЗАТЬ СТАТЬЮ',
				});
			}
			if (!doc) {
				return res.status(404).json({
					message: 'СТАТЬЯ НЕ НАЙДЕНА',
				});
			}
			res.json(doc);

		},
	);
		} catch (err) {
				console.log(err);
				res.status(500).json({
				message: 'НЕ УДАЛОСЬ УДАЛИТЬ СТАТЬЮ',
		});
	}
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await Article.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не УДАЛОСЬ ОБНОВИТЬ СТАТЬЮ',
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