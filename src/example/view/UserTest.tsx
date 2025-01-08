import { useState } from 'react';
import { GlobalUser, User } from '../model/User';
import GlobalToken from '../model/Token';

const UserTest = () => {
    const [userData, setUserData] = useState<User | undefined>();

    const handleSetUser = () => {
        const user: User = {
            email: 'test@example.com',
            phone: '123-456-7890',
        };
        GlobalUser.set(user);
    };

    const handleGetUser = () => {
        setUserData(GlobalUser.get());
    };

    const handleFindUserByEmail = () => {
        setUserData({phone: userData?.phone ?? "", email: GlobalUser.find('email') ?? ""});
    };

    const handleFindUserByPhone = () => {
        setUserData({email: userData?.email ?? "", phone: GlobalUser.find('phone') ?? ""});
    };

    const handleClearUser = () => {
        GlobalUser.clear();
        setUserData(undefined);
    };

    const handleSetToken = () => {
        GlobalToken.set("test");
    }

    const handleFetchUser = () => {
        GlobalUser.fetch({"apiKey": "GlobalUser"}).then(result => {
            if (result) setUserData(result);
        });
    }

    return (
        <div>
            <h1>User Test</h1>

            <button onClick={handleSetToken}>Set Token</button>
            <button onClick={() => handleFetchUser()}>Fetch User</button>
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
            </div>
        </div>
    );
};

export default UserTest;