/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const Derpibooru = require('node-derpi');
const Embed = require('../../util/embed');

// TODO: try to not repeat a lot of code from util/derpi-cimmand.js
module.exports = class ReverseCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'reverse',
			aliases: ['rev', 'rs', 'ris'],
			group: 'derpi',
			memberName: 'reverse',
			description: 'Runs a reverse image search an image or link',
			examples: ['reverse [WITH IMAGE ATTACHMENT]', 'reverse https://cdn.discordapp.com/foo/bar.jpg'],
			args: [
				{
					key: 'url',
					label: 'url',
					default: '',
					prompt: '',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const requestId = `${msg.channel.id}:${msg.id} -`;

		console.log(`${requestId} Received reverse image search request.`);

		if (msg.channel.type === 'text' && msg.guild.settings.get(`blockedUsers.${msg.author.id}`)) {
			console.info(`${requestId} Blocked by adminstrator.`);
			return;
		}

		let searchUrl = '';
		if (args.url !== '') {
			searchUrl = args.url;
		} else if (msg.attachments.size >= 1) {
			searchUrl = msg.attachments.first().url;
		} else {
			console.log(`${requestId} Missing searchable parameters.`);
			return msg.reply('I need an attachment or a link to reverse image search with!');
		}

		console.debug(`${requestId} Sending typing notification...`);
		msg.channel.startTyping();

		console.log(`${requestId} Search URL: ${searchUrl}`);

		let results;

		try {
			results = await Derpibooru.Fetch.reverseImageSearch({
				url: searchUrl
			});
		} catch (e) {
			console.log(`${requestId} ${e}`);
			return msg.reply(`Derpibooru couldn't access the image you provided: ${e.message}`);
		} finally {
			await msg.channel.stopTyping();
		}

		if (results.images.length < 1) return msg.reply(`query: \`${searchUrl}\`: No results found.`);

		let result = results.images[0];

		if (this.client.config.derpibooru.blockedTags && result.tagNames.some(tag => this.client.config.derpibooru.blockedTags.includes(tag))) {
			const blockedTags = result.tagNames.filter(tag => this.client.config.derpibooru.blockedTags.includes(tag)).join(', ');

			console.log(`${requestId} Result https://derpibooru.org/${result.id} violates blocked tag rules: ${blockedTags}`);
			return msg.reply(`*A result was found, but was blocked by the bot's host for containing the following tags: \`${blockedTags}\`, likely in compliance with Discord's ToS. See <https://discordapp.com/guidelines>.*`);
		}

		console.info(`${requestId} Result found - https://derpibooru.org/${result.id}; sending embed...`);

		console.debug(`${requestId} Creating embed from result...`);
		let replyEmbed = await Embed.derpibooruResultToEmbed(result);

		let resolution;
		if (msg.channel.type === 'dm') {
			resolution = this.client.settings.get(`embedResolution.${msg.author.id}`, 'medium');
		} else {
			resolution = msg.guild.settings.get('embedResolution', 'medium');
		}
	
		switch (resolution) {
		case 'full':
			replyEmbed.image.url = result.representations.full;
			break;
		case 'high':
			replyEmbed.image.url = result.representations.large;
			break;
		case 'medium':
			replyEmbed.image.url = result.representations.medium;
			break;
		case 'low':
			replyEmbed.image.url = result.representations.small;
			break;
		}

		return msg.reply(`query: \`${searchUrl}\``, {
			embed: replyEmbed
		});
	}
};
