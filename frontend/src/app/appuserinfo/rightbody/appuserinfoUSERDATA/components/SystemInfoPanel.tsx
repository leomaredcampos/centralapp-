"use client";

const lbl = "text-black leading-none text-[clamp(9.5px,0.78vw,16px)]";
const inp = "w-full p-[1px] border-[0.25px] border-black outline-none text-[clamp(9.5px,0.78vw,16px)]";
const row2 = "grid grid-cols-2 gap-[2px] mb-[1px]";

export default function SystemInfoPanel() {
  return (
    <>
      <div className="flex-shrink-0 px-[6px] py-[1px] border-b-[0.25px] border-black bg-gray-50">
        <span className="text-black text-[clamp(9.5px,0.78vw,16px)]">System Information</span>
      </div>
      <div className="flex-shrink-0 px-[6px] py-[1px]">
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
    </>
  );
}