import { useState, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

interface Distributor {
    id: number;
    name: string;
}

interface Material {
    id: number;
    name: string;
    type: string;
    // Comunes
    price: number;
    stock: number;
    thumbnailUrl: string;
    distributorId: number;
    // Específicos (opcionales porque no todos tienen todo)
    colorHex?: string;
    finish?: string;
    isWaterBased?: boolean;
    widthCm?: number;
    heightCm?: number;
    isAntiSlip?: boolean;
    strengthClass?: string;
    weightKg?: number;
}

interface MaterialFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: Material | null;
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
    // Inicializar estado con TODOS los campos posibles
    const [formData, setFormData] = useState({
        // Comunes
        name: initialData?.name || '',
        type: initialData?.type || 'Paint',
        price: initialData?.price || 0,
        stock: initialData?.stock|| 0,
        thumbnailUrl: initialData?.thumbnailUrl || '',
        distributorId: initialData?.distributorId || '',

        // Paint
        colorHex: initialData?.colorHex || '#ffffff',
        finish: initialData?.finish || '',
        isWaterBased: initialData?.isWaterBased || false,

        // Tile
        widthCm: initialData?.widthCm || 0,
        heightCm: initialData?.heightCm || 0,
        isAntiSlip: initialData?.isAntiSlip || false,
        materialType: 'Ceramic', // Default para Tile

        // Cement
        weightKg: initialData?.weightKg || 25,
        strengthClass: initialData?.strengthClass || '42.5N',
        cementColor: 'Grey' // Renombrado para evitar conflicto con "color" genérico
    });

    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5113/api/Distributors')
            .then(res => setDistributors(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (type === 'file') {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                try {
                    const options = { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true, fileType: "image/jpeg" };
                    const compressed = await imageCompression(file, options);
                    const base64 = await convertToBase64(compressed);
                    setFormData(prev => ({ ...prev, thumbnailUrl: base64 }));
                } catch (err) { console.error(err); }
            }
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            // Convertir a número si es necesario
            const isNumber = ['price', 'distributorId', 'widthCm', 'heightCm', 'weightKg'].includes(name);
            setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const endpointType = formData.type.toLowerCase(); // paint, tile, cement
        const baseUrl = `http://localhost:5113/api/Materials/${endpointType}`;

        try {
            if (initialData) {
                await axios.put(`${baseUrl}/${initialData.id}`, { ...formData, id: initialData.id });
                alert('Updated!');
            } else {
                await axios.post(baseUrl, formData);
                alert('Created!');
            }
            onSuccess();
        } catch (error) {
            console.error("Error saving:", error);
            alert('Error saving material.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
            <h3>{initialData ? `Edit ${formData.type} #${initialData.id}` : 'New Material'}</h3>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>

                {/* COMUNES */}
                <div style={{ gridColumn: 'span 2' }}>
                    <label>Name:</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>

                <div>
                    <label>Type:</label>
                    {/* Deshabilitamos cambiar tipo al editar para simplificar lógica */}
                    <select name="type" value={formData.type} onChange={handleChange} disabled={!!initialData} style={{ width: '100%', padding: '8px' }}>
                        <option value="Paint">Paint</option>
                        <option value="Tile">Tile</option>
                        <option value="Cement">Cement</option>
                    </select>
                </div>

                <div>
                    <label>Distributor:</label>
                    <select required name="distributorId" value={formData.distributorId} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                        <option value="">Select Supplier...</option>
                        {distributors.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
                    </select>
                </div>

                <div>
                    <label>Price ({'\u20AC'}):</label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Initial Stock</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.stock}
                        onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                {/* ---------------- CAMPOS ESPECÍFICOS DE PAINT ---------------- */}
                {formData.type === 'Paint' && (
                    <>
                        <div>
                            <label>Color (Hex):</label>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <input type="color" name="colorHex" value={formData.colorHex} onChange={handleChange} style={{ height: '38px' }} />
                                <input type="text" name="colorHex" value={formData.colorHex} onChange={handleChange} style={{ flex: 1, padding: '8px' }} />
                            </div>
                        </div>
                        <div>
                            <label>Finish:</label>
                            <input type="text" name="finish" value={formData.finish} onChange={handleChange} placeholder="Matte, Satin..." style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input type="checkbox" name="isWaterBased" checked={formData.isWaterBased} onChange={handleChange} />
                            <label>Water Based</label>
                        </div>
                    </>
                )}

                {/* ---------------- CAMPOS ESPECÍFICOS DE TILE ---------------- */}
                {formData.type === 'Tile' && (
                    <>
                        <div>
                            <label>Width (cm):</label>
                            <input type="number" name="widthCm" value={formData.widthCm} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label>Height (cm):</label>
                            <input type="number" name="heightCm" value={formData.heightCm} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input type="checkbox" name="isAntiSlip" checked={formData.isAntiSlip} onChange={handleChange} />
                            <label>Anti-Slip Surface</label>
                        </div>
                    </>
                )}

                {/* ---------------- CAMPOS ESPECÍFICOS DE CEMENT ---------------- */}
                {formData.type === 'Cement' && (
                    <>
                        <div>
                            <label>Weight (Kg):</label>
                            <input type="number" name="weightKg" value={formData.weightKg} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label>Strength Class:</label>
                            <select name="strengthClass" value={formData.strengthClass} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                                <option value="32.5N">32.5N</option>
                                <option value="42.5N">42.5N</option>
                                <option value="52.5N">52.5N</option>
                            </select>
                        </div>
                    </>
                )}

                {/* IMAGEN COMÚN */}
                <div style={{ gridColumn: 'span 2' }}>
                    <label>Image:</label>
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
                        {loading ? 'Saving...' : (initialData ? 'Update' : 'Save')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MaterialForm;
