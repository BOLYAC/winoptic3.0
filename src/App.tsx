
import {   useLocation } from 'react-router-dom';


import AppRoutes from './router/routes.tsx';
import Navbar from './components/navbar.tsx';





function App() {

  const location = useLocation();

  // Check if we are on the home page
  const isHomePage = location.pathname === "/";

  return (
    <div>
     
     {isHomePage && <Navbar />}
      <AppRoutes/>
      
    </div>
  
  );
}

export default App;
