const express = require('express');
const Seat = require('../models/seat');

module.exports = (io) => {
    const router = express.Router();

    // 座席データの取得
    router.get('/', async (req, res) => {
        const seats = await Seat.find();
        res.json(seats);
    });

    // 座席データの更新
    router.post('/', async (req, res) => {
        const { id, name, occupied, row, col, departureTime, returnTime, destination, isTransparent } = req.body;
        const seat = await Seat.findOneAndUpdate(
            { id },
            { name, occupied, row, col, departureTime, returnTime, destination, isTransparent },
            { new: true, upsert: true }
        );

        // 更新された座席データを全クライアントに送信
        io.emit('seatUpdated', seat);

        res.json(seat);
    });

    return router;
};

