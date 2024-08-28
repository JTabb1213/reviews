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
const HttpClient_1 = require("../HttpClient");
const react_router_dom_1 = require("react-router-dom");
//import { useState } from 'react';
require("./SearchButton.css");
function AddReviewButton() {
    const navigate = react_router_dom_1.useNavigate();
    const location = react_router_dom_1.useLocation();
    const httpClient = HttpClient_1.useHttpClient();
    const handleAddReview = (event) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        try {
            const response = yield httpClient.post(`/api/seeIfLoggedIn`);
            console.log('Backend response:', response.data);
            navigate({
                pathname: '/reviewpage',
                search: `${location.search}&redirect_url=/displaypage${location.search}`,
            });
        }
        catch (error) {
            console.log('Error calling backend for nearby restaurants:', error);
            if (error.response && error.response.status === 401) {
                console.log("TTTTT", typeof (error));
                navigate({
                    pathname: '/needtologin',
                    search: `redirect_url=${location.pathname}${location.search}`,
                });
            }
        }
    });
    return (react_1.default.createElement("button", { onClick: handleAddReview, className: "Add-review-button" }, "Review this place"));
}
exports.default = AddReviewButton;
