import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default async (client) => {

    const eventsPath = path.join(__dirname, '../../Events');

    // Vérifie si le dossier existe pour éviter un crash
    if (!fs.existsSync(eventsPath)) {
        console.log(chalk.red(`[ERREUR] Le dossier Events est introuvable au chemin : ${eventsPath}`));
        return;
    }

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);

        try {
            const eventModule = await import(`file://${filePath}`);

            const event = eventModule.default;

            if (!event || !event.name || !event.execute) {
                console.log(chalk.yellow(`⚠️  Fichier ignoré (structure incorrecte) -> ${file}`));
                continue;
            }

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }

            console.log(chalk.green(`Événement chargé : ${event.name}`));

        } catch (error) {
            console.error(chalk.red(`Erreur lors du chargement de ${file}:`), error);
        }
    }
};