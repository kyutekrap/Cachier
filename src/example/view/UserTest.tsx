import { useState } from 'react';
import { GlobalUser, User } from '../model/User';

const UserTest = () => {
    const [email, setEmail] = useState<string | undefined>();
    const [phone, setPhone] = useState<string | undefined>();
    const [userData, setUserData] = useState<User | undefined>();

    const handleSetUser = () => {
        const user: User = {
            email: 'test@example.com',
            phone: '123-456-7890',
        };
        GlobalUser.set(user);
    };

    const handleGetUser = () => {
        const data = GlobalUser.get();
        console.log(data)
        setUserData(data);
    };

    const handleFindUserByEmail = () => {
        const foundEmail = GlobalUser.find('email');
        setEmail(foundEmail);
    };

    const handleFindUserByPhone = () => {
        const foundPhone = GlobalUser.find('phone');
        setPhone(foundPhone);
    };

    const handleClearUser = () => {
        GlobalUser.clear();
        setUserData(undefined);
    };

    return (
        <div>
            <h1>User Test</h1>

            <button onClick={handleSetUser}>Set User</button>
            <button onClick={handleGetUser}>Get User</button>
            <button onClick={handleFindUserByEmail}>Find Email</button>
            <button onClick={handleFindUserByPhone}>Find Phone</button>
            <button onClick={handleClearUser}>Clear User</button>

            <div style={{ marginTop: '20px' }}>
                <h2>Retrieved User Data:</h2>
                {userData ? (
                    <div>
                        <p>Email: {userData.email}</p>
                        <p>Phone: {userData.phone}</p>
                    </div>
                ) : (
                    <p>No user data available.</p>
                )}
                {email && <p>Found Email: {email}</p>}
                {phone && <p>Found Phone: {phone}</p>}
            </div>
        </div>
    );
};

export default UserTest;