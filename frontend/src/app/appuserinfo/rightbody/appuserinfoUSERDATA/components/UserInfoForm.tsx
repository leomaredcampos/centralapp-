"use client";

import { useRef, useState, useEffect } from "react";

const inp = "w-full text-[10.5pt] p-[1px] border border-gray-300 outline-none";
const lbl = "text-[10.5pt] text-gray-500";
const req = <span className="text-red-500">*</span>;
const row4 = "grid grid-cols-4 gap-[4px] mb-[4px]";
const row2 = "grid grid-cols-2 gap-[4px] mb-[4px]";
const btnClass = "text-[10.5pt] px-[12px] py-[1px] bg-white border border-gray-300 cursor-pointer hover:bg-gray-50";

interface Props {
  form: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  loading: boolean;
  files: FileList | null;
  setFiles: (f: FileList | null) => void;
  appList: { appname: string; buttonname: string }[];
  selectedApps: string[];
  toggleApp: (appname: string) => void;
}

export default function UserInfoForm({ form, onChange, onSave, loading, files, setFiles, appList, selectedApps, toggleApp }: Props) {
  const [moduleSearch, setModuleSearch] = useState("");
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const moduleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moduleRef.current && !moduleRef.current.contains(e.target as Node)) {
        setShowModuleDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredApps = appList.filter((a) => a.buttonname.toLowerCase().includes(moduleSearch.toLowerCase()));
  const selectedLabels = appList.filter((a) => selectedApps.includes(a.appname)).map((a) => a.buttonname).join(", ");

  return (
    <div className="h-full flex flex-col border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">

      {/* Frozen Header */}
      <div className="flex-shrink-0 px-[10px] py-[3px] border-b border-gray-200 bg-gray-50 flex flex-wrap items-center gap-[6px]">
        <span className="text-gray-600">Employee Information</span>
        <label className="text-blue-600 border-b border-blue-600 cursor-pointer">
            Choose File
            <input type="file" multiple accept="*" onChange={(e) => setFiles(e.target.files)} className="hidden" />
          </label>
          <span className="text-gray-500">
            {files && files.length > 0 ? `${files.length} file(s) attached` : "No file chosen"}
          </span>
          <span className="text-gray-600">Module Access</span>
          <div ref={moduleRef} className="relative flex-1 min-w-[100px]">
              <input
                type="text"
                value={showModuleDropdown ? moduleSearch : selectedLabels}
                onChange={(e) => setModuleSearch(e.target.value)}
                onFocus={() => { setShowModuleDropdown(true); setModuleSearch(""); }}
                placeholder="Select modules..."
                className="w-full p-[1px] border border-gray-300 outline-none"
              />
              {showModuleDropdown && (
                <div className="absolute z-10 bg-white border border-gray-300 w-full max-h-[150px] overflow-y-auto" style={{ top: "100%" }}>
                  {filteredApps.length === 0 && <div className="text-gray-400 px-[6px] py-[2px]">No apps available</div>}
                  {filteredApps.map((app) => (
                    <label key={app.appname} className="flex items-center gap-[6px] px-[6px] py-[2px] hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" checked={selectedApps.includes(app.appname)} onChange={() => toggleApp(app.appname)} />
                      {app.buttonname}
                    </label>
                  ))}
                </div>
              )}
            </div>
          <button onClick={onSave} disabled={loading} className={`${btnClass} disabled:opacity-50`}>Save</button>
          <button className={btnClass}>Update</button>
          <button className={btnClass}>Request</button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* FROZEN - Employee Info */}
        <div className="flex-shrink-0 px-[10px] pt-[6px]">
          <div className={row4}>
            <div><label className={lbl}>Firstname {req}</label><input name="fname" value={form.fname} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Lastname {req}</label><input name="lname" value={form.lname} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Middlename {req}</label><input name="mname" value={form.mname} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Suffix Name</label><input name="sname" value={form.sname} onChange={onChange} className={inp} /></div>
          </div>
          <div className={row4}>
            <div><label className={lbl}>Employee ID {req}</label><input name="userid" value={form.userid} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Employee Status {req}</label><input name="usertype" value={form.usertype} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Department {req}</label><input name="userdept" value={form.userdept} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Position {req}</label><input name="userposition" value={form.userposition} onChange={onChange} className={inp} /></div>
          </div>
          <div className={row4}>
            <div><label className={lbl}>Contact No. {req}</label><input name="usercontact" value={form.usercontact} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Gender {req}</label>
              <select name="usergender" value={form.usergender} onChange={onChange} className={inp}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div><label className={lbl}>SS No.</label><input name="userss" value={form.userss} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>TIN No.</label><input name="usertin" value={form.usertin} onChange={onChange} className={inp} /></div>
          </div>
          <div className={row4}>
            <div><label className={lbl}>PAGIBIG</label><input name="userpagibig" value={form.userpagibig} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>PhilHealth</label><input name="userphilihealth" value={form.userphilihealth} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Contact Person in Emergency {req}</label><input name="usercontactinemergency" value={form.usercontactinemergency} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Emergency Contact No. {req}</label><input name="userpersoncontactno" value={form.userpersoncontactno} onChange={onChange} className={inp} /></div>
          </div>
          <div className={row2}>
            <div><label className={lbl}>Address {req}</label><input name="useraddress" value={form.useraddress} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Employee Email Address {req}</label><input name="emailx" value={form.emailx} onChange={onChange} className={inp} /></div>
          </div>
          <div className="border-b border-gray-200 pb-[2px] mb-[4px]">
            <span className="text-[10.5pt] text-gray-600">Company Information</span>
          </div>
        </div>

        {/* SCROLLABLE - Company Info */}
        <div className="flex-1 overflow-y-auto px-[10px] pb-[6px]" style={{ scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent" }}>
          <div className="grid grid-cols-4 gap-[4px]">
            <div><label className={lbl}>Company ID</label><input name="companyid" value={form.companyid} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Company Name</label><input name="companyname" value={form.companyname} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Company Type 1</label><input name="companytype1" value={form.companytype1} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Company Type 2</label><input name="companytype2" value={form.companytype2} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Business Type</label><input name="businesstype" value={form.businesstype} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Company TIN</label><input name="companytin" value={form.companytin} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Contact 1</label><input name="companycontact1" value={form.companycontact1} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Contact 2</label><input name="companycontact2" value={form.companycontact2} onChange={onChange} className={inp} /></div>
            <div className="col-span-2"><label className={lbl}>Company Address {req}</label><input name="companyaddress" value={form.companyaddress} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Company Email 1</label><input name="companyemail1" value={form.companyemail1} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Company Email 2</label><input name="companyemail2" value={form.companyemail2} onChange={onChange} className={inp} /></div>
            <div className="col-span-2"><label className={lbl}>Company Website</label><input name="companysite" value={form.companysite} onChange={onChange} className={inp} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
