import {FC, useState} from "react";

interface LikeButtonProps {
    liked: boolean;
    postId: string;
}

const LikeButton: FC<LikeButtonProps> = ({liked, postId}) => {

    const [isLiked, setIsLiked] = useState(liked)

    const handleLike = async () => {
        setIsLiked(!isLiked)

    }

    return (
        <div>
            <button onClick={handleLike} className="bg-blue-500 text-white p-2 rounded-md">
                {isLiked ? "Unlike" : "Like"}
            </button>
        </div>
    );
}

export default LikeButton;