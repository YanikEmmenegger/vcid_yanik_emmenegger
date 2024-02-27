import {FC} from "react";
import {Link} from "react-router-dom";

interface UserItemProps {
    user: any;
}

const UserItem: FC<UserItemProps> = ({user}) => {


    return (
        <Link to={"/app/user/"+ user.id}>
        <div className='bg-neutral-800 transition-all ease-linear border-2 border-transparent p-3 cursor-pointer hover:border-neutral-600'>
            <div className={"flex  items-center justify-center"}>
                    <span className={"text-[30pt]"}>
                        {user.avatars?.icon || "👤"}
                    </span>
                <div className={"flex"}>
                    <h1 className={"mx-3 text-md font-bold"}>{user.name.toUpperCase()} </h1>
                </div>
            </div>
        </div>
        </Link>
    );
}

export default UserItem;