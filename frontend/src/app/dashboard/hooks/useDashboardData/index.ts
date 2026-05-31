import { useState } from "react";
import { fetchApps } from "./fetchApps";
import { handleSearch as filterApps } from "./searchHandlers";

interface App {
  appname: string;
  buttonname: string;
}

interface SearchUser {
  emailx: string;
  fname: string;
  lname: string;
}

export function useDashboardData() {
  const [apps, setApps] = useState<App[]>([]);
  const [filtered, setFiltered] = useState<App[]>([]);
  const [searchList, setSearchList] = useState<SearchUser[]>([]);

  async function loadApps(userEmail: string) {
    const data = await fetchApps(userEmail);
    setApps(data.apps);
    setFiltered(data.apps);
    setSearchList(data.searchList);
  }

  function handleSearch(query: string) {
    const result = filterApps(query, apps);
    setFiltered(result);
  }

  return { apps, filtered, searchList, loadApps, handleSearch };
}
