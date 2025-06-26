import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GetDepartment = () => {
    const [departments, setDepartments] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const navigateTo = useNavigate();

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "CSDL.php";
                const formData = new FormData();
                formData.append("operation", "getDepartment");
                const res = await axios.post(url, formData);
                setDepartments(res.data);
                toast.success("Departments loaded successfully!");
            } catch (error) {
                toast.error("Failed to load departments.");
            }
        };
        getDepartments();
    }, []);

    const deleteDepartment = async (dept_id) => {
        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const formData = new FormData();
            formData.append("operation", "deleteDepartment");
            formData.append("json", JSON.stringify({ dept_id }));
            const res = await axios.post(url, formData);

            if (res.data === 1) {
                setDepartments(departments.filter((department) => department.dept_id !== dept_id));
                toast.success("Department deleted successfully!");
            } else {
                toast.error("Failed to delete department.");
            }
        } catch (error) {
            toast.error("Failed to delete department.");
        }
    };

    const handleEdit = (dept_id, name) => {
        setEditId(dept_id);
        setEditName(name);
        setShowModal(true);
        setShowValidation(false);
    };

    const saveDepartment = async () => {
        if (!editName.trim()) {
            setShowValidation(true);
            return;
        }

        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const formData = new FormData();
            formData.append("operation", "updateDepartment");
            formData.append("json", JSON.stringify({ dept_id: editId, dept_name: editName }));
            const res = await axios.post(url, formData);

            if (res.data === 1) {
                setDepartments(departments.map((dept) =>
                    dept.dept_id === editId ? { ...dept, dept_name: editName } : dept
                ));
                toast.success("Department updated successfully!");
                setShowModal(false);
            } else {
                toast.error("Failed to update department.");
            }
        } catch (error) {
            toast.error("Failed to update department.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full py-10 px-6">
            <div className="max-w-[1440px] mx-auto space-y-10">
                <ArrowLeftCircle onClick={() => navigateTo(-1)} className="cursor-pointer text-green-700 hover:text-green-900 mb-4" size={32} />

                <h1 className="text-4xl font-bold text-green-800 text-center mb-6">
                    Department Management
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {departments.length > 0 ? (
                        departments.map((dept) => (
                            <div
                                key={dept.dept_id}
                                className="bg-white shadow-md rounded-2xl p-6 w-full h-full transition-transform hover:scale-[1.02]"
                            >
                                <div className="flex flex-col space-y-4 h-full justify-between">
                                    <h2 className="text-2xl font-semibold text-green-700">
                                        {dept.dept_name}
                                    </h2>
                                    <div className="flex space-x-3 justify-end">
                                        <button
                                            className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                                            onClick={() => handleEdit(dept.dept_id, dept.dept_name)}
                                        >
                                            <FaEdit />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors"
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this department?")) {
                                                    deleteDepartment(dept.dept_id);
                                                }
                                            }}
                                        >
                                            <FaTrash />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">No Departments Available</p>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl w-full max-w-[90vw] sm:max-w-md p-8 relative shadow-lg">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 bg-gray-200 rounded-full text-gray-600 p-2 hover:bg-gray-300 transition-colors"
                        >
                            X
                        </button>
                        <div className="flex flex-col space-y-6">
                            <h2 className="text-2xl font-bold text-green-700">Edit Department</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className={`w-full border ${showValidation ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                                {showValidation && <p className="text-red-500 text-sm mt-2">Department name cannot be empty.</p>}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    onClick={saveDepartment}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetDepartment;
