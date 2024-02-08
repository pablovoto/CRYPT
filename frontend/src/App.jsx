import './App.css';
import {Routes, Route} from 'react-router-dom'
import Home from './components/Home';
import About from './components/About';
import Create from './components/Create';
import Navbar from './components/NavBar';
import Edit from './components/Edit';
import Delete from './components/Delete';
import MatchStats from './components/Matchstats';
import UserStats from './components/Userstats';
import Login from './components/Login';
import Register from './components/Register';
import MatchStats2 from './components/Matchstats2';
import DeleteProduct from './components/DeleteProduct';
import EditProduct from './components/EditProduct';
import ProductCatalog from './components/ProductCatalog';
import CreateProduct from './components/CreateProduct';
import DisplayProjects from './components/DisplayProjects';
import TestCompnent from './components/TestComponent';

function App() {
  
  const myWidth = 220
  return (
    <div className="App">
        <Navbar
            drawerWidth={myWidth}
            content = {
              <Routes>
                <Route path="" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/create" element={<Create/>}/>
                <Route path="/edit/:id" element={<Edit/>}/>
                <Route path="/delete/:id" element={<Delete/>}/>
                <Route path="/matchstats" element={<MatchStats/>}/>
                <Route path="/userstats" element={<UserStats/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/matchstats2" element={<MatchStats2/>}/>
                <Route path="/deleteproduct/:id" element={<DeleteProduct/>}/>
                <Route path="/editproduct/:id" element={<EditProduct/>}/>
                <Route path="/catalog" element={<ProductCatalog/>}/>
                <Route path="/createproduct" element={<CreateProduct/>}/>
                <Route path="/displayprojects" element={<DisplayProjects/>}/>
                <Route path="/testcomponent" element={<TestCompnent/>}/>
              </Routes>
            }
        
        />
            


        
    </div>
  );
}

export default App;
