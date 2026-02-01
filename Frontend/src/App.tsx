import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Distributor {
    id: number;
    name: string;
    logoUrl: string;
}

function App() {
    const [distributors, setDistributors] = useState<Distributor[]>([]);

    useEffect(() => {
        // Asegúrate de que este puerto (5113) es el de tu API
        axios.get('http://localhost:5113/api/Distributors')
            .then(response => {
                setDistributors(response.data);
            })
            .catch(error => {
                console.error("Error cargando distribuidores:", error);
            });
    }, []);

    return (
        <div>
            <h1>RoomFlow - Distribuidores</h1>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {distributors.map(dist => (
                    <div key={dist.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                        <h3>{dist.name}</h3>
                        {dist.logoUrl && <img src={dist.logoUrl} alt={dist.name} width="100" />}
                    </div>
                ))}
            </div>

            {distributors.length === 0 && <p>Cargando datos...</p>}
        </div>
    );
}

export default App;
