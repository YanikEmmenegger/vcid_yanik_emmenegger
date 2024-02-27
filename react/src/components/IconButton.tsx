import {FC} from "react";
import {IconType} from "react-icons";

interface IconButtonProps {
    icon: IconType,
    onClick: () => void;
    fontSize?: string;
}

const IconButton: FC<IconButtonProps> = ({icon:Icon , onClick, fontSize}) => {
    return (
        <div onClick={onClick} className={"cursor-pointer opacity-80 hover:opacity-100 px-1.5"} >
            <Icon  fontSize={fontSize? fontSize : "30px"}/>
        </div>
    );
}

export default IconButton;