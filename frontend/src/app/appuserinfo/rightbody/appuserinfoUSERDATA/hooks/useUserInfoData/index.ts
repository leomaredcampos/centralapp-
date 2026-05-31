import { useState, useEffect } from "react";
import { fetchAvailableApps } from "./fetchApps";
import { fetchUsersList } from "./fetchUsers";

interface User {
  emailx: string;
  fname: string;
  lname: string;
  writemade: string;
  datemade: string;
  expirationdate: string;
  writeremail: string;
}

export function useUserInfoData() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchIndex, setSearchIndex] = useState(0);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const data = await fetchUsersList();
    setUsers(data);
  }

  function handlePrev() {
    if (users.length === 0) return;
    setSearchIndex((searchIndex - 1 + users.length) % users.length);
  }

  function handleNext() {
    if (users.length === 0) return;
    setSearchIndex((searchIndex + 1) % users.length);
  }

  return { users, searchIndex, handlePrev, handleNext };
}
