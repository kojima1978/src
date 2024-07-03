import React from 'react';
import Seat from './Seat';
import '../css/SeatingChart.css';

const SeatingChart = ({ seats, moveSeat, onSeatClick, onSeatRightClick, dragEnabled }) => {
    return (
        <div className="seating-chart">
            {seats.map((row, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                    {row.map((seat, colIndex) => (
                        <Seat
                            key={`${rowIndex}-${colIndex}`}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            seat={seat}
                            moveSeat={moveSeat}
                            onSeatClick={onSeatClick}
                            onSeatRightClick={onSeatRightClick}
                            dragEnabled={dragEnabled}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SeatingChart;
