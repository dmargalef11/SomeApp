import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './Components/Layout/MainLayout';
import DistributorsPage from './Pages/Distributors/DistributorsPage';
import ProductsPage from './Pages/Products/ProductsPage'; // <--- Importar
import ProjectsPage from './Pages/Projects/ProjectsPage'; // <--- Importar
import MaterialsPage from './Pages/Materials/MaterialsPage';
import DashboardPage from './Pages/Dashboard/DashboardPage';




function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="projects" element={<ProjectsPage />} /> {/* <--- Usar */}
                    <Route path="materials" element={<MaterialsPage />} />
                    <Route path="distributors" element={<DistributorsPage />} />
                    <Route path="products" element={<ProductsPage />} /> {/* <--- Usar */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
