import "./App.css";
// import { React } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { AuthContextProvider } from "./auth";
// import { GlobalStoreContextProvider } from "./store";
// import {
//     // AppBanner,
//     HomeWrapper,
//     // LoginScreen,
//     // RegisterScreen,
//     // Statusbar,
// } from "./components";
import HomeWrapper from "./components/HomeWrapper";

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
            {/* <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <AppBanner /> */}
            <Routes>
                <Route path="/" element={<HomeWrapper />} />
                {/* <Route path="/login/" exact component={LoginScreen} />
                        <Route
                            path="/register/"
                            exact
                            component={RegisterScreen}
                        /> */}
            </Routes>
            {/* <Statusbar />
                </GlobalStoreContextProvider>
            </AuthContextProvider> */}
        </BrowserRouter>
    );
};

export default App;
