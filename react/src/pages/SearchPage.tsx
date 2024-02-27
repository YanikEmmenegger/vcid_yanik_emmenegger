import React, {useCallback, useEffect, useState} from 'react';
import Input from "../components/Input";
import LoadingIndicator from "../components/LoadingIndicator";
import PostsComponent from "../components/PostsComponent";
import axios from "axios";
import toast from "react-hot-toast";
import RadioSelector from "../components/RadioSelector";
import UsersComponent from "../components/UsersComponent";
import usersComponent from "../components/UsersComponent";

const SearchPage: React.FC = () => {

    const [search, setSearch] = useState<string>("");
    const [searchType, setSearchType] = useState<string>("users");
    const [loading, setLoading] = useState<boolean>(false);
    const [posts, setPosts] = useState<any>([]);
    const [users, setUsers] = useState<any>([]);

    const handleInputChange = () => (e: any) => {
        setSearch(e.target.value);
    }

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true); // Aktivieren des Ladestatus vor dem API-Aufruf
            const response = await axios.get(`api/user?name=${search}`);
            setUsers(response.data.data.users);
            setLoading(false);
        } catch (e) {
            toast.error("An error occurred while trying to get users! Try again later!");
            setLoading(false);
        }
    }, [search, setUsers, setLoading]); // Abhängigkeiten

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true); // Aktivieren des Ladestatus vor dem API-Aufruf
            const response = await axios.get(`api/post?limit=100&query=${search}`);
            setPosts(response.data.data.posts);
            setLoading(false);
        } catch (e) {
            toast.error("An error occurred while trying to get posts! Try again later!");
            setLoading(false);
        }
    }, [search, setPosts, setLoading]); // Abhängigkeiten
    const changeSearchType = (type: string) => {
        if (type === "posts" || type === "users") {
            setSearchType(type)
        }
    }
    const loadContent = () => {

        if (searchType === "posts") {
            return posts.length > 0 ? <PostsComponent posts={posts}/> : <p className={"text-center"}>No results found</p>
        }
        if (searchType === "users") {
            return users.length > 0 ? <UsersComponent users={users}/> : <p className={"text-center"}>No results found</p>
        }
    }

    useEffect(() => {
        //fetchdata if search is not empty and at least 3 characters and not typing for 1 sec
        if (search.length > 1) {
            setLoading(true)
            const timeout = setTimeout(() => {
                axios.CancelToken.source().cancel('Operation canceled by the user.');
                switch (searchType) {
                    case "users":
                        fetchUsers()
                        break;
                    case "posts":
                        fetchPosts()
                        break;
                    default:
                        break;
                }
            }, 1000)
            return () => clearTimeout(timeout)
        }
    }, [fetchPosts, fetchUsers, search, searchType]);

    return (
        <div className={"mt-3"}>
            <h1 className={"text-2xl"}>Search</h1>
            <Input placeholder={"Search for Posts or Users"} type={"text"} name={"search"} value={search}
                   onChange={handleInputChange()}/>
            <div className={"flex w-full mb-5 justify-between"}>
                <RadioSelector active={searchType === 'users'} onClick={changeSearchType} name="Users"/>
                <RadioSelector active={searchType === 'posts'} onClick={changeSearchType} name="Posts"/>
            </div>
            <div className={"flex flex-col justify-around pb-48"}>
                {loading ? <LoadingIndicator active={loading}/> : <>
                    {loadContent()}
                </>}
            </div>
        </div>
    );
};

export default SearchPage;
