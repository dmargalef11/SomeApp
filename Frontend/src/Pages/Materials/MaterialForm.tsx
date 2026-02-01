import { useState, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';


// Interfaces (reutiliza las que tengas o impórtalas si las sacaste a un archivo común)
interface Distributor {
    id: number;
    name: string;
}

interface MaterialFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = (error) => reject(error);
    });
};

const MaterialForm = ({ onSuccess, onCancel }: MaterialFormProps) => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        type: 'Paint', // Valor por defecto
        color: '#ffffff',
        texture: '',
        price: 0,
        thumbnailUrl: '',
        distributorId: '' // Empezamos vacío
    });

    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const [loading, setLoading] = useState(false);

    // Cargar distribuidores para el desplegable (Select)
    useEffect(() => {
        axios.get('http://localhost:5113/api/Distributors')
            .then(res => setDistributors(res.data))
            .catch(err => console.error("Error loading distributors:", err));
    }, []);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (e.target.type === 'file') {
            const fileInput = e.target as HTMLInputElement;
            const originalFile = fileInput.files?.[0];

            if (originalFile) {
                try {
                    // CONFIGURACIÓN DE COMPRESIÓN
                    const options = {
                        maxSizeMB: 0.1,          // Queremos que pese máximo 100KB (0.1 MB)
                        maxWidthOrHeight: 800,   // Redimensionar si es gigante (max 800px)
                        useWebWorker: true,      // Para que no se congele la pantalla
                        fileType: "image/jpeg"   // Forzar formato ligero
                    };

                    // Comprimir
                    console.log(`Original size: ${originalFile.size / 1024 / 1024} MB`);
                    const compressedFile = await imageCompression(originalFile, options);
                    console.log(`Compressed size: ${compressedFile.size / 1024 / 1024} MB`);

                    // Convertir la versión comprimida a Base64
                    const base64 = await convertToBase64(compressedFile);

                    setFormData(prev => ({ ...prev, thumbnailUrl: base64 }));
                } catch (err) {
                    console.error("Error compressing image", err);
                    alert("Error processing image");
                }
            }
        } else {
            // Lógica normal
            setFormData(prev => ({
                ...prev,
                [name]: name === 'price' || name === 'distributorId' ? Number(value) : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:5113/api/Materials', formData);
            alert('Material created successfully!');
            onSuccess(); // Avisar al padre para que cierre y refresque
        } catch (error) {
            console.error("Error creating material:", error);
            alert('Error creating material. Check console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
            <h3>New Material</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>

                {/* Nombre */}
                <div style={{ gridColumn: 'span 2' }}>
                    <label>Material Name:</label>
                    <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Tipo */}
                <div>
                    <label>Type:</label>
                    <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                        <option value="Paint">Paint</option>
                        <option value="Tile">Tile</option>
                        <option value="Wood">Wood</option>
                        <option value="Metal">Metal</option>
                        <option value="Cement">Cement</option>
                    </select>
                </div>

                {/* Distribuidor (Clave) */}
                <div>
                    <label>Distributor:</label>
                    <select
                        required
                        name="distributorId"
                        value={formData.distributorId}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="">Select a Supplier...</option>
                        {distributors.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                {/* Precio */}
                <div>
                    <label>Price (€):</label>
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Color (Picker) */}
                <div>
                    <label>Color:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="color"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            style={{ height: '38px', width: '50px' }}
                        />
                        <input
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            style={{ flex: 1, padding: '8px' }}
                        />
                    </div>
                </div>

                {/* Textura */}
                <div>
                    <label>Texture:</label>
                    <input
                        type="text"
                        name="texture"
                        value={formData.texture}
                        onChange={handleChange}
                        placeholder="e.g. Matte, Glossy, Rough"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* URL Imagen (Opcional por ahora) */}
                <div>
                    <label>Image URL:</label>
                    <input
                        type="text"
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleChange}
                        placeholder="http://..."
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Botones */}
                <div style={{ gridColumn: 'span 2', marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onCancel} style={{ padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {loading ? 'Saving...' : 'Save Material'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default MaterialForm;
