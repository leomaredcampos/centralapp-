"use client";

const lbl = "text-gray-500 leading-none text-[clamp(8px,0.78vw,16px)]";
const inp = "w-full p-[1px] border border-gray-300 outline-none text-[clamp(8px,0.78vw,16px)]";
const req = <span className="text-red-500">*</span>;
const row2 = "grid grid-cols-2 gap-[2px] mb-[1px]";
const row3 = "grid grid-cols-3 gap-[2px] mb-[1px]";

interface Props {
  form: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function EmployeeInfoPanel({ form, onChange }: Props) {
  return (
    <div className="w-full min-w-0 h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-[6px] py-[1px] border-b border-gray-200 bg-gray-50">
        <span className="text-gray-600 text-[clamp(8px,0.78vw,16px)]">Employee Information</span>
      </div>
      <div className="flex-1 min-h-0 px-[6px] py-[1px] overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "thin" }}>
        <div className={row3}>
          <div><label className={lbl}>Firstname {req}</label><input name="fname" value={form.fname} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>Lastname {req}</label><input name="lname" value={form.lname} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>Middlename {req}</label><input name="mname" value={form.mname} onChange={onChange} className={inp} /></div>
        </div>
        <div className={row3}>
          <div><label className={lbl}>Suffix</label><input name="sname" value={form.sname} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>Employee ID {req}</label><input name="userid" value={form.userid} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>User Type {req}</label><input name="usertype" value={form.usertype} onChange={onChange} className={inp} /></div>
        </div>
        <div className={row3}>
          <div><label className={lbl}>User Level</label><input name="userlevel" value={form.userlevel} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>Position {req}</label><input name="userposition" value={form.userposition} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>Contact {req}</label><input name="usercontact" value={form.usercontact} onChange={onChange} className={inp} /></div>
        </div>
        <div className={row3}>
          <div><label className={lbl}>Gender {req}</label>
            <select name="usergender" value={form.usergender} onChange={onChange} className={inp}>
              <option value="">-</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div><label className={lbl}>SS No.</label><input name="userss" value={form.userss} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>TIN</label><input name="usertin" value={form.usertin} onChange={onChange} className={inp} /></div>
        </div>
        <div className={row3}>
          <div><label className={lbl}>PAGIBIG</label><input name="userpagibig" value={form.userpagibig} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>PhilHealth</label><input name="userphilihealth" value={form.userphilihealth} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>Birthdate</label><input type="date" name="userbirth" value={form.userbirth} onChange={onChange} className={inp} /></div>
        </div>
        <div className={row3}>
          <div><label className={lbl}>Emergency Contact {req}</label><input name="usercontactinemergency" value={form.usercontactinemergency} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>Emergency No. {req}</label><input name="userpersoncontactno" value={form.userpersoncontactno} onChange={onChange} className={inp} /></div>
          <div className="grid" style={{ gridTemplateColumns: "59% 40%", gap: "1%" }}>
            <div><label className={lbl}>Biometric ID</label><input name="userbio" value={form.userbio} onChange={onChange} className={inp} /></div>
            <div>
              <label className={lbl}>ID Photo {req}</label>
              <label className="flex items-center gap-[2px] border border-gray-300 p-[0px] cursor-pointer w-full">
                <span className="text-blue-600 border-b border-blue-600 whitespace-nowrap text-[clamp(8px,0.78vw,16px)]">Choose file</span>
                <input type="file" name="idphoto" className="hidden" />
              </label>
            </div>
          </div>
        </div>
        <div className={row3}>
          <div><label className={lbl}>Religion</label><input name="userreligion" value={form.userreligion} onChange={onChange} className={inp} /></div>
          <div className="grid" style={{ gridTemplateColumns: "50% 49%", gap: "1%" }}>
            <div><label className={lbl}>Height</label><input name="userheight" value={form.userheight} onChange={onChange} className={inp} /></div>
            <div><label className={lbl}>Weight</label><input name="userweight" value={form.userweight} onChange={onChange} className={inp} /></div>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "59% 40%", gap: "1%" }}>
            <div>
              <label className={lbl}>Signature {req}</label>
              <label className="flex items-center gap-[2px] border border-gray-300 p-[0px] cursor-pointer w-full">
                <span className="text-blue-600 border-b border-blue-600 whitespace-nowrap text-[clamp(8px,0.78vw,16px)]">Choose file</span>
                <input type="file" name="usersign" className="hidden" />
              </label>
            </div>
            <div>
              <label className={lbl}>Others {req}</label>
              <label className="flex items-center gap-[2px] border border-gray-300 p-[0px] cursor-pointer w-full">
                <span className="text-blue-600 border-b border-blue-600 whitespace-nowrap text-[clamp(8px,0.78vw,16px)]">Choose file</span>
                <input type="file" name="requirementsx" multiple className="hidden" />
              </label>
            </div>
          </div>
        </div>
        <div className={row3}>
          <div className="col-span-3"><label className={lbl}>Employee Complete Address {req}</label><input name="useraddress" value={form.useraddress} onChange={onChange} className={inp} /></div>
        </div>
        <div className={row3}>
          <div className="col-span-3"><label className={lbl}>Employee Email Address {req}</label><input name="emailx" value={form.emailx} onChange={onChange} className={inp} /></div>
        </div>
      </div>
    </div>
  );
}