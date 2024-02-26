import {FC} from "react";
import {twMerge} from "tailwind-merge";

interface InputProps {
    placeholder: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const Input: FC<InputProps> = ({placeholder, type, value, name, onChange, className}) => {
    return (
        <div className={"w-full p-3"}>
            <input value={value} name={name} onChange={onChange} placeholder={placeholder} type={type}
                   className={twMerge("h-auto p-4 opacity-75 focus:opacity-100 transition-opacity rounded-2xl outline-none border-2 bg-transparent border-amber-500 w-full", className)}/>
        </div>
    );
}

export default Input;
