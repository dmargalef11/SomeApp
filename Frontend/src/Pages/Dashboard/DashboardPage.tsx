import { useEffect, useState } from 'react';
import axios from 'axios';

interface DashboardSummary {
    totalProjects: number;
    totalMaterials: number;
    catalogValue: number;
    totalProjectsCost: number;
    topMaterialName: string;
    topMaterialCount: number;
}

const DashboardPage = () => {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await axios.get('http://localhost:5113/api/Dashboard/summary');
                setSummary(res.data);
            } catch (error) {
                console.error("Error loading dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Loading Dashboard...</div>;
    if (!summary) return <div style={{ padding: '20px' }}>Error loading data</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Executive Dashboard</h1>
            <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Real-time overview of construction assets</p>

            {/* GRID DE TARJETAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>

                {/* Card 1: Proyectos */}
                <div style={cardStyle}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏗️</div>
                    <h3 style={{ margin: 0, color: '#666' }}>Active Projects</h3>
                    <p style={numberStyle}>{summary.totalProjects}</p>
                </div>

                {/* Card 2: Materiales */}
                <div style={cardStyle}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📦</div>
                    <h3 style={{ margin: 0, color: '#666' }}>Materials in Catalog</h3>
                    <p style={numberStyle}>{summary.totalMaterials}</p>
                </div>

                {/* Card 3: Valor en Obras */}
                <div style={cardStyle}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
                    <h3 style={{ margin: 0, color: '#666' }}>Total Project Value</h3>
                    <p style={{ ...numberStyle, color: '#27ae60' }}>
                        {'\u20AC'}{summary.totalProjectsCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Card 4: Top Material */}
                <div style={cardStyle}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏆</div>
                    <h3 style={{ margin: 0, color: '#666' }}>Top Material</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '10px 0', color: '#2c3e50' }}>
                        {summary.topMaterialName || 'None'}
                    </p>
                    <span style={{ fontSize: '0.9em', color: '#999' }}>Used in {summary.topMaterialCount} projects</span>
                </div>

            </div>

            {/* SECCIÓN INFORMATIVA ADICIONAL */}
            <div style={{ marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '5px solid #3498db' }}>
                <h3 style={{ marginTop: 0 }}>💡 System Status</h3>
                <p>
                    The ERP is currently tracking <strong>{summary.totalMaterials}</strong> unique material types.
                    The total estimated budget across all {summary.totalProjects} active projects is
                    <strong> {'\u20AC'}{summary.totalProjectsCost.toFixed(2)}</strong>.
                </p>
            </div>
        </div>
    );
};

// Estilos simples en objeto para mantener el código limpio
const cardStyle: React.CSSProperties = {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    textAlign: 'center',
    border: '1px solid #eee'
};

const numberStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '10px 0',
    color: '#34495e'
};

export default DashboardPage;
