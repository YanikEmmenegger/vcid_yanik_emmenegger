import {FC} from "react";
import {CiCirclePlus} from "react-icons/ci";
import {twMerge} from "tailwind-merge";

interface CircleButtonProps {
    active?: boolean
    onclick?: () => void
}

const CircleButton: FC<CircleButtonProps> = ({active, onclick}) => {
    return (

        <div onClick={onclick}
            className={twMerge(" mb-4 mx-auto hover:scale-105 outline-none cursor-pointer w- p-2 bg-amber-500 rounded-full transition", active ? "opacity-100 scale-100" : "opacity-0 scale-0")}>
            <CiCirclePlus fontSize="45px" color="white"></CiCirclePlus>
        </div>

    );
}

export default CircleButton;