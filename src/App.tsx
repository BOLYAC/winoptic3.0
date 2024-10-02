
import {  Link } from 'react-router-dom';
import { Button } from './components/ui/button.tsx';
import './App.css';
import AppRoutes from './router/routes.tsx';
import Navbar from './components/navbar.tsx';





function App() {
  return (
    <div>
     
    <Navbar/>
      <AppRoutes/>
      
    </div>
  
  );
}

export default App;
