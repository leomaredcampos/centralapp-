import { useState, useEffect } from "react";
import { fetchAvailableApps } from "../useUserInfoData/fetchApps";

export function useAppAccess() {
  const [appList, setAppList] = useState<{ appname: string; buttonname: string }[]>([]);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  useEffect(() => {
    loadApps();
  }, []);

  async function loadApps() {
    const data = await fetchAvailableApps();
    setAppList(data);
  }

  function toggleApp(appname: string) {
    setSelectedApps((prev) =>
      prev.includes(appname) ? prev.filter((a) => a !== appname) : [...prev, appname]
    );
  }

  return { appList, selectedApps, toggleApp };
}
