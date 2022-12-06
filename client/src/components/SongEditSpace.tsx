import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import SongEditSpaceStyle from "./SongEditSpace.module.css";

import GlobalStoreContext from "../store";

import { useContext } from "react";
import SongEditTools from "./SongEditTools";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
interface SongEditProps {
    published: boolean;
}
function SongEditSpace(props: SongEditProps) {
    const store = useContext(GlobalStoreContext);

    let body = [<div>500 massive error</div>];

    if (store.store.currentList == null || store.store.currentList == undefined)
        return <div> ERROR </div>;

    const handleAdd = () => {
        store.addNewSong({
            title: "Untitled",
            artist: "Unknown",
            youTubeId: "dQw4w9WgXcQ",
        });
    };

    if (!props.published) {
        body = store.store.currentList.map((x, i) => (
            <div
                className={SongEditSpaceStyle["song-card-unpublished"]}
                key={x.title + i}
            >
                {1 + i}. {x.title} by {x.artist}
                {/* the lambda deletes */}
                <Button
                    sx={{ float: "right" }}
                    onClick={() => store.removeSong(i)}
                >
                    X
                </Button>
            </div>
        ));
        body.push(
            <div
                className={SongEditSpaceStyle["song-card-unpublished"]}
                style={{
                    textAlign: "center",
                }}
                onClick={handleAdd}
                key={"RANDOMSTRING"}
            >
                +
            </div>
        );
    } else {
        body = store.store.currentList.map((x, i) => (
            <div key={x.title + i}>
                <Typography>
                    {i}. {x.title} by {x.artist}
                </Typography>
            </div>
        ));
        body = [
            <div
                className={SongEditSpaceStyle["song-card-published-container"]}
                key={"DUMMYTEXT"}
            >
                {body}
            </div>,
        ];
    }

    return (
        <div className={SongEditSpaceStyle["flex-container"]}>
            {body}
            <SongEditTools published={props.published} />
        </div>
    );
}

export default SongEditSpace;
