import AccountTransform from "@/partials/AccountTransform";
import ContractSettings from "@/partials/ContractSettings";
import { PopUps } from "@/utils/constants";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useMemo } from "react";

interface Props {
    popup: PopUps;
    setPopup: React.Dispatch<React.SetStateAction<PopUps>>;
}

export default function PopUp({ popup, setPopup }: Props) {
    const isOpen = popup !== PopUps.None;

    const content = useMemo(() => {
        switch (popup) {
            case PopUps.ContractSettings:
                return <ContractSettings setPopup={setPopup} />

            case PopUps.AccountTransform:
                return <AccountTransform setPopup={setPopup} />

            default:
                return <></>;
        }
    }, [popup, setPopup]);

    return (
        <>
            <Dialog open={isOpen} onClose={() => setPopup(PopUps.None)} className="relative z-50 h-fit w-fit">
                <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <div onClick={() => setPopup(PopUps.None)} className="absolute inset-0 h-screen w-screen bg-black/15 backdrop-blur-[1.5px] z-1" />
                    <DialogPanel
                        transition
                        className="
                            bg-bg-secondary rounded-md border-secondary transition duration-100
                            ease-in-out data-closed:opacity-0 shadow-2xl gap-1 w-fit h-fit z-10"
                    >
                        {content}
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}
