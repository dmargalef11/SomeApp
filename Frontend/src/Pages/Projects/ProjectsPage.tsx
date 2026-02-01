import { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectDetails from './ProjectDetails'; // Asegúrate de importar el componente que te di antes

interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
}

const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Si este estado tiene un ID, mostramos el detalle. Si es null, la lista.
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    // Estado para crear nuevo proyecto (simple)
    const [newProjectName, setNewProjectName] = useState('');

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5113/api/Projects');
            setProjects(res.data);
        } catch (error) {
            console.error("Error loading projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5113/api/Projects', {
                name: newProjectName,
                description: "New project description...",
                startDate: new Date().toISOString()
            });
            setNewProjectName('');
            loadProjects();
        } catch (error) {
            console.error(error); 
            alert('Error creating project');
        }
    };

    const handleDeleteProject = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Para que no entre al detalle al hacer clic en borrar
        if (!confirm("Delete project? This will remove all material links.")) return;

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
                onBack={() => setSelectedProjectId(null)} // Volver a la lista
            />
        );
    }

    // --- MODO LISTA ---
    return (
        <div style={{ padding: '20px' }}>
            <h1>Projects</h1>

            {/* Formulario rápido para crear proyecto */}
            <form onSubmit={handleCreateProject} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="New Project Name"
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    style={{ padding: '8px', width: '300px' }}
                    required
                />
                <button type="submit" style={{ padding: '8px 16px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer' }}>
                    + Create Project
                </button>
            </form>

            {loading ? <p>Loading projects...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {projects.map(p => (
                        <div key={p.id} style={{
                            border: '1px solid #ddd',
                            padding: '20px',
                            borderRadius: '8px',
                            background: 'white',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}>
                            <h3 style={{ marginTop: 0 }}>{p.name}</h3>
                            {/* BOTÓN DE BORRAR X ROJA */}
                            <button
                                onClick={(e) => handleDeleteProject(p.id, e)}
                                style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                            >
                                &times;
                            </button>
                            <p style={{ color: '#666', fontSize: '0.9em' }}>{p.description}</p>
                            <p style={{ fontSize: '0.8em', color: '#999' }}>
                                Start: {new Date(p.startDate).toLocaleDateString()}
                            </p>

                            <button
                                onClick={() => setSelectedProjectId(p.id)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginTop: '10px'
                                }}
                            >
                                Manage Materials &rarr;
                            </button>


                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
