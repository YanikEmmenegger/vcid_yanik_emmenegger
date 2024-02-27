import {FC} from "react";
import PostItem from "./PostItem";

interface UserPostsProps {
    posts: any[];
}

const PostsComponent: FC<UserPostsProps> = ({posts}) => {
    return (
        <div className={"w-full pb-10"}>
            {posts.length > 0 ?
                <div className={"grid grid-cols-1"}>
                    {posts.map((post) => {
                        return (
                            <PostItem post={post} key={post.id}/>
                            )
                    })}
                </div>: <div></div>
            }
        </div>
    );
}

export default PostsComponent;