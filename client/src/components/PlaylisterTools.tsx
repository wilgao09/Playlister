import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Home from "@mui/icons-material/Home";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Person from "@mui/icons-material/Person";
import People from "@mui/icons-material/People";

import HomeOutlined from "@mui/icons-material/HomeOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";

import Sort from "@mui/icons-material/Sort";

import { useContext, useState } from "react";
import GlobalStoreContext, { CurrentScreen, SortOrder } from "../store";

function PlaylisterTools() {
    const [query, setQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const store = useContext(GlobalStoreContext);

    let selfOrders = [
        ["By Name (A-Z)", SortOrder.NAME_ASC],

        ["By Creation Date (Old-New)", SortOrder.CREATE_ASC],
        ["By Last Edit Date (New-Old)", SortOrder.EDIT_ASC],
    ];

    let otherOrders = [
        ["By Publish Date (Descending)", SortOrder.PUBLISH_DESC],
        ["By Listen Count (Descending)", SortOrder.LISTEN_DESC],
        ["Likes (Descending)", SortOrder.LIKE_DESC],
        ["Dislikes (Descending)", SortOrder.DISLIKE_DESC],
    ];

    let handleChangeOrder = (order: any) => {
        store.changeSortOrder(order);
    };

    return (
        <AppBar
            position="static"
            // sx={{
            //     top: "56px",
            //     height: "64px",
            // }}
        >
            <Menu
                anchorEl={anchorEl}
                open={anchorEl !== null}
                keepMounted
                onClose={() => setAnchorEl(null)}
            >
                {selfOrders.concat(otherOrders).map((x, i) => (
                    <MenuItem
                        key={`${i ** i}`}
                        onClick={() => handleChangeOrder(x[1])}
                    >
                        {x[0]}
                    </MenuItem>
                ))}
            </Menu>
            <Toolbar
                variant="regular"
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => store.changeScreen(CurrentScreen.HOME)}
                >
                    {store.store.currentScreen === CurrentScreen.HOME ? (
                        <Home />
                    ) : (
                        <HomeOutlined></HomeOutlined>
                    )}
                </IconButton>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => store.changeScreen(CurrentScreen.PLAYLISTS)}
                >
                    {store.store.currentScreen === CurrentScreen.PLAYLISTS ? (
                        <People />
                    ) : (
                        <PeopleOutlined></PeopleOutlined>
                    )}
                </IconButton>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => store.changeScreen(CurrentScreen.USERS)}
                >
                    {store.store.currentScreen === CurrentScreen.USERS ? (
                        <Person />
                    ) : (
                        <PersonOutlined></PersonOutlined>
                    )}
                </IconButton>
                <TextField
                    id="search-bar"
                    className="text"
                    variant="filled"
                    placeholder="Search..."
                    size="small"
                    sx={{
                        marginLeft: "10%",
                        marginRight: "20%",
                        width: "54%",
                    }}
                    onChange={(e) => {
                        setQuery(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            store.changeQuery(query);
                        }
                    }}
                />
                <Typography
                    sx={{
                        display: "absolute",
                        right: "0px",
                    }}
                >
                    SORT BY
                </Typography>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2, display: "absolute", right: "0px" }}
                    onClick={(e: any) => setAnchorEl(e.currentTarget)}
                >
                    <Sort />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default PlaylisterTools;
