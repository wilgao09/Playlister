import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Home from "@mui/icons-material/Home";
import Person from "@mui/icons-material/Person";
import People from "@mui/icons-material/People";
import Sort from "@mui/icons-material/Sort";

function PlaylisterTools() {
    return (
        <AppBar
            position="static"
            // sx={{
            //     top: "56px",
            //     height: "64px",
            // }}
        >
            <Toolbar
                variant="regular"
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                {/* <Grid container>
                <Grid item xs={1}></Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={1}></Grid>
            </Grid> */}
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <Home />
                </IconButton>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <People />
                </IconButton>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <Person />
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
                >
                    <Sort />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default PlaylisterTools;
