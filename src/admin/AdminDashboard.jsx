import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCourse from '../modal/AddCourse';
import AddAdministrator from '../components/AddAdmin';
import AddScholar from '../components/AddScholar';
import { ArrowLeftCircle, BellIcon, CircleUser, FolderClosed, LogOutIcon, PanelsRightBottom, QrCodeIcon, User } from 'lucide-react';
import AddDepartment from '../modal/AddDepartment';
import AddSchoolYear from '../modal/AddSchoolYear';
import AddScholarshipType from '../modal/AddScholarshipType';
import AddOfficeMaster from '../components/AddOfficeMaster';
import AddSupervisor from '../components/AddSupervisor';
import GetOfficeMaster from '../modal/GetOfficeMaster';
import GetCourse from '../modal/GetCourse';
import GetDepartment from '../modal/GetDepartment';
import GetScholar from '../modal/GetScholar';
import GetSupervisor from '../modal/GetSupervisor';
import GetAdminlist from '../modal/GetAdminList';
import GetSchoolYear from '../modal/GetSchoolYear';
import GetScholarshipSubType from '../modal/GetScholarshipSubType';
import GetScholarType from '../modal/GetScholarType';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import { toast } from 'sonner';
import AddScholarshipSubType from '../modal/AddScholarshipSubType';
import {
    Trash2, Edit, Gauge, List, QrCode, GraduationCap, Book,
    Settings, Bell, Mail, LogOut, Calendar, Search,
} from 'lucide-react';
import { BsQrCode } from 'react-icons/bs';

const MasterFiles = () => {
    const navigateTo = useNavigate();
    const navigate = useNavigate();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState();
    const [datalist, setDatalist] = useState();
    const [isOpenListModal, setIsOpenListModal] = useState(false);

    const handleAddClick = (route) => {
        navigate(route);
    };

    const openModal = (content, title) => {
        setModalContent(content);
        setModalTitle(title);
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setModalContent(null);
        setModalTitle('');
    };

    const openListModal = (contentlist, title) => {
        setModalContent(contentlist);
        setModalTitle(title);
        setIsOpenListModal(true);
    };

    const closeListModal = () => {
        setIsOpenListModal(false);
        setModalContent(null);
        setModalTitle('');
    };

    const getAllList = async () => {
        try {
            const url = secureLocalStorage.getItem("url") + "CSDL.php";
            const formData = new FormData();
            formData.append("operation", "getAllList");
            const res = await axios.post(url, formData);
            console.log("res ni get all list", res.data);
            setDatalist(res.data);

        } catch (error) {
            toast.error("Network error");
            console.log(error);
        }
    }

    useEffect(() => {
        getAllList();
    }, []);

    return (


        <div className="flex min-h-screen bg-blue-800">
            <aside className="w-1/4 bg-green-600 p-6 flex flex-col justify-between">
                <div className="text-white mb-8">

                    <div className="flex items-center mb-8">
                        <img
                            src="images/csdl.jpg"
                            alt="Logo"
                            className="w-20 h-20 rounded-full mr-4"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">HK SMS</h1>
                            <p className="text-sm">HK Scholars Management System</p>
                        </div>
                    </div>


                    <nav>
                        <ul className="text-white space-y-4">
                            <li>
                                <button
                                    className="flex items-center p-2 hover:bg-blue-700 rounded-md w-full transition-colors duration-200"
                                    onClick={() => navigateTo("/MainDashboard")}
                                >
                                    <PanelsRightBottom className="mr-2" />
                                    <span>Dashboard</span>
                                </button>
                            </li>

                            <li>
                                <button
                                    className="flex items-center p-2 hover:bg-blue-700 rounded-md w-full transition-colors duration-200"
                                    onClick={() => navigateTo("/ScholarList")}
                                >
                                    <List className="mr-2" />
                                    <span>Scholar List</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center p-2 hover:bg-blue-700 rounded-md w-full transition-colors duration-200"
                                    onClick={() => navigateTo("/qrcode")}
                                >
                                    <BsQrCode className="mr-2" />
                                    <span>QR Code</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center p-2 hover:bg-blue-700 rounded-md w-full transition-colors duration-200"
                                >
                                    <User className="mr-2" />
                                    <span>Assigned Student</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center p-2 hover:bg-blue-700 rounded-md w-full transition-colors duration-200"
                                    onClick={() => navigateTo("/AdminDashboard")}
                                >
                                    <FolderClosed className="mr-2" />
                                    <span>Master Files</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center p-2 hover:bg-blue-700 rounded-md w-full transition-colors duration-200"
                                >
                                    <CircleUser className="mr-2" />
                                    <span>Account</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center p-2 hover:bg-blue-700 rounded-md w-full transition-colors duration-200"
                                >
                                    <BellIcon className="mr-2" />
                                    <span>Notification</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center p-2 hover:bg-blue-700 rounded-md w-full transition-colors duration-200"
                                >
                                    <Mail className="mr-2" />
                                    <span>Messages</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center p-2 hover:bg-red-600 rounded-md w-full transition-colors duration-200"
                                >
                                    <LogOutIcon className="mr-2" />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>


                <p className="text-white text-xs">Powered by PHINMA</p>
            </aside>


            <div className="flex-grow p-10 bg-blue-500">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="text-left mb-8">
                        <h1 className="text-5xl font-mono text-blue-500 mb-2">Master Files</h1>
                    </div>

                    <div className="bg-blue-600 p-6 rounded-lg shadow-lg">
                        <div className="text-left mb-8">
                            <h1 className="text-3xl font-normal text-white mb-2">Master Files</h1>
                            <p className="text-white text-lg">Maintain and reference master files for centralized and accurate data management.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { title: 'Admin', buttonText: 'Add Administrator', route: '/addAdministrator', content: <AddAdministrator />, buttonText2: 'Addministrator List', contentlist: <GetAdminlist /> },
                                { title: 'Department', buttonText: 'Add Department', route: '/addDepartment', content: <AddDepartment />, buttonText2: 'Department List', contentlist: <GetDepartment /> },
                                { title: 'School Year', buttonText: 'Add School Year', route: '/addSchoolYear', content: <AddSchoolYear />, buttonText2: 'School Year List', contentlist: <GetSchoolYear /> },
                                { title: 'Course', buttonText: 'Add Course', route: '/addCourse', content: <AddCourse />, buttonText2: 'Course List', contentlist: <GetCourse /> },
                                { title: 'Scholarship Type', buttonText: 'Add Scholarship Type', route: '/addScholarshipType', content: <AddScholarshipType />, buttonText2: 'Scholarship Type List', contentlist: <GetScholarType /> },
                                { title: 'Office Master', buttonText: 'Add Office Master', route: '/addOfficeMaster', content: <AddOfficeMaster />, buttonText2: 'Office Master List', contentlist: <GetOfficeMaster /> },
                                { title: 'Scholar', buttonText: 'Add Scholar', route: '/addScholar', content: <AddScholar />, buttonText: 'Scholar List', contentlist: <GetScholar /> },
                                { title: 'Supervisor', buttonText: 'Add Supervisor', route: '/addSupervisor', content: <AddSupervisor />, buttonText2: 'Supervisor List', contentlist: <GetSupervisor /> },
                                { title: 'Scholarship Sub Type', buttonText: 'Add Scholarship Sub Type', route: '/addScholarshipSubType', content: <AddScholarshipSubType />, buttonText2: 'Scholarship Sub Type List', contentlist: <GetScholarshipSubType /> },
                            ].map(({ title, buttonText, route, content, contentlist, buttonText2 }, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <h2 className="text-white text-lg font-semibold mb-2">{title}</h2>
                                    <div className="bg-blue-700 p-4 rounded-lg shadow-lg flex flex-col items-center">
                                        <h3 className="text-white text-base font-semibold mb-2">{buttonText}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                className="w-16 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200 ease-in-out text-xs"
                                                onClick={() => openModal(content, buttonText)}
                                            >
                                                Add
                                            </button>
                                            <button className="w-16 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200 ease-in-out text-xs"
                                                onClick={() => openListModal(contentlist, buttonText2)}>
                                                Get List
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            {
                isOpenModal && (
                    <div className='fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center w-full'>
                        <div className='bg-blue-800 p-8 rounded-lg shadow-lg relative max-w-md w-full'>
                            <div className='grid grid-cols-3 text-xl font-bold md-4 text-black'>
                                <div className=''>
                                    <ArrowLeftCircle className='cursor-pointer h-7 w-7 text-white' onClick={closeModal} />
                                </div>
                                <p className='text-center text-white'>{modalTitle}</p>
                            </div>
                            <div>
                                {modalContent}
                            </div>
                        </div>
                    </div>
                )
            }


            {
                isOpenListModal && (
                    <div className='fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center w-full'>
                        <div className='bg-blue-800 p-8 rounded-lg shadow-lg relative max-w-md w-full'>
                            <div className='grid grid-cols-3 text-xl font-bold md-4 text-black'>
                                <div className=''>
                                    <ArrowLeftCircle className='cursor-pointer h-7 w-7 text-white' onClick={closeListModal} />
                                </div>
                                <p className='text-center text-white'>{modalTitle}</p>
                            </div>
                            <div>
                                {modalContent}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default MasterFiles;
