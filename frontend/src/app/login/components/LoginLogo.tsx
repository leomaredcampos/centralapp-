import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoginLogo() {
  const [imgWidth, setImgWidth] = useState(150);
  const [imgHeight, setImgHeight] = useState(150);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/api/company-logo?type=login&id=1";
    img.onload = () => {
      if (img.naturalWidth !== img.naturalHeight) {
        setImgWidth(300);
        setImgHeight(50);
      }
    };
  }, []);

  return (
    <Image
      src="/api/company-logo?type=login&id=1"
      alt="Logo"
      width={imgWidth}
      height={imgHeight}
      style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
      priority
    />
  );
}
