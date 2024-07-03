const cron = require('node-cron');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require("socket.io");
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(bodyParser.json());
app.use(cors());

// MongoDBの接続設定
mongoose.connect('mongodb://localhost:27017/seatingChart');

// ルートの設定
const seatsRouter = require('./routes/seats')(io);
app.use('/seats', seatsRouter);

// スケジューリングされたタスクの設定
const Seat = require('./models/seat');
cron.schedule('0 0 * * *', async () => {
    console.log('Updating all seats to occupied at midnight...');
    await Seat.updateMany({}, { occupied: true });
    console.log('All seats have been set to occupied.');
    io.emit('allSeatsUpdated', {}); // 全クライアントに通知
}, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});

// サーバーの起動
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
