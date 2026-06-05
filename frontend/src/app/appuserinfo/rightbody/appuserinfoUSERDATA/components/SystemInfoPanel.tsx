"use client";

const lbl = "text-black leading-none ";
const inp = "w-full p-[1px] border-[0.25px] border-black outline-none ";
const row2 = "grid grid-cols-2 gap-[2px] mb-[1px]";

interface Props {
  isPortrait?: boolean;
}

export default function SystemInfoPanel({ isPortrait }: Props) {
  const fields = (
    <div className="px-[6px] py-[1px]">
      <div className={row2}>
        <div><label className={lbl}>Account Status</label><input readOnly className={`${inp} bg-gray-50`} /></div>
        <div><label className={lbl}>As of Date</label><input readOnly className={`${inp} bg-gray-50`} /></div>
      </div>
      <div className={row2}>
        <div><label className={lbl}>Expiration Date</label><input readOnly className={`${inp} bg-gray-50`} /></div>
        <div><label className={lbl}>User Level</label><input readOnly className={`${inp} bg-gray-50`} /></div>
      </div>
      <div className={row2}>
        <div className="col-span-2"><label className={lbl}>Write By</label><input readOnly className={`${inp} bg-gray-50`} /></div>
      </div>
    </div>
  );

  const header = (
    <div className="flex-shrink-0 px-[6px] py-[1px] border-b-[0.25px] border-black bg-gray-50">
      <span className="text-black ">System Information</span>
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
