import React, {FC} from "react";
import {Link} from "react-router-dom";
import IconButton from "./IconButton";
import {CiEdit} from "react-icons/ci";
import {useCookies} from "react-cookie";
import usePostModal from "./usePostModal";
import LoadingIndicator from "./LoadingIndicator";

interface PostAuthorProps {
    user: any;
    edited?: string;
}

const PostAuthor: FC<PostAuthorProps> = ({user, edited}) => {



    return (

        <div className={"flex flex-row pb-2 mb-2 border-b-2 border-b-neutral-700"}>
            {user.username === '' ? <LoadingIndicator fontSize={"25px"} active={true}/> : <>
            <Link to={user.link}>
                <span className={"text-[10pt]"}>
                    {user.avatar}
                </span>
                <span className={"text-[10pt] ml-2"}>
                    {user.username === '' ? <LoadingIndicator fontSize={"10px"} active={true}/> : user.username}
                </span>
                <span className={"text-[10pt] ml-2"}>
                {edited ? "edited" : ""}
                </span>
            </Link>
            </>}

        </div>
    );
}

export default PostAuthor;