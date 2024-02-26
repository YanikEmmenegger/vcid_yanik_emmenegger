import {FC} from "react";
import {twMerge} from "tailwind-merge";

interface LikeContainerProps {
    likes: any[];
    active: boolean;
}

const LikeContainer: FC<LikeContainerProps> = ({likes, active}, ) => {
    return (
        <div className={twMerge("", active ? "block" : "hidden")}>
            <h1 className={"text-[10pt]"}>Comments: </h1>
            <div>
            </div>
        </div>
    );
}

export default LikeContainer;