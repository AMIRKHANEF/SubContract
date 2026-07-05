import PopUp from "@/components/PopUp";
import Utilities from "@/components/Utilities";
import WatchContract from "@/components/WatchContract";
import Content from "@/partials/Content";
import ContractInfo from "@/partials/contractDash/ContractDashboard";
import Footer from "@/partials/Footer";
import Header from "@/partials/Header";
import { PopUps } from "@/utils/constants";
import { useState } from "react";

export default function Home() {
    const [popup, setPopup] = useState<PopUps>(PopUps.None);

    return (
        <div className="page-container">
            <Header />
            <Content>
                <WatchContract setPopup={setPopup} />
                <ContractInfo />
                <Utilities setPopup={setPopup} />
            </Content>
            <Footer />
            <PopUp popup={popup} setPopup={setPopup} />
        </div>
    );
}
