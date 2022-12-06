import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import SongEditSpaceStyle from "./SongEditSpace.module.css";

import GlobalStoreContext, { CurrentModal } from "../store";

import { useContext, useState } from "react";
import SongEditTools from "./SongEditTools";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
interface SongEditProps {
    published: boolean;
}
function SongEditSpace(props: SongEditProps) {
    const store = useContext(GlobalStoreContext);

    const [startDragIndex, setStartDrag] = useState(-1);
    const [endDragIndex, setEndDrag] = useState(-1);

    const swapHandler = () => {
        store.moveSong(startDragIndex, endDragIndex);
    };

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
        //TODO: test drag
        body = store.store.currentList.map((x, i) => (
            <div
                className={SongEditSpaceStyle["song-card-unpublished"]}
                key={x.title + i}
                onDragStart={() => setStartDrag(i)}
                onDragOver={() => setEndDrag(i)}
                onDragEnd={() => swapHandler()}
                draggable={true}
                onDoubleClick={() => {
                    // store.raiseModal(CurrentModal.EDIT_SONG, {
                    //     song: x,
                    //     songIndex: i,
                    // });
                    store.showEditSongModal(i, x);
                }}
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
                    {i + 1}. {x.title} by {x.artist}
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
