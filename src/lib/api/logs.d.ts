export interface Log {
  level: string;
  _id: string;
  message: string;
  action: string;
  createdAt: string;
  __v: number;
}

export function fetchLogs(): Promise<Log[]>; 