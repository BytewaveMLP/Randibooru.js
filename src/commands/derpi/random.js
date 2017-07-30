/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const derpi = require('../../util/derpi.js');
const jsonfile = require('jsonfile');
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
		
		// I don't like having to do this here, especially because of how ugly this line looks
		// But hey, it gets the job done
		this.config = jsonfile.readFileSync(path.join(path.dirname(path.dirname(path.dirname(__dirname))), 'config.json'));
	}

	async run(msg, args) {
		if (msg.channel.type === 'text' && msg.guild.settings.get('blockedUsers.${msg.author.id}')) {
			return;
		}
		
		let query = args.query;

		// Only NSFW channels can have explicit content
		// (Assumes DMs are fine)
		const sfw = msg.channel.type !== 'dm' && !msg.channel.nsfw;

		if (sfw) {
			query = `${query}, -explicit`;
		}

		msg.channel.startTyping();

		derpi.query({
			apiKey: this.config.auth.derpiAPIKey,
			query: query,
			sortFormat: 'random'
		}, function (err, result) {
			// Sometimes, the typing indicator gets stuck, so let's reset it here
			msg.channel.stopTyping();

			if (err) {
				return msg.reply(`An error occurred: ${err.message}`);
			} else if (result === undefined) {
				return msg.reply(`No ${sfw ? 'safe-for-work ' : '' }images found for query: \`${args.query}\``);
			}

			return msg.reply('https://derpibooru.org/' + result.id);
		});
	}
};