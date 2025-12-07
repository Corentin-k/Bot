import { Events, MessageFlags } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (!interaction.isChatInputCommand()) return;

        const client = interaction.client;

        const command = client.commands.get(interaction.commandName);

        if (!command) {

            return interaction.reply({
                content: "Cette commande n'existe pas ou n'est plus disponible.",
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            if (command.runSlash) {

                await command.runSlash(client, interaction);
            } else if (command.execute) {

                await command.execute(interaction);
            } else {
                throw new Error("La commande ne contient ni 'runSlash' ni 'execute'.");
            }

        } catch (error) {
            console.error(`Erreur commande ${interaction.commandName}:`, error);

            const errorMsg = {
                content: 'Une erreur est survenue lors de l\'exécution !',
                flags: MessageFlags.Ephemeral
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMsg);
            } else {
                await interaction.reply(errorMsg);
            }
        }
    }
};