import Users from"./User";
import UsersFilms from"./UserFilm";


import Livres from "./DBlivres";
import Films from "./DBfilms";


const Setup: () => Promise<void> = async (): Promise<void> => {
    await Users.sync();
    await UsersFilms.sync();
    await Livres.sync();
    await Films.sync();
};

export default Setup;