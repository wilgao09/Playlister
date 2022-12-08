import AppBanner from "./AppBanner";
import ListSpace from "./ListSpace";

import PlaylisterTools from "./PlaylisterTools";

import PlaylisterWorkspaceStyle from "./PlaylisterWorkspace.module.css";
import WorkspaceBar from "./WorkspaceBar";

import Youtube from "react-youtube";
import PlayerTabs from "./PlayerTabs";

function PlaylisterWorkspace() {
    return (
        <>
            <AppBanner />
            <PlaylisterTools></PlaylisterTools>
            <div
                style={{
                    position: "fixed",
                    // top: "120px",
                    height: `${window.innerHeight - 120}px`,
                    backgroundColor: "pink",
                    width: "100%",
                }}
            >
                <div className={PlaylisterWorkspaceStyle["workspace-grid"]}>
                    <div className={PlaylisterWorkspaceStyle["list-space"]}>
                        <ListSpace></ListSpace>
                    </div>
                    <div className={PlaylisterWorkspaceStyle["player-space"]}>
                        <PlayerTabs />
                    </div>
                    <div className={PlaylisterWorkspaceStyle["bar-space"]}>
                        <WorkspaceBar />
                    </div>
                </div>
            </div>
        </>
    );
}

export default PlaylisterWorkspace;
