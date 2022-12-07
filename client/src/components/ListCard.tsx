import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDown";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOutlined";
import TextField from "@mui/material/TextField";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";

import ListCardStyle from "./ListCard.module.css";

import { useContext, useEffect, useState } from "react";
import GlobalStoreContext from "../store";
import SongEditSpace from "./SongEditSpace";
import AuthContext from "../auth";

function ListCard(props: SongList) {
    const store = useContext(GlobalStoreContext);
    const auth = useContext(AuthContext);
    const [opened, setOpen] = useState<boolean>(false);
    const [nameEdit, setNameEdit] = useState(false);
    const [nameInField, setNameInField] = useState(props.name);

    let toggleOpen = () => {
        if (opened) {
            store.setCurrentList(-100);
        } else {
            store.setCurrentList(props._id);
        }
    };

    useEffect(() => {
        if (store.store.currentListId !== props._id && opened) {
            setOpen(false);
        } else if (store.store.currentListId === props._id && !opened) {
            setOpen(true);
        }
    });

    let cardClass = "";
    let colorClass = "";
    let color = "";
    if (store.store.currentPlayingListId === props._id) {
        colorClass = ListCardStyle["list-card-playing"];
        color = "gold";
    } else if (props.published) {
        colorClass = ListCardStyle["list-card-published"];
        color = "rgb(183, 221, 255)";
    } else {
        colorClass = ListCardStyle["list-card-private"];
        color = "white";
    }
    cardClass = colorClass + " " + `${ListCardStyle["list-card"]}`;

    if (!props.published) {
        return (
            <Grid
                container
                className={cardClass}
                onClick={(e) => {
                    e.stopPropagation();
                    store.playId(props._id);
                }}
            >
                <Grid item xs={12}>
                    {nameEdit ? (
                        <TextField
                            fullWidth
                            value={nameInField}
                            onChange={(e) => setNameInField(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    store
                                        .changeListName(props._id, nameInField)
                                        .then((success: boolean) => {
                                            if (success) {
                                                setNameEdit(false);
                                            }
                                        })
                                        .catch((res: any) =>
                                            auth.popupError(
                                                res.response.data.err.err
                                            )
                                        );
                                }
                            }}
                        ></TextField>
                    ) : (
                        <div
                            onDoubleClick={() => setNameEdit(true)}
                            style={{
                                cursor: "pointer",
                            }}
                        >
                            {props.name}
                        </div>
                    )}
                </Grid>
                <Grid item xs={12}>
                    By: {props.owner}
                </Grid>
                <Grid item xs={7}></Grid>
                <Grid item xs={4}>
                    <> Listens: {props.listens} </>
                </Grid>
                <Grid item xs={12}>
                    <Accordion
                        className={colorClass}
                        sx={{
                            boxShadow: "none",
                            backgroundColor: color,
                        }}
                        expanded={opened}
                    >
                        <AccordionSummary
                            sx={{ cursor: "default" }}
                            expandIcon={
                                <KeyboardDoubleArrowDownIcon
                                    onClick={(e) => {
                                        toggleOpen();
                                        e.stopPropagation();
                                    }}
                                />
                            }

                            // aria-controls="panel1a-content"
                            // id="panel1a-header"
                        ></AccordionSummary>
                        <AccordionDetails>
                            <SongEditSpace published={props.published} />
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid
            container
            className={cardClass}
            onClick={(e) => {
                e.stopPropagation();
                store.playId(props._id);
            }}
        >
            <Grid item xs={7}>
                {props.name}
            </Grid>
            <Grid item xs={2}>
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        store.likePlaylist(props._id, true);
                    }}
                >
                    {props.userLiked === 1 ? (
                        <ThumbUpAltIcon></ThumbUpAltIcon>
                    ) : (
                        <ThumbUpOffAltIcon></ThumbUpOffAltIcon>
                    )}
                </IconButton>
                {props.upvotes}
            </Grid>
            <Grid item xs={2}>
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        store.likePlaylist(props._id, false);
                    }}
                >
                    {props.userDisliked === 1 ? (
                        <ThumbDownAltIcon></ThumbDownAltIcon>
                    ) : (
                        <ThumbDownOffAltIcon></ThumbDownOffAltIcon>
                    )}
                </IconButton>
                {props.downvotes}
            </Grid>
            <Grid item xs={12}>
                By: {props.owner}
            </Grid>
            <Grid item xs={7}>
                <>Published: {props.updatedAt} </>
            </Grid>
            <Grid item xs={4}>
                <> Listens: {props.listens} </>
            </Grid>
            <Grid item xs={12}>
                <Accordion
                    className={colorClass}
                    sx={{
                        boxShadow: "none",
                        backgroundColor: color,
                    }}
                    expanded={opened}
                >
                    <AccordionSummary
                        expandIcon={
                            <KeyboardDoubleArrowDownIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleOpen();
                                }}
                            />
                        }

                        // aria-controls="panel1a-content"
                        // id="panel1a-header"
                    ></AccordionSummary>
                    <AccordionDetails>
                        <SongEditSpace published={props.published} />
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    );
}

export default ListCard;
