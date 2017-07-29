/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const derpi = require('../../util/derpi.js');

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
		derpi.query('random', query, function (err, result) {
			if (err) {
				return msg.reply(`An error occurred: ${err.message}`);
			} else if (result === null) {
				return msg.reply(`No images found for query: \`${query}\``);
			}
			return msg.reply('https://derpibooru.org/' + result.id);
		});
	}
};