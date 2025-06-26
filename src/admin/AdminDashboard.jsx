import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCourse from '../modal/AddCourse';
import AddAdministrator from '../components/AddAdministrator';
import AddScholar from '../components/AddScholar';
import { ArrowLeftCircle, BellIcon, CircleUser, FolderClosed, LogOutIcon, LucideLayoutDashboard, PanelsRightBottom, QrCodeIcon, User } from 'lucide-react';
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
import AddBuilding from '../modal/AddBuilding';
import GetBuilding from '../modal/GetBuilding';
import AddRoom from '../modal/AddRoom';
import GetRoom from '../modal/GetRoom';
import AddModality from '../modal/AddModality';
import GetModality from '../modal/GetModality';
import AddSubject from '../modal/AddSubject';
import GetSubject from '../modal/GetSubject';
import Navigator from '../dashboard/navigator';

const MasterFiles = () => {
    const navigateTo = useNavigate();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState();
    const [datalist, setDatalist] = useState();
    const [isOpenListModal, setIsOpenListModal] = useState(false);


    const handleAddClick = (route) => {
        navigateTo(route);
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

    const openListModal = (path, title) => {
        // setModalContent(contentlist);
        // setModalTitle(title);
        // setIsOpenListModal(true);
        navigateTo(path)
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
    const handleLogOut = () => {
        navigateTo("/");

    }

    return (

        <div className='grid grid-cols-7 h-screen'>
            <Navigator />
            <div className="bg-white col-span-6 ">
                <div className="flex-grow p-10 bg-white">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="text-left mb-8">
                            <h1 className="text-5xl font-mono text-green-900 mb-2">Master Files</h1>
                        </div>
                        <div className="bg-green-900 p-6 rounded-lg shadow-lg">
                            <div className="text-left mb-8">
                                <h1 className="text-3xl font-normal text-white mb-2">Master Files</h1>
                                <p className="text-white text-lg">Maintain and reference master files for centralized and accurate data management.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { title: 'Admin', buttonText: 'Add Administrator', route: '/AddAdministrator', content: <AddAdministrator />, buttonText2: 'Addministrator List', contentlist: "/adminlist" },
                                    { title: 'Department', buttonText: 'Add Department', route: '/addDepartment', content: <AddDepartment />, buttonText2: 'Department List', contentlist: "/DepartmentList" },
                                    // { title: 'School Year', buttonText: 'Add School Year', route: '/addSchoolYear', content: <AddSchoolYear />, buttonText2: 'School Year List', contentlist: "/SchoolYear" },
                                    { title: 'Course', buttonText: 'Add Course', route: '/addCourse', content: <AddCourse />, buttonText2: 'Course List', contentlist: "/CourseList" },
                                    { title: 'Scholarship Type', buttonText: 'Add Scholarship Type', route: '/addScholarshipType', content: <AddScholarshipType />, buttonText2: 'Scholarship Type   List', contentlist: "/ScholarshipType" },

                                    { title: 'Scholar', buttonText: 'Add Scholar', route: <AddScholar />, content: <AddScholar />, buttonText: 'Scholar List', contentlist: "/ScholarList" },
                                    { title: 'Supervisor Master', buttonText: 'Add Supervisor Master', route: '/addSupervisor', content: <AddSupervisor />, buttonText2: 'Supervisor List', contentlist: "/Supervisorlist" },
                                    // { title: 'Scholarship Sub Type', buttonText: 'Add Scholarship Sub Type', route: '/addScholarshipSubType', content: <AddScholarshipSubType />, buttonText2: 'Scholarship Sub Type List', contentlist: <GetScholarshipSubType /> },
                                    { title: 'Building', buttonText: 'Add Building', route: '/addBuilding', content: <AddBuilding />, buttonText2: 'Building List', contentlist: "/BuildingList" },
                                    { title: 'Room', buttonText: 'Add Room', route: '/addRoom', content: <AddRoom />, buttonText2: 'Room List', contentlist: "/Roomlist" },
                                    // { title: 'Modality', buttonText: 'Add Modality', route: '/addModality', content: <AddModality />, buttonText2: 'Modality List', contentlist: <GetModality /> },
                                    { title: 'Subject', buttonText: 'Add Subject', route: '/addSubject', content: <AddSubject />, buttonText2: 'Subject List', contentlist: "/Subjectlist" },
                                ].map(({ title, buttonText, route, content, contentlist, buttonText2 }, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <h2 className="text-white text-lg font-semibold mb-2">{title}</h2>
                                        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                                            <h3 className="text-green-900 text-base font-semibold mb-2">{buttonText}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    className="w-24 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200 ease-in-out text-xs"
                                                    onClick={() => openModal(content, buttonText)}
                                                >
                                                    Add
                                                </button>
                                                <button className="w-24 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200 ease-in-out text-xs"
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
                            <div className='bg-white p-8 rounded-lg shadow-lg relative max-w-md w-full'>
                                <div className='grid grid-cols-3 text-xl font-bold md-4 text-black'>
                                    <div className=''>
                                        <ArrowLeftCircle className='cursor-pointer h-7 w-7 text-green-900' onClick={closeModal} />
                                    </div>
                                    <p className='text-center text-green-900'>{modalTitle}</p>
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
                            <div className='bg-green-800 p-8 rounded-lg shadow-lg relative max-w-md w-full'>
                                <div className='grid grid-cols-3 text-xl font-bold md-4 text-black'>
                                    <div className=''>
                                        <ArrowLeftCircle className='cursor-pointer h-7 w-7 text-green-900' onClick={closeListModal} />
                                    </div>
                                    <p className='text-center text-green-900'>{modalTitle}</p>
                                </div>
                                <div>
                                    {modalContent}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </div>
    );
};

export default MasterFiles;
