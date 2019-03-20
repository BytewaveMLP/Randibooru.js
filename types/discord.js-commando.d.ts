import * as Commando from 'discord.js-commando';

declare module 'discord.js-commando' {
	export type CommandInfo = Commando.CommandInfo & {
		foo: string
	}
}
