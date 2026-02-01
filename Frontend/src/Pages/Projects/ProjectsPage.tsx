import { useEffect, useState } from 'react';
import axios from 'axios';

interface Project {
    id: number;
    name: string;
    // Añade aquí más campos si tu API los devuelve (ej: fecha, estado)
}

const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        axios.get('http://localhost:5113/api/Projects')
            .then(res => setProjects(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Projects</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {projects.map(proj => (
                    <div key={proj.id} style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        borderLeft: '5px solid #3498db',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>{proj.name}</h3>
                        <p style={{ color: '#666', fontSize: '0.9em' }}>Project ID: #{proj.id}</p>
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button style={{ flex: 1 }}>View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsPage;
