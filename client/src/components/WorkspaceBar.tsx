import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";

import GlobalStoreContext, { CurrentScreen } from "../store";
import AuthContext from "../auth";
import { useContext } from "react";

function WorkspaceBar() {
    const store = useContext(GlobalStoreContext);
    const auth = useContext(AuthContext);
    switch (store.store.currentScreen) {
        case CurrentScreen.HOME: {
            return (
                <>
                    {" "}
                    <Fab
                        color="primary"
                        aria-label="add"
                        onClick={() => store.createNewList()}
                        disabled={auth.auth.isGuest}
                    >
                        <AddIcon />
                    </Fab>
                    <Typography sx={{ display: "inline", fontSize: "32px" }}>
                        Add Playlist
                    </Typography>
                </>
            );
        }

        case CurrentScreen.USERS: {
            return (
                <>
                    <Typography sx={{ display: "inline", fontSize: "32px" }}>
                        {store.store.searchQuery}'s Lists
                    </Typography>
                </>
            );
        }
        default: {
            return (
                <>
                    <Typography sx={{ display: "inline", fontSize: "32px" }}>
                        {store.store.searchQuery} Playlists
                    </Typography>
                </>
            );
        }
    }
}

export default WorkspaceBar;
