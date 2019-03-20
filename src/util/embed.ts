/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Discord from 'discord.js';
import * as Derpibooru from 'node-derpi';

const Jimp = require('jimp');
const ColorThief = require('color-thief-jimp');

 /**
  * Converts a Derpibooru image to a Discord.js embed
  *
  * @param result - The image to convert
  * @return The resulting embed
  */
 export async function derpibooruResultToEmbed(result: Derpibooru.Image): Promise<Discord.RichEmbedOptions> {
	return new Promise((resolve) => {
		let data: Discord.RichEmbedOptions = {
			color: Math.floor(Math.random() * (16777216)),
			title: 'Derpibooru Image',
			url: `https://derpibooru.org/${result.id}`,
			author: {
				name: `Uploaded by: ${result.uploaderName}`
			},
			fields: [
				{
					name: 'Tags',
					value: result.tagString.split(', ').splice(0, 10).join(', ') + (result.tags.length > 10 ? '...' : '')
				},
				{
					name: 'Uploaded on',
					value: result.created.toDateString()
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

		if (!data.author) return null; // the world must really hate you if you hit this line
		if (result.uploaderID !== -1) data.author.url = `https://derpibooru.org/profiles/${encodeURIComponent(result.uploaderName)}`;

		// Can't process webms
		if (result.representations.thumbnailSmall.split('.').pop() === 'webm') return resolve(data);

		Jimp.read(result.representations.thumbnailSmall, (err: Error | string, image: any) => {
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
}
