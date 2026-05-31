export async function saveUser(form: Record<string, string>, selectedApps: string[], files: FileList | null) {
  const writeremail = localStorage.getItem("email") || "";
  
  const res = await fetch("/api/appuserinfo/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...form, writeremail, selectedApps }),
  });
  const data = await res.json();
  
  if (data.status !== "saved") {
    throw new Error(data.error || "Failed to save.");
  }

  if (files && files.length > 0) {
    const fd = new FormData();
    fd.append("email", form.emailx);
    for (let i = 0; i < Math.min(files.length, 4); i++) {
      fd.append("files", files[i]);
    }
    await fetch("/api/appuserinfo/upload", { method: "POST", body: fd });
  }
}
