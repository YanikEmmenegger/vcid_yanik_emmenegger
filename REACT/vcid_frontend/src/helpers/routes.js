import HomePage from "../pages/HomePage";
import {CiHome, CiSearch, CiUser} from "react-icons/ci";
import SearchPage from "../pages/SearchPage";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";

export const routes = [
    {
        "path": "/",
        "name": "Feed",
        "element": <HomePage/>,
        "icon": CiHome
    },
    {
        "path": "/search",
        "name": "Search",
        "element": <SearchPage/>,
        "icon": CiSearch
    },
    {
        "path": "/profile",
        "name": "Profile",
        "element": <ProfilePage/>,
        "icon": CiUser
    },
    {
        "path": "/user/:id",
        "name": "user",
        "element": <CiSearch/>,
    },
    {
        "path": "/post/:id",
        "name": "post",
        "element": <CiSearch/>,
    },
    {
        "path": "/login",
        "name": "login",
        "element": <LoginPage/>,
    }
]