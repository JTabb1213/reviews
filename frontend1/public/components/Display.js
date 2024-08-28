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
const react_2 = require("react");
const HttpClient_1 = require("../HttpClient");
require("react-slideshow-image/dist/styles.css");
require("./Display.css");
function DisplayResults() {
    const location = react_router_dom_1.useLocation();
    const httpClient = HttpClient_1.useHttpClient();
    //const [photos, setPhotos] = useState([]);
    const [photoURLs, setPhotoURLs] = react_2.useState([]);
    const [name, setName] = react_2.useState("");
    react_2.useEffect(() => {
        const getData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const params = new URLSearchParams(location.search);
                const id = params.get('id');
                //const h = params.get();
                //console.log("test", h);
                const response = yield httpClient.get(`/api/searchByGoogleId?id=${id}`);
                console.log(response.data);
                // setPhotos(response.data.result.photos);
                setName(response.data.result.name);
                if (response.data.result.photos) {
                    console.log("photos are here");
                    const urls = yield Promise.all(response.data.result.photos.map((photo) => __awaiter(this, void 0, void 0, function* () {
                        const photoReference = photo.photo_reference;
                        const url = yield getPhotosFromBackend(photoReference);
                        return url;
                    })));
                    setPhotoURLs(urls);
                }
                else {
                    console.log("no photos");
                }
            }
            catch (error) {
                console.error("error getting res info: ", error);
            }
        });
        getData();
    });
    const getPhotosFromBackend = (photoReference) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield httpClient.get(`/api/getPhotos?ref=${photoReference}`);
            return response.data;
        }
        catch (error) {
            console.error("error");
        }
    });
    return (react_1.default.createElement("div", { className: "photos-container" },
        react_1.default.createElement("div", { className: "photos-wrapper" }, photoURLs.length === 0 ? (react_1.default.createElement("div", null,
            "No photos for ",
            name,
            "!")) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: "Restaurant-Name" }, name),
            photoURLs.map((url, index) => (react_1.default.createElement("img", { key: index, src: url, alt: `{index}`, className: "photo" }))))))));
}
exports.default = DisplayResults;
