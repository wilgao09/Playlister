import ModalStyleSwitch from "./ModalStyleSwitch.module.css";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import GlobalStoreContext, { CurrentModal } from "../store";
import PlaylisterModal from "./PlaylisterModal";

import { useContext, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Title } from "@mui/icons-material";

function ModalSwitch() {
    const store = useContext(GlobalStoreContext);
    let modal = undefined;

    console.log("CURRENT STATE OF THE STORE");
    console.log(store.store);

    let cs = store.store.currentSong;

    const [title, setTitle] = useState<string | null>(null);
    const [artist, setArtist] = useState<string | null>(null);
    const [ytId, setYtId] = useState<string | null>(null);

    if (cs !== null && title === null) {
        setTitle(cs.title);
    }

    if (cs !== null && artist === null) {
        setArtist(cs.artist);
    }

    if (cs !== null && ytId === null) {
        setYtId(cs.youTubeId);
    }

    switch (store.store.currentModal) {
        case CurrentModal.EDIT_SONG: {
            return (
                <PlaylisterModal
                    title="Edit Song"
                    confirm={() => {
                        if (
                            title === null ||
                            artist === null ||
                            ytId === null
                        ) {
                            return;
                        }
                        store.editSong(store.store.currentSongIndex, {
                            title,
                            artist,
                            youTubeId: ytId,
                        });
                    }}
                    cancel={() => {
                        store.hideModals();
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid item xs={5}>
                            <Typography
                                sx={{
                                    marginTop: "auto",
                                    marginBottom: "auto",
                                    fontSize: "22pt",
                                }}
                            >
                                Title:
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <TextField
                                variant="outlined"
                                label="Title"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            ></TextField>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography
                                sx={{
                                    marginTop: "auto",
                                    marginBottom: "auto",
                                    fontSize: "22pt",
                                }}
                            >
                                Artist:
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <TextField
                                variant="outlined"
                                label="Artist"
                                fullWidth
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                            ></TextField>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography
                                sx={{
                                    marginTop: "auto",
                                    marginBottom: "auto",
                                    fontSize: "22pt",
                                }}
                            >
                                YouTube Id:
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <TextField
                                variant="outlined"
                                label="YouTube Id"
                                fullWidth
                                value={ytId}
                                onChange={(e) => setYtId(e.target.value)}
                            ></TextField>
                        </Grid>
                    </Grid>
                </PlaylisterModal>
            );
        }
        case CurrentModal.REMOVE_SONG: {
            if (store.store.currentSong === null)
                return <div>Unexpected error</div>;
            else
                return (
                    <PlaylisterModal
                        title="Remove Song"
                        confirm={() => {
                            store.removeSong(store.store.currentSongIndex);
                        }}
                        cancel={() => {
                            store.hideModals();
                        }}
                    >
                        <Typography>
                            Are you sure you want to remove{" "}
                            {store.store.currentSong.title}?
                        </Typography>
                    </PlaylisterModal>
                );
        }
        case CurrentModal.DELETE_LIST: {
            let name = store.store.currentlyLoadedLists.filter(
                (x) => x._id === store.store.listToDelete
            )[0].name;
            console.log("NAME IS vv");
            console.log(name);
            return (
                <PlaylisterModal
                    title="Delete Playlist"
                    confirm={() => {
                        store.deleteList(store.store.listToDelete);
                    }}
                    cancel={() => {
                        store.hideModals();
                    }}
                >
                    <Typography>
                        Are you sure you want to delete {name}?
                    </Typography>
                </PlaylisterModal>
            );
        }
    }

    return <div>ERROR</div>;
}

export default ModalSwitch;
