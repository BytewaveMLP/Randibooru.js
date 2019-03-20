/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Snowflake } from 'discord.js';

export interface RandibooruConfig {
	bot: {
		owner: Snowflake | Snowflake[],
		commandPrefix: string,
		invite: string
	};
	auth: {
		discordToken: string
	};
	derpibooru: {
		filters: {
			sfw: number,
			nsfw: number
		},
		blockedTags: string[]
	};
	statusApi: {
		sites: { url: string, authPrefix: string, token: string }[]
	}
}
