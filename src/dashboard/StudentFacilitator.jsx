import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Sun, Moon, CircleUser, FolderClosed, LogOutIcon, PanelsRightBottom, QrCodeIcon, User, List, Mail, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from "react-bootstrap/Button";
import axios from "axios";

import secureLocalStorage from "react-secure-storage";
import Select from "react-select"; // Importing react-select
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import Navigator from "./navigator";

function StudentFacilitator() {
    const [formData, setFormData] = useState({
        mode: 'Student Facilitator',
        department: '',
        subject: '',
        session: '',
        hours: '90 hours',
        supervisor: '',
        scholar: '',
    });
    const [selectedRow, setSelectedRow] = useState(null);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [scholarSchedules, setScholarSchedules] = useState([]);
    const [activeScholars, setActiveScholars] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [scholarId, setScholarId] = useState("");
    const [session, setSession] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(null); // Track selected subject
    const [saveStatus, setSaveStatus] = useState(""); // To show save status message
    const [selectedStudent, setSelectedStudent] = useState(null); // Track selected student
    const [selectedSessions, setSelectedSessions] = useState(null); // Track selected session
    const navigateTo = useNavigate();

    const normalizeTime = (time) => {
        if (!time) {
            return "";
        }
        if (/^[A-Za-z]+$/.test(time)) {
            return time.toUpperCase();
        }
        time = time.replace(/\s+/g, "").toUpperCase();
        const match = time.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
        if (!match) {
            console.warn(`Invalid time format: ${time}`);
            return "";
        }
        const [, hour, minute, period] = match;
        let hour24 = parseInt(hour, 10);
        if (period === 'AM' && hour24 === 12) hour24 = 0;
        if (period === 'PM' && hour24 !== 12) hour24 += 12;
        return hour24.toString().padStart(2, '0') + ':' + minute;
    };

    const compareTimeRange = (subjectTime, scheduleFromTime, scheduleToTime) => {
        const [subjectStart, subjectEnd] = subjectTime.split("-");
        return (
            normalizeTime(subjectStart) === normalizeTime(scheduleFromTime) &&
            normalizeTime(subjectEnd) === normalizeTime(scheduleToTime)
        );
    };
    const handleLogOut = () => {
        navigateTo("/");

    };

    const getScholarAllAvailableSchedule = async (id) => {
        if (!id) {
            console.error("Scholar ID is missing.");
            return; // Avoid making a request if no scholar ID is provided
        }

        try {
            const url = secureLocalStorage.getItem("url") + 'CSDL.php';
            const formData = new FormData();

            const jsonData = {
                ocr_studActive_id: id,
            };

            formData.append("operation", "getScholarAllAvailableSchedule");
            formData.append("json", JSON.stringify(jsonData));

            console.log(`Fetching schedules for Scholar ID: ${id}`); // Log scholar ID

            const res = await axios.post(url, formData);

            console.log("Fetched schedules:", res.data); // Log response data

            if (res.data !== "0" && Array.isArray(res.data)) {
                setScholarSchedules(res.data);
            } else {
                setScholarSchedules([]);
            }
        } catch (error) {
            console.error("Error fetching scholar schedules:", error);
            setScholarSchedules([]);
        }
    };

    const getScholars = async () => {
        try {
            const url = secureLocalStorage.getItem("url") + 'CSDL.php';
            const formData = new FormData();
            formData.append("operation", "getScholar");

            const res = await axios.post(url, formData);
            console.log("Fetched scholars:", res.data); // Log response data

            if (res.data !== "0") {
                setActiveScholars(res.data);
            }
        } catch (error) {
            console.log("Error fetching scholars:", error);
        }
    };

    const getAllSubjects = async () => {
        try {
            const url = secureLocalStorage.getItem("url") + 'CSDL.php';
            const formData = new FormData();
            formData.append("operation", "getAllSubjects");

            const res = await axios.post(url, formData);

            if (res.data !== "0") {
                setSubjects(res.data);
                setFilteredSubjects(res.data);
            }
        } catch (error) {
            console.log("Error fetching subjects:", error);
        }
    };

    useEffect(() => {
        console.log("Selected Scholar ID:", scholarId); // Log scholar ID to make sure it's set
        if (scholarId) {
            getScholarAllAvailableSchedule(scholarId); // Fetch schedules based on selected scholar
        } else {
            console.error("Scholar ID is missing.");
        }
        getAllSubjects();
        getScholars();
    }, [scholarId]);

    const handleRowClick = (index) => {
        const selectedSchedule = scholarSchedules[index];
        setSelectedRow(index);
        setSelectedSchedule(selectedSchedule);

        const selectedDay = normalizeTime(selectedSchedule.ocr_day);

        console.log("selected day", selectedDay)

        const filteredData = subjects.filter((item) => {
            let isValid = false;
            if (selectedDay === item.f2f_day && compareTimeRange(item.sub_time, selectedSchedule.ocr_schedule_time_from, selectedSchedule.ocr_schedule_time_to)) {
                isValid = true;
            } else if (selectedDay === item.rc_day && compareTimeRange(item.sub_time, selectedSchedule.ocr_schedule_time_from, selectedSchedule.ocr_schedule_time_to)) {
                isValid = true;
            }
            return isValid;
            // return selectedDay === item.f2f_day || item.rc_day
        });
        console.log("filtered", filteredData);

        // const filtered = subjects.filter((item) => {
        //     console.log("ITEMS", item)
        //     const subjectDay = normalizeTime(item.f2f_day);
        //     const subjectTime = item.sub_time;

        //     const isSameDay = subjectDay === selectedDay;
        //     const isSameTimeRange = compareTimeRange(subjectTime, selectedSchedule.ocr_schedule_time_from, selectedSchedule.ocr_schedule_time_to);

        //     return isSameDay && isSameTimeRange;
        // });

        setFilteredSubjects(filteredData);
    };

    const handleSubjectSelect = (selectedOption) => {
        setSelectedSubject(selectedOption); // Update selected subject
        console.log("Selected Subject:", selectedOption);
        setSelectedSessions(selectedSessions);
        console.log("Selected Session:",); // Log selected subject
    };

    const handleClearClick = () => {
        setSelectedRow(null);
        setSelectedSchedule(null);
        setScholarSchedules([]);
        setFilteredSubjects(subjects);
        setScholarId("");
        setSelectedSubject(null); // Reset selected subject
        setSession(''); // Clear session on reset
    };
    const handleSaveClick = async () => {
        if (!scholarId || !selectedSubject) {
            toast.error("Please select both Scholar and Subject before saving.");
            return;
        }

        // Prepare data to save
        const dataToSave = {
            assignment_name: formData.mode,
            dutyH_name: formData.hours,
            assign_stud_id: scholarId,
            off_subject_id: selectedSubject.value,
            session_name: selectedStudent?.session_name || '',
        };

        console.log("Data to save:", dataToSave);

        try {
            const url = secureLocalStorage.getItem("url") + 'CSDL.php';
            const formData = new FormData();
            formData.append("operation", "AddStudentFacilitator");
            formData.append("json", JSON.stringify(dataToSave));

            const res = await axios.post(url, formData);

            if (res.data !== "0") {
                toast.success("Data saved successfully!");

                // Automatically clear the form
                setScholarId("");
                setSelectedSubject(null);
                setSelectedSessions(null);
                setSelectedStudent(null);
                setSession("");
                setScholarSchedules([]);
                setFilteredSubjects(subjects);
                setSelectedRow(null);
                setSelectedSchedule(null);
            } else {
                toast.error(`Failed to save data. Server response: ${res.data}`);
                console.error("Server Response:", res.data);
            }
        } catch (error) {
            console.error("Error during save operation:", error);
            toast.error("Error saving data. Please try again.");
        }
    };



    // Convert the scholars data to the format required by react-select
    const scholarOptions = activeScholars.map(scholar => ({
        value: scholar.stud_active_id,
        label: `${scholar.stud_active_id} | ${scholar.stud_name} | ${scholar.course_name} | ${scholar.session_name}`,
    }));

    // Convert the subjects data to the format required by react-select
    const subjectHeaders = (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(9, auto)",
            gap: "10px",
            alignItems: "center",
            padding: "5px",
            borderBottom: "2px solid #000",
            fontWeight: "bold",
            backgroundColor: "#f0f0f0"
        }}>
            <div>Code</div>
            <div>Title</div>
            <div>Section</div>
            <div>Room</div>
            <div>F2F Day</div>
            <div>RC Day</div>
            <div>Learning</div>
            <div>Used</div>
            <div>Time</div>
        </div>
    );

    const subjectOptions = filteredSubjects.map(subject => ({
        value: subject.sub_id,
        label: (
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(9, auto)",
                gap: "10px",
                alignItems: "center",
                padding: "5px",
                borderBottom: "1px solid #ccc"
            }}>
                <div>{subject.sub_code}</div>
                <div>{subject.sub_descriptive_title}</div>
                <div>{subject.sub_section}</div>
                <div>{subject.sub_room}</div>
                <div>{subject.f2f_day}</div>
                <div>{subject.rc_day}</div>
                <div>{subject.learning_name}</div>
                <div>{subject.sub_used}</div>
                <div>{subject.sub_time}</div>
            </div>
        ),
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-1 h-screen bg-white rounded-lg shadow-lg border-3">
            <Navigator className="hidden md:block" />
            <div className="col-span-6 p-3">
                <h1 className="text-2xl font-bold mb-6 text-green-700 text-center md:text-left">
                    Assign Student Facilitator
                </h1>

                {/* Mode and Assigned Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-black font-medium mb-2">Mode</label>
                        <p className="w-full bg-gray-100 py-3 pl-4 rounded-lg">{formData.mode}</p>
                    </div>

                    <div>
                        <label className="block text-black font-medium mb-2 ">Assigned Hours</label>
                        <p className="w-full bg-gray-100 py-3 pl-4 rounded-lg">
                            {formData.hours}
                        </p>

                    </div>
                </div>

                {/* Select Scholar and Student Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label className="block text-black font-medium mb-2">Select Scholar</label>
                        <Select
                            options={scholarOptions}
                            value={scholarOptions.find(option => option.value === scholarId)}
                            onChange={(selectedOption) => {
                                console.log("selectedOption ", selectedOption);
                                const selectedScholarId = selectedOption ? selectedOption.value : "";
                                setScholarId(selectedScholarId);
                                const selectedScholar = activeScholars.find(scholar => scholar.stud_active_id === selectedScholarId);
                                setSelectedStudent(selectedScholar);
                            }}
                            placeholder="Select a Scholar"
                            className="text-black w-full"
                        />
                    </div>

                    {selectedStudent && (
                        <div>
                            <label className="block text-white font-medium mb-2 bg-green-700 p-2 rounded-lg">Student Info</label>
                            <p className="w-full bg-green-700 text-white py-3 pl-4 rounded-lg">
                                {selectedStudent.stud_name} | {selectedStudent.session_name}
                            </p>
                        </div>
                    )}
                </div>

                {/* Schedule and Select Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Schedule Card */}
                    <div>
                        <label className="block text-black font-medium mb-2">Schedule</label>
                        <div className="card shadow-lg">
                            <div className="card-body bg-green-700 text-white rounded-lg h-64 md:h-[54vh] overflow-auto">
                                {Array.isArray(scholarSchedules) && scholarSchedules.length > 0 ? (
                                    scholarSchedules.map((schedule, index) => (
                                        <div key={index} className="p-2 border-b border-white cursor-pointer hover:bg-green-600" onClick={() => handleRowClick(index)}>
                                            <p><strong>Day:</strong> {schedule.ocr_day}</p>
                                            <p><strong>Time:</strong> {schedule.ocr_schedule_time_from} - {schedule.ocr_schedule_time_to}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center">No schedules found for this Scholar ID.</p>
                                )}
                            </div>
                        </div>
                        {selectedSchedule && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-green-700">Selected Schedule:</h3>
                                <p className="text-gray-700">
                                    {selectedSchedule.ocr_day} | {selectedSchedule.ocr_schedule_time_from} - {selectedSchedule.ocr_schedule_time_to}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Subject Selection - Matching Height */}
                    <div>
                        <label className="block text-black font-medium mb-2">Select Subject</label>
                        <div className="rounded-lg bg-green-700 shadow-lg h-64 md:h-[54vh] overflow-auto">
                            {subjectOptions.length > 0 ? (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-green-800 text-white">
                                            <th className="p-2 text-center">Code</th>
                                            <th className="p-2 text-center">Title</th>
                                            <th className="p-2 text-center hidden md:table-cell">Section</th>
                                            <th className="p-2 text-center hidden md:table-cell">Room</th>
                                            <th className="p-2 text-center hidden md:table-cell">F2F Day</th>
                                            <th className="p-2 text-center hidden md:table-cell">RC Day</th>
                                            <th className="p-2 text-center hidden md:table-cell">Learning</th>
                                            <th className="p-2 text-center hidden md:table-cell">Used</th>
                                            <th className="p-2 text-center">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subjectOptions.map((subject, index) => (
                                            <tr
                                                key={index}
                                                className={`cursor-pointer hover:bg-green-600 hover:text-white ${selectedSubject?.value === subject.value ? "bg-green-800 text-white" : "text-white"
                                                    }`}
                                                onClick={() => handleSubjectSelect(subject)}
                                            >
                                                {subject.label.props.children.map((child, idx) => (
                                                    <td key={idx} className="p-2 text-center">
                                                        {child}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-white">No subjects available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row justify-between mt-6 gap-3">
                    <button
                        className="bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition w-full md:w-auto"
                        onClick={handleClearClick}
                    >
                        Clear
                    </button>
                    <button
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition w-full md:w-auto"
                        onClick={handleSaveClick}
                    >
                        Save
                    </button>
                </div>

                {saveStatus && (
                    <div className="mt-4">
                        <p className="text-green-700 text-center md:text-left">{saveStatus}</p>
                    </div>
                )}
            </div>
        </div>


    );
}

export default StudentFacilitator;
