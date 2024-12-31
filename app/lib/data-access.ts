import type { User, UserItem } from "./definitions";

export async function getSessionCookie(request?: Request) {
  if (typeof document !== "undefined") {
    // Client-side environment
    const cookies = document.cookie
      .split("; ")
      .reduce((acc, cookie) => {
        const [name, ...rest] = cookie.split("=");
        acc[name] = decodeURIComponent(rest.join("="));
        return acc;
      }, {} as Record<string, string>);
    return cookies["connect.sid"];
  } else if (request) {
    // Server-side environment
    const cookies = request.headers.get("cookie") || "";
    return cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("connect.sid="))
      ?.split("=")[1];
  }

  return null;
}

export async function ensureAuthenticated(request: Request) {
  // Check if there's a session cookie
  
  const sessionCookie = await getSessionCookie(request);

  if (!sessionCookie) {
    return false; // Redirect to login if no session cookie
  }

  // Verify session by calling the server
  try {
    const response = await fetch(`${import.meta.env.VITE_NETLY_HOST}/auth/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `connect.sid=${sessionCookie}`, // Pass the session cookie in the request
      }
    });

    if (!response.ok) {
      return false; // Redirect to login if server responds with 401 or other errors
    }
  } catch (_error) {
    return false; // Redirect to login if an error occurs while checking authentication
  }

  return true; // User is authenticated, continue processing
}

// Function to make requests with the session cookie, ensuring the session is valid
async function requestWithSession(request: Request, url: string, init?: RequestInit) {
  const sessionCookie = await getSessionCookie(request);

  // Set up headers with the session cookie
  const headers = {
    ...init?.headers,
    ...(sessionCookie && { Cookie: `connect.sid=${sessionCookie}` }), // Attach session cookie to headers
  };

  // Make the request with the provided URL, init, and session cookie
  return fetch(`${import.meta.env.VITE_NETLY_HOST}${url}`, {
    ...init, // Include other init options (e.g., method, body)
    headers,
    credentials: 'include', // Ensure credentials (cookies) are sent
  });
}

export async function getCurrentUser(request: Request): Promise<User | null> {
  
  try {
    const response = await requestWithSession(request, '/api/user', 
      { headers: { 'Content-Type': 'applicaiton/json' }})
    
    if (!response.ok) {
      return null
    }
    
    return (await response.json()) as User
  } catch (_error) {
    return null
  }
}

export async function getUserItems(request: Request): Promise<UserItem[]> {
  
  try {
    const response = await requestWithSession(request, '/api/items',
      { headers: { 'Content-Type': 'application/json' }}
    )
    
    if (!response.ok) {
      return []
    }
    
    return (await response.json()) as UserItem[] 
  } catch(_error) {
    console.error('Error getting user items')
    return []
  }
}