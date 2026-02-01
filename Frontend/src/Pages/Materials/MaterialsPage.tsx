import { useEffect, useState } from 'react';
import axios from 'axios';
import MaterialForm from './MaterialForm';

interface Distributor {
    id: number;
    name: string;
    logoUrl: string;
}

interface Material {
    id: number;
    name: string;
    type: string;
    price: number;
    thumbnailUrl: string;
    distributorId: number;
    distributor?: Distributor;

    // Propiedades opcionales de los hijos (Paint, Tile, Cement)
    colorHex?: string;
    finish?: string;
    isWaterBased?: boolean;    // <--- Faltaba esta
    widthCm?: number;
    heightCm?: number;
    isAntiSlip?: boolean;
    materialType?: string;     // <--- Faltaba esta (para Tile)
    weightKg?: number;
    strengthClass?: string;
    cementColor?: string;
}

const MaterialsPage = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
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

    const handleCreate = () => {
        setEditingMaterial(null);
        setShowForm(true);
    };

    const handleEdit = (material: Material) => {
        setEditingMaterial(material);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this material?')) return;

        try {
            await axios.delete(`http://localhost:5113/api/Materials/${id}`);
            setMaterials(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            // Usamos la función de ayuda de Axios para saber si es un error de red/api
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                alert("⛔ CANNOT DELETE: This material is currently used in a Project.\n\nRemove it from the project first.");
            } else {
                console.error(error);
                alert("Error deleting material");
            }
        }
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
                        onClick={handleCreate}
                        style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + New Material
                    </button>
                )}
            </div>

            {showForm && (
                <MaterialForm
                    initialData={editingMaterial}
                    onCancel={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        loadData();
                    }}
                />
            )}

            {loading ? <p>Loading catalog...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {materials.map(mat => {
                        const dist = getDistributor(mat.distributorId);

                        // Lógica visual para el fondo de la tarjeta
                        const cardBackground = mat.colorHex || '#ddd';

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
                                    background: cardBackground, // Usamos la variable calculada
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

                                    {/* DETALLES ESPECÍFICOS SEGÚN EL TIPO */}
                                    <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#666', minHeight: '60px' }}>

                                        {/* PINTURA */}
                                        {mat.type === 'Paint' && (
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '5px 0' }}>
                                                    <strong>Color:</strong>
                                                    {mat.colorHex ? (
                                                        <>
                                                            <span style={{
                                                                display: 'inline-block',
                                                                width: '12px', height: '12px',
                                                                backgroundColor: mat.colorHex,
                                                                borderRadius: '50%', border: '1px solid #ccc'
                                                            }}></span>
                                                            <span style={{ textTransform: 'uppercase' }}>{mat.colorHex}</span>
                                                        </>
                                                    ) : 'N/A'}
                                                </div>
                                                <p style={{ margin: '5px 0' }}><strong>Finish:</strong> {mat.finish || '-'}</p>
                                                {mat.isWaterBased && (
                                                    <span style={{ fontSize: '0.85em', background: '#e3f2fd', color: '#1565c0', padding: '2px 6px', borderRadius: '4px' }}>
                                                        💧 Water Based
                                                    </span>
                                                )}
                                            </>
                                        )}

                                        {/* AZULEJO */}
                                        {mat.type === 'Tile' && (
                                            <>
                                                <p style={{ margin: '5px 0' }}>
                                                    <strong>Size:</strong> {mat.widthCm} x {mat.heightCm} cm
                                                </p>
                                                <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                                    <span style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>
                                                        {mat.materialType || 'Ceramic'}
                                                    </span>
                                                    {mat.isAntiSlip && (
                                                        <span style={{ background: '#fff3e0', color: '#e65100', padding: '2px 6px', borderRadius: '4px' }}>
                                                            ⚠ Anti-Slip
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* CEMENTO */}
                                        {mat.type === 'Cement' && (
                                            <>
                                                <p style={{ margin: '5px 0' }}><strong>Pack:</strong> {mat.weightKg} Kg</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span><strong>Class:</strong> {mat.strengthClass}</span>
                                                    <span><strong>Color:</strong> {mat.cementColor || 'Grey'}</span>
                                                </div>
                                            </>
                                        )}

                                        {/* Fallback por si el tipo no coincide o es viejo */}
                                        {!['Paint', 'Tile', 'Cement'].includes(mat.type) && (
                                            <p style={{ fontStyle: 'italic', color: '#999' }}>Generic Material</p>
                                        )}
                                    </div>


                                    {/* Botonera */}
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button
                                            onClick={() => handleEdit(mat)}
                                            style={{ flex: 1, padding: '8px', border: '1px solid #ddd', background: 'transparent', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(mat.id)}
                                            style={{ flex: 1, padding: '8px', border: 'none', background: '#ffebee', color: '#c62828', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </div>


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
