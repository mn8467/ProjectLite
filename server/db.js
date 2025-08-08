// db.js
const mysql = require('mysql2');

// Create the connection pool.
const pool = mysql.createPool({
    host: 'concave-db.cnoqa4uyoqo3.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    database: 'test123',
    password: 'alsghwjd6588!',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// getUsers 함수는 예시이므로 주석 처리
// const getUsers = async () => {
//     const promisePool = pool.promise();
//     const [rows] = await promisePool.query('select * from users;');
//     console.log(rows);
//     return rows;
// };

// promise()를 사용하여 promisePool을 바로 내보내는 것이 더 효율적입니다.
const promisePool = pool.promise();

// 다른데서 db를 사용하기위해 pool을 내보내기위한 코드
module.exports = {
    promisePool
};