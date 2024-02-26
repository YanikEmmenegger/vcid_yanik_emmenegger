import {FC} from "react";
import {Link} from "react-router-dom";

interface PostAuthorProps {
    user: any;
    edited?: string;
}

const PostAuthor: FC<PostAuthorProps> = ({user, edited}) => {
    return (

            <div className={"flex pb-2 mb-2 border-b-2 border-b-neutral-700"}>
                <Link to={user.link}>
                <span className={"text-[10pt]"}>
                    {user.avatar}
                </span>
                    <span className={"text-[10pt] ml-2"}>
                    {user.username}
                </span>
                <span className={"text-[10pt] ml-2"}>
                {edited ? "edited" : ""}
                </span>
                </Link>
            </div>
    );
}

export default PostAuthor;