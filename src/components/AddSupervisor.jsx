import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';

const AddSupervisorMaster = () => {
    const [formData, setFormData] = useState({
        supM_employee_id: '',
        supM_first_name: '',
        supM_last_name: '',
        supM_middle_name: '',
        supM_department_id: '',
        supM_email: '',
        supM_contact_number: '',
    });

    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const url = secureLocalStorage.getItem('url') + 'CSDL.php';
                const formData = new FormData();
                formData.append('operation', 'getDepartment');
                const res = await axios.post(url, formData);
                setDepartments(res.data);
                toast.success('Departments loaded successfully');
            } catch (error) {
                console.log('Failed to load departments:', error);
                toast.error('Failed to load departments');
            }
        };

        fetchDepartments();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = secureLocalStorage.getItem('url') + 'CSDL.php';
            const jsonData = {
                supM_employee_id: formData.supM_employee_id,
                supM_first_name: formData.supM_first_name,
                supM_last_name: formData.supM_last_name,
                supM_middle_name: formData.supM_middle_name,
                supM_department_id: formData.supM_department_id,
                supM_email: formData.supM_email,
                supM_contact_number: formData.supM_contact_number,
            };

            const formDataToSend = new FormData();
            formDataToSend.append('json', JSON.stringify(jsonData));
            formDataToSend.append('operation', 'AddSupervisorMaster');

            const res = await axios.post(url, formDataToSend);
            if (res.data !== 0) {
                toast.success('Supervisor added successfully');
                setFormData({
                    supM_employee_id: '',
                    supM_first_name: '',
                    supM_last_name: '',
                    supM_middle_name: '',
                    supM_department_id: '',
                    supM_email: '',
                    supM_contact_number: '',
                });
            } else {
                toast.error('Failed to add supervisor');
            }
        } catch (error) {
            toast.error('An error occurred while adding supervisor');
        }
    };

    return (
        <div className="bg-white p-10 rounded-lg max-w-5xl mx-auto shadow-xl mt-12">


            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Employee ID */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-gray-700 font-semibold">Employee ID</label>
                        <input
                            type="text"
                            name="supM_employee_id"
                            value={formData.supM_employee_id}
                            onChange={handleInputChange}
                            placeholder="Enter Employee ID"
                            required
                            className="p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                        />
                    </div>

                    {/* First Name */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-gray-700 font-semibold">First Name</label>
                        <input
                            type="text"
                            name="supM_first_name"
                            value={formData.supM_first_name}
                            onChange={handleInputChange}
                            placeholder="Enter First Name"
                            required
                            className="p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-gray-700 font-semibold">Middle Name</label>
                        <input
                            type="text"
                            name="supM_middle_name"
                            value={formData.supM_middle_name}
                            onChange={handleInputChange}
                            placeholder="Enter Middle Name"
                            className="p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                        />
                    </div>
                    {/* Last Name */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-gray-700 font-semibold">Last Name</label>
                        <input
                            type="text"
                            name="supM_last_name"
                            value={formData.supM_last_name}
                            onChange={handleInputChange}
                            placeholder="Enter Last Name"
                            required
                            className="p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                        />
                    </div>

                    {/* Department */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-gray-700 font-semibold">Department</label>
                        <select
                            name="supM_department_id"
                            value={formData.supM_department_id}
                            onChange={handleInputChange}
                            required
                            className="p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept, index) => (
                                <option key={index} value={dept.dept_id}>
                                    {dept.dept_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-gray-700 font-semibold">Email</label>
                        <input
                            type="email"
                            name="supM_email"
                            value={formData.supM_email}
                            onChange={handleInputChange}
                            placeholder="Enter Email"
                            required
                            className="p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-gray-700 font-semibold">Contact Number</label>
                        <input
                            type="text"
                            name="supM_contact_number"
                            value={formData.supM_contact_number}
                            onChange={handleInputChange}
                            placeholder="Enter Contact Number"
                            required
                            className="p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full p-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 mt-6"
                >
                    Add Supervisor
                </button>
            </form>
        </div>
    );
};

export default AddSupervisorMaster;
