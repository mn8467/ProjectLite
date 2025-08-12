// services/boardService.js
// db.js에서 내보낸 promisePool 객체를 올바르게 가져옵니다.
// const { promisePool } = require('../db');
const promisePool = require('../db').promisePool;


/**
 * 게시판 데이터를 조회하는 비동기 함수
 * @param {number} limit - 조회할 게시글의 개수 (기본값 5)
 * @returns {Promise<Array>} - 게시글 데이터 배열
 */
async function getBoard(limit = 5) {
    // a.user_id = u.user_id;로 수정된 올바른 조인 조건
    const query = `
        SELECT
            a.board_id,
            a.user_id,
            u.nickname,
            a.title,
            a.content,
            a.created_at
        FROM
            board AS a
        INNER JOIN
            users AS u
        ON
            a.user_id = u.user_id
        LIMIT ?;
    `;
    
    // db.query() 대신 promisePool.query()를 사용하도록 수정
    const [rows] = await promisePool.query(query, [limit]);
    return rows;
} 


/**
 * 특정 게시글의 상세 데이터를 조회하는 비동기 함수
 * @param {number} boardId - 조회할 게시글의 고유 ID / 받아서 id로 조회
 */

async function getBoardDetail(boardId) {
    const query = `
        SELECT
            a.board_id,
            u.user_id,
            u.nickname,
            a.title,
            a.content,
            a.created_at
        FROM
            board AS a
        INNER JOIN
            users AS u
        ON
            a.user_id = u.user_id
        WHERE
            a.board_id =?;
    `;
    
    // boardId를 매개변수로 전달하여 SQL 인젝션을 방지합니다.
    const [rows] = await promisePool.query(query, [boardId]);
    
    // 상세 페이지는 하나의 게시글만 조회하므로, 배열의 첫 번째 요소만 반환합니다.
    // 게시글이 없을 경우 undefined를 반환합니다.
    return rows[0];
}

module.exports = { getBoard, getBoardDetail };




