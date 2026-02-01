import { useState } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

// Interfaz del Distribuidor
interface Distributor {
    id: number;
    name: string;
    logoUrl: string;
}

interface DistributorFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: Distributor | null; // Datos para editar (opcional)
}

// Función helper para Base64 (la misma de antes)
const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = (error) => reject(error);
    });
};

const DistributorForm = ({ onSuccess, onCancel, initialData }: DistributorFormProps) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        logoUrl: initialData?.logoUrl || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === 'file') {
            const file = e.target.files?.[0];
            if (file) {
                try {
                    const options = { maxSizeMB: 0.1, maxWidthOrHeight: 400, useWebWorker: true, fileType: "image/png" };
                    const compressedFile = await imageCompression(file, options);
                    const base64 = await convertToBase64(compressedFile);
                    setFormData(prev => ({ ...prev, logoUrl: base64 }));
                } catch (err) {
                    console.error("Error processing logo", err);
                }
            }
        } else {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData) {
                // EDITAR (PUT)
                await axios.put(`http://localhost:5113/api/Distributors/${initialData.id}`, { ...formData, id: initialData.id });
                alert('Distributor updated!');
            } else {
                // CREAR (POST)
                await axios.post('http://localhost:5113/api/Distributors', formData);
                alert('Distributor created!');
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Error saving distributor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
            <h3>{initialData ? `Edit Supplier #${initialData.id}` : 'New Supplier'}</h3>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>

                {/* Nombre */}
                <div>
                    <label>Company Name:</label>
                    <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                {/* Logo Upload */}
                <div>
                    <label>Logo:</label>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '5px' }}>
                        <input type="file" accept="image/*" onChange={handleChange} />

                        {formData.logoUrl && (
                            <div style={{ width: '60px', height: '60px', border: '1px solid #ddd', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
                                <img src={formData.logoUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button type="button" onClick={onCancel} style={{ padding: '8px 16px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" disabled={loading} style={{ padding: '8px 16px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {loading ? 'Saving...' : 'Save Supplier'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DistributorForm;
