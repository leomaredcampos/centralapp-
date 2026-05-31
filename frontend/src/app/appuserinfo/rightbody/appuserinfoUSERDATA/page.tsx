"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import UserInfoDataGrid from "./components/UserInfoDataGrid";
import EmployeeInfoPanel from "./components/EmployeeInfoPanel";
import CompanyInfoPanel from "./components/CompanyInfoPanel";
import SystemInfoPanel from "./components/SystemInfoPanel";

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
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [appList, setAppList] = useState<{ appname: string; buttonname: string }[]>([]);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [users, setUsers] = useState<{ emailx: string; fname: string; lname: string; writemade: string; datemade: string; expirationdate: string; writeremail: string }[]>([]);
  const [searchIndex, setSearchIndex] = useState(0);

  useEffect(() => {
    fetch("/api/get-available-apps", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
      .then((r) => r.json()).then((d) => setAppList(Array.isArray(d) ? d : []));
    fetch("/api/appuserinfo/list", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
      .then((r) => r.json()).then((d) => setUsers(Array.isArray(d) ? d : []));
  }, []);

  function toggleApp(appname: string) {
    setSelectedApps((prev) => prev.includes(appname) ? prev.filter((a) => a !== appname) : [...prev, appname]);
  }

  function handlePrev() {
    if (users.length === 0) return;
    setSearchIndex((searchIndex - 1 + users.length) % users.length);
  }

  function handleNext() {
    if (users.length === 0) return;
    setSearchIndex((searchIndex + 1) % users.length);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setLoading(true);
    const writeremail = localStorage.getItem("email") || "";
    const res = await fetch("/api/appuserinfo/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, writeremail, selectedApps }),
    });
    const data = await res.json();
    if (data.status !== "saved") { setLoading(false); alert(data.error || "Failed to save."); return; }
    if (files && files.length > 0) {
      const fd = new FormData();
      fd.append("email", form.emailx);
      for (let i = 0; i < Math.min(files.length, 4); i++) fd.append("files", files[i]);
      await fetch("/api/appuserinfo/upload", { method: "POST", body: fd });
    }
    setLoading(false);
    alert("User saved successfully.");
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
    <div className="h-full flex flex-col border border-gray-200 rounded-lg bg-white overflow-hidden">
      {/* Datagrid */}
      <div className="flex-1 overflow-hidden border-t border-gray-200" style={{ height: "35%" }}>
        <UserInfoDataGrid
          users={users}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      {/* 3-Panel Body */}
      <div className="flex overflow-hidden" style={{ height: "63%" }}>
        <div className="w-[48%] h-full flex flex-col border-r border-gray-200 overflow-hidden">
          <EmployeeInfoPanel form={form} onChange={handleChange} />
        </div>
        <div className="w-[25.5%] h-full flex flex-col border-r border-gray-200 overflow-hidden">
          <CompanyInfoPanel form={form} onChange={handleChange} />
        </div>
        <div className="w-[26.5%] h-full flex flex-col overflow-hidden">
          <SystemInfoPanel />
        </div>
      </div>
    </div>
  );
});

AppUserInfoRightBody.displayName = "AppUserInfoRightBody";
export default AppUserInfoRightBody;