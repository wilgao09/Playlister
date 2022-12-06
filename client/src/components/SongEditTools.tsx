import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";

import { useContext } from "react";

import GlobalStoreContext from "../store";

interface SongEditProps {
    published: boolean;
}

function SongEditTools(props: SongEditProps) {
    const store = useContext(GlobalStoreContext);

    let lhs = [<Grid item xs={7}></Grid>];
    if (!props.published) {
        lhs = [
            <Grid item xs={2}>
                <Button variant="outlined" onClick={store.undo}>
                    Undo
                </Button>
            </Grid>,
            <Grid item xs={2}>
                <Button variant="outlined" onClick={store.redo}>
                    Redo
                </Button>
            </Grid>,
            <Grid item xs={3}>
                <Button variant="outlined" onClick={store.publishPlaylist}>
                    Publish
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
            <Grid item xs={2}>
                <Button variant="outlined">Delete</Button>
            </Grid>
            <Grid item xs={2}>
                <Button variant="outlined" onClick={store.duplicateList}>
                    Duplicate
                </Button>
            </Grid>
            <Grid item xs={1}>
                <IconButton onClick={store.closeCurrentList}>
                    <KeyboardDoubleArrowUpIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
}

export default SongEditTools;
