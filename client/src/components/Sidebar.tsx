import {
  ShoppingCart, X, Atom, Aperture, MoreVertical,
  House,
  NotebookText,
  User
} from 'lucide-react';
import logoImg from '../assets/images/logos/logo.svg';
 {/* iconify-icon 대신 MoreVertical 아이콘 사용 (유사한 기능) <MoreVertical className="nav-small-cap-icon fs-4" /> */}
   {/* ti ti-atom 대신 Atom 아이콘 사용                */}
  {/* ti ti-aperture 대신 Aperture 아이콘 사용   <Aperture /> */}
   {/* ti ti-shopping-cart 대신 ShoppingCart 아이콘 사용   <ShoppingCart /> */}
const Sidebar: React.FC = () => {
  return (
   <aside className="left-sidebar">
      {/* <!-- Sidebar scroll--> */}
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <a href="./index.html" className="text-nowrap logo-img">
            <img src={logoImg} alt="logo" />
          </a>
          <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
          </div>
        </div>
        {/* <!-- Sidebar navigation--> */}
        <nav className="sidebar-nav scroll-sidebar d-flex" data-simplebar="">
          <ul id="sidebarnav">
            <li className="nav-small-cap ">
             
              <span className="hide-menu">Home</span>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="./index.html" aria-expanded="false">
                 <House />
                <span className="hide-menu">Home</span>
              </a>
            </li>
            {/* <!-- ---------------------------------- -->
            <!-- Dashboard -->
            <!-- ---------------------------------- --> */}
            <li className="sidebar-item">
              <a className="sidebar-link justify-content-between"  
                href="#" aria-expanded="false">
                <div className="d-flex align-items-center gap-3">
                  <span className="d-flex">
                    <NotebookText />
                  </span>
                  <span className="hide-menu">게시판</span>
                </div>
                
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link justify-content-between"  
                href="#" aria-expanded="false">
                <div className="d-flex align-items-center gap-3">
                  <span className="d-flex">
                    <User /> 
                  </span>
                  <span className="hide-menu">마이페이지</span>
                </div>
                
              </a>
            </li>
          </ul>
        </nav>
        {/* // <!-- End Sidebar navigation --> */}
      </div>
      {/* // <!-- End Sidebar scroll--> */}
    </aside>
  );
}; export default Sidebar;  
