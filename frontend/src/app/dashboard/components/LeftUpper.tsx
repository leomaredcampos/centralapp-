import Image from "next/image";

export default function LeftUpper() {
  return (
    <div className="h-[5%] border border-gray-300 flex items-center justify-center">
      <Image src="/logo.png" alt="Logo" width={100} height={100} style={{ objectFit: "contain" }} />
    </div>
  );
}
