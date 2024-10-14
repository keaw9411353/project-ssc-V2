const express = require('express');
const cors = require('cors');

// นำเข้า routes ของ crud ที่เรา หำะ ไว้
const apiRouter = require('./routes/api'); // นำเข้า apiRouter
const apiRouterV2 = require('./routes/api_v2');

const app = express();


// Middleware สำหรับการแปลงข้อมูลที่ถูกส่งมาเป็น JSON
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

// เชื่อมโยงเส้นทาง /api/v1 ไปยัง apiRouter
app.use('/api/v1', apiRouter);
app.use('/api/v2', apiRouterV2);


// เริ่มเซิร์ฟเวอร์
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

