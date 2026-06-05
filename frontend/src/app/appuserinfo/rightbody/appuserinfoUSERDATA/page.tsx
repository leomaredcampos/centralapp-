"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import UserInfoDataGrid from "./components/UserInfoDataGrid";
import EmployeeInfoPanel from "./components/EmployeeInfoPanel";
import CompanyInfoPanel from "./components/CompanyInfoPanel";
import SystemInfoPanel from "./components/SystemInfoPanel";
import { useUserInfoData } from "./hooks/useUserInfoData";
import { useUserInfoActions } from "./hooks/useUserInfoActions";
import { useAppAccess } from "./hooks/useAppAccess";

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

  return (
    <div className="h-full flex flex-col border-[0.25px] border-black rounded-lg bg-white overflow-hidden">
      {/* Datagrid */}
      <div className="overflow-hidden border-b-[0.25px] border-black" style={{ flex: "0 0 35%" }}>
        <UserInfoDataGrid
          users={users}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      {/* Desktop Layout (Landscape) — 3 Columns Side by Side */}
      <div className="hidden md:flex overflow-hidden min-w-0" style={{ flex: "0 0 63%" }}>
        <div className="w-[48%] min-w-0 h-full flex flex-col overflow-hidden">
          <EmployeeInfoPanel form={form} onChange={handleChange} />
        </div>
        <div className="w-[25.5%] min-w-0 h-full flex flex-col overflow-hidden">
          <CompanyInfoPanel form={form} onChange={handleChange} />
        </div>
        <div className="w-[26.5%] min-w-0 h-full flex flex-col overflow-hidden">
          <SystemInfoPanel />
        </div>
      </div>

      {/* Mobile/Portrait Layout — 3 Frames takes full height, Left Lower sa baba */}
      <div className="flex md:hidden flex-col overflow-hidden" style={{ flex: "1 1 0%", minHeight: 0 }}>
        {/* 3 Information Panels — scrollable, fills remaining space */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {/* Employee Information Panel */}
          <div className="w-full border-b-[0.25px] border-black">
            <EmployeeInfoPanel form={form} onChange={handleChange} />
          </div>
          {/* Company Information Panel (new format) */}
          <div className="w-full border-b-[0.25px] border-black">
            <CompanyInfoPanel form={form} onChange={handleChange} />
          </div>
          {/* System Information Panel */}
          <div className="w-full border-b-[0.25px] border-black">
            <SystemInfoPanel />
          </div>
        </div>

      </div>
    </div>
  );
});

AppUserInfoRightBody.displayName = "AppUserInfoRightBody";
export default AppUserInfoRightBody;