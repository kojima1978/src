import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import '../css/Seat.css';

const Seat = ({ rowIndex, colIndex, seat, moveSeat, onSeatClick, onSeatRightClick, dragEnabled }) => {
    const [, drag] = useDrag(() => ({
        type: 'SEAT',
        item: { rowIndex, colIndex },
        canDrag: dragEnabled,
    }), [rowIndex, colIndex, dragEnabled]);

    const [, drop] = useDrop(() => ({
        accept: 'SEAT',
        drop: (item) => {
            moveSeat(item.rowIndex, item.colIndex, rowIndex, colIndex);
        },
    }), [rowIndex, colIndex]);

    const seatStyle = {
        opacity: seat.isTransparent ? 0.5 : 1,
        backgroundColor: dragEnabled ? 'green' : (seat.isTransparent ? 'transparent' : (seat.occupied ? 'blue' : 'red')),
        position: 'relative' // ツールチップの相対位置を設定
    };

    return (
        <div
            ref={(node) => drag(drop(node))}
            className="seat"
            style={seatStyle}
            onClick={() => onSeatClick(rowIndex, colIndex)}
            onContextMenu={(e) => onSeatRightClick(e, rowIndex, colIndex)}
        >
            <div className="seat-id">{seat.id}</div>
            <div className="seat-name">{seat.name}</div>
            {!dragEnabled && (
                <div className="tooltip">
                    <div>出発: {seat.departureTime || 'N/A'}</div>
                    <div>帰社: {seat.returnTime || 'N/A'}</div>
                    <div>行先: {seat.destination || 'N/A'}</div>
                </div>
            )}
        </div>
    );
};

export default Seat;
