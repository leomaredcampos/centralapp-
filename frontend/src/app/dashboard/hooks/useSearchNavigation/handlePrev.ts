interface SearchUser {
  emailx: string;
  fname: string;
  lname: string;
}

export function handlePrev(
  searchList: SearchUser[],
  searchIndex: number,
  setSearchIndex: (index: number) => void,
  setSearchVal: (val: string) => void
) {
  if (searchList.length === 0) return;
  const prev = (searchIndex - 1 + searchList.length) % searchList.length;
  setSearchIndex(prev);
  setSearchVal(searchList[prev].emailx);
}
