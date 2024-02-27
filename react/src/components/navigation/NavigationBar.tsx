'use client'
import {FC, useMemo} from "react";
import {twMerge} from "tailwind-merge";
import {routes} from "../../helpers/routes";
import NavigationButton from "./NavigationButton";
import CircleButton from "../CircleButton";
import toast from "react-hot-toast";
import {useCookies} from "react-cookie";
import useNewPostModal from "../useNewPostModal";


const NavigationBar: FC = () => {

    const newPostModal = useNewPostModal()

    const createRoutes = () => {
        return routes.map(({icon: Icon, name, path}) => {
            return Icon ?
                <NavigationButton key={name} icon={Icon} label={name} href={"/app"+path} id={name}></NavigationButton> : null
        }).filter((el) => {
            return el != null
        })
    }
    const routeElements = useMemo(() => createRoutes(), []);
    const handleAdd = () => {
        newPostModal.onOpen()
    }
    const [cookies] = useCookies(['uuid']);



    return (
        <>
            <div
                className={twMerge(" fixed bottom-24 left-0 w-full transition justify-center flex flex-col", cookies.uuid ? "fixed opacity-100" : "hidden opacity-0")}>
                <CircleButton onclick={handleAdd} active={cookies.uuid}></CircleButton>
            </div>
            <div
                className={twMerge(" fixed bottom-24 left-0 w-full transition justify-center flex flex-col")}>
            </div>
            <div
                className="fixed bottom-0 flex-col items-center -left-[25%] w-[150%] bg-amber-500 pt-3 text-white rounded-t-[100%]">

                <div className="grid grid-cols-3 items-center w-2/3 md:w-3/4 lg:w-1/3 mx-auto pb-3 ">

                    {
                        routeElements
                    }

                </div>
            </div>
        </>
    )

}

export default NavigationBar;