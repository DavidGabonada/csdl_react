import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GetScholarshipType = () => {
    const [scholarshipTypes, setScholarshipTypes] = useState([]);
    const [expandedScholarshipType, setExpandedScholarshipType] = useState(null);
    const navigateTo = useNavigate();

    useEffect(() => {
        const getScholarshipTypes = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "CSDL.php";
                const formData = new FormData();
                formData.append("operation", "getscholarship_type");
                const res = await axios.post(url, formData);
                setScholarshipTypes(res.data);
                toast.success("Scholarship types loaded successfully");
            } catch (error) {
                console.log('Failed to load scholarship types:', error);
                toast.error("Failed to load scholarship types");
            }
        };
        getScholarshipTypes();
    }, []);

    const deleteScholarType = async (type_id) => {
        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const jsonData = { type_id };
            const formData = new FormData();
            formData.append("operation", "deleteScholarshipType");
            formData.append("json", JSON.stringify(jsonData));
            const res = await axios.post(url, formData);
            if (res.data === 1) {
                setScholarshipTypes(prev => prev.filter(item => item.type_id !== type_id));
                toast.success("Scholarship type deleted successfully");
            } else {
                toast.error(res.data.message || "Failed to delete scholarship type");
            }
        } catch (error) {
            console.log('Failed to delete scholarship type:', error);
            toast.error("Failed to delete scholarship type");
        }
    };

    const handleScholarshipTypeClick = (type_id) => {
        setExpandedScholarshipType(expandedScholarshipType === type_id ? null : type_id);
    };

    const handleDelete = (type_id) => {
        if (window.confirm("Are you sure you want to delete this scholarship type?")) {
            deleteScholarType(type_id);
        }
    };

    const handleUpdate = (type_id) => {
        toast.success(`Scholarship type ${type_id} updated successfully`);
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full py-10 px-6">
            <div className="max-w-[1440px] mx-auto space-y-10">
                <ArrowLeftCircle onClick={() => navigateTo(-1)} className="cursor-pointer text-green-700 hover:text-green-900 mb-4" size={32} />

                <h1 className="text-4xl font-bold text-green-800 text-center mb-6">
                    Scholarship Type Management
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {scholarshipTypes.length > 0 ? (
                        scholarshipTypes.map((item) => (
                            <div
                                key={item.type_id}
                                className="bg-white shadow-md rounded-2xl p-6 w-full h-full transition-transform hover:scale-[1.02]"
                            >
                                <div className="flex flex-col space-y-4 h-full justify-between">
                                    <div onClick={() => handleScholarshipTypeClick(item.type_id)} className="cursor-pointer">
                                        <h2 className="text-2xl font-semibold text-green-700">
                                            {item.type_name}
                                        </h2>
                                    </div>
                                    {expandedScholarshipType === item.type_id && (
                                        <div className="flex space-x-3 justify-end">
                                            <button
                                                className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdate(item.type_id);
                                                }}
                                            >
                                                <FaEdit />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(item.type_id);
                                                }}
                                            >
                                                <FaTrash />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">No Scholarship Types Available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GetScholarshipType;
