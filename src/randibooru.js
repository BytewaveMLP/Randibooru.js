/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const Helpers = require('./util/helpers.js');
const path = require('path');
const sqlite = require('sqlite');
const config = require('../config');

const client = new Commando.Client(config.bot);

client.config = config;

client.registry
	.registerGroups([
		['derpi', 'Derpibooru'],
		['admin', 'Administrative', true]
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
	sqlite.open(path.join(path.dirname(__dirname), 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', async msg => {
		if (process.env.NODE_ENV !== 'production') {
			console.log(msg);
		}
	})
	.on('ready', async () => {
		console.log(`Initialized - logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
		let link = await client.generateInvite(['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGES']);
		console.log(`Use this link to invite me to your server: ${link}`);
		await Helpers.setGame(client);
	})
	.on('disconnect', async () => { console.warn('Disconnected!'); })
	.on('reconnecting', async () => { console.warn('Reconnecting...'); })
	.on('guildCreate', async (guild) => {
		// Handles case in which guildCreate events could be sent randomly, causing the welcome message to be sent
		// to servers the bot has already joined.
		// This doesn't happen often, but once is once too many.
		if (Date.now() - guild.joinedTimestamp > 120) return;

		await Helpers.setGame(client);

		console.log(`Joined server ${guild.name} (${guild.id})`);

		let channels = guild.channels.filter((channel) => {
			return channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES');
		});

		if (channels.array().length > 0) {
			channels = channels.sort((a, b) => {
				return a.calculatedPosition - b.calculatedPosition;
			}).array();

			console.log('Posting join message in highest channel with SEND_MESSAGES permission...');
			await channels[0].send(`**Hey there!** I'm **Randibooru.js**, the next generation of Randibooru! I fetch random images from Derpibooru, the MLP image booru, for your enjoyment.

If you'd like to know what I can do, take a look at the \`${guild.commandPrefix || client.commandPrefix || client.options.commandPrefix}help\` command!

**Want to see my source code?** Here ya go!
https://github.com/BytewaveMLP/Randibooru.js

**Join my Discord server!**
${config.bot.invite}`).catch(console.error);
		}
	})
	.on('guildDelete', async (guild) => {
		await Helpers.setGame(client);
		console.log(`Removed from server ${guild.name} (${guild.id})`);
	})
	.on('commandError', async (cmd, err) => {
		if (err instanceof Commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', async (msg, reason) => {
		console.log(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''} blocked; ${reason}`);
	})
	.on('commandPrefixChange', async (guild, prefix) => {
		console.log(`Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
		if (!guild) {
			await Helpers.setGame(client);
		}
	})
	.on('commandStatusChange', async (guild, command, enabled) => {
		console.log(`Command ${command.groupID}:${command.memberName} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	})
	.on('groupStatusChange', async (guild, group, enabled) => {
		console.log(`Group ${group.id} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	});

client.login(config.auth.discordToken);
