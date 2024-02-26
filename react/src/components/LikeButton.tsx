import {FC} from "react";
import {RiHeart3Fill, RiHeart3Line, RiLoaderFill} from "react-icons/ri";
import {twMerge} from "tailwind-merge";

interface LikeButtonProps {
    liked: boolean;
    loading: boolean;
    onclick: () => void;
}

const LikeButton: FC<LikeButtonProps> = ({liked, loading, onclick}) => {

    return (
            <button onClick={onclick} className={twMerge("mr-1", loading ? "animate-spin": "")} disabled={loading} >
                {loading ? <RiLoaderFill />: <>
                {liked ? <RiHeart3Fill/> : <RiHeart3Line/>}
                </>
                }
            </button>
    );
}

export default LikeButton;