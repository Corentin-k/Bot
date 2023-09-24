# Bot discord permettant d'afficher le planning d'une personne 
#### Par @Corentin-k et @kevin-71.
----


Inspiré du [Bot de l'assossiation Crobotic](https://github.com/Crobot-ic/WebSite/tree/main/Server
) et avec l'aide de [@Serquand](https://github.com/Serquand)
  

- [x] Création d'une commande planning
- [X] Création d'une commande donnant des informations sur un livre en
      utilisant l'API de Google
- [X] Création d'une commande donnant des informations sur un film en      utilisant l'API omdbapi
- [ ]  Création d'une commade qui récupére les données et les sauvegarde dans un base de donnée

###    1. <u> Installation</u>
  Depuis le terminal :

        npm install

        npm install discord.js axios node-ical moment moment-timezone

  Installer node.js en suivant les étapes sur https://nodejs.org/fr
  ou avec chocolatey `choco install nodejs`


### 2. <u>Création du fichier .env</u> 
  Créez un fichier .env et suivez les informations du fichier "[.env.example](https://github.com/Corentin-k/Bot/blob/main/.env.example)"
  
  * Pour créer un bot discord --> https://discord.com/developers/
  et Récupérer le token du bot 
  > :warning: Ne jamais envoyer le TOKEN sur internet ou le push sur Github
  
  * Pour récupérer l'identifiant du serveur discord : 

        Paramètre du serveur> widget>IDENTIFIANT DU SERVEUR
    ![Alt text](/src/images/id_serveur.png)
  * Et récupérer l'ID d'un salon :

        Clique droit sur le salon > Copier l'identifiant du salon ID
      ![Alt text](/src/images/id_salon.png)

> :bulb: Il est nécessaire d'avoir une clef API pour accéder aux commandes /livre et /film

  * Récupérer la clef de l'API Google https://developers.google.com/books?hl=fr pour la commande [/livre](/src/commands/livre.ts)
  * Récupérer la clef de l'API OMDb https://www.omdbapi.com/ pour la comande [/film](/src/commands/film.ts)
### 3. <u>Pour lancer le bot</u> 
    npx nodemon

> :warning: Si ca ne fonctionne pas :  npm install -g npm

### Exemple de rendu 

* [Commande /Planning](/src/commands/planning.ts)

    ![Alt text](/src/images/image.png)
    ![Alt text](/src/images/image2.png)

* [Commande /Livre](/src/commands/livre.ts)

    ![Alt text](/src/images/image-livre.png)
* [Commande /Film](/src/commands/film.ts)

    ![Alt text](/src/images/image-film.png)