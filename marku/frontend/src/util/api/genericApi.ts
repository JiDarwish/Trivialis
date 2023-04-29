import type { ApiResponse } from "../apiTypes";

const getStoredCredentials = () => {
  const token = localStorage.getItem('token');
  const permissions = localStorage.getItem('permissions');
  return { token, permissions }
}

export const authenticatedFetcher = async (url: string) => {
  const { token } = getStoredCredentials()

  return fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}` 
    }
  }).then(r => r.json())
}

export async function sendAuthenticatedRequestWithBody<T>(url: string, body: any, method = 'POST'): Promise<ApiResponse<T>> {
  const { token } = getStoredCredentials()

  const requestOptions: RequestInit = {
    method: method,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      return { error: response.statusText, success: false}
    }
    return { data: await response.json() as T, success: true }
  } catch (error) {
    return { error: `${error}`, success: false }
  }
}
