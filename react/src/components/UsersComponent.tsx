import {FC} from "react";
import UserItem from "./UserItem";

interface UsersComponentProps {
    users: any[];
}

const UsersComponent: FC<UsersComponentProps> = ({users}) => {
    return (
        <div className={"w-full justify-center items-center pb-10"}>
            {users.length > 0 ?
                <div className={"grid gap-5 grid-cols-1 md:grid-cols-3"}>
                    {users.map((user) => {
                        return (
                            <UserItem key={user.id} user={user}/>
                        )
                    })}
                </div> :
                <div className={"text-white text-center"}>No posts yet</div>
            }
        </div>
    );
}

export default UsersComponent;