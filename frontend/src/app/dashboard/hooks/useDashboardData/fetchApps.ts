interface App {
  appname: string;
  buttonname: string;
}

interface SearchUser {
  emailx: string;
  fname: string;
  lname: string;
}

export async function fetchApps(userEmail: string) {
  const res = await fetch("/api/get-apps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userEmail }),
  });
  const apps = await res.json();

  const res2 = await fetch("/api/appuserinfo/list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const searchList = await res2.json();

  return {
    apps: apps as App[],
    searchList: Array.isArray(searchList) ? (searchList as SearchUser[]) : [],
  };
}
