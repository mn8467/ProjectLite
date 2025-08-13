// services/boardService.js
const promisePool = require('../db').promisePool;

/**
 * 새로운 게시글 생성
 */
async function createBoard(boardData) {
    //  주석과 변수명 불일치 → 일치시킴
    const { user_id, title, content } = boardData; // 기존 userId → user_id
    const query = `
        INSERT INTO board (user_id, title, content)
        VALUES (?, ?, ?);
    `;
    const [result] = await promisePool.query(query, [user_id, title, content]);
    return result;
}

async function getBoard() {
    try { // [추가] 에러 핸들링
        const query = `
            SELECT
                a.board_id,
                a.user_id,
                u.nickname,
                a.title,
                a.content,
                a.created_at
            FROM board AS a
            INNER JOIN users AS u
            ON a.user_id = u.user_id;
        `;
        const [rows] = await promisePool.query(query);
        return rows;
    } catch (err) {
        console.error("getBoard 쿼리 오류:", err);
        throw err;
    }
}

async function getBoardDetail(boardId) {
    try { //  [추가] 에러 핸들링
        const query = `
            SELECT
                a.board_id,
                u.user_id,
                u.nickname,
                a.title,
                a.content,
                a.created_at
            FROM board AS a
            INNER JOIN users AS u
            ON a.user_id = u.user_id
            WHERE a.board_id = ?;
        `;
        const [rows] = await promisePool.query(query, [boardId]);
        return rows[0];
    } catch (err) {
        console.error("getBoardDetail 쿼리 오류:", err);
        throw err;
    }
}

module.exports = { getBoard, getBoardDetail, createBoard };