/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class APIKeyCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			guildOnly: true,
			name: 'apkey',
			aliases: ['key'],
			group: 'admin',
			memberName: 'apikey',
			description: 'Set Randibooru\'s SFW/NSFW API keys for Derpibooru. Sets the NSFW key by default unless specified otherwise.',
			examples: ['apikey YOUR_API_KEY_HERE', 'apikey YOUR_API_KEY_HERE SFW', 'apikey NONE SFW'],
			args: [
				{
					key: 'key',
					label: 'key',
					prompt: 'Which Derpibooru API key should I use?\nSpecify NONE to unset this option.\nIf you aren\'t sure what to put, see https://derpibooru.org/users/edit.',
					type: 'string'
				},
				{
					key: 'nsfw',
					label: 'nsfw',
					prompt: '',
					default: 'nsfw',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.author.id === msg.guild.ownerID;
	}

	async run(msg, args) {
		const nsfw = args.nsfw.toLowerCase();

		if (nsfw !== 'sfw' && nsfw !== 'nsfw') {
			return msg.reply(`The second argument must be either "sfw" or "nsfw" to denote which API key you'd like to set.`);
		}

		if (args.key.toLowerCase() === "none") {
			await msg.guild.settings.remove(`apikey.${nsfw}`);
			return msg.reply(`${nsfw.toUpperCase()} API key unset.`);
		}

		await msg.guild.settings.set(`apikey.${nsfw}`, args.key);
		return msg.reply(`${nsfw.toUpperCase()} API key set successfully!`);
	}
};
