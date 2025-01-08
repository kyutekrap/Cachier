import { createConfig } from "cachier-api";
import GlobalToken from "./src/example/model/Token";

const config = createConfig({
    restApiConfig: {
        url: "http://localhost:3000/api",
        secretKey: GlobalToken,
        method: 'jwt'
    },
    indexedDBConfig: {
        dbName: 'ExampleDB',
        version: 1,
        stores: [
            {
                name: 'Users',
                keyPath: 'id',
                autoIncrement: true,
                indices: [
                    { name: 'email', keyPath: 'email', unique: true }
                ]
            },
            {
                name: 'Orders',
                keyPath: 'orderId',
                autoIncrement: false
            }
        ]
    }
});

export default config;