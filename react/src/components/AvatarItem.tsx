import {FC} from "react";
import {twMerge} from "tailwind-merge";

interface AvatarItemProps {
    active: boolean;
    avatar: string;
    onclick: () => void;
}

const AvatarItem: FC<AvatarItemProps> = ({avatar, active, onclick}) => {
    return (
        <div onClick={onclick} className={twMerge("p-0.5 cursor-pointer", active ? "bg-green-600" : "bg-transparent")}>
            <p className={"text-[30px]"}>{avatar}</p>
        </div>
    );
}

export default AvatarItem;