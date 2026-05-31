interface Props {
  onSetup: () => void;
  loading: boolean;
}

export default function DisabledView({ onSetup, loading }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-[10px]">
      <p className="text-[10.5pt] text-black">2FA is not enabled.</p>
      <button
        onClick={onSetup}
        disabled={loading}
        className="w-[350px] text-[9pt] p-[2px] leading-none bg-white border-t border-b border-black border-l-0 border-r-0 cursor-pointer hover:bg-[#f0f0f0] transition-colors disabled:opacity-50"
      >
        Setup 2FA
      </button>
    </div>
  );
}
