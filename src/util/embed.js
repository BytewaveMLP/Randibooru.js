/**
 * Converts a Derpibooru image to a Discord.js embed
 * 
 * @param {object} result - The image to convert
 * @return {object} - The resulting embed
 */
exports.derpibooruResultToEmbed = (result) => {
	let data = {
		embed: {
			color: Math.floor(Math.random() * (16777216)),
			title: 'Derpibooru Image',
			url: `https://derpibooru.org/${result.id}`,
			author: {
				name: `Uploaded by: ${result.uploader}`
			},
			fields: [
				{
					name: 'Tags',
					value: result.tags.split(', ').splice(0, 10).join(', ') + (result.tags.length > 10 ? '...' : '')
				},
				{
					name: 'Uploaded on',
					value: new Date(result.created_at).toDateString()
				},
				{
					name: 'Score',
					value: `${result.score} (+${result.upvotes}/-${result.downvotes})`,
					inline: true
				},
				{
					name: 'Faves',
					value: `${result.faves}`,
					inline: true
				}
			],
			image: {
				url: `https:${result.representations.medium}`
			},
			footer: {
				icon_url: 'https://i.imgur.com/GJBeBoQ.jpg',
				text: 'Randibooru.js - Made with <3 by Bytewave'
			}
		}
	};

	if (result.uploader_id) data.embed.author.url = `https://derpibooru.org/profiles/${encodeURIComponent(result.uploader)}`;

	return data;
};