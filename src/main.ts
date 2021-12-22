import "reflect-metadata";
import { Intents, Interaction, Message } from "discord.js";
import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";
import dotenv from "dotenv"
import mysql from "mysql"

const client = new Client({
  simpleCommand: {
    prefix: "!",
  },
  intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ],
  // If you only want to use global commands only, comment this line
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  silent: true,
});

client.once("ready", async () => {
	// make sure all guilds are in cache
	await client.guilds.fetch();

	// init all application commands
	await client.initApplicationCommands({
		guild: { log: true },
		global: { log: true },
	});

	// init permissions; enabled log to see changes
	await client.initApplicationPermissions(true);

	// uncomment this line to clear all guild commands,
	// useful when moving to global commands from guild commands
	//  await client.clearApplicationCommands(
	//    ...client.guilds.cache.map((g) => g.id)
	//  );

	const connection = mysql.createConnection({
		host     : 	process.env.MYSQL_HOST,
		user     : 'root',
		password : 'secret',
		database : 'bot-db'
	});

	connection.connect();

	console.log("Bot started");
});

client.on("interactionCreate", (interaction: Interaction) => {
  client.executeInteraction(interaction);
});

client.on("messageCreate", (message: Message) => {
  client.executeCommand(message);
});

dotenv.config();

async function run() {
  await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");

  client.login(process.env.BOT_TOKEN ?? "");
}

run();