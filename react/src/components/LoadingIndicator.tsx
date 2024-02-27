import {FC} from "react";
import {RiLoaderFill} from "react-icons/ri";
import {twMerge} from "tailwind-merge";

interface LoadingIndicatorProps {
    active: boolean
    fontSize?: string
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({active, fontSize}) => {
    return (
        <div className={"flex justify-around text-center"}>
            <RiLoaderFill className={twMerge("animate-spin", active ? "block": "hidden")} fontSize={fontSize ? fontSize : "50px"}/>
        </div>
    );
}

export default LoadingIndicator;