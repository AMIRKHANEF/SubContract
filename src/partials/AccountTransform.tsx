import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import PopupTitle from "@/components/ui/PopupTitle";
import { PopUps } from "@/utils/constants";
import { LayoutDashboard } from "lucide-react"; // ChevronsLeftRightEllipsis
import { Fragment, useReducer } from "react";
import { ethToSS58, isValidEthAddress, isValidSS58Address, ss58ToEth } from "@/utils/addressConverter";
import { u8aToHex } from "@polkadot/util";
import { decodeAddress } from "@polkadot/util-crypto";
import { CollapseContent } from "@/components/ui/Collapse";
import DisplayAddress from "@/components/DisplayAddress";

export interface FormattedType {
    address: string;
    chain: "Revive" | "Polkadot" | "PublicKey";
}

interface AddressState {
    address: string;
    formatted: FormattedType | undefined;
    formattedExtra: FormattedType | undefined;
    addressPK: FormattedType | undefined;
    badAddr: boolean;
}

const initialState: AddressState = {
    address: "",
    formatted: undefined,
    formattedExtra: undefined,
    addressPK: undefined,
    badAddr: false,
};

type Action =
    | { type: "SET_ADDRESS"; payload: string }
    | { type: "SET_RESULT"; payload: { formatted: FormattedType; addressPK?: FormattedType; formattedExtra?: FormattedType; } }
    | { type: "SET_BAD_ADDR"; payload: boolean }
    | { type: "RESET" };

function reducer(state: AddressState, action: Action): AddressState {
    switch (action.type) {
        case "SET_ADDRESS": return { ...state, address: action.payload };
        case "SET_RESULT": return {
            ...state,
            formatted: action.payload.formatted,
            formattedExtra: action.payload.formattedExtra,
            addressPK: action.payload.addressPK
        };
        case "SET_BAD_ADDR": return { ...state, badAddr: action.payload };
        case "RESET": return initialState;
        default: return state;
    }
}

const getConversionResult = (address: string): { formatted: FormattedType; addressPK?: FormattedType; formattedExtra?: FormattedType } => {
    if (isValidEthAddress(address)) {
        const ss58Addr = ethToSS58(address);
        return {
            addressPK: { address: u8aToHex(decodeAddress(ss58Addr)), chain: "PublicKey" },
            formatted: { address: ss58Addr, chain: "Polkadot" },
        };
    }

    // checks if it is a public key
    if (isValidSS58Address(address) && address.startsWith("0x")) {
        const addr = address.slice(0, 42);

        return {
            // addressPK: { address, chain: "PublicKey" },
            formatted: { address: ethToSS58(addr), chain: "Polkadot" },
            formattedExtra: { address: addr, chain: "Revive" },
        };
    }

    if (isValidSS58Address(address)) {
        return {
            addressPK: { address: u8aToHex(decodeAddress(address)), chain: "PublicKey" },
            formatted: { address: ss58ToEth(address), chain: "Revive" },
        };
    }

    throw new Error("Invalid address entered!");
};

export default function AccountTransform({ setPopup }: { setPopup: React.Dispatch<React.SetStateAction<PopUps>> }) {
    const [{ address, addressPK, badAddr, formatted, formattedExtra }, dispatch] = useReducer(reducer, initialState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement, Element>) => {
        const addr = e.target.value;

        if (!addr) {
            dispatch({ type: "SET_ADDRESS", payload: "" });
            return;
        }

        if (badAddr) dispatch({ type: "SET_BAD_ADDR", payload: false });

        dispatch({ type: "SET_ADDRESS", payload: addr });
    };

    const handleConversion = () => {

        try {
            if (!address) throw Error("No address entered!");

            dispatch({ type: "SET_RESULT", payload: getConversionResult(address) });
        } catch (error) {
            console.log(error);

            dispatch({ type: "SET_BAD_ADDR", payload: true });
            setTimeout(() => dispatch({ type: "RESET" }), 210);
        }
    };

    const formatsToShow = [formatted, formattedExtra, addressPK].filter((item) => !!item);

    return (
        <div className="flex flex-col w-[90vw] p-4.5 pt-3">
            <PopupTitle
                title="Account Transform"
                onCloseButton={() => setPopup(PopUps.None)}
                Icon={<LayoutDashboard size={28} className="text-accent-primary" />}
            />
            <Divider className="my-2.5" />
            <p className="text-sm font-extralight text-text-primary px-2.5 py-2.5 mb-2.5">
                Bidirectional conversion between Substrate-based SS58 and H160 address formats.
            </p>
            <Input
                placeholder="Paste address..."
                onChange={handleInputChange}
                value={address}
                onEnter={handleConversion}
                error={badAddr}
                showPasteIcon
            />
            <Button
                onClick={handleConversion}
                title="Transform"
                type="quaternary"
                className="mt-3.5"
            />
            <CollapseContent
                isOpen={!badAddr && !!formatted}
                className="flex flex-col p-0 pt-5 gap-3 duration-300"
            >
                {formatsToShow.map((item, index) => {
                    return (
                        <Fragment key={index}>
                            <DisplayAddress formattedAddress={item} />
                            {(formatsToShow.length - 1) > index && <Divider />}
                        </Fragment>
                    );
                })}
            </CollapseContent>
        </div>
    );
}
