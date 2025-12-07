import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config();

import { Client, Partials, GatewayIntentBits, Collection } from 'discord.js';

import EventsHandlers from "./Utils/Handlers/EventsHandlers.js";
import CommandsHandlers from "./Utils/Handlers/CommandsHandlers.js";

const libraries = ["discord.js", "axios", "node-ical", "moment", "moment-timezone"];

async function checkLibraries() {
    for (const library of libraries) {
        try {
            await import(library);
        } catch (error) {
            console.error(chalk.red(`Missing library: ${library}`));
            console.error(chalk.red(`Install with >> npm install ${library}`));
            process.exit(1);
        }
    }
}

const createClient = () => {
    return new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ],
        partials: [Partials.Message, Partials.Channel, Partials.Reaction]
    });
};

process.on("exit", (code) => { console.log(`Process exited with code ${code}`); });
process.on("uncaughtException", (err, origin) => { console.error(`uncaughtException:`, err, `origin:`, origin); });
process.on("unhandledRejection", (reason, promise) => { console.error(`unhandledRejection:`, reason, `\nPromise:`, promise); });
process.on("warning", (...args) => { console.warn(...args); });

const mainDiscordJs = async (client) => {
    client.commands = new Collection();

    // Chargement des Handlers
    await EventsHandlers(client);
    await CommandsHandlers(client);
};

const main = async () => {
    await checkLibraries();

    const client = createClient();

    await mainDiscordJs(client);

    try {
        await client.login(process.env.BOT_TOKEN);
    } catch (err) {
        console.error(chalk.red("Login failed:"), err);
        process.exit(1);
    }
};

main().catch(err => {
    console.error("Fatal error in main:", err);
    process.exit(1);
});