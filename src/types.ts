
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
  alt?: string;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type Absence = {
  player_id : string,
  start_date : number,
  end_date : number,
  reason : string
}
