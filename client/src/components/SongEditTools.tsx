import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";

import { useContext } from "react";

import GlobalStoreContext, { CurrentModal } from "../store";
import AuthContext from "../auth";

interface SongEditProps {
    published: boolean;
}

function SongEditTools(props: SongEditProps) {
    const store = useContext(GlobalStoreContext);
    const auth = useContext(AuthContext);

    let userOwns =
        auth.auth.user !== null &&
        store.store.currentlyLoadedLists.filter(
            (x) => x._id === store.store.currentListId
        )[0].owner === auth.auth.user.username;

    let lhs = [<Grid item xs={11}></Grid>];
    if (!props.published) {
        lhs = [
            <Grid item xs={2}>
                <Button
                    variant="outlined"
                    onClick={store.undo}
                    disabled={!store.canUndo()}
                >
                    Undo
                </Button>
            </Grid>,
            <Grid item xs={2}>
                <Button
                    variant="outlined"
                    onClick={store.redo}
                    disabled={!store.canRedo()}
                >
                    Redo
                </Button>
            </Grid>,
            <Grid item xs={3}>
                <Button variant="outlined" onClick={store.publishPlaylist}>
                    Publish
                </Button>
            </Grid>,
            <Grid item xs={2}>
                <Button
                    variant="outlined"
                    onClick={(e) => {
                        e.stopPropagation();
                        store.raiseModal(CurrentModal.DELETE_LIST, {
                            id: store.store.currentListId,
                        });
                    }}
                    disabled={
                        store.store.currentListId ===
                        store.store.currentPlayingListId
                    }
                >
                    Delete
                </Button>
            </Grid>,
            <Grid item xs={2}>
                <Button variant="outlined" onClick={store.duplicateList}>
                    Duplicate
                </Button>
            </Grid>,
        ];
    } else if (userOwns) {
        lhs = [
            <Grid item xs={7}></Grid>,
            <Grid item xs={2}>
                <Button
                    variant="outlined"
                    onClick={(e) => {
                        e.stopPropagation();
                        store.raiseModal(CurrentModal.DELETE_LIST, {
                            id: store.store.currentListId,
                        });
                    }}
                    disabled={
                        store.store.currentListId ===
                        store.store.currentPlayingListId
                    }
                >
                    Delete
                </Button>
            </Grid>,
            <Grid item xs={2}>
                <Button variant="outlined" onClick={store.duplicateList}>
                    Duplicate
                </Button>
            </Grid>,
        ];
    }

    return (
        <Grid
            container
            sx={{
                width: "100%",
                paddingTop: "16px",
            }}
        >
            {lhs}

            <Grid item xs={1}>
                <IconButton onClick={store.closeCurrentList}>
                    <KeyboardDoubleArrowUpIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
}

export default SongEditTools;
