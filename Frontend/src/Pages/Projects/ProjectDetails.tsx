import { useEffect, useState } from 'react';
import axios from 'axios';
// Puedes usar useParams si usas React Router, o props si lo muestras en un modal
// Aquí asumo que usas React Router: import { useParams } from 'react-router-dom';

interface Material {
    id: number;
    name: string;
    price: number;
    type: string;
}

interface ProjectMaterial {
    id: number; // ID de la relación
    materialId: number;
    material?: Material;
    quantity: number;
    usageNotes: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
}

// Si recibes el ID por props (ej: desde un listado de proyectos)
interface Props {
    projectId: number;
    onBack?: () => void;
}

const ProjectDetails = ({ projectId, onBack }: Props) => {
    const [project, setProject] = useState<Project | null>(null);
    const [projectMaterials, setProjectMaterials] = useState<ProjectMaterial[]>([]);
    const [availableMaterials, setAvailableMaterials] = useState<Material[]>([]);

    // Estado para el formulario de añadir
    const [selectedMaterialId, setSelectedMaterialId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);

    // Cargar datos
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Cargar info del proyecto (asumiendo que tienes este endpoint)
                const projRes = await axios.get(`http://localhost:5113/api/Projects/${projectId}`);
                setProject(projRes.data);

                // 2. Cargar materiales DEL proyecto (usando el controller nuevo)
                const pmRes = await axios.get(`http://localhost:5113/api/ProjectMaterials/project/${projectId}`);
                setProjectMaterials(pmRes.data);

                // 3. Cargar TODOS los materiales disponibles (para el select)
                const allMatRes = await axios.get('http://localhost:5113/api/Materials');
                setAvailableMaterials(allMatRes.data);

            } catch (error) {
                console.error("Error loading project details", error);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) loadData();
    }, [projectId]);

    // Función: Añadir Material
    const handleAddMaterial = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMaterialId || quantity <= 0) return;

        try {
            await axios.post('http://localhost:5113/api/ProjectMaterials', {
                projectId: projectId,
                materialId: Number(selectedMaterialId),
                quantity: Number(quantity),
                usageNotes: notes
            });

            // Recargar la lista de materiales del proyecto
            const pmRes = await axios.get(`http://localhost:5113/api/ProjectMaterials/project/${projectId}`);
            setProjectMaterials(pmRes.data);

            // Limpiar form
            setQuantity(1);
            setNotes('');
            // No limpiamos el materialId por si quiere añadir más del mismo tipo, o sí, a gusto.
        } catch (error) {
            alert('Error adding material');
            console.error(error);
        }
    };

    // Función: Quitar Material
    const handleRemove = async (id: number) => {
        if (!confirm('Are you sure you want to remove this material from the project?')) return;

        try {
            await axios.delete(`http://localhost:5113/api/ProjectMaterials/${id}`);
            // Actualizar estado local filtrando el eliminado
            setProjectMaterials(prev => prev.filter(pm => pm.id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to remove material');
        }
    };

    // Calcular coste total
    const totalCost = projectMaterials.reduce((acc, pm) => {
        const price = pm.material?.price || 0;
        return acc + (price * pm.quantity);
    }, 0);

    if (loading) return <div>Loading Project Details...</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {onBack && (
                <button onClick={onBack} style={{ marginBottom: '20px', cursor: 'pointer' }}>
                    &larr; Back to Projects
                </button>
            )}

            <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '20px', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>{project.name}</h1>
                <p style={{ color: '#666' }}>{project.description}</p>
                <h3>Total Cost: {'\u20AC'}{totalCost.toFixed(2)}</h3>
            </div>

            {/* FORMULARIO PARA AÑADIR */}
            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
                <h4>Add Material to Project</h4>
                <form onSubmit={handleAddMaterial} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'end' }}>

                    <div style={{ flex: 2, minWidth: '200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Material</label>
                        <select
                            value={selectedMaterialId}
                            onChange={e => setSelectedMaterialId(Number(e.target.value))}
                            style={{ width: '100%', padding: '8px' }}
                            required
                        >
                            <option value="">-- Select Material --</option>
                            {availableMaterials.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.name} ({m.type}) - {'\u20AC'}{m.price}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '80px' }}>
                        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Quantity</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            style={{ width: '100%', padding: '8px' }}
                            required
                        />
                    </div>

                    <div style={{ flex: 2, minWidth: '200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Usage Notes</label>
                        <input
                            type="text"
                            placeholder="e.g., Bathroom wall"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Add
                    </button>
                </form>
            </div>

            {/* LISTA DE MATERIALES */}
            <h3>Materials List</h3>
            {projectMaterials.length === 0 ? (
                <p style={{ color: '#777', fontStyle: 'italic' }}>No materials linked to this project yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ background: '#eee', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Material</th>
                            <th style={{ padding: '10px' }}>Qty</th>
                            <th style={{ padding: '10px' }}>Unit Price</th>
                            <th style={{ padding: '10px' }}>Subtotal</th>
                            <th style={{ padding: '10px' }}>Notes</th>
                            <th style={{ padding: '10px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectMaterials.map(pm => (
                            <tr key={pm.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>
                                    <strong>{pm.material?.name}</strong>
                                    <br />
                                    <span style={{ fontSize: '0.85em', color: '#666' }}>{pm.material?.type}</span>
                                </td>
                                <td style={{ padding: '10px' }}>{pm.quantity}</td>
                                <td style={{ padding: '10px' }}>{'\u20AC'}{pm.material?.price.toFixed(2)}</td>
                                <td style={{ padding: '10px' }}>
                                    <strong>{'\u20AC'}{((pm.material?.price || 0) * pm.quantity).toFixed(2)}</strong>
                                </td>
                                <td style={{ padding: '10px', color: '#555', fontSize: '0.9em' }}>{pm.usageNotes || '-'}</td>
                                <td style={{ padding: '10px' }}>
                                    <button
                                        onClick={() => handleRemove(pm.id)}
                                        style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProjectDetails;
