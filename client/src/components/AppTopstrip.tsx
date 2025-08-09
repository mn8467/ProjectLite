import React from 'react';
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
     const { isLoggedIn, isLoading } = CheckLogin();

     console.log('isLoggedIn:', isLoggedIn);

  
  return (
    <div className="app-topstrip bg-dark py-6 px-3 w-100 d-lg-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center justify-content-center gap-5 mb-2 mb-lg-0">
        <a className="d-flex justify-content-center" href="#">
          <img src={TopImg}alt="WrapPixel Logo" width="150" />
        </a>
      </div>

      <div className="d-lg-flex align-items-center gap-2">
        <div className="d-flex align-items-center justify-content-center gap-2">
                  <a className="btn btn-primary d-flex align-items-center gap-1" href="/signup">
                    Signup
                  </a>
  {isLoggedIn ? (
                // 로그인 상태일 때 로그아웃 버튼을 보여줍니다.
                <div className="dropdown flex">
                    <a className="btn btn-primary d-flex align-items-center gap-1" href="/logout">   
                        Logout
                    </a>
                </div>
            ) : (
                // 로그아웃 상태일 때 로그인 버튼을 보여줍니다.
                <div className="dropdown flex">
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
