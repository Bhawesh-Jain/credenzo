import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 100,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0
});

export default db;
