import {FC} from "react";
import {twMerge} from "tailwind-merge";

interface RadioSelectorProps {
    name: string;
    onClick: (type: string) => void;
    active: boolean;
}

const RadioSelector: FC<RadioSelectorProps> = ({name, onClick, active}) => {
    return (
        <div className={twMerge("transition  cursor-pointer border-2 border-neutral-600 p-5 rounded-lg text-center mx-5 w-full border-b-2", active ? "bg-amber-500 border-amber-500 text-opacity-100" : "bg-transparent border-neutral-700 text-opacity-70")}
             onClick={() => onClick(name.toLowerCase())}>{name}</div> // onClick wird nun mit `name` als Argument aufgerufen
    );
}

export default RadioSelector;
