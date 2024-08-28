"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const HttpClient_1 = require("../HttpClient");
require("./LoginButton.css");
require("react-slideshow-image/dist/styles.css");
require("./DisplayName.css");
function LogoutButton() {
    const navigate = react_router_dom_1.useNavigate();
    const httpClient = HttpClient_1.useHttpClient();
    //const 
    const handleLogout = () => __awaiter(this, void 0, void 0, function* () {
        httpClient.post(`/api/logout`).then(result => {
            console.log("successfully logged out");
        }).catch(err => {
            console.log("error logging out", err);
        });
        navigate({
            pathname: '/logoutpage',
        });
    });
    return (react_1.default.createElement("button", { onClick: handleLogout, className: "Login-button" }, "Logout"));
}
exports.default = LogoutButton;
