import React ,{useState}from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// 필요한 CSS 파일을 임포트합니다.
// 이 파일들은 프로젝트의 src/assets/css 경로에 있다고 가정합니다.
import '../assets/css/styles.min.css';
import TopImg from '../assets/images/logos/logo-wrappixel.svg'
import CheckLogin from './CheckLogin'; // 로그인 상태를 확인하는 훅을 임포트합니다.


// lucide-react에서 필요한 아이콘들을 임포트합니다.
// Feather Icons와 유사한 아이콘을 React 컴포넌트 형태로 제공합니다.
   {/* 이미지 경로를 public 폴더 기준으로 수정   */}
// --- AppTopstrip Component ---  
// 상단 검은색 스트립 부분을 담당하는 컴포넌트



const AppTopstrip: React.FC = () => {
     const { isLoggedIn, isLoading ,setIsLoggedIn  } = CheckLogin();
     const navigate = useNavigate();
     const [message, setMessage] = useState<string>(''); // 메시지 상태 추가
     

     const handleLogout = async () => { // 링크의 기본 동작 방지      try{
        
        try{
        await axios.post('http://localhost:8080/logout', {}, {
          withCredentials: true
        });
         setIsLoggedIn(false); // 로그인 상태를 false로 설정
         console.log(setIsLoggedIn)
        // 로그아웃 후 홈 페이지로 이동
        setMessage('로그아웃 성공'); // 메시지 업데이트
        navigate('/home');
      } catch (error) { 
        console.error('로그아웃 실패 :', error);

        if (axios.isAxiosError(error) && error.response) {
          setMessage(error.response.data.message || '로그아웃에 실패했습니다.');
        // 오류 처리 로직 추가 가능
      } else {
          setMessage('네트워크 오류가 발생했습니다.');
        }
     }
    };
     

  if (isLoading) {
        return <div>Loading...</div>;
    }

  
  return (
    <div className="app-topstrip bg-dark py-6 px-3 w-100 d-lg-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center justify-content-center gap-5 mb-2 mb-lg-0">
        <a className="d-flex justify-content-center" href="#">
          <img src={TopImg}alt="WrapPixel Logo" width="150" />
        </a>
      </div>

      <div className="d-lg-flex align-items-center gap-2">
        <div className="d-flex align-items-center justify-content-center gap-2">
                  
              {isLoggedIn ? (
                            // 로그인 상태일 때 로그아웃 버튼을 보여줍니다.
                                  <div className="dropdown flex">
                                      <button className="btn btn-danger d-flex align-items-center gap-1" onClick={handleLogout}>
                                          Logout
                                      </button>
                                  </div>
                        ) : (
                            // 로그아웃 상태일 때 로그인 버튼을 보여줍니다.

                                  <div className="d-flex gap-2">
                                      <a className="btn btn-primary d-flex align-items-center gap-1" href="/signup">
                                        Signup
                                      </a>

                                      <a className="btn btn-primary d-flex align-items-center gap-1" href="/login">
                                        Login
                                      </a>
                                  </div>
                        )}
        </div>
      </div>

    </div>
  );
}; export default AppTopstrip;
