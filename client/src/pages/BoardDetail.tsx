import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface BoardDetail{
    board_id: number; // 게시글 ID
    nickname: string;
    title: string;
    content: string;
    created_at: string;
}

const BoardDetail: React.FC = () => {
    // useParams 훅을 사용하여 URL에서 'id' 파라미터를 가져옵니다.
    const { boardId } = useParams<{ boardId: string }>();

    const [boardDetailsData, setBoardDetailData] = useState<BoardDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // id가 없으면 로딩을 멈추고 오류를 표시합니다.
        if (!boardId) {
            setError('게시글 ID가 없습니다.');
            setIsLoading(false);
            return;
        }

        const fetchPostDetail = async () => {
            try {
                // `fetch` 요청 URL에 `id`를 사용하도록 수정합니다.
                const response = await fetch(`http://localhost:8080/board/${boardId}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP 오류! 상태: ${response.status}`);
                }
                
                // 응답은 단일 객체이므로, 배열로 받지 않도록 수정합니다.
                const boardDetailsData: BoardDetail = await response.json();
                setBoardDetailData(boardDetailsData);
                
            } catch (err) {
                console.error('게시글을 불러오는 중 오류 발생:', err);
                setError('게시글을 불러오는 데 실패했습니다.');
                
            } finally {
                setIsLoading(false);
            }
        };

        fetchPostDetail();
    // 의존성 배열에 id를 추가하여, URL의 ID가 변경될 때마다 훅이 다시 실행되도록 합니다.
    }, [boardId]);

    if (isLoading) {
        return <div>게시글을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    // 데이터가 없을 경우 (예: ID가 존재하지 않는 게시글)
    if (!boardDetailsData) {
        return <div>해당 게시글을 찾을 수 없습니다.</div>;
    }

    // 날짜 포맷팅 (YYYY-MM-DD)
    const date = new Date(boardDetailsData.created_at);
    const formattedDate = date.getFullYear() + '-' +
                          String(date.getMonth() + 1).padStart(2, '0') + '-' +
                          String(date.getDate()).padStart(2, '0');

    return (
        <div className="outer">
            <h2>게시글 상세정보</h2>
            <div className="overflow-x-auto">
                <table className='detail-table'>
                        <tr>
                        <th colSpan={4}>{boardDetailsData.title}</th>
                        </tr>
                        <tr>
                        <th>작성자</th>
                        <td>{boardDetailsData.nickname}</td>
                        <th>작성일</th>
                        <td>{formattedDate}</td>
                        </tr>
                        <tr>
                        <th>글내용</th>
                        <td colSpan={3} style={{ height: "200px" }}>{boardDetailsData.content}</td>
                        </tr>
                </table>
            </div>
        </div>
    );
};

export default BoardDetail;