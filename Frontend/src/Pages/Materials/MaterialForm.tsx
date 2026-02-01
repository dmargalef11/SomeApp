import { useState, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

interface Distributor {
    id: number;
    name: string;
}

// EDIT: Añadimos la interfaz del Material para poder recibirlo
interface Material {
    id: number;
    name: string;
    type: string;
    color: string;
    texture: string;
    price: number;
    thumbnailUrl: string;
    distributorId: number;
}

interface MaterialFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: Material | null; // EDIT: Prop nueva opcional
}

const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = (error) => reject(error);
    });
};

const MaterialForm = ({ onSuccess, onCancel, initialData }: MaterialFormProps) => {
    // EDIT: Inicializamos el estado con los datos si existen, o vacíos si es nuevo
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        type: initialData?.type || 'Paint',
        color: initialData?.color || '#ffffff',
        texture: initialData?.texture || '',
        price: initialData?.price || 0,
        thumbnailUrl: initialData?.thumbnailUrl || '',
        distributorId: initialData?.distributorId || ''
    });

    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const [loading, setLoading] = useState(false);

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
                    const options = {
                        maxSizeMB: 0.1,
                        maxWidthOrHeight: 800,
                        useWebWorker: true,
                        fileType: "image/jpeg"
                    };
                    const compressedFile = await imageCompression(originalFile, options);
                    const base64 = await convertToBase64(compressedFile);
                    setFormData(prev => ({ ...prev, thumbnailUrl: base64 }));
                } catch (err) {
                    console.error(err);
                    alert("Error processing image");
                }
            }
        } else {
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
            if (initialData) {
                // EDIT: Si hay initialData, hacemos PUT (Actualizar)
                // Necesitamos enviar el ID en la URL y el objeto con ID en el cuerpo
                const updatePayload = { ...formData, id: initialData.id };
                await axios.put(`http://localhost:5113/api/Materials/${initialData.id}`, updatePayload);
                alert('Material updated successfully!');
            } else {
                // EDIT: Si no, hacemos POST (Crear)
                await axios.post('http://localhost:5113/api/Materials', formData);
                alert('Material created successfully!');
            }
            onSuccess();
        } catch (error) {
            console.error("Error saving material:", error);
            alert('Error saving material.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
            {/* EDIT: Título dinámico */}
            <h3>{initialData ? `Edit Material #${initialData.id}` : 'New Material'}</h3>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {/* ... (El resto del formulario es idéntico, no cambia nada visualmente) ... */}

                <div style={{ gridColumn: 'span 2' }}>
                    <label>Material Name:</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>

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

                <div>
                    <label>Distributor:</label>
                    <select required name="distributorId" value={formData.distributorId} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                        <option value="">Select a Supplier...</option>
                        {distributors.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
                    </select>
                </div>

                <div>
                    <label>Price ({'\u20AC'}):</label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>

                <div>
                    <label>Color:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="color" name="color" value={formData.color} onChange={handleChange} style={{ height: '38px', width: '50px' }} />
                        <input type="text" name="color" value={formData.color} onChange={handleChange} style={{ flex: 1, padding: '8px' }} />
                    </div>
                </div>

                <div>
                    <label>Texture:</label>
                    <input type="text" name="texture" value={formData.texture} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                    <label>Material Image (Upload):</label>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '5px' }}>
                        <input type="file" accept="image/*" onChange={handleChange} style={{ padding: '5px' }} />
                        {formData.thumbnailUrl && (
                            <div style={{ width: '50px', height: '50px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                                <img src={formData.thumbnailUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ gridColumn: 'span 2', marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onCancel} style={{ padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {loading ? 'Saving...' : (initialData ? 'Update Material' : 'Save Material')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MaterialForm;
