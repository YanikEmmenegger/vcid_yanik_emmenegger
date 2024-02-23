import {FC} from "react";
import {IconType} from "react-icons";
import {Link} from "react-router-dom";

interface NavigationButtonProps {
    icon: IconType;
    label: string
    href: string
    id: string
}

const NavigationButton: FC<NavigationButtonProps> = ({icon: Icon, label, href, id}) => {
    return (
        <div id={id + "-container"}
             className="hover:font-bold py-3 transition cursor-pointer flex flex-col items-center justify-center w-full nav-button">

            <Link to={href} className="flex flex-col items-center justify-center">
                <Icon fontSize="30px"/>
                <p className={"pt-1 font-semibold text-xs"}>{label}</p>
            </Link>
        </div>
    );
}

export default NavigationButton;