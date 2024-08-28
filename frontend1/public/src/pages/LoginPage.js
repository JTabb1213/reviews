"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const HttpClient_1 = require("../HttpClient");
//import { useEffect } from 'react';
require("./LoginPage.css");
function LoginPage() {
    const httpClient = HttpClient_1.useHttpClient();
    const navigate = react_router_dom_1.useNavigate();
    //const location = useLocation();
    const [searchParams] = react_router_dom_1.useSearchParams();
    const redirectUrl = searchParams.get('redirect_url');
    const [username, setUsername] = react_1.useState("");
    const [password, setPassword] = react_1.useState("");
    const [error, setError] = react_1.useState(null);
    const [working, setWorking] = react_1.useState(null);
    const [user, setUser] = react_1.useState(null);
    const onButtonClick = () => {
        setError(null);
        setWorking(true);
        httpClient.post('/api/login', {
            username: username,
            password: password
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(result => {
            console.log("result of login:", result);
            setUser(result.data.username);
            console.log("user", user);
            navigate(redirectUrl || '/');
        }).catch(err => {
            console.log("error: ", err);
            setError(err.response.data.message);
        }).finally(() => {
            setWorking(false);
        });
    };
    const onRegisterClicked = () => {
        navigate({
            pathname: '/register',
            search: `redirect_url=${redirectUrl}`,
        });
    };
    return (react_1.default.createElement("div", { className: "login-container" },
        react_1.default.createElement("h1", null, "Login"),
        react_1.default.createElement("div", { className: "input-container" },
            react_1.default.createElement("label", null,
                "Username:",
                react_1.default.createElement("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: "login-input" })),
            react_1.default.createElement("br", null),
            react_1.default.createElement("label", null,
                "Password:",
                react_1.default.createElement("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "login-input" }))),
        error && react_1.default.createElement("div", { className: "error-message" }, error),
        react_1.default.createElement("div", { className: "button-container" },
            react_1.default.createElement("button", { onClick: onButtonClick, className: "login-button", disabled: working !== null && working !== void 0 ? working : false }, working ? "logging in..." : "Login"),
            react_1.default.createElement("button", { onClick: onRegisterClicked, className: "register-button" }, "Register"))));
}
exports.default = LoginPage;
