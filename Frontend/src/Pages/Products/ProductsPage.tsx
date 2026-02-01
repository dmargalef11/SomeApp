import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
}

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5113/api/Products')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Products Management</h1>
                <button style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}>
                    + New Product
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>ID</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Name</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Price</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Stock</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{product.id}</td>
                                <td style={{ padding: '12px' }}>
                                    <strong>{product.name}</strong><br />
                                    <small style={{ color: '#777' }}>{product.description}</small>
                                </td>
                                <td style={{ padding: '12px' }}>€{product.price.toFixed(2)}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        background: product.stock > 10 ? '#d4edda' : '#f8d7da',
                                        color: product.stock > 10 ? '#155724' : '#721c24',
                                        fontSize: '0.85em'
                                    }}>
                                        {product.stock} units
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <button style={{ marginRight: '5px' }}>Edit</button>
                                    <button style={{ color: 'red' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductsPage;
