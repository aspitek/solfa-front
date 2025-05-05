export type User = {
  username: string,
  email: string,
  is_admin: boolean,
  jti: string,
  iss: string,
  exp: number,
  iat: number
};

export type Partition = {
  id: number,
  title: string,
  composer: string,
  genre: string,
  category: string,
  release_date: Date,
  partition_file: string
};

export type SelectableI = {
  label: string,
  value: string
};
