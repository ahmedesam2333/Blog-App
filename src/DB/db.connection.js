import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

export const checkDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const syncDB = async () => {
  try {
    const result = await sequelize.sync({ alter: false, force: false });
    console.log("DB Sync");
  } catch (error) {
    console.error("Unable to Sync", error);
  }
};
