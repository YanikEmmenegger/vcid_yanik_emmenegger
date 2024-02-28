import * as Dialog from '@radix-ui/react-dialog';
import {FC} from "react";
import {CgClose} from "react-icons/cg";

interface ModalProps {
    isOpen: boolean;
    onChange: (open: boolean) => void;
    title: string;
    description: string;
    children: React.ReactNode;
}


const Modal: FC<ModalProps> = ({isOpen, onChange, title, description, children}) => {
    return (
        <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="backdrop-blur-sm fixed inset-0"/>
                <Dialog.Content
                    className="fixed drop-shadow-md top-[50%] left-[50%] w-full h-full translate-x-[-50%] translate-y-[-50%] p-[10px] focus:outline-none">
                    <div
                        className={" rounded-lg mt-[2.5vh] flex max-h-[95vh] mx-auto md:w-3/4 bg-amber-500 pb-20 w-full flex-col items-center"}>
                        <div
                            className={"px-5 py-5 flex w-[96%] justify-between items-center border-b-2 border-b-neutral-600"}>
                            <div className={" w-full items-start"}>
                                <Dialog.Title className={"text-2xl"}>{title}</Dialog.Title>
                                <h1 className={""}>{description}</h1>
                            </div>
                            <Dialog.Close asChild>
                                <CgClose fontSize={"30px"} className={"cursor-pointer"}/>
                            </Dialog.Close>
                        </div>
                        <div className={"py-10 px-10 w-full overflow-x-hidden overflow-y-auto"}>
                            {children}
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Modal;



