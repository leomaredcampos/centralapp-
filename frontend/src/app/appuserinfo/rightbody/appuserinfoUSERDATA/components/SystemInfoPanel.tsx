"use client";

const lbl = "text-black leading-none text-[clamp(10px,0.78vw,16px)]";
const inp = "w-full p-[1px] border-[0.25px] border-black outline-none text-[clamp(10px,0.78vw,16px)]";
const row2 = "grid grid-cols-2 gap-[2px] mb-[1px]";

export default function SystemInfoPanel() {
  return (
    <div className="w-full min-w-0 h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-[6px] py-[1px] border-b-[0.25px] border-black bg-gray-50">
        <span className="text-black text-[clamp(10px,0.78vw,16px)]">System Information</span>
      </div>
      <div className="flex-1 min-h-0 px-[6px] py-[1px] overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "thin" }}>
        {/* Row 1: Account Status | As of Date */}
        <div className={row2}>
          <div><label className={lbl}>Account Status</label><input readOnly className={`${inp} bg-gray-50`} /></div>
          <div><label className={lbl}>As of Date</label><input readOnly className={`${inp} bg-gray-50`} /></div>
        </div>
        {/* Row 2: Expiration Date | User Level */}
        <div className={row2}>
          <div><label className={lbl}>Expiration Date</label><input readOnly className={`${inp} bg-gray-50`} /></div>
          <div><label className={lbl}>User Level</label><input readOnly className={`${inp} bg-gray-50`} /></div>
        </div>
        {/* Row 3: Write By */}
        <div className={row2}>
          <div className="col-span-2"><label className={lbl}>Write By</label><input readOnly className={`${inp} bg-gray-50`} /></div>
        </div>
      </div>
    </div>
  );
}