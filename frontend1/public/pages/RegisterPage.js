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
//import { useEffect } from 'react';
const react_router_dom_1 = require("react-router-dom");
const HttpClient_1 = require("../HttpClient");
const react_loader_spinner_1 = require("react-loader-spinner"); //for loading wheel
require("./LoginPage.css");
function Register() {
    const httpClient = HttpClient_1.useHttpClient();
    const navigate = react_router_dom_1.useNavigate();
    //const location = useLocation();
    const [searchParams] = react_router_dom_1.useSearchParams();
    const redirectUrl = searchParams.get('redirect_url');
    //const [searchParams] = useSearchParams();
    const [username, setUsername] = react_1.useState("");
    const [password, setPassword] = react_1.useState("");
    const [email, setEmail] = react_1.useState("");
    const [confirmPass, setConfirmPass] = react_1.useState("");
    const [error, setError] = react_1.useState(null);
    // const [previousRoute, setPreviousRoute] = useState("");
    const [working, setWorking] = react_1.useState(null);
    const handleTakeMeHome = () => {
        navigate('/');
    };
    const handleCreateAccount = () => {
        //setWorking(true);
        setError("");
        if (password !== confirmPass) {
            setError("Passwords have to match");
            return;
        }
        setWorking(true);
        // console.log("U", username);
        httpClient.post('/api/createUser', {
            email: email,
            username: username,
            password: password
        }).then(result => {
            console.log(result);
            navigate({
                pathname: '/loginpage',
                search: `redirect_url=${redirectUrl}`
            });
        }).catch(err => {
            console.log("Error", err);
            setError(err.response.data.message);
        }).finally(() => {
            setWorking(false);
        });
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        working && (react_1.default.createElement("div", { className: 'loadWheelRegister', style: { display: 'flex', justifyContent: 'center' } },
            react_1.default.createElement(react_loader_spinner_1.ColorRing, null))),
        !working && (react_1.default.createElement("div", { className: "login-container" },
            react_1.default.createElement("h1", null, "Create Account"),
            react_1.default.createElement("div", { className: "input-container" },
                react_1.default.createElement("label", null,
                    "Email:",
                    react_1.default.createElement("input", { type: "text", value: email, onChange: (e) => setEmail(e.target.value), className: "login-input" })),
                react_1.default.createElement("label", null,
                    "Username:",
                    react_1.default.createElement("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: "login-input" })),
                react_1.default.createElement("br", null),
                react_1.default.createElement("label", null,
                    "Password:",
                    react_1.default.createElement("input", { type: "text", value: password, onChange: (e) => setPassword(e.target.value), className: "login-input" })),
                react_1.default.createElement("label", null,
                    "Confirm Password:",
                    react_1.default.createElement("input", { type: "confirmPassword", value: confirmPass, onChange: (e) => setConfirmPass(e.target.value), className: "login-input" }))),
            error && react_1.default.createElement("div", { className: "error-message" }, error),
            react_1.default.createElement("div", { className: "button-container" },
                react_1.default.createElement("button", { onClick: handleCreateAccount, className: "login-button", disabled: working !== null && working !== void 0 ? working : false }, working ? "Creating account..." : "Create Account"),
                react_1.default.createElement("button", { onClick: handleTakeMeHome, className: "take-me-home-button", disabled: working !== null && working !== void 0 ? working : false }, working ? "Going back..." : "Take me back"))))));
}
exports.default = Register;
