import { getLocalStorage } from '../storage';

export interface Log {
  level: string;
  _id: string;
  message: string;
  action: string;
  createdAt: string;
  __v: number;
}

export async function fetchLogs(): Promise<Log[]> {
  try {
    const authToken = getLocalStorage();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logs`, {
      headers: {
        'x-token': authToken.token || ''
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener logs:', error);
    throw error;
  }
} 