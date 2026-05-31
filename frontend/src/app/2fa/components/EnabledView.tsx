interface Props {
  onDisable: () => void;
  loading: boolean;
}

export default function EnabledView({ onDisable, loading }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-[10px]">
      <p className="text-[10.5pt] text-black">2FA is enabled.</p>
      <button
        onClick={onDisable}
        disabled={loading}
        className="w-[350px] text-[9pt] p-[2px] leading-none bg-white border-t border-b border-[#ff0000] border-l-0 border-r-0 cursor-pointer text-[#ff0000] hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Disable
      </button>
    </div>
  );
}
