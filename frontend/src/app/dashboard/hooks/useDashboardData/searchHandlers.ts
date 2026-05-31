interface App {
  appname: string;
  buttonname: string;
}

export function handleSearch(query: string, apps: App[]) {
  if (!query.trim()) {
    return apps;
  }
  const q = query.toLowerCase();
  return apps.filter((a) => a.buttonname.toLowerCase().includes(q));
}
