import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import io from 'socket.io-client';
import SeatingChart from './components/SeatingChart';
import EditModal from './components/EditModal';
import './css/App.css';

const socket = io('http://localhost:5000');

const App = () => {
  const [seats, setSeats] = useState([]);
  const [editSeat, setEditSeat] = useState(null);
  const [dragEnabled, setDragEnabled] = useState(false);

  const fetchSeats = async () => {
    const response = await axios.get('http://localhost:5000/seats');
    const seatsData = Array.from({ length: 8 }, (_, rowIndex) =>
      Array.from({ length: 8 }, (_, colIndex) => {
        const seat = response.data.find(seat => seat.row === rowIndex && seat.col === colIndex);
        return seat ? seat : { id: `${rowIndex + 1}-${colIndex + 1}`, name: `Seat ${rowIndex + 1}-${colIndex + 1}`, occupied: false, row: rowIndex, col: colIndex };
      })
    );
    setSeats(seatsData);
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  useEffect(() => {
    socket.on('seatUpdated', (updatedSeat) => {
      setSeats((prevSeats) => {
        const newSeats = [...prevSeats];
        const { row, col } = updatedSeat;
        newSeats[row][col] = updatedSeat;
        return newSeats;
      });
    });

    socket.on('allSeatsUpdated', () => {
      fetchSeats(); // 全ての座席が更新された場合に再取得
    });

    return () => {
      socket.off('seatUpdated');
      socket.off('allSeatsUpdated');
    };
  }, []);

  const moveSeat = async (fromRow, fromCol, toRow, toCol) => {
    const newSeats = [...seats];
    const movedSeat = { ...newSeats[fromRow][fromCol], row: toRow, col: toCol };
    newSeats[fromRow][fromCol] = { ...newSeats[toRow][toCol], row: fromRow, col: fromCol };
    newSeats[toRow][toCol] = movedSeat;
    setSeats(newSeats);

    await axios.post('http://localhost:5000/seats', newSeats[fromRow][fromCol]);
    await axios.post('http://localhost:5000/seats', newSeats[toRow][toCol]);
  };

  const handleSeatClick = async (rowIndex, colIndex) => {
    const newSeats = [...seats];
    newSeats[rowIndex][colIndex].occupied = !newSeats[rowIndex][colIndex].occupied;

    await axios.post('http://localhost:5000/seats', newSeats[rowIndex][colIndex]);

    setSeats(newSeats);
  };

  const handleSeatRightClick = (e, rowIndex, colIndex) => {
    e.preventDefault();
    setEditSeat({ ...seats[rowIndex][colIndex], rowIndex, colIndex });
  };

  const handleSaveSeat = async (updatedSeat) => {
    const newSeats = [...seats];
    newSeats[updatedSeat.rowIndex][updatedSeat.colIndex] = updatedSeat;
    setSeats(newSeats);

    await axios.post('http://localhost:5000/seats', updatedSeat);
    setEditSeat(null);
  };

  return (
    <div className="App">
      <h1>8x8 Seating Chart</h1>
      <button onClick={() => setDragEnabled(!dragEnabled)}>
        {dragEnabled ? 'Disable Drag & Drop' : 'Enable Drag & Drop'}
      </button>
      <DndProvider backend={HTML5Backend}>
        <SeatingChart
          seats={seats}
          moveSeat={moveSeat}
          onSeatClick={handleSeatClick}
          onSeatRightClick={handleSeatRightClick}
          dragEnabled={dragEnabled}
        />
      </DndProvider>
      {editSeat && <EditModal seat={editSeat} onSave={handleSaveSeat} onClose={() => setEditSeat(null)} />}
    </div>
  );
};

export default App;
