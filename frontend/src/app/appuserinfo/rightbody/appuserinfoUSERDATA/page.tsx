"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import UserInfoDataGrid from "./components/UserInfoDataGrid";
import EmployeeInfoPanel from "./components/EmployeeInfoPanel";
import CompanyInfoPanel from "./components/CompanyInfoPanel";
import SystemInfoPanel from "./components/SystemInfoPanel";
import { useUserInfoData } from "./hooks/useUserInfoData";
import { useUserInfoActions } from "./hooks/useUserInfoActions";
import { useAppAccess } from "./hooks/useAppAccess";
import { useOrientation } from "../../../dashboard/hooks/useOrientation";

export interface UserInfoHandle {
  getFiles: () => FileList | null;
  setFiles: (f: FileList | null) => void;
  getAppList: () => { appname: string; buttonname: string }[];
  getSelectedApps: () => string[];
  toggleApp: (appname: string) => void;
  handleSave: () => void;
  loading: boolean;
}

const AppUserInfoRightBody = forwardRef<UserInfoHandle>((_, ref) => {
  const [form, setForm] = useState({
    fname: "", lname: "", mname: "", sname: "",
    userid: "", usertype: "", userdept: "", userposition: "",
    usercontact: "", usergender: "", userss: "", usertin: "",
    userpagibig: "", userphilihealth: "", usercontactinemergency: "", userpersoncontactno: "",
    useraddress: "", emailx: "", userbirth: "", userlevel: "",
    userheight: "", userweight: "", userreligion: "", userbio: "",
    idphoto: "", usersign: "", requirementsx: "",
    companyid: "", companyname: "", companytype1: "", companytype2: "",
    businesstype: "", companytin: "", companycontact1: "", companycontact2: "",
    companyaddress: "", companyemail1: "", companyemail2: "", companysite: "",
    companymainlogo: "", companyloginlogo: "",
  });
  const [files, setFiles] = useState<FileList | null>(null);

  const { users, handlePrev, handleNext } = useUserInfoData();
  const { appList, selectedApps, toggleApp } = useAppAccess();
  const { loading, handleSave } = useUserInfoActions(form, selectedApps, files);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  useImperativeHandle(ref, () => ({
    getFiles: () => files,
    setFiles,
    getAppList: () => appList,
    getSelectedApps: () => selectedApps,
    toggleApp,
    handleSave,
    loading,
  }));

  const isPortrait = useOrientation();

  // ─── LANDSCAPE LAYOUT ──────────────────────────────────────────────
  if (!isPortrait) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", border: "0.25px solid black", borderRadius: "8px", background: "white" }}>
        {/* Datagrid - 35% */}
        <div style={{ height: "35%", flexShrink: 0, borderBottom: "0.25px solid black", overflow: "hidden" }}>
          <UserInfoDataGrid users={users} onPrev={handlePrev} onNext={handleNext} />
        </div>
        {/* 3 Columns - 63% */}
        <div style={{ height: "63%", display: "flex", overflow: "hidden" }}>
          <div style={{ width: "48%", height: "100%", overflow: "hidden" }}>
            <EmployeeInfoPanel form={form} onChange={handleChange} />
          </div>
          <div style={{ width: "25.5%", height: "100%", overflow: "hidden" }}>
            <CompanyInfoPanel form={form} onChange={handleChange} />
          </div>
          <div style={{ width: "26.5%", height: "100%", overflow: "hidden" }}>
            <SystemInfoPanel />
          </div>
        </div>
      </div>
    );
  }

  // ─── PORTRAIT LAYOUT ───────────────────────────────────────────────
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", border: "0.25px solid black", background: "white" }}>
      <div style={{ height: "10vh", flexShrink: 0, borderBottom: "0.25px solid black", overflow: "hidden" }}>
        <UserInfoDataGrid users={users} onPrev={handlePrev} onNext={handleNext} />
      </div>
      {/* Employee - 35vh */}
      <div style={{ height: "35vh", flexShrink: 0, borderBottom: "0.25px solid black", overflow: "hidden" }}>
        <EmployeeInfoPanel form={form} onChange={handleChange} />
      </div>
      {/* Company - 30vh */}
      <div style={{ height: "30vh", flexShrink: 0, borderBottom: "0.25px solid black", overflow: "hidden" }}>
        <CompanyInfoPanel form={form} onChange={handleChange} />
      </div>
      {/* System - 15vh */}
      <div style={{ height: "15vh", flexShrink: 0, overflow: "hidden" }}>
        <SystemInfoPanel />
      </div>
    </div>
  );
});

AppUserInfoRightBody.displayName = "AppUserInfoRightBody";
export default AppUserInfoRightBody;