import SingIn from "./Components/SingIn"
import ChatDashboard from "./Components/ChatDashboard"
import LogIn from "./Components/LogIn"
import { BrowserRouter,Routes,Route } from "react-router-dom"
import ProtectedRoute from "./Components/Protected"
import PublicRoute from "./Components/PublicRoute"


function App() {                                                                      
 
  
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route element={<PublicRoute/>}>
      <Route path="/" element={<SingIn/>}/>
      <Route path="/login" element={<LogIn/>}/>
      <Route path="/*" element={<h1> Page Not Found</h1>}/>
      </Route>
      <Route element={<ProtectedRoute/>}>
      <Route path="/chat" element={<ChatDashboard/>}/>
      </Route>
    </Routes>
    
    
    </BrowserRouter>
    
   
    </>
  )
}

export default App
