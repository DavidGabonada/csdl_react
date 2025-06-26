import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';

const GetSubject = () => {
    const [subjects, setSubjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const navigateTo = useNavigate();

    useEffect(() => {
        const getSubjects = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "CSDL.php";
                const formData = new FormData();
                formData.append("operation", "getSubject");
                const res = await axios.post(url, formData);
                if (Array.isArray(res.data)) {
                    setSubjects(res.data);
                    toast.success("Subjects loaded successfully");
                } else {
                    toast.error("Unexpected data format");
                }
            } catch (error) {
                toast.error("Failed to load subjects");
            }
        };
        getSubjects();
    }, []);

    const deleteSubject = async (sub_id) => {
        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const formData = new FormData();
            formData.append("operation", "deleteSubject");
            formData.append("json", JSON.stringify({ sub_id }));
            const res = await axios.post(url, formData);
            if (res.data === 1) {
                setSubjects(subjects.filter(subject => subject.sub_id !== sub_id));
                toast.success("Subject deleted successfully");
            } else {
                toast.error(res.data.message || "Failed to delete subject");
            }
        } catch (error) {
            toast.error("Failed to delete subject");
        }
    };

    const handleDelete = (subjectId) => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            deleteSubject(subjectId);
        }
    };

    const handleUpdate = (subject) => {
        setSelectedSubject(subject);
        setShowModal(true);
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full py-10 px-6">
            <div className="max-w-[1440px] mx-auto space-y-10">
                <ArrowLeftCircle onClick={() => navigateTo(-1)} className="cursor-pointer text-green-700 hover:text-green-900 mb-4" size={32} />
                <h1 className="text-4xl font-bold text-green-800 text-center mb-6">
                    Subject Management
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {subjects.length > 0 ? (
                        subjects.map((subject) => (
                            <div
                                key={subject.sub_id}
                                className="bg-white shadow-md rounded-2xl p-6 w-full h-full transition-transform hover:scale-[1.02]"
                            >
                                <div className="flex flex-col space-y-4 h-full justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-green-700">
                                            {subject.sub_code}
                                        </h2>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {subject.sub_descriptive_title}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Units: {subject.sub_units}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Type: {subject.sub_type}
                                        </p>
                                    </div>
                                    <div className="flex space-x-3 justify-end">
                                        <button
                                            className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                                            onClick={() => handleUpdate(subject)}
                                        >
                                            <FaEdit />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors"
                                            onClick={() => handleDelete(subject.sub_id)}
                                        >
                                            <FaTrash />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">No Subjects Available</p>
                    )}
                </div>
            </div>

            {showModal && selectedSubject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl w-full max-w-[90vw] sm:max-w-md p-8 relative shadow-lg">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 bg-gray-200 rounded-full text-gray-600 p-2 hover:bg-gray-300 transition-colors"
                        >
                            X
                        </button>
                        <div className="flex flex-col space-y-6">
                            <h2 className="text-2xl font-bold text-green-700">Subject Details</h2>
                            <div className="text-gray-700 space-y-2">
                                <p><strong>Code:</strong> {selectedSubject.sub_code}</p>
                                <p><strong>Title:</strong> {selectedSubject.sub_descriptive_title}</p>
                                <p><strong>Units:</strong> {selectedSubject.sub_units}</p>
                                <p><strong>Type:</strong> {selectedSubject.sub_type}</p>
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

export default GetSubject;
