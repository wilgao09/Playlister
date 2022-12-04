import "./playlister.css";
import HomeWrapperStyle from "./HomeWrapper.module.css";

import { Button } from "@mui/material";

function HomeWrapper(): JSX.Element {
    return (
        <div id={HomeWrapperStyle.container}>
            <div id={HomeWrapperStyle["left-splash"]}>
                <div id={HomeWrapperStyle.credits}>
                    {" "}
                    Author: William Gao (wilgao){" "}
                </div>
                <div id={HomeWrapperStyle.banner}>
                    <h1 className={HomeWrapperStyle.title}>Playlister</h1>
                    <h2> PLAY MUSIC AND SHARE OPINIONS </h2>
                    <h4>
                        {" "}
                        An online music sharing app for music discussion and
                        debate{" "}
                    </h4>
                </div>
            </div>
            <div id={HomeWrapperStyle["right-splash"]}>
                <Button variant="contained" size="small">
                    {" "}
                    Register{" "}
                </Button>
                <Button variant="contained" size="small">
                    {" "}
                    Login{" "}
                </Button>
                <Button variant="contained" size="small">
                    {" "}
                    Continue as Guest{" "}
                </Button>
            </div>
        </div>
    );
}

export default HomeWrapper;
