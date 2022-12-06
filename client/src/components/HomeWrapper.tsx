import Logostyle from "./playlister.module.css";
import HomeWrapperStyle from "./HomeWrapper.module.css";

import PlaylisterWorkspace from "./PlaylisterWorkspace";

import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../auth";
import GlobalStoreContext, { CurrentModal } from "../store";
import ModalSwitch from "./ModalSwitch";

function HomeWrapper(): JSX.Element {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const store = useContext(GlobalStoreContext);

    if (auth.auth.isGuest || auth.auth.loggedIn) {
        return (
            <>
                <PlaylisterWorkspace></PlaylisterWorkspace>
                {store.store.currentModal !== CurrentModal.NONE && (
                    <ModalSwitch />
                )}
            </>
        );
    }

    return (
        <div id={HomeWrapperStyle.container}>
            <div id={HomeWrapperStyle["left-splash"]}>
                <div id={HomeWrapperStyle.credits}>
                    {" "}
                    Author: William Gao (wilgao){" "}
                </div>
                <div id={HomeWrapperStyle.banner}>
                    <h1
                        className={`${HomeWrapperStyle.title} ${Logostyle["playlister-logo"]}`}
                    >
                        Playlister
                    </h1>
                    <h2> PLAY MUSIC AND SHARE OPINIONS </h2>
                    <h4>
                        {" "}
                        An online music sharing app for music discussion and
                        debate{" "}
                    </h4>
                </div>
            </div>
            <div id={HomeWrapperStyle["right-splash"]}>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        navigate("/register");
                    }}
                >
                    {" "}
                    Register{" "}
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        navigate("/login");
                    }}
                >
                    {" "}
                    Login{" "}
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        navigate("/playlister");
                    }}
                >
                    {" "}
                    Continue as Guest{" "}
                </Button>
            </div>
        </div>
    );
}

export default HomeWrapper;
