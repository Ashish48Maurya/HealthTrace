import React, { useState, useEffect } from 'react';

const ManuProducts = () => {
    const [items, setItems] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8000/get');
            const data = await response.json();
            setItems(data.ans);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleSoldClick = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8000/sold/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ distributor: true })
            });

            if (response.ok) {
                await fetchData();
                console.log(`Product ${productId} is marked as sold.`);
            } else {
                console.error(`Failed to mark product ${productId} as sold.`);
            }
        } catch (error) {
            console.error('Error marking product as sold:', error);
        }
    };

    return (
        <div>
            <h1>Product List</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {items.map(item => (
                    <li key={item._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                        <strong>Product ID:</strong> {item.productID}<br />
                        <strong>Product Name:</strong> {item.prdName}<br />
                        <strong>Batch No:</strong> {item.batchNo}<br />
                        <strong>Manufacture Date:</strong> {new Date(item.manufactureDate).toLocaleDateString()}<br />
                        <strong>Expiration Date:</strong> {new Date(item.expirationDate).toLocaleDateString()}<br />
                        <button className='btn btn-primary' onClick={() => handleSoldClick(item.productID)}>Sold</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManuProducts;
