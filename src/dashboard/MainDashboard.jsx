import React, { useState, useEffect } from 'react';
import { Sun, Moon, Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Legend } from "recharts";
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import Navigator from './navigator';

const MainDashboard = () => {
    const [formData, setFormData] = useState({ course: "", yearLevel: "" });
    const [yearLevels, setYearLevels] = useState([]);
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [darkMode, setDarkMode] = useState(false);
    const [assign, setAssign] = useState([]);
    const navigateTo = useNavigate();
    const itemsPerPage = 4;
    const data = [
        { day: "Monday", time: "7:30 AM - 9:00 AM", absent: 5 },

        { day: "Tuesday", time: "7:30 AM - 9:00 AM", absent: 7 },

        { day: "Wednesday", time: "7:30 AM - 9:00 AM", absent: 3 },

        { day: "Thursday", time: "7:30 AM - 9:00 AM", absent: 4 },

        { day: "Friday", time: "7:30 AM - 9:00 AM", absent: 6 },
    ];



    const pieData = [
        { name: "Male", value: 400, color: "#4CAF50" },
        { name: "Female", value: 300, color: "#F44336" },
    ];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = assignments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(assignments.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = secureLocalStorage.getItem('url') + 'CSDL.php';
                const formData = new FormData();
                formData.append('operation', 'getAddScholarDropDown');
                const res = await axios.post(url, formData);
                setCourses(res.data.course);
                setYearLevels(res.data.yearLevel);
                toast.success('Form data loaded successfully');
            } catch (error) {
                toast.error('Failed to load form data');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const getAssignmentList = async () => {
            try {
                const url = secureLocalStorage.getItem('url') + 'assign.php';
                const formData = new FormData();
                formData.append('operation', 'getAssignmentList');
                const res = await axios.post(url, formData);
                setAssignments(res.data);
            } catch (error) {
                toast.error('Failed to fetch data');
            }
        };
        getAssignmentList();
    }, []);
    useEffect(() => {
        const getDashboard = async () => {
            try {
                const url = secureLocalStorage.getItem('url') + 'CSDL.php';
                const formData = new FormData();
                formData.append('operation', 'getDashboard');
                const res = await axios.post(url, formData);
                setAssign(res.data.getAssignedScholar);
            } catch (error) {
                toast.error('Failed to fetch data');
            }
        };
        getDashboard();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-950' : ''}`}>
            <Navigator />
            <main className="flex-1 p-8 relative bg-gray-100">
                <h2 className="text-3xl text-gray-900 font-bold flex items-center">
                    Time Sheets - October 2024 <Calendar className="ml-2 text-5xl" />
                </h2>
                <br />
                <div className="flex items-center p-6 bg-white rounded-md shadow-md">
                    <img src={`http://localhost/csdl/images/${secureLocalStorage.getItem("userImage")}`} alt="User Avatar" className="w-24 h-24 mr-4 rounded-xl" />
                    <div>
                        <h3 className="text-2xl font-sans text-green-900">{secureLocalStorage.getItem("adminName")}</h3>
                        <p className="text-lg text-green-900">{secureLocalStorage.getItem("email")}</p>
                        <p className="text-lg text-green-900">Administrator</p>
                    </div>
                    <div className="relative ml-auto">
                        <Search className="absolute left-2 top-3 text-gray-400" />
                        <input type="text" placeholder="Search scholar" className="p-2 pl-8 rounded-md bg-white shadow-md" />
                    </div>
                </div>
                <br />

                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 shadow-md rounded-md text-center">
                        {/* <h3 className="text-xl">{stats.total_unassigned}</h3> */}
                        <p className="text-gray-500">Total Unassigned</p>
                    </div>
                    <div className="bg-white p-4 shadow-md rounded-md text-center">
                        <h3 className="text-xl">{assign.length}</h3>
                        <p className="text-gray-500">Total Assigned</p>
                    </div>
                    <div className="bg-white p-4 shadow-md rounded-md text-center">
                        {/* <h3 className="text-xl">{stats.total_renewed}</h3> */}
                        <p className="text-gray-500">Total Renewed</p>
                    </div>
                </div>

                <div className="bg-white p-6 shadow-md rounded-md mt-6">
                    <h3 className="text-2xl font-bold mb-4">Attendance Overview</h3>
                    <div className="flex gap-8">
                        {/* Total Present & Absent Chart */}
                        <div className="w-2/3 bg-white p-6 shadow-lg rounded-md border">
                            <h3 className="text-lg font-bold mb-2">Total Present & Absent</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={data}>
                                    <XAxis dataKey="day" tick={{ fill: '#555' }} />
                                    <YAxis
                                        domain={[7.5, 12.0]}
                                        tickFormatter={(time) => {
                                            const hours = Math.floor(time);
                                            const minutes = (time % 1) * 60;
                                            return `${hours}:${minutes === 0 ? "00" : minutes} AM`;
                                        }}
                                        tick={{ fill: '#555' }}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="absent" stroke="#F44336" strokeWidth={3} dot={{ fill: '#F44336', r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Scholar Stats Pie Chart */}
                        <div className="w-1/3 bg-white p-6 shadow-lg rounded-md border flex flex-col items-center">
                            <h3 className="text-lg font-bold mb-4">Scholar Stats</h3>
                            <PieChart width={220} height={220}>
                                <Pie data={pieData} dataKey="value" outerRadius={90} />
                            </PieChart>
                        </div>
                    </div>
                </div>


            </main>
        </div >
    );
};

export default MainDashboard;
