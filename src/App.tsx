import { useState } from "react"
import Utilities from "./components/Utilities"
import WatchContract from "./components/WatchContract"
import Content from "./partials/Content"
import Footer from "./partials/Footer"
import Header from "./partials/Header"
import { PopUps } from "./utils/constants"
import PopUp from "./components/PopUp"

function App() {
  const [popup, setPopup] = useState<PopUps>(PopUps.None);

  return (
    <>
      <div className="page-container">
        <Header />
        <Content>
          <WatchContract setPopup={setPopup} />
          <Utilities />
        </Content>
        <Footer />
      </div>
      <PopUp popup={popup} setPopup={setPopup} />
    </>
  )
}

export default App
