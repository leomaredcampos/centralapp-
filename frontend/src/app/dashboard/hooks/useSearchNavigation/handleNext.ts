interface SearchUser {
  emailx: string;
  fname: string;
  lname: string;
}

export function handleNext(
  searchList: SearchUser[],
  searchIndex: number,
  setSearchIndex: (index: number) => void,
  setSearchVal: (val: string) => void
) {
  if (searchList.length === 0) return;
  const next = (searchIndex + 1) % searchList.length;
  setSearchIndex(next);
  setSearchVal(searchList[next].emailx);
}
