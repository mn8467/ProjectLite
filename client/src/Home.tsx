import './assets/css/styles.min.css';
import './assets/images/logos/logo-wrappixel.svg'
import './assets/images/logos/logo.svg'
import AppTopstrip from './components/AppTopstrip'; 
import Sidebar from './components/Sidebar';
import Header from './components/Header';   
function Home(){
    return(
        <>
          <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
                data-sidebar-position="fixed" data-header-position="fixed">
                    <AppTopstrip />
                    <Sidebar />
           </div>         
                <div className="body-wrapper">
                    <Header />
                </div>
          
        </>
    )
}
export default Home;


