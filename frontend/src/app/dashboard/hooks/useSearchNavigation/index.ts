import { useState } from "react";
import { handlePrev as prev } from "./handlePrev";
import { handleNext as next } from "./handleNext";

interface SearchUser {
  emailx: string;
  fname: string;
  lname: string;
}

export function useSearchNavigation(searchList: SearchUser[]) {
  const [searchVal, setSearchVal] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);

  function handlePrev() {
    prev(searchList, searchIndex, setSearchIndex, setSearchVal);
  }

  function handleNext() {
    next(searchList, searchIndex, setSearchIndex, setSearchVal);
  }

  return { searchVal, setSearchVal, handlePrev, handleNext };
}
