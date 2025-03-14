import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';

function AddRoom() {
    const [formData, setFormData] = useState({
        room: "",
        // building: ""
    });
    // const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);

    const getRooms = async () => {
        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const formData = new FormData();
            formData.append("operation", "getRoom");
            const res = await axios.post(url, formData);
            if (Array.isArray(res.data)) {
                setRooms(res.data);
                toast.success("Rooms loaded successfully");
            } else {
                console.log('Unexpected response format:', res.data);
                toast.error("Unexpected data format");
            }
        } catch (error) {
            console.log('Failed to load Rooms:', error);
            toast.error("Failed to load Rooms");
        }
    };

    useEffect(() => {
        getRooms();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        const roomName = formData.room.trim(); // Remove leading and trailing spaces

        if (roomName === "") {
            toast.error("Room name cannot be empty.");
            return;
        }

        const roomExists = rooms.some(
            (room) => room.room_name.toLowerCase().trim() === roomName.toLowerCase()
        );

        if (roomExists) {
            toast.error("Room with the same number already exists.");
            return;
        }

        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const jsonData = {
                room_name: roomName,
            };

            const formDataToSend = new FormData();
            formDataToSend.append("json", JSON.stringify(jsonData));
            formDataToSend.append("operation", "AddRoom");

            console.log('Sending data:', jsonData);
            const res = await axios.post(url, formDataToSend);
            console.log('Response from server:', res.data);

            if (res.data !== 0) {
                toast.success("Room added successfully");

                setFormData({
                    room: "",
                });

                await getRooms();
            } else {
                toast.error("Failed to add room");
            }
        } catch (error) {
            console.log('Error while adding room:', error);
            toast.error("An error occurred while adding the room");
        }
    };


    return (
        <div className="flex flex-col items-center bg-blue-100 p-6 rounded-lg max-w-md mx-auto shadow-md">
            <h2 className="mb-4 text-2xl text-blue-900">Add Room</h2>

            <input
                type="text"
                name="room"
                placeholder="Enter Room Number"
                value={formData.room}
                onChange={handleInputChange}
                className="p-2 text-lg w-full mb-2 border border-blue-900 rounded"
            />

            {/* <select
                name="building"
                value={formData.building}
                onChange={handleInputChange}
                className="p-2 text-lg w-full mb-2 border border-blue-900 rounded"
            >
                <option value="">Select Building</option>
                {buildings.length > 0 ? buildings.map((building, index) => (
                    <option key={index} value={building.build_id}>
                        {building.build_name}
                    </option>
                )) : (<option disabled>No buildings yet</option>)}
            </select> */}

            <button
                onClick={handleAdd}
                className="p-2 text-lg bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
            >
                Add Room
            </button>
        </div>
    );
}

export default AddRoom;
