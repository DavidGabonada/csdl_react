import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminDashboard from './admin/AdminDashboard';
import { Toaster } from 'sonner';
import secureLocalStorage from 'react-secure-storage';
import AddOfficeMaster from './components/AddOfficeMaster';
import AddSupervisor from './components/AddSupervisor';
import AddScholar from './components/AddScholar';
import ScholarList from './dashboard/ScholarList';
import Login from './login/login';
import MainDashboard from './dashboard/MainDashboard';
import Qrcode from './Qrcode/qrcode';
import AddBatchScholar from './modal/AddBatchScholar';
import AssignStudent from './dashboard/AssignStudent';
import Account from './dashboard/Account';
import GetAdminList from './modal/GetAdminList';
import GetDepartment from './modal/GetDepartment';
import AddAdministrator from './components/AddAdministrator';
import GetOfficeMaster from './modal/GetOfficeMaster';
import GetBuilding from './modal/GetBuilding';
import Batch from './dashboard/Batch';
import BatchSubject from './dashboard/BatchSubject';
import StudentFacilitator from './dashboard/StudentFacilitator';
import AddBuilding from './modal/AddBuilding';
import AddModality from './modal/AddModality';
import GetSchoolYear from './modal/GetSchoolYear';
import GetCourse from './modal/GetCourse';
import GetScholarshipType from './modal/GetScholarType';
import GetScholarLists from './modal/GetScholar';
import GetSubject from './modal/GetSubject';
import GetRoom from './modal/GetRoom';
import GetSupervisor from './modal/GetSupervisor';



const ProtectedRoute = ({ children }) => {
  const isAuthenticated = secureLocalStorage.getItem("adminLogin") === "true";
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {

  if (secureLocalStorage.getItem("url") !== "http://localhost/csdl/") {
    secureLocalStorage.setItem("url", "http://localhost/csdl/");
  }

  return (
    <>
      <Toaster richColors position="top-right" duration={1500} />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/AddAdministrator" element={<AddAdministrator />} />

          <Route path="/OfficeMaster" element={<AddOfficeMaster />} />
          <Route path="/addSupervisor" element={<AddSupervisor />} />
          <Route path="/AddScholar" element={<AddScholar />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/ScholarList" element={<ScholarList />} />
          <Route path='/qrcode' element={<Qrcode />} />
          <Route path="/AddBatchScholar" element={<AddBatchScholar />} />
          <Route path="/AssignStudent" element={<AssignStudent />} />
          <Route path="/Account" element={<Account />} />
          <Route path='/adminlist' element={<GetAdminList />} />
          <Route path="/DepartmentList" element={<GetDepartment />} />
          <Route path="/OfficeMasterList" element={<GetOfficeMaster />} />
          <Route path="/BuildingList" element={<GetBuilding />} />
          <Route path="/Batch" element={<Batch />} />
          <Route path="/BatchSubject" element={<BatchSubject />} />
          <Route path="/StudentFacilitator" element={<StudentFacilitator />} />
          <Route path='/SchoolYear' element={<GetSchoolYear />} />
          <Route path='/CourseList' element={<GetCourse />} />
          <Route path='/ScholarshipType' element={<GetScholarshipType />} />
          <Route path='/ScholarList' element={<GetScholarLists />} />
          <Route path='/Subjectlist' element={<GetSubject />} />
          <Route path='/Roomlist' element={<GetRoom />} />
          <Route path='/Supervisorlist' element={<GetSupervisor />} />

          <Route
            path="/MainDashboard"
            element={
              <ProtectedRoute>
                <MainDashboard />
                {/* <AddAdministrator />
                <AddOfficeMaster />
                <AddScholar />
                <AddSupervisor />
                <Account />
                <AssignStudent />
                <Batch />
                <BatchSubject />
                <MainDashboard />
                <navigator />
                <ScholarList />
                <StudentFacilitator />
                <AddBatchScholar />
                <AddBuilding />
                <AddModality />
                <AdminDashboard /> */}








              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
