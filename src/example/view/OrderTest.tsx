import { useState } from 'react';
import { Orders, Order } from '../model/Order';

const OrderTest = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderId, setOrderId] = useState('');
    const [foundOrder, setFoundOrder] = useState<Order | undefined>(undefined);

    const sampleOrders = [
        { orderId: '1', name: 'Order 1' },
        { orderId: '2', name: 'Order 2' },
    ];

    const handleSetOrders = () => {
        Orders.set(sampleOrders);
    };

    const handleGetOrders = async () => {
        const retrievedOrders = await Orders.get() || [];
        setOrders(retrievedOrders);
    };

    const handleFindOrder = async () => {
        const result = await Orders.find(orderId);
        setFoundOrder(result);
    };

    const handleClearOrders = () => {
        Orders.clear();
        setOrders([]);
        setFoundOrder(undefined);
    };

    return (
        <div>
            <h1>Orders Test</h1>

            <button onClick={handleSetOrders}>Set Orders</button>
            <button onClick={handleGetOrders}>Get Orders</button>

            <h2>Orders:</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.orderId}>
                        {order.orderId}: {order.name}
                    </li>
                ))}
            </ul>

            <div>
                <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter Order ID"
                />
                <button onClick={handleFindOrder}>Find Order</button>
                {foundOrder ? (
                    <div>
                        <h3>Found Order:</h3>
                        <p>Order ID: {foundOrder.orderId}</p>
                        <p>Name: {foundOrder.name}</p>
                    </div>
                ) : (
                    <p>No order found with ID: {orderId}</p>
                )}
            </div>

            <button onClick={handleClearOrders}>Clear Orders</button>
            {orders.length === 0 && <p>No orders available.</p>}
        </div>
    );
};

export default OrderTest;