/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class FilterCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'resolution',
			aliases: ['res'],
			group: 'admin',
			memberName: 'resolution',
			description: 'Set Randibooru\'s preferred resolution for image embeds.',
			details: 'Higher values will make images in embeds appear nicer on high-DPI displays, but may cause issues on mobile devices with animated or absurd resolution images.\n`full`: full resolution, no resizing\n`high`: ~1500x maximum\n`med`/`medium`: ~750x maximum (*default*)\n`low`: ~300x maximum',
			examples: ['res full', 'res high', 'res medium', 'res low'],
			args: [
				{
					key: 'res',
					label: 'res',
					prompt: '',
					default: 'medium',
					type: 'string',
				}
			],
			userPermissions: [
				'MANAGE_CHANNELS',
			],
		});
	}

	async run(msg, args) {
		let res = args.res.toLowerCase();

		if (res === 'med') res = 'medium';

		if (!['full', 'high', 'medium', 'low'].includes(res)) return msg.reply(`Invalid resolution: ${res}. See \`help res\`.`);

		if (msg.channel.type === 'dm') {
			await this.client.settings.set(`embedResolution.${msg.author.id}`, res);
		} else {
			await msg.guild.settings.set('embedResolution', res);
		}
		return msg.reply(`Embedded image resolution set to \`${res}\`.`);
	}
};
