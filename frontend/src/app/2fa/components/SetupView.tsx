interface Props {
  qr: string;
  code: string;
  setCode: (val: string) => void;
  onVerify: () => void;
  loading: boolean;
}

export default function SetupView({ qr, code, setCode, onVerify, loading }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-[10px]">
      <p className="text-[10.5pt] text-[#333]">Scan this QR code using Microsoft Authenticator</p>
      {qr && <img src={qr} alt="QR Code" width={200} height={200} />}
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !loading && onVerify()}
        maxLength={6}
        placeholder="Enter Code"
        disabled={loading}
        autoFocus
        className="w-[350px] text-[9pt] p-[2px] border border-[#333] outline-none text-center tracking-[4px] disabled:opacity-50"
      />
      <p className="text-[9pt] text-center text-[#333] mt-[2px] mb-0">Authenticator Code</p>
      <button
        onClick={onVerify}
        disabled={loading}
        className="w-[350px] text-[9pt] p-[2px] leading-none bg-white border-t border-b border-[#333] border-l-0 border-r-0 cursor-pointer hover:bg-[#f0f0f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Verify
      </button>
    </div>
  );
}
