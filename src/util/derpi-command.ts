/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Embed from './embed';
import * as Derpibooru from 'node-derpi';
import * as Discord from 'discord.js';
import * as Commando from 'discord.js-commando';

import { RandibooruClient } from '../../types/RandibooruClient';

/**
 * Handles an incoming Derpibooru-related command.
 *
 * @param options - The options to pass to Derpibooru
 * @param client - The Discord.js client object (this.client in command context)
 * @param msg - The Discord.js message object (first param in async run)
 * @param args - The arguments to the command (second param in async run)
 */
export async function handleDerpiCommand(options: Derpibooru.SearchOptions, client: RandibooruClient, msg: Commando.CommandMessage, args: { query: string }) {
	let requestId = `[${new Date().toISOString()}] [@${msg.author.username}#${msg.author.discriminator} `;

	if (msg.channel.type === 'dm' && msg.channel instanceof Discord.DMChannel) {
		requestId += `(DM)`;
	} else if (msg.channel.type === 'group' && msg.channel instanceof Discord.GroupDMChannel) {
		requestId += `(GDM - ${msg.channel.name} [${msg.channel.id}])`;
	} else if (msg.channel.type === 'text' && msg.channel instanceof Discord.TextChannel) {
		requestId += `(${msg.channel.guild.name} [${msg.channel.guild.id}] #${msg.channel.name} [${msg.channel.id}])`;
	}

	if (args.query) {
		requestId += `, query ${args.query}`;
	}

	requestId += ']';

	console.info(`${requestId} Request received.`);
	console.debug(`${requestId} Options: ${JSON.stringify(options)}`);

	if (msg.channel.type === 'text' && (msg.guild as Commando.GuildExtension).settings.get(`blockedUsers.${msg.author.id}`)) {
		console.info(`${requestId} Blocked by adminstrator.`);
		return;
	}

	console.debug(`${requestId} Sending typing notification...`);
	msg.channel.startTyping();

	options.query = args.query;

	let nsfw = false;

	// Only NSFW channels can have explicit content
	// (Assumes DMs are fine)
	if (msg.channel.type === 'dm' || msg.channel.type === 'group') {
		options.filterID = client.config.derpibooru.filters.nsfw;
		console.debug(`${requestId} Request is in a DM; NSFW filter enabled.`);
		nsfw = true;
	} else if (msg.channel instanceof Discord.TextChannel && msg.channel.nsfw) {
		options.filterID = (msg.guild as Commando.GuildExtension).settings.get('filter.nsfw', client.config.derpibooru.filters.nsfw);
		console.debug(`${requestId} Request was sent in a channel marked NSFW; NSFW filter enabled.`);
		nsfw = true;
	} else {
		options.filterID = (msg.guild as Commando.GuildExtension).settings.get('filter.sfw', client.config.derpibooru.filters.sfw);
		console.debug(`${requestId} Request was not sent in an NSFW channel; using SFW filter.`);
	}

	console.debug(`${requestId} Using filter ID ${options.filterID}`);

	let searchResults;

	try {
		searchResults = await Derpibooru.Fetch.search(options);
	} catch (err) {
		console.debug(`${requestId} Stopping typing notification...`);
		msg.channel.stopTyping();
		console.error(`${requestId} ERROR: ${err.message}`);
		return msg.reply(`An error occurred: ${err.message}`);
	}

	// Sometimes, the typing indicator gets stuck, so let's reset it here
	console.debug(`${requestId} Stopping typing notification...`);
	msg.channel.stopTyping();

	let messagePrefix = args.query !== '' ? `query: \`${args.query}\`: ` : '';

	let results = searchResults.images;
	let result;

	if (results.length > 0) {
		result = results[options.sortFormat === 'random' ? Math.floor(Math.random() * results.length) : 0];
	}

	if (result === undefined) {
		console.info(`${requestId} No results found.`);
		return msg.reply(`${messagePrefix}No ${!nsfw ? 'safe-for-work ' : ''}images found for query: \`${args.query}\``);
	} else if (client.config.derpibooru.blockedTags && result.tagString.split(', ').some(tag => client.config.derpibooru.blockedTags.includes(tag))) {
		console.log(`${requestId} Result found, but would violate blocked tag rules`);
		return msg.reply(`${messagePrefix}A result was found, but was blocked by the bot's host, likely due to ToS enforcement. See https://discordapp.com/guidelines.`);
	}

	console.info(`${requestId} Result found - https://derpibooru.org/${result.id}; sending embed...`);

	console.debug(`${requestId} Creating embed from result...`);
	let replyEmbed = await Embed.derpibooruResultToEmbed(result);

	return msg.reply(messagePrefix, {
		embed: replyEmbed
	});
}
