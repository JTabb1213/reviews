"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
require("./SearchButton.css");
function SearchButton() {
    const navigate = react_router_dom_1.useNavigate();
    const handleSearch = (event) => {
        event.preventDefault();
        navigate('/');
    };
    return (react_1.default.createElement("button", { onClick: handleSearch, className: "Search-button" }, "Go back to search"));
}
exports.default = SearchButton;
