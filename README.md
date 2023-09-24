# Bot discord permettant d'afficher le planning d'une personne 
#### Par @Corentin-k et @kevin-71.
----


Inspiré du Bot de l'assossiation Crobotic et avec l'aide de @Serquand
  https://github.com/Crobot-ic/WebSite/tree/main/Server



- [x] Création d'une commande planning
- [X] Création d'une commande donnant des informations sur un livre en
      Utilisant l'API de Google
- [X] Création d'une commande donnant des informations sur un film en      utilisant l'API omdbapi
- [ ]  Création d'une commade qui récupére les données et les sauvegarde dans un base de donnée

###    1.  installation : 

    Depuis le terminal :

        npm install

        npm install discord.js axios node-ical moment moment-timezone

    Installer node.js en suivant les étapes sur https://nodejs.org/fr
    ou avec chocolatey `choco install nodejs`
    
    - Créer le fichier .env en suivant le fichier .env.example

### 2. Pour lancer : 
    - npx nodemon

> :warning: Si ca ne fonctionne pas :  npm install -g npm

### Exemple de rendu 

* [Commande Planning](/src/commands/planning.ts)

    ![Alt text](/src/images/image.png)
    ![Alt text](/src/images/image2.png)

