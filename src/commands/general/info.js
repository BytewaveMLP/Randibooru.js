/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const Helpers = require('../../util/helpers.js');

module.exports = class InfoCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['i'],
			group: 'commands',
			memberName: 'info',
			description: 'Gets basic info about the bot.',
			details: 'Contains an invite link to the bot\'s support server, as well as a link to the bot\'s GitHub repository.',
			guarded: true,
		});
	}

	async run(msg) {
		let guilds = await Helpers.getGuilds(this.client);

		let link = await this.client.generateInvite(['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGES']);

		msg.reply(`**Hey there**, I'm Randibooru! I fetch random images from Derpibooru (<https://derpibooru.org>), the MLP image booru, for your enjoyment.

I'm currently serving **${guilds.toLocaleString()}** servers, and hope to grow soon! If you want to help me grow, feel free to invite me to your server!
<${link}>

If you need help getting me to work, try using the \`${msg.guild ? (msg.guild.commandPrefix || this.client.commandPrefix || this.client.options.commandPrefix) : ''}help\` command. From there, you can see a list of all the commands I have available.

**GitHub repository**
https://github.com/BytewaveMLP/Randibooru.js

**Support server** (send feature requests and bug reports here!)
${this.client.config.bot.invite}`);
	}
};
