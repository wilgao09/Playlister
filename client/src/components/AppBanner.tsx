import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import PlaylisterLogo from "./playlister.module.css";
import AppBannerStyle from "./AppBanner.module.css";

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth";

function AppBanner() {
    const auth = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const isMenuOpen = Boolean(anchorEl);

    let circleButton = auth.auth.user ? (
        <div>
            {auth.auth.user?.firstName.charAt(0) +
                auth.auth.user?.lastName.charAt(0)}
        </div>
    ) : (
        <AccountCircle sx={{ width: "100%", height: "100%" }} />
    );

    const handleMenuOpen = (event: any) => {
        // if (event.currentTarget instanceof Element)
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        //TODO: fix this
        // store.reset();
        auth.logoutUser();
    };

    const menuId = AppBannerStyle["menu-id"];
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <Link to="/login/">
                <MenuItem onClick={handleMenuClose}>Login</MenuItem>
            </Link>

            <Link to="register">
                <MenuItem onClick={handleMenuClose}>
                    Create New Account
                </MenuItem>
            </Link>

            {/* <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem> */}
        </Menu>
    );
    const loggedInMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    );

    let menu = auth.auth.loggedIn ? loggedInMenu : loggedOutMenu;

    return (
        <Box sx={{ height: "7%" }}>
            <AppBar
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "grey",
                    // height: "100%",
                }}
            >
                <h3
                    className={`${PlaylisterLogo["playlister-logo"]} ${AppBannerStyle["logo-styling"]}`}
                >
                    Playlister
                </h3>

                <IconButton
                    className={AppBannerStyle["account-button"]}
                    onClick={(e) => {
                        handleMenuOpen(e);
                    }}
                >
                    {circleButton}
                    {/* <AccountCircle sx={{ width: "100%", height: "100%" }} /> */}
                </IconButton>
                {menu}
            </AppBar>
        </Box>
    );
}

export default AppBanner;
