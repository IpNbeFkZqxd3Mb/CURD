import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(path.resolve(), 'backend/data.json');

// 提供靜態文件（前端）
// Middleware
app.use(cors()); //允許跨來源請求，解決前後端跨域問題
app.use(bodyParser.json()); //解析請求中的 JSON 數據，並將其轉換為 JavaScript 對象，存放在 req.body 中
app.use(express.static(path.join(path.resolve(), 'frontend')));


// 如果用戶訪問根路徑 `/`，返回 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'frontend', 'index.html'));
});


// 模擬數據庫加載
function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// 保存數據
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API 路由
app.get('/api/items', (req, res) => {
    const data = loadData();
    res.json(data);
});

app.post('/api/items', (req, res) => {
    ("Received data:", req.body);
    const data = loadData();
    const newItem = { id: Date.now(), ...req.body };
    data.push(newItem);
    saveData(data);
    res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
    const data = loadData();
    const index = data.findIndex(item => item.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('Item not found');
    }
    data[index] = { ...data[index], ...req.body };
    saveData(data);
    res.json(data[index]);
});

app.delete('/api/items/:id', (req, res) => {
    let data = loadData();
    const index = data.findIndex(item => item.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('Item not found');
    }
    const deletedItem = data.splice(index, 1)[0];
    saveData(data);
    res.json(deletedItem);
});

// 啟動服務器
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
