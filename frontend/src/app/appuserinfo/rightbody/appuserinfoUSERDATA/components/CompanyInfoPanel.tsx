"use client";

const lbl = "text-gray-500 leading-none text-[clamp(8px,0.78vw,16px)]";
const inp = "w-full p-[1px] border border-gray-300 outline-none text-[clamp(8px,0.78vw,16px)]";
const req = <span className="text-red-500">*</span>;
const row2 = "grid grid-cols-2 gap-[2px] mb-[1px]";

interface Props {
  form: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function CompanyInfoPanel({ form, onChange }: Props) {
  return (
    <>
      <div className="flex-shrink-0 px-[6px] py-[1px] border-b border-gray-200 bg-gray-50">
        <span className="text-gray-600 text-[clamp(8px,0.78vw,16px)]">Company Information</span>
      </div>
      <div className="flex-1 px-[6px] py-[1px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
        <div className={row2}>
          <div><label className={lbl}>Company ID</label><input name="companyid" value={form.companyid} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>Company Name</label><input name="companyname" value={form.companyname} onChange={onChange} className={inp} /></div>
        </div>
        <div className={row2}>
          <div><label className={lbl}>Business Type</label><input name="businesstype" value={form.businesstype} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>Company TIN</label><input name="companytin" value={form.companytin} onChange={onChange} className={inp} /></div>
        </div>
        <div className={row2}>
          <div><label className={lbl}>Company Type 1</label><input name="companytype1" value={form.companytype1} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>Company Type 2</label><input name="companytype2" value={form.companytype2} onChange={onChange} className={inp} /></div>
        </div>
        <div className={row2}>
          <div>
            <label className={lbl}>Company Main Logo</label>
            <label className="flex items-center gap-[3px] border border-gray-300 p-[1px] cursor-pointer w-full">
              <span className="text-blue-600 border-b border-blue-600 whitespace-nowrap text-[clamp(8px,0.78vw,16px)]">Choose file</span>
              <input type="file" name="companymainlogo" accept=".ico" className="hidden" />
            </label>
          </div>
          <div>
            <label className={lbl}>Company Login Logo</label>
            <label className="flex items-center gap-[3px] border border-gray-300 p-[1px] cursor-pointer w-full">
              <span className="text-blue-600 border-b border-blue-600 whitespace-nowrap text-[clamp(8px,0.78vw,16px)]">Choose file</span>
              <input type="file" name="companyloginlogo" accept=".png" className="hidden" />
            </label>
          </div>
        </div>
        <div className={row2}>
          <div><label className={lbl}>Contact 1</label><input name="companycontact1" value={form.companycontact1} onChange={onChange} className={inp} /></div>
          <div><label className={lbl}>Contact 2</label><input name="companycontact2" value={form.companycontact2} onChange={onChange} className={inp} /></div>
        </div>
        <div className="mb-[1px]"><label className={lbl}>Company Address {req}</label><input name="companyaddress" value={form.companyaddress} onChange={onChange} className={inp} /></div>
        <div className="mb-[1px]"><label className={lbl}>Company Email 1</label><input name="companyemail1" value={form.companyemail1} onChange={onChange} className={inp} /></div>
        <div className="mb-[1px]"><label className={lbl}>Company Email 2</label><input name="companyemail2" value={form.companyemail2} onChange={onChange} className={inp} /></div>
        <div className="mb-[1px]"><label className={lbl}>Website</label><input name="companysite" value={form.companysite} onChange={onChange} className={inp} /></div>
      </div>
    </>
  );
}