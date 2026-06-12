"use client";

interface Props {
  message: string;
  onClose: () => void;
}

export default function MessageModal({ message, onClose }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white border border-black shadow p-6 flex flex-col items-center gap-4 min-w-[260px]">
        <p className="text-black text-center">{message}</p>
        <button
          onClick={onClose}
          autoFocus
          className="w-[120px] p-[2px] bg-white border-t-[0.25px] border-b-[0.25px] border-black border-l-0 border-r-0 cursor-pointer hover:bg-[#f0f0f0] transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}
