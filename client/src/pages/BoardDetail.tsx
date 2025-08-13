import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppTopstrip from '../components/AppTopstrip';
import Sidebar from '../components/Sidebar';
import { Container, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


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
    const formattedDate = date.getFullYear() + '.' +
                          String(date.getMonth() + 1).padStart(2, '0') + '.' +
                          String(date.getDate()).padStart(2, '0');

    const formattedTime = String(date.getHours()).padStart(2, '0') + ':' +
                          String(date.getMinutes()).padStart(2, '0') + ':' +
                          String(date.getSeconds()).padStart(2, '0');

    return (

        <>
                  <Container className="d-flex align-items-center justify-content-center min-vh-100 p-4">
                  {/* Bootstrap Card 컴포넌트를 사용하여 컨테이너를 만듭니다. */}
                  <Card className="shadow-lg p-4 p-md-5 w-100 border-0 rounded-3">
                    {/* 게시글 제목 영역 */}
                    <div className="border-bottom border-2 border-light-subtle pb-4 mb-4 ">
                      <h1 className="fs-3 fw-bolder text-dark leading-tight ">
                              {boardDetailsData.title}
                      </h1>
                      {/* 작성자 및 정보 영역 */}
                      <div className="mt-2 text-muted d-flex flex-wrap gap-4">
                        <span>작성자: <strong className="text-dark">{boardDetailsData.nickname}</strong></span>
                        <span>작성일: {formattedDate} {formattedTime}</span>
                      </div>
                    </div>

                    {/* 게시글 내용 영역 */}
                    {/* Bootstrap은 Tailwind의 'prose'와 같은 기능을 제공하지 않아, 
                        텍스트 가독성을 위해 일부 커스텀 CSS를 사용했습니다. */}
                    <div className="post-content">
                      {boardDetailsData.content}
                    </div>
                    
                    {/* 버튼 영역 */}
                    <div className="mt-4 d-flex justify-content-end">
                      {/* React-Bootstrap Button 컴포넌트를 사용했습니다. */}
                      <Button
                        variant="primary"
                        className="rounded-pill px-4"
                        onClick={() => window.history.back()}
                      >
                        목록으로 돌아가기
                      </Button>
                    </div>
                  </Card>
                </Container>
                    </>
    );
};

export default BoardDetail;