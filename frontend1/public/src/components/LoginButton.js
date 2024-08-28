"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
require("./LoginButton.css");
require("react-slideshow-image/dist/styles.css");
require("./DisplayName.css");
function LoginButton() {
    const navigate = react_router_dom_1.useNavigate();
    const location = react_router_dom_1.useLocation();
    //const 
    const handleLogin = () => {
        //const currentRoute = location.pathname;
        navigate({
            pathname: '/loginpage',
            search: `redirect_url=${location.pathname}${location.search}`,
        });
        //const queryParams = new URLSearchParams(location.search);
        // const id = queryParams.get('id');
        //queryParams.set('redirectRoute', currentRoute);
        // console.log("H", queryParams.toString());
        //const url = `/loginpage?${queryParams.toString()}`;
        //navigate(url);
    };
    return (react_1.default.createElement("button", { onClick: handleLogin, className: "Login-button" }, "login"));
}
exports.default = LoginButton;
