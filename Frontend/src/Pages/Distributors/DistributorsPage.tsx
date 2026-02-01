import { useEffect, useState } from 'react';
import axios from 'axios';
import DistributorForm from './DistributorForm';

interface Distributor {
    id: number;
    name: string;
    logoUrl: string;
}

const DistributorsPage = () => {
    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);

    // Función para cargar datos
    const loadData = () => {
        axios.get('http://localhost:5113/api/Distributors')
            .then(response => setDistributors(response.data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = () => {
        setEditingDistributor(null);
        setShowForm(true);
    };

    const handleEdit = (dist: Distributor) => {
        setEditingDistributor(dist);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Suppliers / Distributors</h1>

                {!showForm && (
                    <button
                        onClick={handleCreate}
                        style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + New Supplier
                    </button>
                )}
            </div>

            {showForm && (
                <DistributorForm
                    initialData={editingDistributor}
                    onCancel={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        loadData();
                    }}
                />
            )}

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                {distributors.map(dist => (
                    <div key={dist.id} style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        width: '200px',
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        {/* Avatar / Logo */}
                        <div style={{
                            width: '80px', height: '80px', margin: '0 auto 15px',
                            borderRadius: '50%', border: '2px solid #f0f0f0',
                            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {dist.logoUrl ?
                                <img src={dist.logoUrl} alt={dist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                <span style={{ fontSize: '2em', color: '#ccc' }}>🏢</span>
                            }
                        </div>

                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1em' }}>{dist.name}</h3>

                        <button
                            onClick={() => handleEdit(dist)}
                            style={{
                                background: 'transparent', border: '1px solid #3498db',
                                color: '#3498db', borderRadius: '4px',
                                padding: '5px 15px', cursor: 'pointer', fontSize: '0.9em'
                            }}
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DistributorsPage;
