export async function fetchAvailableApps() {
  const res = await fetch("/api/get-available-apps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
