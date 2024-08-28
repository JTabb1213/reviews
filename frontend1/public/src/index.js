"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const react_router_dom_1 = require("react-router-dom");
const SearchPage_1 = __importDefault(require("./pages/SearchPage"));
const DisplayPage_1 = __importDefault(require("./pages/DisplayPage"));
const LoginPage_1 = __importDefault(require("./pages/LoginPage"));
const RegisterPage_1 = __importDefault(require("./pages/RegisterPage"));
const ReviewPage_1 = __importDefault(require("./pages/ReviewPage"));
const BadLoginPage_1 = __importDefault(require("./pages/BadLoginPage"));
const LogoutPage_1 = __importDefault(require("./pages/LogoutPage"));
function App() {
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement(react_router_dom_1.Routes, null,
            react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(SearchPage_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/displaypage", element: react_1.default.createElement(DisplayPage_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/loginpage", element: react_1.default.createElement(LoginPage_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/register", element: react_1.default.createElement(RegisterPage_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/reviewpage", element: react_1.default.createElement(ReviewPage_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/needtologin", element: react_1.default.createElement(BadLoginPage_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/logoutpage", element: react_1.default.createElement(LogoutPage_1.default, null) }))));
}
exports.default = App;
const root = client_1.createRoot(document.getElementById('root')); // Use createRoot from react-dom
root.render(react_1.default.createElement(react_1.default.StrictMode, null,
    react_1.default.createElement(App, null)));
