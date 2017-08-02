/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const handler = require('../../util/derpi-command.js');

module.exports = class FirstCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'latest',
			aliases: ['l'],
			group: 'derpi',
			memberName: 'latest',
			description: 'Gets the latest image uploaded to Derpibooru matching the given query',
			examples: ['latest', 'latest safe', 'latest safe, -anthro, (this OR that)'],
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
		handler.handleDerpiCommand({
			sortFormat: 'created_at',
			order: 'desc'
		}, this.client, msg, args);
	}
};