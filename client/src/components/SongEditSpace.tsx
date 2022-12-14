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

    const handlePlay = (ind: number) => {
        if (store.store.currentList === null) {
            return;
        }
        //find the name of the list LOL
        let name = store.store.currentlyLoadedLists.filter(
            (x) => x._id == store.store.currentListId
        )[0].name;
        store.playSong(
            store.store.currentListId,
            store.store.currentList,
            name,
            ind
        );
    };

    let isPlaying = (ind: number) =>
        store.store.currentListId === store.store.currentPlayingListId &&
        ind === store.store.currentPlayingSongIndex;

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
                    store.showEditSongModal(i, x);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(i);
                }}
            >
                <div
                    style={
                        isPlaying(i)
                            ? {
                                  backgroundColor: "aliceblue",
                                  borderRadius: "8px",
                                  padding: "8px",
                              }
                            : {}
                    }
                >
                    {1 + i}. {x.title} by {x.artist}
                    {/* the lambda deletes */}
                    <Button
                        sx={{ float: "right" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            store.showRemoveSongModal(i, x);
                        }}
                    >
                        X
                    </Button>
                </div>
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
                <div
                    style={
                        isPlaying(i)
                            ? {
                                  backgroundColor: "aliceblue",
                                  borderRadius: "8px",
                                  padding: "8px",
                                  color: "indigo",
                              }
                            : {}
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(i);
                    }}
                >
                    <Typography>
                        {i + 1}. {x.title} by {x.artist}
                    </Typography>
                </div>
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
        <div
            className={SongEditSpaceStyle["flex-container"]}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            {body}
            <SongEditTools published={props.published} />
        </div>
    );
}

export default SongEditSpace;
