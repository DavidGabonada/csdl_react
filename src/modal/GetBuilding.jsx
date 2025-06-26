import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';

const GetBuilding = () => {
    const [buildings, setBuildings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const navigateTo = useNavigate();

    useEffect(() => {
        const getBuildings = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "CSDL.php";
                const formData = new FormData();
                formData.append("operation", "getBuilding");
                const res = await axios.post(url, formData);
                setBuildings(res.data);
                toast.success("Buildings loaded successfully");
            } catch (error) {
                console.error('Failed to load buildings:', error);
                toast.error("Failed to load buildings");
            }
        };
        getBuildings();
    }, []);

    const deleteBuilding = async (build_id) => {
        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const formData = new FormData();
            formData.append("operation", "deleteBuilding");
            formData.append("json", JSON.stringify({ build_id }));
            const res = await axios.post(url, formData);
            if (res.data === 1) {
                setBuildings(buildings.filter(building => building.build_id !== build_id));
                toast.success("Building deleted successfully");
            } else {
                toast.error(res.data.message || "Failed to delete building");
            }
        } catch (error) {
            console.error('Failed to delete building:', error);
            toast.error("Failed to delete building");
        }
    };

    const handleDelete = (buildingId) => {
        if (window.confirm("Are you sure you want to delete this building?")) {
            deleteBuilding(buildingId);
        }
    };

    const handleUpdate = (building) => {
        setSelectedBuilding(building);
        setShowModal(true);
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full py-10 px-6">
            <div className="max-w-[1440px] mx-auto space-y-10">
                <ArrowLeftCircle onClick={() => navigateTo(-1)} className="cursor-pointer text-green-700 hover:text-green-900 mb-4" size={32} />
                <h1 className="text-4xl font-bold text-green-800 text-center mb-6">
                    Building Management
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {buildings.length > 0 ? (
                        buildings.map((building) => (
                            <div
                                key={building.build_id}
                                className="bg-white shadow-md rounded-2xl p-6 w-full h-full transition-transform hover:scale-[1.02]"
                            >
                                <div className="flex flex-col space-y-4 h-full justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-green-700">
                                            {building.build_name}
                                        </h2>
                                        <p className="text-gray-500 text-sm">
                                            ID: {building.build_id}
                                        </p>
                                    </div>
                                    <div className="flex space-x-3 justify-end">
                                        <button
                                            className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                                            onClick={() => handleUpdate(building)}
                                        >
                                            <FaEdit />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors"
                                            onClick={() => handleDelete(building.build_id)}
                                        >
                                            <FaTrash />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">No Buildings Available</p>
                    )}
                </div>
            </div>

            {showModal && selectedBuilding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl w-full max-w-[90vw] sm:max-w-md p-8 relative shadow-lg">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 bg-gray-200 rounded-full text-gray-600 p-2 hover:bg-gray-300 transition-colors"
                        >
                            X
                        </button>
                        <div className="flex flex-col space-y-6">
                            <h2 className="text-2xl font-bold text-green-700">Building Details</h2>
                            <div className="text-gray-700 space-y-2">
                                <p><strong>ID:</strong> {selectedBuilding.build_id}</p>
                                <p><strong>Name:</strong> {selectedBuilding.build_name}</p>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetBuilding;
