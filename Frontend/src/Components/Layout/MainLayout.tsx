import { Outlet, Link } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div className="app-container">
            {/* Menú Lateral */}
            <nav className="sidebar">
                <h2>RoomFlow ERP</h2>
                <Link to="/" className="nav-link">DASHBOARD</Link>

                <Link to="/projects" className="nav-link">PROJECTS</Link>
                <Link to="/materials" className="nav-link">MATERIALS</Link>
                <Link to="/distributors" className="nav-link">DISTRIBUTORS</Link>
                <Link to="/products" className="nav-link">PRODUCTS</Link>
            </nav>

            {/* Área de contenido cambiante */}
            <main className="content-area">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
