import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';

const GetAdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const navigateTo = useNavigate();

    useEffect(() => {
        const getAdmins = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "CSDL.php";
                const formData = new FormData();
                formData.append("operation", "getAdmin");
                const res = await axios.post(url, formData);
                setAdmins(res.data);
                toast.success("Admins loaded successfully");
            } catch (error) {
                toast.error("Failed to load admins");
            }
        };
        getAdmins();
    }, []);

    const deleteAdmin = async (admin_id) => {
        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const formData = new FormData();
            formData.append("operation", "deleteAdmin");
            formData.append("json", JSON.stringify({ admin_id }));
            const res = await axios.post(url, formData);

            if (res.data === -1) {
                toast.error("Cannot delete. Admin is linked to transactions.");
            } else if (res.data === 1) {
                setAdmins(admins.filter(admin => admin.adm_id !== admin_id));
                toast.success("Admin deleted successfully");
            } else {
                toast.error("Failed to delete admin.");
            }
        } catch (error) {
            toast.error("Failed to delete admin.");
        }
    };

    const handleDelete = (adminId) => {
        if (window.confirm("Are you sure you want to delete this admin?")) {
            deleteAdmin(adminId);
        }
    };

    const handleUpdate = (admin) => {
        setSelectedAdmin(admin);
        setShowModal(true);
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full py-10 px-6">
            <div className="max-w-[1440px] mx-auto space-y-10">
                <ArrowLeftCircle onClick={() => navigateTo(-1)} className="cursor-pointer text-green-700 hover:text-green-900 mb-4" size={32} />

                <h1 className="text-4xl font-bold text-green-800 text-center mb-6">
                    Admin Management
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {admins.length > 0 ? (
                        admins.map((admin) => (
                            <div
                                key={admin.adm_id}
                                className="bg-white shadow-md rounded-2xl p-6 w-full h-full transition-transform hover:scale-[1.02]"
                            >
                                <div className="flex flex-col space-y-4 h-full justify-between">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-green-700">
                                            {admin.adm_first_name} {admin.adm_last_name}
                                        </h2>
                                        <p className="text-gray-600 text-sm mt-1">
                                            ID: {admin.adm_employee_id}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Contact: {admin.adm_contact_number}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Email: {admin.adm_email}
                                        </p>
                                    </div>
                                    <div className="flex space-x-3 justify-end">
                                        <button
                                            className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                                            onClick={() => handleUpdate(admin)}
                                        >
                                            <FaEdit />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors"
                                            onClick={() => handleDelete(admin.adm_id)}
                                        >
                                            <FaTrash />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">No Admins Available</p>
                    )}
                </div>
            </div>

            {showModal && selectedAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl w-full max-w-[90vw] sm:max-w-md p-8 relative shadow-lg">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 bg-gray-200 rounded-full text-gray-600 p-2 hover:bg-gray-300 transition-colors"
                        >
                            X
                        </button>
                        <div className="flex flex-col space-y-6">
                            <h2 className="text-2xl font-bold text-green-700">Edit Admin</h2>
                            <div className="text-gray-700 space-y-2">
                                <p><strong>Employee ID:</strong> {selectedAdmin.adm_employee_id}</p>
                                <p><strong>Name:</strong> {selectedAdmin.adm_first_name} {selectedAdmin.adm_last_name}</p>
                                <p><strong>Contact:</strong> {selectedAdmin.adm_contact_number}</p>
                                <p><strong>Email:</strong> {selectedAdmin.adm_email}</p>
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

export default GetAdminList;
