export async function submitEmail(email: string) {
  if (!email) return { status: "error" };
  
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return await res.json();
}
