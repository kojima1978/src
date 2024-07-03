const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    id: String,
    name: String,
    occupied: Boolean,
    row: Number,
    col: Number,
    departureTime: String,
    returnTime: String,
    destination: String,
    isTransparent: { type: Boolean, default: false }
}, { timestamps: true });

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;

