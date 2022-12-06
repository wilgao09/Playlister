import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ThumbDown from "@mui/icons-material/ThumbDown";
import ThumbUp from "@mui/icons-material/ThumbUp";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";

import ListCardStyle from "./ListCard.module.css";

import { useContext, useEffect, useState } from "react";
import GlobalStoreContext from "../store";
import SongEditSpace from "./SongEditSpace";

function ListCard(props: SongList) {
    const store = useContext(GlobalStoreContext);
    const [opened, setOpen] = useState<boolean>(false);

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
            <Grid container className={cardClass}>
                <Grid item xs={12}>
                    {props.name}
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
                                    onClick={toggleOpen}
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
        <Grid container className={cardClass}>
            <Grid item xs={7}>
                {props.name}
            </Grid>
            <Grid item xs={2}>
                <IconButton>
                    <ThumbUp></ThumbUp>
                </IconButton>
                {props.upvotes}
            </Grid>
            <Grid item xs={2}>
                <IconButton>
                    <ThumbDown></ThumbDown>
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
                            <KeyboardDoubleArrowDownIcon onClick={toggleOpen} />
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
