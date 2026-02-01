import { useEffect, useState } from 'react';
import axios from 'axios';
import MaterialForm from './MaterialForm';

// Interfaces basadas en tu dominio .NET
interface Distributor {
    id: number;
    name: string;
    logoUrl: string;
}

interface Material {
    id: number;
    name: string;
    type: string;
    color: string;
    texture: string;
    price: number;
    thumbnailUrl: string;
    distributorId: number;
    distributor?: Distributor;
}

const MaterialsPage = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // NUEVO: Estado para saber qué material estamos editando (null si es crear uno nuevo)
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

    const loadData = async () => {
        try {
            const [matRes, distRes] = await Promise.all([
                axios.get('http://localhost:5113/api/Materials'),
                axios.get('http://localhost:5113/api/Distributors')
            ]);
            setMaterials(matRes.data);
            setDistributors(distRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getDistributor = (id: number) => distributors.find(d => d.id === id);

    // NUEVO: Función para abrir el formulario en modo CREAR
    const handleCreate = () => {
        setEditingMaterial(null); // Limpiamos para asegurar que está vacío
        setShowForm(true);
    };

    // NUEVO: Función para abrir el formulario en modo EDITAR
    const handleEdit = (material: Material) => {
        setEditingMaterial(material); // Cargamos los datos del material seleccionado
        setShowForm(true);
        // Pequeño scroll suave hacia arriba para que el usuario vea el formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1>Materials Catalog</h1>
                    <p style={{ color: '#666', marginTop: '-10px' }}>Manage paints, tiles, and raw materials</p>
                </div>

                {!showForm && (
                    <button
                        onClick={handleCreate} // NUEVO: Usamos handleCreate
                        style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + New Material
                    </button>
                )}
            </div>

            {showForm && (
                <MaterialForm
                    initialData={editingMaterial} // NUEVO: Pasamos los datos (o null)
                    onCancel={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        loadData(); // Recargamos la lista tras guardar/editar
                    }}
                />
            )}

            {loading ? <p>Loading catalog...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {materials.map(mat => {
                        const dist = getDistributor(mat.distributorId);

                        return (
                            <div key={mat.id} style={{
                                background: 'white',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                border: '1px solid #eee'
                            }}>
                                <div style={{
                                    height: '120px',
                                    background: mat.color || '#ddd',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {mat.thumbnailUrl ?
                                        <img src={mat.thumbnailUrl} alt={mat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                        <span style={{ color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>No Image</span>
                                    }

                                    <span style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        right: '10px',
                                        background: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.9em'
                                    }}>
                                        {'\u20AC'}{mat.price.toFixed(2)} /unit
                                    </span>
                                </div>

                                <div style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1em' }}>{mat.name}</h3>
                                            <span style={{
                                                fontSize: '0.8em',
                                                background: '#f0f0f0',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                color: '#555'
                                            }}>
                                                {mat.type}
                                            </span>
                                        </div>

                                        {dist && (
                                            <img
                                                src={dist.logoUrl}
                                                title={`Supplier: ${dist.name}`}
                                                alt={dist.name}
                                                style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #eee' }}
                                            />
                                        )}
                                    </div>

                                    <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#666' }}>
                                        <p style={{ margin: '5px 0' }}><strong>Texture:</strong> {mat.texture}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Color:</strong> {mat.color}</p>
                                    </div>

                                    {/* NUEVO: Botón Edit Details conectado */}
                                    <button
                                        onClick={() => handleEdit(mat)}
                                        style={{ width: '100%', marginTop: '10px', padding: '8px', border: '1px solid #ddd', background: 'transparent', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Edit Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MaterialsPage;
