import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftCircle, BellIcon, CircleUser, FolderClosed, LogOutIcon, PanelsRightBottom, QrCodeIcon, User,
    Trash2, Edit, Gauge, List, QrCode, GraduationCap, Book, Settings, Bell, Mail, LogOut, Calendar, Search,
} from 'lucide-react';
import { useState } from 'react';

function Qrcode() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [course, setCourse] = useState('');
    const [qrData, setQrData] = useState('');

    const handleGenerateQR = () => {
        if (firstName && lastName && studentId && course) {
            const data = `${firstName} ${lastName}, ${studentId}, ${course}`;
            setQrData(data);
        } else {
            alert("Please fill in all required fields.");
        }
    };

    const handleClearQR = () => {
        setQrData('');
        setFirstName('');
        setLastName('');
        setStudentId('');
        setCourse('');
    };

    const navigateTo = useNavigate();
    const handleLogOut = () => {
        navigateTo("/");

    }

    return (
        <div className="flex h-screen" style={{ backgroundColor: "rgb(8, 54, 100)" }}>
            <aside className="w-1/6 p-4 flex flex-col justify-between" style={{ backgroundColor: "#109315" }}>
                <div className="text-white mb-6">
                    <div className="flex items-center mb-6">
                        <img
                            src="images/csdl.jpg"
                            alt="CSDL Logo"
                            className="w-24 h-24 rounded-full mr-3"
                        />
                        <div>
                            <br />
                            <h1 className="text-xl font-bold">HK SMS</h1>
                            <p className="text-xl">HK Scholars Management System</p>
                        </div>
                    </div>

                    <nav>
                        <ul className="space-y-4">
                            <li>
                                <button
                                    className="flex items-center p-3 hover:bg-green-700 rounded-md w-full transition-all duration-200"
                                    onClick={() => navigateTo("/MainDashboard")}
                                >
                                    <PanelsRightBottom className="mr-2" />
                                    <span className="text-sm">Dashboard</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center p-3 hover:bg-green-700 rounded-md w-full transition-all duration-200"
                                    onClick={() => navigateTo("/ScholarList")}
                                >
                                    <List className="mr-2" />
                                    <span className="text-sm">Scholar List</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center p-3 hover:bg-green-700 rounded-md w-full transition-all duration-200"
                                    onClick={() => navigateTo("/qrcode")}
                                >
                                    <QrCodeIcon className="mr-2" />
                                    <span className="text-sm">QR Code</span>
                                </button>
                            </li>

                            <li>
                                <button
                                    className="flex items-center p-3 hover:bg-green-700 rounded-md w-full transition-all duration-200"
                                    onClick={() => navigateTo("/AssignStudent")}
                                >
                                    <User className="mr-2" />
                                    <span className="text-sm">Assigned Student</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center p-3 hover:bg-green-700 rounded-md w-full transition-all duration-200"
                                    onClick={() => navigateTo("/AdminDashboard")}
                                >
                                    <FolderClosed className="mr-2" />
                                    <span className="text-sm">Master Files</span>
                                </button>
                            </li>
                            <h2 className="text-lg font-semibold mt-6 mb-2">Account</h2>
                            <li>
                                <button
                                    className="flex items-center p-3 hover:bg-green-700 rounded-md w-full transition-all duration-200"
                                    onClick={() => navigateTo("/Account")}
                                >
                                    <CircleUser className="mr-2" />
                                    <span className="text-sm">Account</span>
                                </button>
                            </li>
                            {/* <li>
                                <button
                                    className="flex items-center p-3 hover:bg-green-700 rounded-md w-full transition-all duration-200"
                                >
                                    <BellIcon className="mr-2" />
                                    <span className="text-sm">Notification</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center p-3 hover:bg-green-700 rounded-md w-full transition-all duration-200"
                                >
                                    <Mail className="mr-2" />
                                    <span className="text-sm">Messages</span>
                                </button>
                            </li> */}
                            <li className="mt-4">
                                <button
                                    className="flex items-center p-3 bg-red-600 hover:bg-red-700 rounded-md w-full transition-all duration-200"
                                    onClick={handleLogOut}
                                >
                                    <LogOutIcon className="mr-2" />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <p className="text-white text-xs mt-4">Powered by PHINMA</p>
            </aside >
            <div className="flex-grow p-10 bg-blue-500">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="text-left mb-8">
                        <h1 className="text-5xl font-mono text-blue-500 mb-2">QR Code</h1>
                    </div>

                    <div className="bg-blue-600 p-6 rounded-lg shadow-lg">
                        <div className="text-left mb-8">
                            <h1 className="text-3xl font-normal text-white mb-2">Generate QR Code</h1>
                            <p className="text-white text-lg">Generate a QR code quickly: Enter the student info and get a shareable code for easy scanning.</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 text-sm text-white">First Name*</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded bg-white text-black"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm text-white">Last Name*</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded bg-white text-black"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm text-white">Student ID*</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded bg-white text-black"
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm text-white">Course*</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded bg-white text-black"
                                            value={course}
                                            onChange={(e) => setCourse(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={handleGenerateQR}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                        aria-label="Generate QR Code"
                                    >
                                        Generate QR Code
                                    </button>
                                    <button
                                        onClick={handleClearQR}
                                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                                        aria-label="Clear Fields"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {qrData && (
                                <div className="w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
                                    <QRCodeCanvas value={qrData} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Qrcode;
