// App-specific constants
export const appConfig = {
    name: "MyCloud",
    version: "1.0.0",
    apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
    endpoints: {
        health: "/health",
        postgres: "/postgres",
        minio: "/minio"
    },
};