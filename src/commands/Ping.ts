import { Client, Interaction } from "discord.js";

module.exports = {
    name: "ping", 
    description: "Answer by Pong !", 
    runSlash: (client: Client, interaction: any) => {
        interaction.reply({
            content: `Pong! Latence de ${Date.now() - interaction.createdTimestamp}ms`,
            ephemeral: true 
        });
    }
}