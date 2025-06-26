import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GetSupervisorMaster = () => {
    const [supervisors, setSupervisors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const navigateTo = useNavigate();

    useEffect(() => {
        const getSupervisors = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "CSDL.php";
                const formData = new FormData();
                formData.append("operation", "getSupervisorMaster");
                const res = await axios.post(url, formData);
                setSupervisors(res.data);
                toast.success("Supervisors loaded successfully");
            } catch (error) {
                console.error('Failed to load supervisors:', error);
                toast.error("Failed to load supervisors");
            }
        };
        getSupervisors();
    }, []);

    const deleteSupervisor = async (supervisor_id) => {
        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const formData = new FormData();
            formData.append("operation", "deleteSupervisorMaster");
            formData.append("json", JSON.stringify({ supervisor_id }));
            const res = await axios.post(url, formData);

            if (res.data === -1) {
                toast.error("Failed to delete, there's a transaction using this supervisor");
            } else if (res.data === 1) {
                setSupervisors((prev) =>
                    prev.filter((supervisor) => supervisor.supervisor_id !== supervisor_id)
                );
                toast.success("Supervisor deleted successfully");
            } else {
                toast.error(res.data.message || "Failed to delete supervisor");
            }
        } catch (error) {
            console.error('Failed to delete supervisor:', error);
            toast.error("Failed to delete supervisor");
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this supervisor?")) {
            deleteSupervisor(id);
        }
    };

    const handleUpdate = (supervisor) => {
        setSelectedSupervisor(supervisor);
        setShowModal(true);
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full py-10 px-6">
            <div className="max-w-[1440px] mx-auto space-y-10">
                <ArrowLeftCircle onClick={() => navigateTo(-1)} className="cursor-pointer text-blue-700 hover:text-blue-900 mb-4" size={32} />
                <h1 className="text-4xl font-bold text-blue-800 text-center mb-6">
                    Supervisor Management
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {supervisors.length > 0 ? (
                        supervisors.map((sup) => (
                            <div
                                key={sup.supervisor_id}
                                className="bg-white shadow-md rounded-2xl p-6 w-full h-full transition-transform hover:scale-[1.02]"
                            >
                                <div className="flex flex-col space-y-4 h-full justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-blue-700">
                                            {sup.supM_first_name} {sup.supM_last_name}
                                        </h2>
                                        <p className="text-gray-500 text-sm">Employee ID: {sup.supM_employee_id}</p>
                                        <p className="text-gray-500 text-sm">Department: {sup.dept_name}</p>
                                        <p className="text-gray-500 text-sm">Contact: {sup.supM_contact_number}</p>
                                        <p className="text-gray-500 text-sm">Email: {sup.supM_email}</p>
                                    </div>
                                    <div className="flex space-x-3 justify-end">
                                        <button
                                            className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                                            onClick={() => handleUpdate(sup)}
                                        >
                                            <FaEdit />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors"
                                            onClick={() => handleDelete(sup.supervisor_id)}
                                        >
                                            <FaTrash />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">No Supervisors Available</p>
                    )}
                </div>
            </div>

            {showModal && selectedSupervisor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl w-full max-w-[90vw] sm:max-w-md p-8 relative shadow-lg">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 bg-gray-200 rounded-full text-gray-600 p-2 hover:bg-gray-300 transition-colors"
                        >
                            X
                        </button>
                        <div className="flex flex-col space-y-6">
                            <h2 className="text-2xl font-bold text-blue-700">Supervisor Details</h2>
                            <div className="text-gray-700 space-y-2">
                                <p><strong>ID:</strong> {selectedSupervisor.supM_employee_id}</p>
                                <p><strong>Name:</strong> {selectedSupervisor.supM_first_name} {selectedSupervisor.supM_last_name}</p>
                                <p><strong>Department:</strong> {selectedSupervisor.dept_name}</p>
                                <p><strong>Contact:</strong> {selectedSupervisor.supM_contact_number}</p>
                                <p><strong>Email:</strong> {selectedSupervisor.supM_email}</p>
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

export default GetSupervisorMaster;
