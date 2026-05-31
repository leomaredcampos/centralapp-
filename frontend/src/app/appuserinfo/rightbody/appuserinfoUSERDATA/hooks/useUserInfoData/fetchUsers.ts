export async function fetchUsersList() {
  const res = await fetch("/api/appuserinfo/list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
