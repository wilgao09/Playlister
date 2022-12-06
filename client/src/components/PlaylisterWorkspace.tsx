import AppBanner from "./AppBanner";
import ListSpace from "./ListSpace";

import PlaylisterTools from "./PlaylisterTools";

import PlaylisterWorkspaceStyle from "./PlaylisterWorkspace.module.css";

function PlaylisterWorkspace() {
    return (
        <>
            <AppBanner />
            <PlaylisterTools></PlaylisterTools>
            <div
                style={{
                    height: `${window.innerHeight - 120}px`,
                    backgroundColor: "pink",
                    width: "100%",
                }}
            >
                <div className={PlaylisterWorkspaceStyle["workspace-grid"]}>
                    <div className={PlaylisterWorkspaceStyle["list-space"]}>
                        <ListSpace></ListSpace>
                    </div>
                    <div
                        className={PlaylisterWorkspaceStyle["player-space"]}
                    ></div>
                    <div className={PlaylisterWorkspaceStyle["bar-space"]}>
                        {/* <WorkspaceBar/> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PlaylisterWorkspace;
