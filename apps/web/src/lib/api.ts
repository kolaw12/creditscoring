const API_BASE = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? "" : "http://localhost:5000");

interface ApiOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  status: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, code?: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  endpoint: string;
  options: ApiOptions;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.options.headers = {
        ...prom.options.headers,
        Authorization: `Bearer ${token}`,
      };
      request(prom.endpoint, prom.options).then(prom.resolve).catch(prom.reject);
    }
  });
  failedQueue = [];
};

async function request<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (typeof window !== "undefined") {
    const stored = localStorage.getItem("accessToken");
    if (stored) headers["Authorization"] = `Bearer ${stored}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && !options.token && typeof window !== "undefined") {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken && !endpoint.includes("/auth/refresh") && !endpoint.includes("/auth/login")) {
      if (isRefreshing) {
        return new Promise<T>((resolve, reject) => {
          failedQueue.push({ resolve: resolve as any, reject, endpoint, options });
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        const refreshData = await refreshRes.json();

        if (refreshRes.ok && refreshData.data?.accessToken) {
          const newAccessToken = refreshData.data.accessToken;
          const newRefreshToken = refreshData.data.refreshToken;

          localStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

          processQueue(null, newAccessToken);

          headers["Authorization"] = `Bearer ${newAccessToken}`;
          const retryRes = await fetch(`${API_BASE}${endpoint}`, {
            ...fetchOptions,
            headers,
          });
          const retryData = await retryRes.json();
          if (!retryRes.ok) {
            throw new ApiError(
              retryData.message || "An error occurred",
              retryRes.status,
              retryData.code,
              retryData.errors
            );
          }
          return retryData as T;
        } else {
          processQueue(new Error("Session expired"), null);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }
  }

  if (!res.ok) {
    throw new ApiError(
      data.message || "An error occurred",
      res.status,
      data.code,
      data.errors
    );
  }

  return data;
}

export const api = {
  get: <T = unknown>(endpoint: string, options?: ApiOptions) =>
    request<T>(endpoint, { method: "GET", ...options }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: ApiOptions) =>
    request<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined, ...options }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: ApiOptions) =>
    request<T>(endpoint, { method: "PUT", body: body ? JSON.stringify(body) : undefined, ...options }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: ApiOptions) =>
    request<T>(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined, ...options }),

  delete: <T = unknown>(endpoint: string, options?: ApiOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
};

export { ApiError };
export type { ApiOptions };
