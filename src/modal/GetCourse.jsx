import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GetCourse = () => {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [editCourse, setEditCourse] = useState(null);
    const [newCourseName, setNewCourseName] = useState('');
    const [newDepartment, setNewDepartment] = useState('');
    const navigateTo = useNavigate();

    useEffect(() => {
        const getCourse = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "CSDL.php";
                const formData = new FormData();
                formData.append("operation", "getcourse");
                const res = await axios.post(url, formData);

                if (Array.isArray(res.data)) {
                    setCourses(res.data);
                    toast.success("Courses loaded successfully");
                } else {
                    toast.error("Unexpected data format");
                }
            } catch {
                toast.error("Failed to load Courses");
            }
        };

        const getDepartments = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "CSDL.php";
                const formData = new FormData();
                formData.append("operation", "getDepartment");
                const res = await axios.post(url, formData);

                if (Array.isArray(res.data)) {
                    setDepartments(res.data);
                    toast.success("Departments loaded successfully");
                } else {
                    toast.error("Unexpected data format for departments");
                }
            } catch {
                toast.error("Failed to load departments");
            }
        };

        getCourse();
        getDepartments();
    }, []);

    const deleteCourse = async (course_id) => {
        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const formData = new FormData();
            formData.append("operation", "deleteCourse");
            formData.append("course_id", course_id);
            const res = await axios.post(url, formData);
            if (res.data === 1) {
                setCourses(prev => prev.filter(c => c.course_id !== course_id));
                toast.success("Course deleted successfully");
            } else {
                toast.error("Failed to delete Course");
            }
        } catch {
            toast.error("Failed to delete course");
        }
    };

    const openEditModal = (course) => {
        setEditCourse(course);
        setNewCourseName(course.course_name);
        setNewDepartment(course.department || '');
    };

    const handleUpdate = async () => {
        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const formData = new FormData();
            formData.append("operation", "updateCourse");
            formData.append("course_id", editCourse.course_id);
            formData.append("course_name", newCourseName);
            formData.append("department", newDepartment);
            const res = await axios.post(url, formData);

            if (res.data === 1) {
                setCourses(prev =>
                    prev.map(c =>
                        c.course_id === editCourse.course_id
                            ? { ...c, course_name: newCourseName, department: newDepartment }
                            : c
                    )
                );
                toast.success("Course updated successfully");
                setEditCourse(null);
            } else {
                toast.error("Failed to update Course");
            }
        } catch {
            toast.error("Failed to update course");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full py-10 px-6">
            <div className="max-w-[1440px] mx-auto space-y-10">
                <ArrowLeftCircle onClick={() => navigateTo(-1)} className="cursor-pointer text-blue-700 hover:text-blue-900 mb-4" size={32} />

                <h1 className="text-4xl font-bold text-blue-800 text-center mb-6">
                    Course Management
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <div key={course.course_id} className="bg-white shadow-md rounded-2xl p-6 w-full h-full transition-transform hover:scale-[1.02]">
                                <div className="flex flex-col space-y-4 h-full justify-between">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-blue-700">{course.course_name}</h2>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Course ID: {course.course_id}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Department: {course.department || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="flex space-x-3 justify-end">
                                        <button
                                            className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                                            onClick={() => openEditModal(course)}
                                        >
                                            <FaEdit />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors"
                                            onClick={() => deleteCourse(course.course_id)}
                                        >
                                            <FaTrash />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">No Courses Available</p>
                    )}
                </div>
            </div>

            {editCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl w-full max-w-[90vw] sm:max-w-md p-8 relative shadow-lg">
                        <button
                            onClick={() => setEditCourse(null)}
                            className="absolute top-2 right-2 bg-gray-200 rounded-full text-gray-600 p-2 hover:bg-gray-300 transition-colors"
                        >
                            X
                        </button>
                        <div className="flex flex-col space-y-6">
                            <h2 className="text-2xl font-bold text-blue-700">Edit Course</h2>
                            <div className="text-gray-700 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Course Name</label>
                                    <input
                                        type="text"
                                        value={newCourseName}
                                        onChange={(e) => setNewCourseName(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Department</label>
                                    <select
                                        value={newDepartment}
                                        onChange={(e) => setNewDepartment(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept.dept_id} value={dept.dept_name}>{dept.dept_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => setEditCourse(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    onClick={handleUpdate}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetCourse;
