import { Dialect, Sequelize } from "sequelize";

export default new Sequelize(process.env.DB_NAME as string, process.env.BD_USER as string, process.env.DB_PWD as string, {
    host: process.env.DB_HOST as string, 
    dialect: process.env.DB_DIALECT as Dialect, 
    logging: false
});