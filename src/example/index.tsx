import { useState } from 'react';
import GlobalUser from './model/User';

const GlobalUserTest = () => {
    const [user, setUser] = useState(GlobalUser.get());

    const handleSetUser = () => {
        const newUser = { email: 'kate@awesome', phone: '001225' };
        GlobalUser.set(newUser);
        setUser(GlobalUser.get());
    };

    const handleClearUser = () => {
        GlobalUser.clear();
        setUser(GlobalUser.get());
    };

    return (
        <div>
            <h1>GlobalUser Test</h1>
            <div>
                <strong>Stored User:</strong>
                {user ? (
                    <div>
                        <p>Email: {user.email}</p>
                        <p>Phone: {user.phone}</p>
                    </div>
                ) : (
                    <p>No user data found.</p>
                )}
            </div>
            <button onClick={handleSetUser}>Set User</button>
            <button onClick={handleClearUser}>Clear User</button>
        </div>
    );
};

export default GlobalUserTest;