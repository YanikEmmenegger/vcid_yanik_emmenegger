import {FC} from "react";
import {twMerge} from "tailwind-merge";

interface ButtonProps {
    onClick: () => void;
    text: string;
    disabled?: boolean;
    className?: string;
}

const Button: FC<ButtonProps> = ({onClick, text, disabled, className}) => {
    return (
        <div className={"w-full py-1 px-1"}>
            <button onClick={onClick} disabled={disabled}
                className={twMerge("h-auto py-4 opacity-100 active:scale-105 transition-opacity rounded-2xl outline-none border-2 bg-amber-500 border-amber-500 w-full", className, disabled? "cursor-not-allowed" : "cursor-pointer")}>
                {text}
            </button>
        </div>
    );
}

export default Button;