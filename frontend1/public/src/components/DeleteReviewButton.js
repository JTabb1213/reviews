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
//import { /*useNavigate,*/ useLocation } from 'react-router-dom';
//import { useState } from 'react';
//import { Grid } from "@mui/material";
require("./SearchButton.css");
function DeleteReviewButton({ username, query }) {
    // const navigate = useNavigate();
    //const location = useLocation();
    const httpClient = HttpClient_1.useHttpClient();
    //const { search } = useLocation();
    //const queryParams = new URLSearchParams(search);
    console.log("got username", username);
    console.log("Id", query);
    const handleAddReview = (event) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete your review?");
            if (confirmDelete) {
                const response = httpClient.delete(`/api/deleteRev?user=${username}&id=${query}`);
                console.log(response);
                window.location.reload();
            }
        }
        catch (error) {
            console.error("error deleting review", error);
        }
    });
    return (react_1.default.createElement("button", { onClick: handleAddReview, className: "Add-review-button" }, "Delete your review"));
}
exports.default = DeleteReviewButton;
