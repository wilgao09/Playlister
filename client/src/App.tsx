import "./App.css";
// import { React } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./auth";
import { GlobalStoreContextProvider } from "./store";

import HomeWrapper from "./components/HomeWrapper";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";

/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = (): JSX.Element => {
    return (
        // <div></div>
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    {/* <AppBanner /> */}
                    <Routes>
                        <Route path="/" element={<HomeWrapper />} />
                        <Route path="/login/" element={<LoginScreen />} />
                        <Route path="/register/" element={<RegisterScreen />} />
                    </Routes>
                    {/* <Statusbar /> */}
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );
};

export default App;
