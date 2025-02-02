import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

function AddScholarshipType() {
    const [formData, setFormData] = useState({
        scholarship_type: "",
    });

    const [scholarshipTypes, setScholarshipTypes] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (loading) return;

        // Safeguard against empty input
        const scholarshipType = formData.scholarship_type || "";
        if (scholarshipType.trim() === "") {
            toast.error("Scholarship type cannot be empty");
            return;
        }

        // Check for duplicate
        const scholarshipTypeExists = scholarshipTypes.some(
            (scholarshipTypeItem) => scholarshipTypeItem.type_name?.toLowerCase() === scholarshipType.toLowerCase()
        );
        if (scholarshipTypeExists) {
            toast.error("Scholarship type already exists");
            return;
        }

        setLoading(true);
        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";

            const jsonData = {
                type_name: scholarshipType,
            };

            const formDataToSend = new FormData();
            formDataToSend.append("json", JSON.stringify(jsonData));
            formDataToSend.append("operation", "addScholarshipType");

            const res = await axios.post(url, formDataToSend);

            if (res.data !== 0) {
                toast.success("Scholarship Type added successfully");
                setFormData({ scholarship_type: "" }); // Reset form
            } else {
                toast.error("Failed to add Scholarship Type");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while adding the Scholarship Type");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center bg-blue-100 p-6 rounded-lg max-w-md mx-auto shadow-lg">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Add Scholarship Type</h2>
            <input
                type="text"
                name="scholarship_type"
                placeholder="Enter Scholarship Type"
                value={formData.scholarship_type}
                onChange={handleInputChange}
                className="p-3 text-lg w-full mb-4 border border-blue-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
                onClick={handleAdd}
                className={`px-5 py-3 text-lg text-white rounded-md transition-colors duration-300 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                disabled={loading}
            >
                {loading ? 'Adding...' : 'Add'}
            </button>
        </div>
    );
}

export default AddScholarshipType;
