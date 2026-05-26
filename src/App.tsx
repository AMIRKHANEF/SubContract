import WatchContract from "./components/WatchContract"
import Content from "./partials/Content"
import Footer from "./partials/Footer"
import Header from "./partials/Header"

function App() {
  return (
    <div className="page-container">
      <Header />
      <Content>
        <WatchContract />
      </Content>
      <Footer />
    </div>
  )
}

export default App
