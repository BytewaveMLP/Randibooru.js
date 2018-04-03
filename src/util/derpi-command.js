const derpi = require('./derpi.js');
const embed = require('./embed.js');

/**
 * Handles an incoming Derpibooru-related command.
 *
 * @param {object} options - The options to pass to Derpibooru
 * @param {string} [options.sortFormat] - The sort format to pull a result from
 * @param {string} [options.order] - The order to sort the results in before retrieving one
 * @param {object} client - The Discord.js client object (this.client in command context)
 * @param {object} msg - The Discord.js message object (first param in async run)
 * @param {object} args - The arguments to the command (second param in async run)
 */
exports.handleDerpiCommand = (options, client, msg, args) => {
	let requestId = `[${new Date().toISOString()}] [@${msg.author.username}#${msg.author.discriminator} in `;

	if (msg.channel.type === 'dm') {
		requestId += 'a DM';
	} else if (msg.channel === 'group') {
		requestId += `a group DM (${msg.channel.name}`;
	} else {
		requestId += `${msg.channel.guild.name} #${msg.channel.name}`;
	}

	if (args.query) {
		requestId += ` with query ${args.query}`;
	}

	requestId += ']';

	console.info(`${requestId} Received.`);
	console.debug(`${requestId} Options: ${JSON.stringify(options)}`);

	if (msg.channel.type === 'text' && msg.guild.settings.get(`blockedUsers.${msg.author.id}`)) {
		console.info(`${requestId} Blocked by adminstrator.`);
		return;
	}

	console.debug(`${requestId} Sending typing notification...`);
	msg.channel.startTyping();

	options.query = args.query;

	// Only NSFW channels can have explicit content
	// (Assumes DMs are fine)
	if (msg.channel.type === 'dm' || msg.channel.type === 'group') {
		options.filter = client.condfig.derpibooru.filters.nsfw;
		console.debug(requestId + ' Request is in a DM; NSFW filter enabled.');
	} else if (msg.channel.nsfw) {
		options.filter = msg.guild.settings.get('filter.nsfw', client.config.derpibooru.filters.nsfw);
		console.debug(requestId + ' Request was sent in a channel marked NSFW; NSFW filter enabled.');
	} else {
		options.filter = msg.guild.settings.get('filter.sfw', client.config.derpibooru.filters.sfw);
		console.debug(requestId + ' Request was not sent in an NSFW channel; using SFW filter.');
	}

	console.debug(requestId + `Using filter ID ${options.filter}`);

	derpi.query(options, (err, data) => {
		// Sometimes, the typing indicator gets stuck, so let's reset it here
		console.debug(`${requestId} Stopping typing notification...`);
		msg.channel.stopTyping();

		if (err) {
			console.error(`${requestId} ERROR: ${err.message}`);
			return msg.reply(`An error occurred: ${err.message}`);
		}

		let results = data.search;
		let result;

		if (results.length > 0) {
			result = results[options.sortFormat === 'random' ? Math.floor(Math.random() * results.length) : 0];
		}

		if (result === undefined) {
			console.info(`${requestId} No results found.`);
			return msg.reply(`No ${!nsfw ? 'safe-for-work ' : ''}images found for query: \`${args.query}\``);
		}

		console.info(`${requestId} Result found - https://derpibooru.org/${result.id}; sending embed...`);

		console.debug(`${requestId} Creating embed from result...`);
		let replyEmbed = embed.derpibooruResultToEmbed(result);

		return msg.reply(args.query !== '' ? `query: \`${args.query}\`` : '', {
			embed: replyEmbed
		});
	});
};
