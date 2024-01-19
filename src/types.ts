
export type AppErrorData = {
  action?: string;
  message: string;
  name: string;
  onRetry: () => void;
};

export type BuildPlayer = {
  id: string;
  name: string;
  realm?: string;
  class: string;
  spec?: string;
  race?: string;
  raid: number;
  status: string;
  group?: string;
  oldName?: string;
  main?: string;
};

export type ConnectionString = {
  server?: string;
  port?: string;
  database?: string;
  uid?: string;
  password?: string;
  table?: string;
  name?: string;
  startDate?: number;
  endDate?: number;
  reason?: string;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type Absence = {
  playerId : string,
  startDate : number,
  endDate : number,
  reason : string
}
