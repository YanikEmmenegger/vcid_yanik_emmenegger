import {FC} from "react";
import {twMerge} from "tailwind-merge";

interface CommentContainerProps {
    comments: any[];
    active: boolean;
}

const CommentContainer: FC<CommentContainerProps> = ({comments, active}) => {
    return (
        <div className={twMerge("", active ? "block" : "hidden")}>
            <h1 className={"text-[10pt]"}>Comments: </h1>
            <div>
            </div>
        </div>
    );
}

export default CommentContainer;