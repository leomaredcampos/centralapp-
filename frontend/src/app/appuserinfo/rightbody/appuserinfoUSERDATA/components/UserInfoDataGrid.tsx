"use client";

import { useState } from "react";

interface User {
  emailx: string;
  fname: string;
  lname: string;
  writemade: string;
  datemade: string;
  expirationdate: string;
  writeremail: string;
}

interface Props {
  users: User[];
  onPrev?: () => void;
  onNext?: () => void;
  maxRows?: number;
}

const btnClass = "px-[8px] py-[1px] bg-white border-[0.25px] border-black cursor-pointer hover:bg-gray-50";

export default function UserInfoDataGrid({ users, onPrev, onNext, maxRows }: Props) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const displayUsers = maxRows ? users.slice(0, maxRows) : users;

  function toggleRow(emailx: string) {
    setSelectedRows((prev) => prev.includes(emailx) ? prev.filter((e) => e !== emailx) : [...prev, emailx]);
  }

  return (
    <div className="flex flex-col rounded-lg shadow-sm bg-white" style={{ overflow: "hidden" }}>
      <div className="flex-shrink-0 px-[6px] py-[2px] border-b-[0.25px] border-black bg-gray-50 flex flex-wrap items-center gap-[4px]">
        <input placeholder="Type to search..." className="p-[1px] border-[0.25px] border-black outline-none" style={{ width: "25.5%" }} />
        <span className="text-black">Search</span>
        <button onClick={onPrev} className={btnClass}>Prev</button>
        <button onClick={onNext} className={btnClass}>Next</button>
        <span className="text-black">Module Access</span>
        <input placeholder="Select modules..." className="p-[1px] border-[0.25px] border-black outline-none" style={{ width: "18.3%" }} />
        <button className={btnClass}>Update</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent", position: "relative" }}>
        <table style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%" }}>
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr className="border-b-[0.25px] border-black">
              <th className="px-[6px] py-[3px] text-black font-normal bg-gray-50" style={{ width: "2.2%", position: "sticky", left: 0, zIndex: 20 }}>
                <input type="checkbox" style={{ width: "1em", height: "1em" }} />
              </th>
              <th className="text-left px-[6px] py-[3px] text-black font-normal bg-gray-50" style={{ width: "29.1%", position: "sticky", left: "2.2%", zIndex: 20 }}>Employee Email Address</th>
              <th className="text-left px-[6px] py-[3px] text-black font-normal bg-gray-50" style={{ width: "9.1%", position: "sticky", left: "31.3%", zIndex: 20 }}>Account Status</th>
              <th className="text-left px-[6px] py-[3px] text-black font-normal bg-gray-50" style={{ width: "13.6%" }}>As Date of</th>
              <th className="text-left px-[6px] py-[3px] text-black font-normal bg-gray-50" style={{ width: "13.6%" }}>Expiration Date</th>
              <th className="text-left px-[6px] py-[3px] text-black font-normal bg-gray-50" style={{ width: "31.8%" }}>Written By</th>
            </tr>
          </thead>
          <tbody>
            {displayUsers.map((u, i) => (
              <tr key={i} className="border-b-[0.25px] border-black hover:bg-gray-50 cursor-pointer">
                <td className="px-[6px] py-[2px] text-center bg-white" style={{ position: "sticky", left: 0, zIndex: 10, width: "2.2%" }}>
                  <input type="checkbox" checked={selectedRows.includes(u.emailx)} onChange={() => toggleRow(u.emailx)} style={{ width: "1em", height: "1em" }} />
                </td>
                <td className="px-[6px] py-[2px] bg-white" style={{ position: "sticky", left: "2.2%", zIndex: 10, width: "29.1%" }}>{u.emailx}</td>
                <td className="px-[6px] py-[2px] bg-white" style={{ position: "sticky", left: "31.3%", zIndex: 10, width: "9.1%" }}>{u.writemade || "-"}</td>
                <td className="px-[6px] py-[2px]">{u.datemade ? new Date(u.datemade).toLocaleDateString() : "-"}</td>
                <td className="px-[6px] py-[2px]">{u.expirationdate ? new Date(u.expirationdate).toLocaleDateString() : "-"}</td>
                <td className="px-[6px] py-[2px]">{u.writeremail || "-"}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} className="px-[6px] py-[2px] text-black">No records</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
