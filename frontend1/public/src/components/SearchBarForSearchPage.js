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
const SearchBarForSearchPage = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = react_1.useState('');
    const handleSearch = () => {
        onSearch(searchTerm);
    };
    return (react_1.default.createElement("div", { style: styles.container },
        react_1.default.createElement("input", { type: "text", placeholder: "Enter your search term", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: styles.input }),
        react_1.default.createElement("button", { onClick: handleSearch, style: styles.button }, "Searchvhbjnbvhvgjhbjhbjhbjb")));
};
const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
    },
    input: {
        padding: '10px',
        marginRight: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
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
exports.default = SearchBarForSearchPage;
