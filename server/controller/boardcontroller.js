const express = require('express');
const board = express.Router();

// BoardService 모듈을 불러옵니다.
// 이 라우터는 서비스에 의존하며, 직접 데이터베이스에 접근하지 않습니다.
const { getBoard,getBoardDetail } = require('../service/boardservice');

// [GET] / 요청에 대한 핸들러.
// 이 파일은 라우터이면서 컨트롤러의 역할도 함께 수행합니다.
board.get('/', async (req, res) => {
    try {
        // getBoard 함수를 호출하여 게시판 데이터를 가져옵니다.
        const boardData = await getBoard();
        res.status(200).json(boardData);
    } catch (error) {
        console.error('게시판 데이터 조회 중 오류 발생:', error);
        res.status(500).json({ error: '게시판 데이터를 가져오는 중 오류가 발생했습니다.' });
    }
});

// [GET] /board/:id 요청에 대한 핸들러.
// 특정 게시글의 상세 데이터를 조회합니다.

board.get('/:id', async (req, res) => {
    const boardId = parseInt(req.params.id, 10); // 가져온 문자를 10진수 정수로 변환하여 숫자값으로 처리
    


    if (isNaN(boardId)) {
            console.log('요청된 게시글 ID:', boardId);

        return res.status(400).json({ error: '유효하지 않은 게시글 ID입니다.' });
    }

    try {
        // getBoardDetail 함수를 호출하여 특정 게시글의 상세 데이터를 가져옵니다.
        const boardDetail = await getBoardDetail(boardId);
        console.log('게시글 상세 데이터:', boardDetail);
        if (!boardDetail) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }
        
        res.status(200).json(boardDetail);
    } catch (error) {
        console.error('게시글 상세 조회 중 오류 발생:', error);
        res.status(500).json({ error: '게시글 상세 데이터를 가져오는 중 오류가 발생했습니다.' });
    }
});

// 외부에서 이 라우터를 사용할 수 있도록 모듈로 내보냅니다.
module.exports = board;
