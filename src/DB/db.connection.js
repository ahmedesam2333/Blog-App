import mysql2 from "mysql2";

const connectDB = () => {
  const dbConnection = mysql2.createConnection({
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  dbConnection.connect((err) => {
    if (err) {
      console.log(`Fail to connect to DB ❌`, err);
    } else console.log(`DB Connected Successfully 🚀`);
  });
  return dbConnection;
};

export default connectDB;
