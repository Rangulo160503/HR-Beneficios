import Display from "./components/Display"
import Sidebar from "./components/Sidebar"

const App = () => {
  return (
    <div className="h-screen bg-black">
      <div className="h-[90%] flex">
        <Sidebar/>
        <Display/>
      </div>
    </div>
  )
}

export default App