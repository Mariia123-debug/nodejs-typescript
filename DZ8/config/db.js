import Sequelize from 'sequelize';
import configFile from './config.json' with { type: 'json' };

const env = 'development';
const config = configFile[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
);

export default sequelize;