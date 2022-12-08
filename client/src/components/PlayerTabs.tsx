import PlayerTabsStyle from "./PlayerTabs.module.css";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import GlobalStoreContext, { CurrentScreen } from "../store";
import AuthContext from "../auth";

import { useState, useContext, useEffect } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { PlayArrow, Pause, FastForward, FastRewind } from "@mui/icons-material";

interface Comment {
    comment: string;
    createdAt: Date;
    username: string;
}

export default function () {
    const [tabval, setTabval] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [userComment, setUserComment] = useState("");
    const [ytId, setYtId] = useState("");
    const [published, setPublished] = useState(false);
    const [ytref, setYtref] = useState<YouTubePlayer | null>(null);
    const [autoplayNext, setAutoplayNext] = useState(false);
    const store = useContext(GlobalStoreContext);
    const auth = useContext(AuthContext);
    let panel = null;
    console.log("VV YOUTUBE");
    console.log(ytref);

    let cpl = store.store.currentPlayingList;
    let cpsi = store.store.currentPlayingSongIndex;

    if (cpsi < cpl.length && cpsi > -1 && ytId !== cpl[cpsi].youTubeId) {
        setYtId(
            store.store.currentPlayingList[store.store.currentPlayingSongIndex]
                .youTubeId
        );
    }

    // useEffect(() => {
    if (
        // store.store.currentPlayingListId === store.store.currentListId &&
        store.store.currentPlayingListId > -1
    ) {
        let isPublished = store.store.currentlyLoadedLists.filter(
            (x) => x._id === store.store.currentPlayingListId
        );
        if (isPublished.length > 0) {
            let p = isPublished[0].published;
            if (published !== p) {
                setPublished(p);
            }
        }

        // if (autoplayNext) {
        //     setAutoplayNext(false);
        // }
    }
    // });

    const onEndHandler = () => {
        let nind = store.store.currentPlayingSongIndex + 1;
        setAutoplayNext(true);
        if (nind < store.store.currentPlayingList.length) {
            store.playSong(
                store.store.currentPlayingListId,
                store.store.currentPlayingList,
                store.store.currentPlayingListName,
                nind
            );
        } else
            store.playSong(
                store.store.currentPlayingListId,
                store.store.currentPlayingList,
                store.store.currentPlayingListName,
                0
            );
    };

    const handleClick = async (tno: number) => {
        if (tno != tabval) {
            if (tno === 1) {
                let res = await store.getComments();
                let comments: Comment[] = res.data.comments;
                setComments(comments);
            }

            setTabval(tno);
        }
    };

    const handleSendComment = () => {
        store
            .postComment(userComment)
            .then(() => {
                return store.getComments();
            })
            .then((res: any) => {
                setComments(res.data.comments);
                setUserComment("");
            });
    };

    if (tabval === 0) {
        panel = (
            <div className={PlayerTabsStyle["bottom-about"]}>
                <Grid container>
                    <Grid item xs={3}>
                        <Typography>Playlist:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography>
                            {store.store.currentPlayingListName}
                        </Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography>Song Number:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography>
                            {store.store.currentPlayingSongIndex + 1}
                        </Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography>Title:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography>
                            {cpl[cpsi] ? cpl[cpsi].title : "N/A"}
                        </Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography>Artist:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography>
                            {cpl[cpsi] ? cpl[cpsi].artist : "N/A"}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <IconButton
                            onClick={() => {
                                if (ytref !== null) {
                                    setAutoplayNext(true);
                                    store.playSong(
                                        store.store.currentPlayingListId,
                                        store.store.currentPlayingList,
                                        store.store.currentPlayingListName,
                                        store.store.currentPlayingSongIndex - 1
                                    );
                                }
                            }}
                            disabled={store.store.currentPlayingSongIndex === 0}
                        >
                            <FastRewind />
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                if (ytref !== null) {
                                    ytref.pauseVideo();
                                }
                            }}
                            // disabled={
                            //     ytref === null || ytref.getPlayerState() === 1
                            // }
                        >
                            <Pause />
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                if (ytref !== null) {
                                    ytref.playVideo();
                                }
                            }}
                            // disabled={
                            //     ytref === null || ytref.getPlayerState() === 0
                            // }
                        >
                            <PlayArrow />
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                if (ytref !== null) {
                                    setAutoplayNext(true);
                                    store.playSong(
                                        store.store.currentPlayingListId,
                                        store.store.currentPlayingList,
                                        store.store.currentPlayingListName,
                                        store.store.currentPlayingSongIndex + 1
                                    );
                                }
                            }}
                            disabled={
                                store.store.currentPlayingSongIndex >=
                                store.store.currentPlayingList.length - 1
                            }
                        >
                            <FastForward />
                        </IconButton>
                    </Grid>
                </Grid>
            </div>
        );
    } else {
        panel = (
            <div
                style={{
                    height: "90%",
                    width: "100%",
                    backgroundColor: "rgb(183, 221, 255)",
                }}
            >
                <div
                    style={{
                        height: "90%",
                        width: "100%",
                        overflowY: "scroll",
                    }}
                >
                    {comments.map((x) => (
                        <div className={PlayerTabsStyle["comment"]}>
                            <div
                                className={PlayerTabsStyle["username"]}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    store.setScreenQuery(
                                        CurrentScreen.USERS,
                                        x.username
                                    );
                                }}
                            >
                                {x.username}
                            </div>
                            <div style={{ wordWrap: "break-word" }}>
                                {x.comment}
                            </div>
                        </div>
                    ))}
                </div>
                <TextField
                    variant="outlined"
                    label="Add Comment"
                    fullWidth
                    onKeyDown={(e) => {
                        console.log(e);
                        if (e.key === "Enter") {
                            handleSendComment();
                        }
                    }}
                    onChange={(e) => setUserComment(e.target.value)}
                    value={userComment}
                    disabled={!published || auth.auth.isGuest}
                ></TextField>
            </div>
        );
    }

    return (
        <>
            {/* These are the tabs */}
            <div
                style={{
                    height: "10%",
                    width: "100%",
                    backgroundColor: "slategray",
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <div
                    className={PlayerTabsStyle["tab"]}
                    onClick={() => handleClick(0)}
                    style={
                        tabval === 0
                            ? {
                                  backgroundColor: "rgb(150, 150, 150)",
                              }
                            : {}
                    }
                >
                    <div>Player</div>
                </div>
                {published ? (
                    <div
                        className={PlayerTabsStyle["tab"]}
                        onClick={() => handleClick(1)}
                        style={
                            tabval === 1
                                ? {
                                      backgroundColor: "rgb(150, 150, 150)",
                                  }
                                : {}
                        }
                    >
                        <div>Comments</div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
            {/* This is the YouTubePlayer */}
            <div
                className={
                    tabval
                        ? PlayerTabsStyle["youtube-closed"]
                        : PlayerTabsStyle["youtube-opened"]
                }
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <YouTube
                        videoId={ytId}
                        onEnd={onEndHandler}
                        opts={{
                            height: "360",
                            width: "480",
                            playerVars: {
                                // https://developers.google.com/youtube/player_parameters
                                autoplay: 1,
                            },
                        }}
                        onReady={(e) => {
                            setYtref(e.target);
                        }}
                    />
                </div>
            </div>
            {panel}
        </>
    );
}
