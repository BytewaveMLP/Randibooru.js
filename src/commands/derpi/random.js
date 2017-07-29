const Commando = require('discord.js-commando');
const https = require('https');

module.exports = class RandomCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'random',
			aliases: ['rand', 'r'],
			group: 'derpi',
			memberName: 'random',
			description: 'Gets a random image from Derpibooru matching the given query',
			examples: ['random', 'random safe', 'random safe, -anthro, (this OR that)'],
			args: [
				{
					key: 'query',
					label: 'query',
					default: '',
					prompt: '',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		let query = args.query;
		if (query === '') query = '*';
		https.get('https://derpibooru.org/search.json?sf=random&q=' + encodeURIComponent(query), (res) => {
			const { statusCode } = res;
			if (statusCode !== 200) {
				res.resume();
				return msg.reply(`Request failed - status: ${statusCode}`);
			}

			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				try {
					const parsedData = JSON.parse(rawData);
					const results = parsedData.search;
					if (results.length === 0) {
						return msg.reply(`No images found matching query \`${query}\`.`);
					}
					const result = results[Math.floor(Math.random() * results.length)];
					return msg.reply('https://derpibooru.org/' + result.id);
				} catch (e) {
					return msg.reply(`An error occurred: ${e.message}`);
				}
			});
		}).on('error', (e) => {
			return msg.reply(`An error occurred: ${e.message}`);
		});
		// return msg.reply(`Query: ${query}`);
	}
};