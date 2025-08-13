import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CheckLogin from '../components/CheckLogin';
import { Alert, Button } from 'react-bootstrap'; // Bootstrap Alert와 Button 추가

interface Post {
    board_id: number;
    nickname: string;
    title: string;
    created_at: string;
}

const Board: React.FC = () => {
    const { isLoggedIn } = CheckLogin(); // 필요한 isLoggedIn 상태만 가져옵니다.
    const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate 훅을 사용합니다.
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'danger' } | null>(null);

    // "글 작성하기" 버튼 클릭 시 실행될 함수
    const handleWriteButtonClick = () => {
        // 로그인 상태를 확인합니다.
        if (!isLoggedIn) {
            // 로그인되어 있지 않다면 알림 메시지를 설정하고

            alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
            // 로그인 페이지로 이동시킵니다.
            navigate('/login');
        } else {
            // 로그인되어 있다면 글쓰기 페이지로 이동합니다.
            navigate('/board/write');
        }
    };
    
    // 컴포넌트가 처음 렌더링될 때 API를 호출하는 useEffect 훅입니다.
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const response = await fetch('http://localhost:8080/board');
                
                if (!response.ok) {
                    throw new Error(`HTTP 오류! 상태: ${response.status}`);
                }
                
                const boardData: Post[] = await response.json();
                setPosts(boardData);
            } catch (err) {
                console.error('데이터를 불러오는 중 오류 발생:', err);
                setError('게시글 목록을 불러오는 데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBoardData();
    }, []);

    // 로딩 중일 때 보여줄 UI
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen text-gray-600">게시판 데이터를 불러오는 중...</div>;
    }

    // 오류가 발생했을 때 보여줄 UI
    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="app-board">
            <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-4xl">
                    {message && <Alert variant={message.type}>{message.text}</Alert>}
                    <div className="app-board overflow-x-auto">
                        <table className="table divide-y divide-gray-200 w-full">
                            <thead>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1">작성자</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/2">제목</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">생성날짜</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.length > 0 ? (
                                    posts.map((post) => {
                                        const date = new Date(post.created_at);
                                        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                        
                                        return (
                                            <tr key={post.board_id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.nickname}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <Link to={`/board/${post.board_id}`}>{post.title}</Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedDate}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">게시글이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Button className="mt-4 btn btn-primary" onClick={handleWriteButtonClick}>
                            글 작성하기
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Board;