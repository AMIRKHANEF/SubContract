import Button from "@/components/ui/Button";
import DescriptionText from "@/components/ui/DescriptionText";
import Input from "@/components/ui/Input";
import PageTitle from "@/components/ui/PageTitle";
import { useNavigation } from "@/hooks/useStore";
import ABIStructured from "@/partials/abi/ABIStructured";
import { ABITab, parseABI, type ParsedABI } from "@/utils/ABI/ABIParser";
import { validateAbi } from "@/utils/ABI/validateABI";
import { BookText } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export default function AbiExplore() {
    const { goHome } = useNavigation();

    const [rawInput, setRawInput] = useState<string | undefined>();
    const [parsedABI, setParsedABI] = useState<ParsedABI | undefined>();
    const [error, setError] = useState<boolean>(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement, Element>) => {
        try {
            const value = e.target.value;
            setError(false);
            
            if (!value) return setRawInput("");

            if (!validateAbi(value)) throw Error('Bad ABI input');

            setRawInput(value)
        } catch (error) {
            setError(true);
            console.error(error);
        }
    }

    const handleParing = useCallback(() => {
        try {
            if (!rawInput) return;

            const parsed = parseABI(rawInput)

            setParsedABI(parsed);
        } catch (error) {
            console.error(error);
        }
    }, [rawInput]);

    const tabContent = useMemo(() => {
        if (!parsedABI) return undefined;

        return [
            { name: ABITab.Functions, count: parsedABI.stats.functions },
            { name: ABITab.Events, count: parsedABI.stats.events },
            { name: ABITab.Errors, count: parsedABI.stats.errors },
            { name: ABITab.Specials, count: parsedABI.stats.special }
        ];
    }, [parsedABI]);

    return (
        <div className="section-container max-h-screen overflow-y-auto">
            <PageTitle
                text="ABI Explorer"
                Icon={BookText}
                onBackButton={() => goHome()}
            />
            <DescriptionText
                description="Paste a raw ABI, instantly see all functions, events, and errors laid out cleanly with their signatures, types, and mutability."
            />
            <div className="flex flex-row gap-1.5">
                <Input
                    error={error}
                    onChange={handleInput}
                    placeholder='Enter ABI here, e.g [{"type":"function",...}]'
                    onEnter={handleParing}
                    showPasteIcon
                    value={rawInput}
                    containerClassName="flex-1 w-max"
                />
                <Button
                    onClick={handleParing}
                    type="primary"
                    className="w-22.5"
                    title="Parse ABI"
                />
            </div>
            {tabContent &&
                <ABIStructured
                    tabContent={tabContent}
                    parsedABI={parsedABI}
                />
            }
        </div>
    );
}
