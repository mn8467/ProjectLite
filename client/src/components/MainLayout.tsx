import React from 'react';
import AppTopstrip from './AppTopstrip';
import Sidebar from './Sidebar';

// MainLayout 컴포넌트가 props로 children을 받도록 수정합니다.
// React.PropsWithChildren<T>는 children 속성을 포함하는 props 타입입니다.
const MainLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
      data-sidebar-position="fixed" data-header-position="fixed">
           <AppTopstrip />
           <Sidebar />
      </div>
      <div className="body-wrapper p-4 d-flex flex-grow-1" >
         
           {children}
         
      </div>
    </>
  );
};

export default MainLayout;
