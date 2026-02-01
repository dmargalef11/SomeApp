import { useEffect, useState } from 'react';
import axios from 'axios';

interface Distributor {
    id: number;
    name: string;
    logoUrl: string;
}

const DistributorsPage = () => {
    const [distributors, setDistributors] = useState<Distributor[]>([]);

    useEffect(() => {
        axios.get('http://localhost:5113/api/Distributors')
            .then(response => setDistributors(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Distributors management</h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                {distributors.map(dist => (
                    <div key={dist.id} style={{
                        background: 'white',
                        padding: '15px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3>{dist.name}</h3>
                        {/* Pequeña validación visual */}
                        {dist.logoUrl ?
                            <img src={dist.logoUrl} alt={dist.name} width="100" /> :
                            <span style={{ color: '#999' }}>Sin logo</span>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DistributorsPage;
