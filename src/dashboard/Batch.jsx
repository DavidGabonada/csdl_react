import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Navigator from "./navigator";
import { useNavigate } from "react-router-dom";

const App = () => {
    const [data, setData] = useState([]);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [course, setCourse] = useState({});
    const [department, setDepartment] = useState({});
    const [scholarList, setScholarList] = useState({});
    const [percentStyped, setPercentStyped] = useState({});
    const [scholarListType, setScholarListType] = useState({});
    const [schoolYear, setSchoolYear] = useState({});
    const [studStatus, setStudStatus] = useState({});
    const [academicSession, setAcademicSession] = useState({});


    const itemsPerPage = 20;

    // Fetch course mapping on component mount
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "CSDL.php";
                const formdata = new FormData();
                formdata.append("operation", "getcourse");
                const response = await axios.post(url, formdata);
                console.log("response ni fetchCourse", response.data);
                if (response.data) {
                    setCourse(response.data);
                } else {
                    alert(`Failed to fetch course mapping: ${response.data.message}`);
                }
            } catch (error) {
                console.error("Error fetching course mapping:", error);
                alert("Error fetching course mapping. Check logs for details.");
            }
        };

        fetchCourse();
    }, []);
    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "CSDL.php";
                const formdata = new FormData();
                formdata.append("operation", "getDepartment");
                const response = await axios.post(url, formdata);
                console.log("response ni fetchDepartment", response.data);
                if (response.data) {
                    setDepartment(response.data);
                } else {
                    alert(`Failed to fetch department mapping: ${response.data.message}`);
                }
            } catch (error) {
                console.error("Error fetching department mapping:", error);
                alert("Error fetching department mapping. Check logs for details.");
            }
        };
        fetchDepartment();
    }, []);

    useEffect(() => {
        const fetchScholarList = async () => {
            try {
                const url = secureLocalStorage.getItem("url") + "CSDL.php";
                const formdata = new FormData();
                formdata.append("operation", "getScholarlist");
                const response = await axios.post(url, formdata);
                console.log("response ni fetchScholarList", response.data);
                if (response.data) {
                    // setScholarList(response.data.scholarList);
                    setPercentStyped(response.data.getPercentStype);
                    setScholarListType(response.data.getScholarTypeList);
                    setSchoolYear(response.data.getschoolyear);
                    setStudStatus(response.data.getStudStatus);
                    setAcademicSession(response.data.getAcademicSession);
                } else {
                    alert(`Failed to fetch scholar list: ${response.data.message}`);
                }
            } catch (error) {
                console.error("Error fetching scholar list:", error);
                alert("Error fetching scholar list. Check logs for details.");
            }
        }
        fetchScholarList();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    })

    // Handle file upload and processing
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

            console.log("json data", jsonData)

            const processedData = jsonData.map((row) => ({
                ...row,
                DATE: row["DATE"] ? new Date(row["DATE"]).toISOString().split("T")[0] : "",
                "MODIFIED DATE": row["MODIFIED DATE"]
                    ? new Date(row["MODIFIED DATE"]).toISOString().split("T")[0]
                    : "",
            }));

            console.log("processedDta", processedData);
            setData(processedData);
        } catch (error) {
            console.error("Error reading the Excel file:", error);
            alert("Error reading the Excel file. Please check the file format.");
        }
    };

    // Save data to backend
    const handleSaveToBackend = async () => {
        console.log("Raw data before mapping:", data);
        console.log("Course array:", course);
        console.log("Department array:", department);
        console.log("Scholarship array:", scholarListType);
        console.log("Percent array:", percentStyped);
        console.log("Academic session array:", academicSession);
        console.log("School year array:", schoolYear);
        console.log("Student status array:", studStatus);

        // Ensure that the data array is not empty
        if (!data || data.length === 0) {
            console.warn("Data is empty! No data will be sent.");
            return;
        }

        // Check the course, department, etc., arrays


        const jsonData = data.map((row, index) => {
            const courseId = course.find((c) => row.COURSE === c.course_name);
            const departmentId = department.find((d) => row.COLLEGE === d.dept_name);
            const scholarId = scholarListType.find((s) => row.SCHOLARSHIP === s.type_name);
            const percentId = percentStyped.find((a) => Number(row.PERCENT) === Number(a.percent_name));
            const academicSessionId = academicSession.find((b) => row.ACADEMIC_SESSION === b.session_name);
            const schoolyearId = schoolYear.find((d) => row.YEAR === d.year_name);
            const studStatusId = studStatus.find((e) => row.STUDENT_STATUS === e.status_name);

            // Helper function to check if a value is empty and convert to null
            const toNullable = (value) => (value === undefined || value === null || value === "" ? null : value);

            return {
                stud_id: toNullable(row["STUDENT_NO"]),
                stud_active_academic_session_id: academicSessionId ? academicSessionId.session_id : null,
                stud_name: toNullable(row["NAME"]),
                stud_scholarship_id: scholarId ? scholarId.type_id : null,
                stud_department_id: departmentId ? departmentId.dept_id : null,
                stud_course_id: courseId ? courseId.course_id : null,
                stud_active_year_id: schoolyearId ? schoolyearId.year_id : null,
                stud_active_status_id: studStatusId ? studStatusId.status_id : null,
                stud_active_percent_id: percentId ? percentId.percent_id : null,
                stud_active_amount: toNullable(row["AMOUNT"]),
                stud_active_applied_on_tuition: toNullable(row["APPLIED_TO_TUITION"]),
                stud_active_applied_on_misc: toNullable(row["APPLIED_TO_MISC"]),
                stud_active_mode_id: toNullable(row["MODE"]),
                stud_date: toNullable(row["DATE"]),
                stud_modified_by: toNullable(row["MODIFIED BY"]),
                stud_modified_date: toNullable(row["MODIFIED DATE"]),
                stud_image_file: "noImage.png",
            };
        }).filter(row => row !== null);


        console.log("jsonData after mapping:", JSON.stringify(jsonData));
        console.log("jsonData Length:", jsonData.length);

        if (jsonData.length === 0) {
            console.warn("jsonData is empty! No data will be sent.");
            return;
        }

        setLoading(true);
        try {
            const url = `${secureLocalStorage.getItem("url")}CSDL.php`;
            const formDataToSend = new FormData();
            console.log("JSON DATA", jsonData)
            formDataToSend.append("json", JSON.stringify(jsonData));
            formDataToSend.append("operation", "AddScholarBatch");

            console.log("API Request Add Scholar:", jsonData);

            const response = await axios.post(url, formDataToSend);
            console.log("RESPONSEfrom backend:", response.data);

            if (response.data === 1) {
                alert("Data saved successfully!");
                //setData([]);
                setFileName("");
            } else {
                alert(`Error from backend: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error saving data to backend:", error);
            alert("Error saving data to backend. Check logs for details.");
        } finally {
            setLoading(false);
        }
    };


    // Pagination
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIdx, startIdx + itemsPerPage);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <div className="grid grid-cols-7 gap-4 h-screen">
            <Navigator />
            {/* <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-6"> */}
            <div className="min-h-screen p-6 col-span-6">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Scholar Uploader</h1>
                    <label className="block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-300 focus:outline-none">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <div className="p-4 text-center">Choose Excel File</div>
                    </label>
                    {fileName && <p className="text-center text-gray-600 mt-4">Selected File: {fileName}</p>}

                    {currentData.length > 0 && (
                        <>
                            <div className="overflow-x-auto mt-6">
                                <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {Object.keys(currentData[0]).map((key) => (
                                                <th key={key} className="border px-4 py-2 text-gray-800 font-medium">
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((row, idx) => (
                                            <tr key={idx} className="even:bg-gray-50">
                                                {Object.values(row).map((value, i) => (
                                                    <td key={i} className="border px-6 py-4 text-gray-700">
                                                        {value}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none"
                                >
                                    Previous
                                </button>
                                <p className="text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </p>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none"
                                >
                                    Next
                                </button>
                            </div>
                            <button
                                onClick={handleSaveToBackend}
                                disabled={loading}
                                className={`mt-6 w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 ${loading ? "bg-gray-400 text-gray-800" : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400"
                                    }`}
                            >
                                {loading ? "Saving..." : "Save to Backend"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
