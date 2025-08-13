import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// API에서 가져온 게시글 데이터의 타입을 정의합니다.
// 이 타입은 데이터의 구조를 명확히 하고 코드 안정성을 높입니다.
interface Post {
    board_id: number;
    nickname: string;
    title: string;
    created_at: string;
}

const Board: React.FC = () => {
    // 게시글 목록, 로딩 상태, 오류 상태를 관리하는 state를 정의합니다.
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 컴포넌트가 처음 렌더링될 때 API를 호출하는 useEffect 훅입니다.
    useEffect(() => {
        // 데이터를 가져오는 비동기 함수를 정의합니다.
        const fetchBoardData = async () => {
            try {
                // Node.js 서버의 API 엔드포인트에서 데이터를 가져옵니다.
                // 백엔드에서 LIMIT를 적용하도록 수정했기 때문에 프론트엔드에서는
                // 쿼리 파라미터를 추가하여 5개만 요청할 수 있습니다.
                // 만약 백엔드 수정이 어렵다면, 현재 코드처럼 전체를 가져온 뒤 프론트에서 처리하는 것도 가능합니다.
                const response = await fetch('http://localhost:8080/board');
                
                if (!response.ok) {
                    throw new Error(`HTTP 오류! 상태: ${response.status}`);
                }
                
                const boardData: Post[] = await response.json();
                setPosts(boardData); // 데이터를 state에 저장합니다.
                
            } catch (err) {
                // 오류 발생 시 error state를 업데이트합니다.
                console.error('데이터를 불러오는 중 오류 발생:', err);
                setError('게시글 목록을 불러오는 데 실패했습니다.');
                
            } finally {
                // 데이터 로딩이 완료되면 로딩 상태를 false로 변경합니다.
                setIsLoading(false);
            }
        };

        fetchBoardData(); // 함수를 호출하여 데이터 로딩을 시작합니다.
    }, []); // 빈 배열을 의존성으로 두어 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.

    // 로딩 중일 때 보여줄 UI
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                게시판 데이터를 불러오는 중...
            </div>
        );
    }

    // 오류가 발생했을 때 보여줄 UI
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                {error}
            </div>
        );
    }

    // 게시글이 없을 때 보여줄 UI
    if (posts.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                게시글이 없습니다.
            </div>
        );
    }
    
    // --- 이 부분에서 전체 posts 배열을 가공합니다. ---
    // 1. 전체 게시물을 날짜(created_at) 기준으로 내림차순 정렬합니다.
// ...existing code...
const sortedPosts = [...posts].sort((a, b) => {
    // 날짜 파싱이 잘 되는지 로그로 확인
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    console.log('dateA:', dateA, 'dateB:', dateB);
    return dateB.getTime() - dateA.getTime();
});

const recentPosts = sortedPosts.slice(0, 5);
// ...existing code...

    return (
        <div className="app-board">
            <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-4xl">
                    <div className="app-board overflow-x-auto">
                        <table className="table divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1">
                                        작성자
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/2">
                                        제목
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">
                                        생성날짜
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* recentPosts 배열을 map 함수로 순회하며 테이블 행을 생성합니다. */}
                                {recentPosts.map((post) => { // 변경된 부분
                                    const date = new Date(post.created_at);
                                    const formattedDate = date.getFullYear() + '-' +
                                        String(date.getMonth() + 1).padStart(2, '0') + '-' +
                                        String(date.getDate()).padStart(2, '0');
                                    
                                    return (
                                        <tr key={post.board_id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.nickname}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <Link to={`/board/${post.board_id}`}>
                                                    {post.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedDate}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <button className="mt-4 btn btn-primary">
                            <Link to="/board/write" className="text-white">
                                글 작성하기
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Board;
