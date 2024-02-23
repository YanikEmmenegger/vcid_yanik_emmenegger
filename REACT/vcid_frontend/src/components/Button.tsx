import {FC} from "react";

interface ButtonProps {
    onClick: () => void;
    text: string;
    disabled?: boolean;
}

const Button: FC<ButtonProps> = ({onClick, text, disabled}) => {
    return (
        <div className={"w-full p-3"}>
            <button onClick={onClick} disabled={disabled? disabled : false}
                className="h-auto p-4 opacity-100 active:scale-105 transition-opacity rounded-2xl outline-none border-2 bg-amber-500 border-amber-500 w-3/4">
                {text}
            </button>
        </div>
    );
}

export default Button;