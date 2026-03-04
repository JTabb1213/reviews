const AppProps = {
    backend: process.env.REACT_APP_API_URL ?? "http://localhost:80"
};

console.log('[AppProps] REACT_APP_API_URL env var:', JSON.stringify(process.env.REACT_APP_API_URL));
console.log('[AppProps] Resolved backend baseURL:', JSON.stringify(AppProps.backend));

export default AppProps;

