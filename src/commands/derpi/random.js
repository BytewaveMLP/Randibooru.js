/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const derpi = require('../../util/derpi.js');
const embed = require('../../util/embed.js');
const path = require('path');

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

		this.config = client.config;
	}

	async run(msg, args) {
		if (msg.channel.type === 'text' && msg.guild.settings.get('blockedUsers.${msg.author.id}')) {
			return;
		}
		
		let query = args.query;

		// Only NSFW channels can have explicit content
		// (Assumes DMs are fine)
		const nsfw = msg.channel.type === 'dm' || msg.channel.nsfw;

		msg.channel.startTyping();

		derpi.query({
			apiKey: nsfw ? this.config.auth.derpiAPIKey : '',
			query: query,
			sortFormat: 'random'
		}, (err, data) => {
			// Sometimes, the typing indicator gets stuck, so let's reset it here
			msg.channel.stopTyping();

			if (err) {
				return msg.reply(`An error occurred: ${err.message}`);
			}

			let results = data.search;
			let result;

			if (results.length > 0) {
				result = results[Math.floor(Math.random() * results.length)];
			}

			if (result === undefined) {
				return msg.reply(`No ${!nsfw ? 'safe-for-work ' : '' }images found for query: \`${args.query}\``);
			}

			let reply = embed.derpibooruResultToEmbed(result);

			return msg.reply(args.query !== '' ? `query: \`${args.query}\`` : '', reply);
		});
	}
};