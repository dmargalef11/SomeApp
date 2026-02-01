import { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectDetails from './ProjectDetails';

interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
}

const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    // Estado para el formulario (Nuevo Proyecto)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0] // Fecha de hoy por defecto (YYYY-MM-DD)
    });

    // Cargar proyectos
    const loadProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5113/api/Projects');
            // Ordenar por fecha (más nuevos primero)
            const sorted = res.data.sort((a: Project, b: Project) =>
                new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            );
            setProjects(sorted);
        } catch (error) {
            console.error("Error loading projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    // Crear Proyecto
    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5113/api/Projects', {
                name: formData.name,
                description: formData.description,
                startDate: formData.startDate
            });

            setFormData({
                name: '',
                description: '',
                startDate: new Date().toISOString().split('T')[0]
            });
            loadProjects();
        } catch (error) {
            // Usamos axios.isAxiosError en lugar de 'any'
            if (axios.isAxiosError(error) && error.response) {
                const msg = JSON.stringify(error.response.data);
                alert(`Error creating project: ${msg}`);
            } else {
                console.error(error);
                alert("Unknown error creating project");
            }
        }
    };


    // Borrar Proyecto
    const handleDeleteProject = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("⚠️ Are you sure? This will remove the project and unlink all materials.")) return;

        try {
            await axios.delete(`http://localhost:5113/api/Projects/${id}`);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
            alert("Could not delete project");
        }
    };

    // --- MODO DETALLE ---
    if (selectedProjectId) {
        return (
            <ProjectDetails
                projectId={selectedProjectId}
                onBack={() => setSelectedProjectId(null)}
            />
        );
    }

    // --- MODO LISTA ---
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>

            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '10px' }}>Projects Portfolio</h1>
                <p style={{ color: '#7f8c8d' }}>Manage your construction sites and renovations</p>
            </div>

            {/* FORMULARIO ELEGANTE */}
            <div style={{
                background: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                marginBottom: '40px',
                border: '1px solid #f0f0f0'
            }}>
                <h3 style={{ marginTop: 0, color: '#34495e' }}>New Project</h3>
                <form onSubmit={handleCreateProject} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>Project Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Kitchen Renovation"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>Start Date</label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                            required
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>Description</label>
                        <input
                            type="text"
                            placeholder="Brief details about the project..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                        />
                    </div>

                    <button type="submit" style={{
                        padding: '12px 20px',
                        background: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        transition: 'background 0.2s'
                    }}>
                        + Create
                    </button>
                </form>
            </div>

            {/* GRID DE PROYECTOS */}
            {loading ? <p>Loading projects...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                    {projects.map(p => (
                        <div
                            key={p.id}
                            onClick={() => setSelectedProjectId(p.id)}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                border: '1px solid #eaeaea',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                            }}
                        >
                            {/* Header de la tarjeta con gradiente */}
                            <div style={{
                                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                                padding: '15px 20px',
                                color: 'white'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{p.name}</h3>
                                    <button
                                        onClick={(e) => handleDeleteProject(p.id, e)}
                                        title="Delete Project"
                                        style={{
                                            background: 'rgba(255,255,255,0.2)',
                                            border: 'none',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '28px', height: '28px',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <span style={{ fontSize: '0.85em', opacity: 0.9 }}>
                                    📅 {new Date(p.startDate).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Cuerpo de la tarjeta */}
                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <p style={{ color: '#555', lineHeight: '1.5', fontSize: '0.95rem', flex: 1 }}>
                                    {p.description || "No description provided."}
                                </p>

                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <span style={{
                                        color: '#3498db',
                                        fontWeight: 'bold',
                                        fontSize: '0.9em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        Manage Materials &rarr;
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {projects.length === 0 && !loading && (
                <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
                    <h3>No projects yet</h3>
                    <p>Create your first project using the form above.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
