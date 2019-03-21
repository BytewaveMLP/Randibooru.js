/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const Jimp = require('jimp');
const ColorThief = require('color-thief-jimp');

/**
 * Helper function to slugify a URL parameter using the same format Derpibooru uses
 * 
 * See https://github.com/BytewaveMLP/node-derpi/blob/8e50b1e4a59365e3bac75bad15292c18a20c50ab/lib/util/Helpers.ts
 *
 * @param {string} param - The URL parameter to slugify
 * @returns The sluggified parameter
 */
function slugify(param) {
	return param
		.replace('-', '-dash-')
		.replace('/', '-fwslash-')
		.replace('\\', '-bwslash-')
		.replace(':', '-colon-')
		.replace('.', '-dot-')
		.replace('+', '-plus-');
}

/**
 * Converts a Derpibooru image to a Discord.js embed
 *
 * @param {object} result - The image to convert
 * @return {object} - The resulting embed
 */
exports.derpibooruResultToEmbed = async (result) => {
	return new Promise((resolve) => {
		let uploaderNameText = `${result.uploaderName}`;
		if (result.uploaderID && result.uploaderID > 0) {
			uploaderNameText = `[${uploaderNameText}](https://derpibooru.org/profiles/${encodeURIComponent(result.uploaderName)})`;
		}

		let data = {
			color: Math.floor(Math.random() * (16777216)),
			title: 'Derpibooru Image',
			url: `https://derpibooru.org/${result.id}`,
			author: {
				name: 'Unknown Artist'
			},
			fields: [
				{
					name: 'Tags',
					value: result.tagString.split(', ').splice(0, 10).join(', ') + (result.tags.length > 10 ? '...' : '')
				},
				{
					name: 'Uploaded',
					value: `${result.created.toDateString()} by ${uploaderNameText}`
				},
				{
					name: 'Score',
					value: `${result.score} (+${result.upvotes}/-${result.downvotes})`,
					inline: true
				},
				{
					name: 'Faves',
					value: `${result.favorites}`,
					inline: true
				}
			],
			image: {
				url: result.representations.medium
			},
			footer: {
				icon_url: 'https://i.imgur.com/qidEKrL.png',
				text: 'Randibooru.js - Made with <3 by Bytewave'
			}
		};

		if (result.artistName) {
			data.author.name = result.artistName;
			data.author.url  = `https://derpibooru.org/tags/${slugify(`artist:${result.artistName}`)}`;
		}

		// Can't process webms
		if (result.representations.thumbnailSmall.split('.').pop() === 'webm') return resolve(data);

		Jimp.read(result.representations.thumbnailSmall, (err, image) => {
			if (err) {
				// Record the error, but since it isn't fatal, just continue with the random color we generated earlier
				console.error(err);
				return resolve(data);
			}

			try {
				data.color = parseInt(ColorThief.getColorHex(image), 16);
			} catch (err) {
				// Again, it isn't fatal, so we can just continue
				console.error(err);
			}

			resolve(data);
		});
	});
};
