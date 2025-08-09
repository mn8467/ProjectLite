import { useState, useEffect } from 'react';
import axios from 'axios';

// 로그인 상태를 확인하는 커스텀 훅입니다.
// 이 훅은 React 컴포넌트의 로직을 재사용할 수 있도록 분리해줍니다.
const useCheckLogin = () => {
    // isLoggedIn 상태와 로딩 상태를 관리합니다.
    // isLoggedIn: 로그인 여부 (true/false)
    // isLoading: 세션 확인 중인지 여부 (true/false)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const clientCheckLogin = async () => {
            try {
                // 백엔드 API를 호출하여 로그인 상태를 확인합니다.
                const response = await axios.get('http://localhost:8080/check-session', { withCredentials: true });
                const data = response.data;
                setIsLoggedIn(data.isLoggedIn);
            } catch (error) {
                console.error('로그인 상태 확인 중 오류 발생:', error);
                setIsLoggedIn(false);
            } finally {
                // API 호출이 완료되면 로딩 상태를 false로 변경합니다.
                setIsLoading(false);
            }
        };
        clientCheckLogin();
    }, []);

    // isLoggedIn과 isLoading 상태를 객체로 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
return { isLoggedIn, isLoading, setIsLoggedIn };  // 여기 setIsLoggedIn 추가됨
};

export default useCheckLogin;
