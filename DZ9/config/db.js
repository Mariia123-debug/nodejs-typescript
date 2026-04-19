import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "auth_homework_db", // имя БД
  "root",             // пользователь (если другой — скажешь)
  "masha",                 // пароль (если есть — впишешь)
  {
    host: "localhost",
    dialect: "mysql",
  }
);

export default sequelize;