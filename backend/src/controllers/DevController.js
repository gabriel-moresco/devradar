const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
	async index(req, res) {
		const devs = await Dev.find();

		res.json(devs);
	},

	async store(req, res) {
		const { github_username, techs, latitude, longitude } = req.body;

		let dev = await Dev.findOne({ github_username });

		if (!dev) {
			const techsArray = parseStringAsArray(techs);

			const githubResponse = await axios.get(
				`https://api.github.com/users/${github_username}`
			);

			const { name = login, avatar_url, bio } = githubResponse.data;

			const location = {
				type: 'Point',
				coordinates: [longitude, latitude]
			};

			dev = await Dev.create({
				name,
				github_username,
				bio,
				avatar_url,
				techs: techsArray,
				location
			});
		}

		res.json(dev);
	}
};
