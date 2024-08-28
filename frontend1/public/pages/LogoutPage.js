"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
function LogoutPage() {
    const navigate = react_router_dom_1.useNavigate();
    const handleClick = () => {
        console.log('Button clicked!');
        navigate('/');
    };
    return (react_1.default.createElement("div", { style: styles.container },
        react_1.default.createElement("h1", { style: styles.heading }, "Successfully logged out, return to search?"),
        react_1.default.createElement("button", { onClick: handleClick, style: styles.button }, "Take me to search")));
}
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    button: {
        padding: '10px 15px',
        fontSize: '16px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};
exports.default = LogoutPage;
