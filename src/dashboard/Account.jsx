import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import { toast } from 'sonner';
import Navigator from './navigator';

const Account = () => {
    const [file, setFile] = useState(null);
    const [userData, setUserData] = useState({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        confirmEmail: ''
    });
    const navigateTo = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "user.php";
                const response = await axios.post(url, { operation: "getUserData" });

                if (response.data) {
                    setUserData({
                        fullName: response.data.fullName || '',
                        password: '',
                        confirmPassword: '',
                        email: response.data.email || '',
                        confirmEmail: response.data.email || ''
                    });

                    setImageUrl(`http://localhost/csdl/images/${response.data.image || 'default.png'}`);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to load user data');
            }
        };

        fetchUserData();
    }, []);

    const handleLogOut = () => {
        secureLocalStorage.clear();
        navigateTo("/");
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(selectedFile);
                //   setImagePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
        if (!selectedFile) return;
        setFile(selectedFile);
    };

    const handlePhotoUpload = () => {
        document.getElementById('photo-upload').click();
    };

    const handleAdd = async () => {
        if (!file) {
            toast.error("Please select an image first.");
            return;
        }

        const jsonData = {
            userId: secureLocalStorage.getItem("userId")
        }

        console.log("jsonData", jsonData)

        const formData = new FormData();
        formData.append("file", file);  // Append file directly
        formData.append("operation", "updateImage");
        formData.append("json", JSON.stringify(jsonData));

        try {
            const url = secureLocalStorage.getItem("url") + "user.php";
            const response = await axios.post(url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("response", response.data);

            if (response.data && ![0, 2, 3, 4].includes(response.data)) {
                secureLocalStorage.setItem("userImage", response.data)
                setImageUrl(`http://localhost/csdl/images/${response.data}`);
                toast.success("Profile picture updated successfully!");
            } else {
                const errors = {
                    2: "You cannot upload files of this type!",
                    3: "There was an error uploading your file!",
                    4: "Your file is too big (25MB maximum)!",
                };
                toast.error(errors[response.data] || "Failed to update profile picture.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("An error occurred while uploading the image.");
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("User data updated successfully");
    };

    return (
        <div className={`flex h-screen w-screen ${darkMode ? 'bg-green-900' : 'bg-gray-100'}`}>
            <Navigator />
            <div className="flex-1 flex justify-center items-center p-10">
                <div className="bg-green-900 text-white w-full max-w-4xl p-10 rounded-xl shadow-xl">
                    <h2 className="text-3xl font-semibold mb-4">General Info</h2>
                    <p className="text-white mb-6 text-lg">Setup your profile account and edit profile details.</p>

                    <div className="flex items-center bg-white p-4 rounded-lg mb-6 w-full">
                        <div className="w-20 h-20 bg-gray-500 rounded-full overflow-hidden">
                            <img
                                src={file ? URL.createObjectURL(file) : imageUrl}
                                alt="Profile"
                                className="object-cover w-full h-full"
                                onError={(e) => e.target.src = 'http://localhost/csdl/images/default.png'}
                            />
                        </div>
                        <input type="file" id="photo-upload" className="hidden" onChange={handleFileChange} />
                        <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm" onClick={handlePhotoUpload}>
                            Choose Photo
                        </button>
                        <button className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm" onClick={handleAdd}>
                            Upload
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg w-full">
                        <h3 className="text-xl font-semibold mb-4">Account Info</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-green-900 mb-2 text-lg">Full Name*</label>
                                <input type="text" name="fullName" value={userData.fullName} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-green-700 text-white border border-white text-lg" />
                            </div>

                            <div>
                                <label className="block text-green-900 mb-2 text-lg">Email*</label>
                                <input type="email" name="email" value={userData.email} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-green-700 text-white border border-gray-600 text-lg" />
                            </div>
                            <div>
                                <label className="block text-green-900 mb-2 text-lg">Confirm Email*</label>
                                <input type="email" name="confirmEmail" value={userData.confirmEmail} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-green-700 text-white border border-gray-600 text-lg" />
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg">
                                    Update Info
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Account;
