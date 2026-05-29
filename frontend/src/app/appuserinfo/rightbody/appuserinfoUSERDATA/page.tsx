"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import UserInfoDataGrid from "./components/UserInfoDataGrid";

const inp = "w-full p-[1px] border border-gray-300 outline-none";
const lbl = "text-gray-500 leading-none";
const req = <span className="text-red-500">*</span>;
const row2 = "grid grid-cols-2 gap-[3px] mb-[2px]";
const row3 = "grid grid-cols-3 gap-[3px] mb-[2px]";

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
  const [moduleSearch, setModuleSearch] = useState("");
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [users, setUsers] = useState<{ emailx: string; fname: string; lname: string; writemade: string; datemade: string; expirationdate: string; writeremail: string }[]>([]);
  const [searchVal, setSearchVal] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);
  const moduleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/get-available-apps", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
      .then((r) => r.json()).then((d) => setAppList(Array.isArray(d) ? d : []));
    fetch("/api/appuserinfo/list", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
      .then((r) => r.json()).then((d) => setUsers(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moduleRef.current && !moduleRef.current.contains(e.target as Node)) setShowModuleDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleApp(appname: string) {
    setSelectedApps((prev) => prev.includes(appname) ? prev.filter((a) => a !== appname) : [...prev, appname]);
  }

  function handlePrev() {
    if (users.length === 0) return;
    const prev = (searchIndex - 1 + users.length) % users.length;
    setSearchIndex(prev);
    setSearchVal(users[prev].emailx);
  }

  function handleNext() {
    if (users.length === 0) return;
    const next = (searchIndex + 1) % users.length;
    setSearchIndex(next);
    setSearchVal(users[next].emailx);
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

  const filteredApps = appList.filter((a) => a.buttonname.toLowerCase().includes(moduleSearch.toLowerCase()));
  const selectedLabels = appList.filter((a) => selectedApps.includes(a.appname)).map((a) => a.buttonname).join(", ");

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
      {/* 3 Panel Body */}
      <div className="flex overflow-hidden" style={{ height: "63%" }}>

        {/* Panel 1 — Employee Info */}
        <div className="w-[48%] h-full flex flex-col border-r border-gray-200 overflow-hidden">
          <div className="flex-shrink-0 px-[6px] py-[2px] border-b border-gray-200 bg-gray-50">
            <span className="text-gray-600">Employee Information</span>
          </div>
          <div className="flex-1 px-[6px] py-[3px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
            <div className={row3}>
              <div><label className={lbl}>Firstname {req}</label><input name="fname" value={form.fname} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Lastname {req}</label><input name="lname" value={form.lname} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Middlename {req}</label><input name="mname" value={form.mname} onChange={handleChange} className={inp} /></div>
            </div>
            <div className={row3}>
              <div><label className={lbl}>Suffix</label><input name="sname" value={form.sname} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Employee ID {req}</label><input name="userid" value={form.userid} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>User Type {req}</label><input name="usertype" value={form.usertype} onChange={handleChange} className={inp} /></div>
            </div>
            <div className={row3}>
              <div><label className={lbl}>User Level</label><input name="userlevel" value={form.userlevel} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Position {req}</label><input name="userposition" value={form.userposition} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Contact {req}</label><input name="usercontact" value={form.usercontact} onChange={handleChange} className={inp} /></div>
            </div>
            <div className={row3}>
              <div><label className={lbl}>Gender {req}</label>
                <select name="usergender" value={form.usergender} onChange={handleChange} className={inp}>
                  <option value="">-</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div><label className={lbl}>SS No.</label><input name="userss" value={form.userss} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>TIN</label><input name="usertin" value={form.usertin} onChange={handleChange} className={inp} /></div>
            </div>
            <div className={row3}>
              <div><label className={lbl}>PAGIBIG</label><input name="userpagibig" value={form.userpagibig} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>PhilHealth</label><input name="userphilihealth" value={form.userphilihealth} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Birthdate</label><input type="date" name="userbirth" value={form.userbirth} onChange={handleChange} className={inp} /></div>
            </div>
            <div className={row3}>
              <div><label className={lbl}>Emergency Contact {req}</label><input name="usercontactinemergency" value={form.usercontactinemergency} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Emergency No. {req}</label><input name="userpersoncontactno" value={form.userpersoncontactno} onChange={handleChange} className={inp} /></div>
              <div className="grid" style={{ gridTemplateColumns: "59% 40%", gap: "1%" }}>
                <div><label className={lbl}>Biometric ID</label><input name="userbio" value={form.userbio} onChange={handleChange} className={inp} /></div>
                <div>
                  <label className={lbl}>ID Photo {req}</label>
                  <label className="flex items-center gap-[3px] border border-gray-300 p-[1px] cursor-pointer w-full">
                    <span className="text-blue-600 border-b border-blue-600 whitespace-nowrap">Choose file</span>
                    <input type="file" name="idphoto" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            <div className={row3}>
              <div><label className={lbl}>Religion</label><input name="userreligion" value={form.userreligion} onChange={handleChange} className={inp} /></div>
              <div className="grid" style={{ gridTemplateColumns: "50% 49%", gap: "1%" }}>
                <div><label className={lbl}>Height</label><input name="userheight" value={form.userheight} onChange={handleChange} className={inp} /></div>
                <div><label className={lbl}>Weight</label><input name="userweight" value={form.userweight} onChange={handleChange} className={inp} /></div>
              </div>
              <div className="grid" style={{ gridTemplateColumns: "59% 40%", gap: "1%" }}>
                <div>
                  <label className={lbl}>Signature {req}</label>
                  <label className="flex items-center gap-[3px] border border-gray-300 p-[1px] cursor-pointer w-full">
                    <span className="text-blue-600 border-b border-blue-600 whitespace-nowrap">Choose file</span>
                    <input type="file" name="usersign" className="hidden" />
                  </label>
                </div>
                <div>
                  <label className={lbl}>Others {req}</label>
                  <label className="flex items-center gap-[3px] border border-gray-300 p-[1px] cursor-pointer w-full">
                    <span className="text-blue-600 border-b border-blue-600 whitespace-nowrap">Choose file</span>
                    <input type="file" name="requirementsx" multiple className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            <div className={row3}>
              <div className="col-span-3"><label className={lbl}>Employee Complete Address {req}</label><input name="useraddress" value={form.useraddress} onChange={handleChange} className={inp} /></div>
            </div>
            <div className={row3}>
              <div className="col-span-3"><label className={lbl}>Employee Email Address {req}</label><input name="emailx" value={form.emailx} onChange={handleChange} className={inp} /></div>
            </div>
          </div>
        </div>

        {/* Panel 2 — Company Info */}
        <div className="w-[25.5%] h-full flex flex-col border-r border-gray-200 overflow-hidden">
          <div className="flex-shrink-0 px-[6px] py-[2px] border-b border-gray-200 bg-gray-50">
            <span className="text-gray-600">Company Information</span>
          </div>
          <div className="flex-1 px-[6px] py-[3px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
            <div className={row2}>
              <div><label className={lbl}>Company ID</label><input name="companyid" value={form.companyid} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Company Name</label><input name="companyname" value={form.companyname} onChange={handleChange} className={inp} /></div>
            </div>
            <div className={row2}>
              <div><label className={lbl}>Business Type</label><input name="businesstype" value={form.businesstype} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Company TIN</label><input name="companytin" value={form.companytin} onChange={handleChange} className={inp} /></div>
            </div>
            <div className={row2}>
              <div><label className={lbl}>Company Type 1</label><input name="companytype1" value={form.companytype1} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Company Type 2</label><input name="companytype2" value={form.companytype2} onChange={handleChange} className={inp} /></div>
            </div>
            <div className={row2}>
              <div>
                <label className={lbl}>Company Main Logo</label>
                <label className="flex items-center gap-[3px] border border-gray-300 p-[1px] cursor-pointer w-full">
                  <span className="text-blue-600 border-b border-blue-600 whitespace-nowrap">Choose file</span>
                  <input type="file" name="companymainlogo" accept=".ico" className="hidden" />
                </label>
              </div>
              <div>
                <label className={lbl}>Company Login Logo</label>
                <label className="flex items-center gap-[3px] border border-gray-300 p-[1px] cursor-pointer w-full">
                  <span className="text-blue-600 border-b border-blue-600 whitespace-nowrap">Choose file</span>
                  <input type="file" name="companyloginlogo" accept=".png" className="hidden" />
                </label>
              </div>
            </div>
            <div className={row2}>
              <div><label className={lbl}>Contact 1</label><input name="companycontact1" value={form.companycontact1} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Contact 2</label><input name="companycontact2" value={form.companycontact2} onChange={handleChange} className={inp} /></div>
            </div>
            <div className="mb-[2px]"><label className={lbl}>Company Address {req}</label><input name="companyaddress" value={form.companyaddress} onChange={handleChange} className={inp} /></div>
            <div className="mb-[2px]"><label className={lbl}>Company Email 1</label><input name="companyemail1" value={form.companyemail1} onChange={handleChange} className={inp} /></div>
            <div className="mb-[2px]"><label className={lbl}>Company Email 2</label><input name="companyemail2" value={form.companyemail2} onChange={handleChange} className={inp} /></div>
            <div className="mb-[2px]"><label className={lbl}>Website</label><input name="companysite" value={form.companysite} onChange={handleChange} className={inp} /></div>
          </div>
        </div>

        {/* Panel 3 — System Info + Datagrid */}
        <div className="w-[26.5%] h-full flex flex-col overflow-hidden">
          <div className="flex-shrink-0 px-[6px] py-[2px] border-b border-gray-200 bg-gray-50">
            <span className="text-gray-600">System Information</span>
          </div>
          <div className="flex-shrink-0 px-[6px] py-[3px]">
            <div className={row2}>
              <div><label className={lbl}>Employee Account Status</label><input readOnly className={`${inp} bg-gray-50`} /></div>
              <div><label className={lbl}>As Date of</label><input readOnly className={`${inp} bg-gray-50`} /></div>
            </div>
            <div className={row2}>
              <div><label className={lbl}>Expiration Date</label><input readOnly className={`${inp} bg-gray-50`} /></div>
              <div><label className={lbl}>User Level</label><input readOnly className={`${inp} bg-gray-50`} /></div>
            </div>
            <div className={row2}>
              <div className="col-span-2"><label className={lbl}>Written By</label><input readOnly className={`${inp} bg-gray-50`} /></div>
            </div>
          </div>
        </div>

      </div>

      {/* Datagrid — full width bottom */}
      <div className="flex-1 overflow-hidden border-t border-gray-200">
        <UserInfoDataGrid
          users={users}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
});

AppUserInfoRightBody.displayName = "AppUserInfoRightBody";
export default AppUserInfoRightBody;
