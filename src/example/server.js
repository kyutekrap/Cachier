const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'GET'],
    allowedHeaders: ['Authorization']
}));

app.post('/api', (req, res) => {
    res.json({ email: 'test@email.com', phone: '123456789' });
});

app.get('/api', (req, res) => {
    res.json({ email: 'test@email.com', phone: '123456789' });
});

app.get('/api/GlobalUser', (req, res) => {
    res.json({ email: 'test@email.com', phone: '123456789' });
});

app.listen(PORT, () => {
    console.log("App is running on port " + PORT);
});