import React, { useState } from 'react';
import '../css/EditModal.css';

const EditModal = ({ seat, onSave, onClose }) => {
    const [id, setId] = useState(seat.id);
    const [name, setName] = useState(seat.name);
    const [departureTime, setDepartureTime] = useState(seat.departureTime || '');
    const [returnTime, setReturnTime] = useState(seat.returnTime || '');
    const [destination, setDestination] = useState(seat.destination || '');
    const [isTransparent, setIsTransparent] = useState(seat.isTransparent || false);

    const handleSave = () => {
        onSave({ ...seat, id, name, departureTime, returnTime, destination, isTransparent });
    };

    const handleClear = () => {
        setDepartureTime('');
        setReturnTime('');
        setDestination('');
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Seat</h2>
                <label>
                    ID:
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
                </label>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Departure Time:
                    <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
                </label>
                <label>
                    Return Time:
                    <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
                </label>
                <label>
                    Destination:
                    <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
                </label>
                <label>
                    Transparent Seat:
                    <input type="checkbox" checked={isTransparent} onChange={(e) => setIsTransparent(e.target.checked)} />
                </label>
                <div className="modal-buttons">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleClear}>Clear</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
