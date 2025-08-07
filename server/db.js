const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool
({
  host: 'concave-db.cnoqa4uyoqo3.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
  database: 'test123',
  password: 'alsghwjd6588!',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const getUsers = async ()=>
{
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('select * from users;');
    console.log(rows);
    return rows;
};

module.exports = 
{
    getUsers
};