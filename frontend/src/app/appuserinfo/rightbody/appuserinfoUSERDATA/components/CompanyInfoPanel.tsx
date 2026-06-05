"use client";

const lbl = "text-black leading-none ";
const inp = "w-full p-[1px] border-[0.25px] border-black outline-none ";
const req = <span className="text-red-500">*</span>;

interface Props {
  form: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isPortrait?: boolean;
}

export default function CompanyInfoPanel({ form, onChange, isPortrait }: Props) {
  const fields = (
    <div className="px-[6px] py-[1px]">
      <div className="grid grid-cols-3 gap-[2px] mb-[1px]">
        <div><label className={lbl}>Company ID</label><input name="companyid" value={form.companyid} onChange={onChange} className={inp} /></div>
        <div><label className={lbl}>Company Name</label><input name="companyname" value={form.companyname} onChange={onChange} className={inp} /></div>
        <div><label className={lbl}>Company TIN</label><input name="companytin" value={form.companytin} onChange={onChange} className={inp} /></div>
      </div>
      <div className="grid grid-cols-3 gap-[2px] mb-[1px]">
        <div><label className={lbl}>Business Type</label><input name="businesstype" value={form.businesstype} onChange={onChange} className={inp} /></div>
        <div><label className={lbl}>Company Type 1</label><input name="companytype1" value={form.companytype1} onChange={onChange} className={inp} /></div>
        <div><label className={lbl}>Company Type 2</label><input name="companytype2" value={form.companytype2} onChange={onChange} className={inp} /></div>
      </div>
      <div className="grid grid-cols-2 gap-[2px] mb-[1px]">
        <div><label className={lbl}>Contact 1</label><input name="companycontact1" value={form.companycontact1} onChange={onChange} className={inp} /></div>
        <div><label className={lbl}>Contact 2</label><input name="companycontact2" value={form.companycontact2} onChange={onChange} className={inp} /></div>
      </div>
      <div className="grid grid-cols-2 gap-[2px] mb-[1px]">
        <div>
          <label className={lbl}>Company Main Logo</label>
          <label className="flex items-center gap-[2px] border-[0.25px] border-black p-[0px] cursor-pointer w-full">
            <span className="text-blue-600 border-b-[0.25px] border-blue-600 whitespace-nowrap ">Choose file</span>
            <input type="file" name="companymainlogo" accept=".ico" className="hidden" />
          </label>
        </div>
        <div>
          <label className={lbl}>Company Login Logo</label>
          <label className="flex items-center gap-[2px] border-[0.25px] border-black p-[0px] cursor-pointer w-full">
            <span className="text-blue-600 border-b-[0.25px] border-blue-600 whitespace-nowrap ">Choose file</span>
            <input type="file" name="companyloginlogo" accept=".png" className="hidden" />
          </label>
        </div>
      </div>
      <div className="mb-[1px]"><label className={lbl}>Company Address {req}</label><input name="companyaddress" value={form.companyaddress} onChange={onChange} className={inp} /></div>
      <div className="mb-[1px]"><label className={lbl}>Company Email 1</label><input name="companyemail1" value={form.companyemail1} onChange={onChange} className={inp} /></div>
      <div className="mb-[1px]"><label className={lbl}>Company Email 2</label><input name="companyemail2" value={form.companyemail2} onChange={onChange} className={inp} /></div>
      <div className="mb-[1px]"><label className={lbl}>Website</label><input name="companysite" value={form.companysite} onChange={onChange} className={inp} /></div>
    </div>
  );

  const header = (
    <div className="flex-shrink-0 px-[6px] py-[1px] border-b-[0.25px] border-black bg-gray-50">
      <span className="text-black ">Company Information</span>
    </div>
  );

  if (isPortrait) {
    return (
      <div className="w-full min-w-0">
        {header}
        {fields}
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 h-full flex flex-col overflow-hidden">
      {header}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "thin" }}>
        {fields}
      </div>
    </div>
  );
}
