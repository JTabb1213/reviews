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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const LoginPrompt = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
const NeedToLoginBox = styled_components_1.default.div `
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 20px;
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
const GoBackButton = styled_components_1.default.button `
  background-color: #4285f4;
  color: #fff;
  border: none;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #3367d6;
  }
`;
const LoginButtonStyled = styled_components_1.default.button `
  background-color: #0f9d58;
  color: #fff;
  border: none;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #0a8041;
  }
`;
function BadLoginPage() {
    //const location = useLocation();
    const navigate = react_router_dom_1.useNavigate();
    const [searchParams] = react_router_dom_1.useSearchParams();
    const redirectUrl = searchParams.get('redirect_url') || '';
    const questionMarkIndex = redirectUrl.indexOf('='); //Could not find id query param for some reason, so I just split the string where the '=' was
    const id = questionMarkIndex !== -1 ? redirectUrl.substring(questionMarkIndex + 1) : null;
    react_1.useEffect(() => {
        console.log("Component mounted");
        return () => {
            console.log("Component unmountedffff");
        };
    }, []);
    const handleGoBack = () => {
        navigate(redirectUrl || '/');
    };
    const handleLogin = () => {
        navigate({
            pathname: '/loginpage',
            search: `redirect_url=/reviewpage?id=${id}`,
        });
    };
    return (react_1.default.createElement(LoginPrompt, null,
        react_1.default.createElement(NeedToLoginBox, null,
            "Need to login to add review",
            react_1.default.createElement("br", null),
            react_1.default.createElement("div", { className: 'goBack', style: { display: 'flex', justifyContent: 'center' } },
                react_1.default.createElement(GoBackButton, { onClick: handleGoBack }, "Go back")),
            react_1.default.createElement("div", { className: 'goBack', style: { display: 'flex', justifyContent: 'center' } },
                react_1.default.createElement(LoginButtonStyled, { onClick: handleLogin }, "Login")))));
}
exports.default = BadLoginPage;
