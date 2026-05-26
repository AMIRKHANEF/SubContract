import Button from "@/components/ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";
import SectionTitle from "./ui/SectionTitle";

export default function WatchContract() {
    return (
        <Card style="flex flex-col gap-3.5">
            <SectionTitle
                text="Watch Smart Contract"
            />

            <Input
                placeholder="Paste contract address..."
            />

            <div className="flex flex-row gap-3.5">
                <Button
                    onClick={() => null}
                    title="Add To Watchlist"
                    type="primary"
                    style="flex-1"
                />
                <Button
                    onClick={() => null}
                    title="⚙"
                    type="secondary"
                />
            </div>
        </Card>
    );
}
