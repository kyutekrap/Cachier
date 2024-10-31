import { useState } from 'react';
import { Orders, Order } from '../model/Order';

const OrderTest = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    
    // Separate states for finding, adding, and removing orders
    const [findOrderId, setFindOrderId] = useState('');
    const [foundOrder, setFoundOrder] = useState<Order | undefined>(undefined);
    
    const [addOrderId, setAddOrderId] = useState('');
    const [addOrderName, setAddOrderName] = useState('');
    
    const [removeOrderId, setRemoveOrderId] = useState('');

    const sampleOrders = [
        { orderId: '1', name: 'Order 1' },
        { orderId: '2', name: 'Order 2' },
    ];

    const handleSetOrders = () => {
        Orders.set(sampleOrders);
        setOrders(sampleOrders);
    };

    const handleGetOrders = async () => {
        const retrievedOrders = await Orders.get() || [];
        setOrders(retrievedOrders);
    };

    const handleFindOrder = async () => {
        const result = await Orders.find(findOrderId);
        setFoundOrder(result);
    };

    const handleClearOrders = () => {
        Orders.clear();
        setOrders([]);
        setFoundOrder(undefined);
    };

    const handleAddOrder = () => {
        if (addOrderId && addOrderName) {
            const newOrder: Order = { orderId: addOrderId, name: addOrderName };
            Orders.add(newOrder);
            setOrders(prevOrders => [...(prevOrders || []), newOrder]);
            setAddOrderId('');
            setAddOrderName('');
        }
    };

    const handleRemoveOrder = () => {
        Orders.remove(removeOrderId);
        setOrders(prevOrders => prevOrders.filter(order => order.orderId !== removeOrderId));
        setRemoveOrderId('');
    };

    return (
        <div>
            <h1>Orders Test</h1>

            <button onClick={handleSetOrders}>Set Sample Orders</button>
            <button onClick={handleGetOrders}>Get Orders</button>

            <h2>Orders:</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.orderId}>
                        {order.orderId}: {order.name}
                    </li>
                ))}
            </ul>

            {/* Find Order Section */}
            <div>
                <h3>Find Order</h3>
                <input
                    type="text"
                    value={findOrderId}
                    onChange={(e) => setFindOrderId(e.target.value)}
                    placeholder="Enter Order ID to Find"
                />
                <button onClick={handleFindOrder}>Find Order</button>
                {foundOrder ? (
                    <div>
                        <h3>Found Order:</h3>
                        <p>Order ID: {foundOrder.orderId}</p>
                        <p>Name: {foundOrder.name}</p>
                    </div>
                ) : (
                    findOrderId && <p>No order found with ID: {findOrderId}</p>
                )}
            </div>

            {/* Add Order Section */}
            <div>
                <h3>Add New Order</h3>
                <input
                    type="text"
                    value={addOrderId}
                    onChange={(e) => setAddOrderId(e.target.value)}
                    placeholder="Order ID"
                />
                <input
                    type="text"
                    value={addOrderName}
                    onChange={(e) => setAddOrderName(e.target.value)}
                    placeholder="Order Name"
                />
                <button onClick={handleAddOrder}>Add Order</button>
            </div>

            {/* Remove Order Section */}
            <div>
                <h3>Remove Order</h3>
                <input
                    type="text"
                    value={removeOrderId}
                    onChange={(e) => setRemoveOrderId(e.target.value)}
                    placeholder="Enter Order ID to Remove"
                />
                <button onClick={handleRemoveOrder}>Remove Order</button>
            </div>

            <button onClick={handleClearOrders}>Clear Orders</button>
            {orders.length === 0 && <p>No orders available.</p>}
        </div>
    );
};

export default OrderTest;