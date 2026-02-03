import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// --- INTERFACES ---
interface Material {
    id: number;
    name: string;
    price: number;
    stockQuantity: number; // Ojo: Asegúrate de que coincida con tu backend (stockQuantity vs stock)
    type: string;
}

interface ProjectMaterial {
    id: number;
    materialId: number;
    material?: Material;
    quantity: number;
    usageNotes: string;
}

interface DesignJob {
    id: number;
    prompt: string;
    status: string; // 'Pending', 'Processing', 'Completed'
    resultImageUrl?: string;
    createdAt: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
}

interface Props {
    projectId: number;
    onBack?: () => void;
}

const ProjectDetails = ({ projectId, onBack }: Props) => {
    // --- ESTADOS ---
    const [project, setProject] = useState<Project | null>(null);
    const [projectMaterials, setProjectMaterials] = useState<ProjectMaterial[]>([]);
    const [availableMaterials, setAvailableMaterials] = useState<Material[]>([]);

    // Estados para Materiales
    const [selectedMaterialId, setSelectedMaterialId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [notes, setNotes] = useState('');

    // Estados para AI Design
    const [designJobs, setDesignJobs] = useState<DesignJob[]>([]);
    const [aiPrompt, setAiPrompt] = useState('');
    const [generatingAi, setGeneratingAi] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(true);

    // --- CARGA DE DATOS ---
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Proyecto
                const projRes = await axios.get(`http://localhost:5113/api/Projects/${projectId}`);
                setProject(projRes.data);

                // 2. Materiales del Proyecto
                const pmRes = await axios.get(`http://localhost:5113/api/ProjectMaterials/project/${projectId}`);
                setProjectMaterials(pmRes.data);

                // 3. Catálogo Disponible
                const allMatRes = await axios.get('http://localhost:5113/api/Materials');
                setAvailableMaterials(allMatRes.data);

                // 4. Trabajos de Diseño AI
                const jobsRes = await axios.get(`http://localhost:5113/api/DesignJobs/project/${projectId}`);
                setDesignJobs(jobsRes.data);

            } catch (error) {
                console.error("Error loading project details", error);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) loadData();
    }, [projectId]);

    // Refresco automático de trabajos AI pendientes
    useEffect(() => {
        const interval = setInterval(() => {
            const hasPending = designJobs.some(j => j.status === 'Pending' || j.status === 'Processing');
            if (hasPending) {
                axios.get(`http://localhost:5113/api/DesignJobs/project/${projectId}`)
                    .then(res => setDesignJobs(res.data))
                    .catch(err => console.error("Error polling jobs", err));
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [designJobs, projectId]);

    // --- FUNCIONES ---

    // 1. Generar AI Design
    const handleGenerateAi = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiPrompt.trim()) return;

        // VALIDACIÓN: Si tu workflow exige imagen, obligamos a subirla
        if (!selectedFile) {
            Swal.fire('Error', 'Please upload a room photo for reference', 'warning');
            return;
        }

        setGeneratingAi(true);
        try {
            // CAMBIO IMPORTANTE: Usamos FormData para enviar texto + archivo
            const formData = new FormData();
            formData.append('prompt', aiPrompt);
            formData.append('projectId', projectId.toString());
            formData.append('image', selectedFile); // <--- El archivo

            await axios.post('http://localhost:5113/api/DesignJobs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setAiPrompt('');
            setSelectedFile(null); // Limpiamos el archivo

            // Reset del input file (truco sucio pero rápido: usar useRef es mejor, pero esto sirve)
            (document.getElementById('fileInput') as HTMLInputElement).value = '';

            const jobsRes = await axios.get(`http://localhost:5113/api/DesignJobs/project/${projectId}`);
            setDesignJobs(jobsRes.data);

        } catch {
            Swal.fire('Error', 'Failed to start AI generation', 'error');
        } finally {
            setGeneratingAi(false);
        }
    };


    // 2. Añadir Material
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

            // Recargar todo
            const pmRes = await axios.get(`http://localhost:5113/api/ProjectMaterials/project/${projectId}`);
            setProjectMaterials(pmRes.data);

            const allMatRes = await axios.get('http://localhost:5113/api/Materials');
            setAvailableMaterials(allMatRes.data);

            setQuantity(1);
            setNotes('');

            Swal.fire({
                icon: 'success',
                title: 'Added!',
                text: 'Material added to project',
                timer: 1500,
                showConfirmButton: false
            });

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Not Enough Stock!',
                        text: error.response.data,
                        confirmButtonText: 'Understood'
                    });
                } else {
                    Swal.fire('Error', error.response.statusText, 'error');
                }
            }
        }
    };

    // 3. Quitar Material
    const handleRemove = async (id: number) => {
        const result = await Swal.fire({
            title: 'Remove material?',
            text: "This will return stock to the warehouse.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, remove'
        });

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`http://localhost:5113/api/ProjectMaterials/${id}`);
            setProjectMaterials(prev => prev.filter(pm => pm.id !== id));

            // Actualizar catálogo por si el stock volvió
            const allMatRes = await axios.get('http://localhost:5113/api/Materials');
            setAvailableMaterials(allMatRes.data);

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to remove material', 'error');
        }
    };

    // 4. Descargar PDF
    const handleDownloadPdf = async () => {
        if (!projectId) return;
        try {
            const response = await axios.get(`http://localhost:5113/api/Reports/project/${projectId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Project_${projectId}_Budget.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            Swal.fire('Error', 'Failed to generate PDF report', 'error');
        }
    };

    // Calculo Total
    const totalCost = projectMaterials.reduce((acc, pm) => {
        const price = pm.material?.price || 0;
        return acc + (price * pm.quantity);
    }, 0);


    if (loading) return <div>Loading Project Details...</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {onBack && (
                <button onClick={onBack} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#666', fontSize: '1rem' }}>
                    &larr; Back to Projects
                </button>
            )}

            {/* CABECERA */}
            <div style={{
                borderBottom: '1px solid #ddd',
                paddingBottom: '20px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start'
            }}>
                <div>
                    <h1 style={{ margin: 0, color: '#2c3e50' }}>{project.name}</h1>
                    <p style={{ color: '#7f8c8d', margin: '5px 0' }}>{project.description}</p>
                    <h3 style={{ color: '#27ae60', marginTop: '10px' }}>
                        Total Cost: {'\u20AC'}{totalCost.toFixed(2)}
                    </h3>
                </div>

                <button
                    onClick={handleDownloadPdf}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: '#e74c3c', color: 'white', border: 'none',
                        padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    📄 Download Budget
                </button>
            </div>

            {/* FORMULARIO MATERIALES */}
            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #eee' }}>
                <h4 style={{ marginTop: 0 }}>Add Material to Project</h4>
                <form onSubmit={handleAddMaterial} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'end' }}>

                    <div style={{ flex: 2, minWidth: '200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Material</label>
                        <select
                            value={selectedMaterialId}
                            onChange={e => setSelectedMaterialId(Number(e.target.value))}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            required
                        >
                            <option value="">-- Select Material --</option>
                            {availableMaterials.map(m => (
                                <option key={m.id} value={m.id} disabled={m.stockQuantity <= 0} style={{ color: m.stockQuantity <= 0 ? '#ccc' : 'black' }}>
                                    {m.name} ({m.type}) - {'\u20AC'}{m.price}
                                    {m.stockQuantity <= 0 ? ' [OUT OF STOCK]' : ` [Stock: ${m.stockQuantity}]`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '80px' }}>
                        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Qty</label>
                        <input
                            type="number" step="0.01" min="0.01"
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            required
                        />
                    </div>

                    <div style={{ flex: 2, minWidth: '200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Notes</label>
                        <input
                            type="text" placeholder="e.g., Bathroom wall"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <button type="submit" style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Add
                    </button>
                </form>
            </div>

            {/* TABLA MATERIALES */}
            <h3 style={{ borderBottom: '2px solid #3498db', display: 'inline-block', paddingBottom: '5px' }}>Materials List</h3>
            {projectMaterials.length === 0 ? (
                <p style={{ color: '#777', fontStyle: 'italic' }}>No materials linked yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: 'white' }}>
                    <thead>
                        <tr style={{ background: '#f1f1f1', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                            <th style={{ padding: '12px' }}>Material</th>
                            <th style={{ padding: '12px' }}>Qty</th>
                            <th style={{ padding: '12px' }}>Unit Price</th>
                            <th style={{ padding: '12px' }}>Subtotal</th>
                            <th style={{ padding: '12px' }}>Notes</th>
                            <th style={{ padding: '12px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectMaterials.map(pm => (
                            <tr key={pm.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>
                                    <strong>{pm.material?.name}</strong>
                                    <br />
                                    <span style={{ fontSize: '0.85em', color: '#666', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>{pm.material?.type}</span>
                                </td>
                                <td style={{ padding: '12px' }}>{pm.quantity}</td>
                                <td style={{ padding: '12px' }}>{'\u20AC'}{pm.material?.price.toFixed(2)}</td>
                                <td style={{ padding: '12px' }}>
                                    <strong>{'\u20AC'}{((pm.material?.price || 0) * pm.quantity).toFixed(2)}</strong>
                                </td>
                                <td style={{ padding: '12px', color: '#555', fontSize: '0.9em' }}>{pm.usageNotes || '-'}</td>
                                <td style={{ padding: '12px' }}>
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

            {/* SECCIÓN AI REMODELING */}
            <div style={{ marginTop: '50px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6a1b9a' }}>
                    ✨ AI Remodeling Ideas
                    <span style={{ fontSize: '0.5em', background: '#f3e5f5', color: '#6a1b9a', padding: '2px 8px', borderRadius: '10px', border: '1px solid #e1bee7' }}>Beta</span>
                </h2>

                <form onSubmit={handleGenerateAi} style={{ /* ...tus estilos... */ flexDirection: 'column', alignItems: 'stretch' }}>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* INPUT DE TEXTO */}
                        <input
                            type="text"
                            placeholder="Describe the remodeling..."
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            style={{ flex: 1, padding: '12px' /*...*/ }}
                        />
                    </div>

                    {/* NUEVO INPUT DE ARCHIVO */}
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                            style={{ fontSize: '0.9em' }}
                        />

                        <button
                            type="submit"
                            disabled={generatingAi}
                            style={{ /* ...tus estilos del botón... */ marginLeft: 'auto' }}
                        >
                            {generatingAi ? 'Uploading & Rendering...' : 'Generate Idea'}
                        </button>
                    </div>
                </form>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    {designJobs.map(job => (
                        <div key={job.id} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <div style={{ height: '180px', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                {job.status === 'Completed' && job.resultImageUrl ? (
                                    <a href={job.resultImageUrl} target="_blank" rel="noreferrer">
                                        <img src={job.resultImageUrl} alt={job.prompt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </a>
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{job.status === 'Processing' ? '🎨' : '⏳'}</div>
                                        <span style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9em' }}>
                                            {job.status === 'Processing' ? 'Rendering...' : job.status}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '12px', fontSize: '0.85em', borderTop: '1px solid #eee' }}>
                                <p style={{ margin: 0, fontWeight: 'bold', color: '#444', lineHeight: '1.4' }}>{job.prompt}</p>
                                <p style={{ margin: '8px 0 0 0', color: '#bbb', fontSize: '0.8em' }}>{new Date(job.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}

                    {designJobs.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#999', background: '#fff', borderRadius: '8px', border: '1px dashed #ccc' }}>
                            <p>No AI designs generated for this project yet.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ProjectDetails;
