/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class FilterCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			guildOnly: true,
			name: 'filter',
			aliases: ['filt', 'fid'],
			group: 'admin',
			memberName: 'filter',
			description: 'Set Randibooru\'s Derpibooru filters.\nIf you aren\'t sure how to retrieve this, it can be found by right-clicking the "Use this filter" button for the filter you want on https://derpibooru.org/filters and using Inspect Element. The ID is the number after `/filters/current?id=` on the line above.\nSpecify NSFW or SFW after the filter ID to choose which filter to set.',
			examples: ['filter YOUR_FILTER_ID', 'filter NONE', 'filter YOUR_FILTER_ID SFW'],
			args: [
				{
					key: 'key',
					label: 'key',
					prompt: 'Which Derpibooru filter should I use?\nSpecify NONE to unset this option.\nIf you aren\'t sure what to put, see `help filter`.',
					type: 'string'
				},
				{
					key: 'type',
					label: 'type',
					prompt: '',
					default: 'nsfw',
					type: 'string',
				}
			],
		});
	}

	hasPermission(msg) {
		return msg.author.id === msg.guild.ownerID;
	}

	async run(msg, args) {
		const type = args.type.toLowerCase();

		if (type !== 'nsfw' && type != 'sfw') {
			return msg.reply('`type` must be one of `sfw`/`nsfw`.');
		}

		if (args.key.toLowerCase() === 'none') {
			await msg.guild.settings.remove(`filter.${type}`);
			return msg.reply(`${type.toUpperCase()} filter ID unset.`);
		}

		await msg.guild.settings.set(`filter.${type}`, args.key);
		return msg.reply(`${type.toUpperCase()} filter ID set successfully!`);
	}
};
