/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class FilterCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'filter',
			aliases: ['filt', 'fid'],
			group: 'admin',
			memberName: 'filter',
			description: 'Set Randibooru\'s Derpibooru filters.',
			details: 'If you aren\'t sure how to retrieve this, it can be found by right-clicking the "Use this filter" button for the filter you want on <https://derpibooru.org/filters> and using Inspect Element. The ID is the number after `/filters/current?id=` on the line above.\nSpecify NSFW or SFW after the filter ID to choose which filter to set; this does not matter for DMs, however, as DMs always use the NSFW filter.',
			examples: ['filter YOUR_FILTER_ID', 'filter NONE', 'filter YOUR_FILTER_ID SFW'],
			args: [
				{
					key: 'filter',
					label: 'filter',
					prompt: 'Which Derpibooru filter should I use?\nSpecify NONE to unset this option.\nIf you aren\'t sure what to put, see `help filter`.',
					type: 'string',
				},
				{
					key: 'type',
					label: 'type',
					prompt: '',
					default: 'nsfw',
					type: 'string',
				},
			],
			userPermissions: [
				'MANAGE_CHANNELS',
			],
		});
	}

	async run(msg, args) {
		const type = args.type.toLowerCase();
		const filter = args.filter.toLowerCase();

		if (filter !== 'none' && isNaN(filter)) {
			return msg.reply('`filter` must be a number or `none`.');
		}

		if (type !== 'nsfw' && type != 'sfw') {
			return msg.reply('`type` must be one of `sfw`/`nsfw`.');
		}

		if (msg.channel.type === 'dm') {
			if (filter === 'none') {
				await this.client.settings.remove(`filter.${msg.author.id}`, filter);
			} else {
				await this.client.settings.set(`filter.${msg.author.id}`, filter);
			}
		} else {
			if (filter === 'none') {
				await msg.guild.settings.remove(`filter.${type}`);
			} else {
				await msg.guild.settings.set(`filter.${type}`, filter);
			}
		}

		// DM:    Filter ID...
		// Guild: [TYPE] filter ID...
		return msg.reply(`${msg.channel.type === 'dm' ? 'F' : `${type.toUpperCase()} f`}ilter ID ${filter === 'none' ? 'unset' : `set to ${filter}`}.`);
	}
};
