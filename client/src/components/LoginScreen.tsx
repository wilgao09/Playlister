import AppBanner from "./AppBanner";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";

import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Lock from "@mui/icons-material/Lock";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LoginScreenStyle from "./LoginScreen.module.css";

import { Link } from "react-router-dom";
import { useState, useContext } from "react";

function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = useContext(AuthContext);
    const store = useContext(GlobalStoreContext);

    let onInputChange = (isEmail: boolean) => {
        if (isEmail) {
            //TODO: type??
            return (e: any) => {
                setEmail(e.target.value);
            };
        } else {
            return (e: any) => {
                setPassword(e.target.value);
            };
        }
    };

    let handleLogin = () => {
        auth.loginUser(email, password);
        store.resetState();
    };
    return (
        <>
            <AppBanner />
            <div
                style={{
                    height: "95%",
                    backgroundColor: "aliceblue",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <div id={LoginScreenStyle["central"]}>
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justifyContent="center"
                        rowSpacing={0.5}
                        sx={{
                            paddingTop: "15%",
                        }}
                    >
                        <Grid item xs={12}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Avatar
                                    sx={{
                                        backgroundColor: "purple",
                                    }}
                                >
                                    <Lock sx={{ color: "white" }} />
                                </Avatar>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <div
                                    style={{
                                        display: "inline",
                                        fontSize: "24pt",
                                    }}
                                >
                                    SIGN IN
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItem>
                                <TextField
                                    label="Email Address"
                                    variant="outlined"
                                    fullWidth
                                    onChange={onInputChange(true)}
                                />
                            </ListItem>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItem>
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    onChange={onInputChange(false)}
                                    // ref="password"
                                    // hintText="Password"
                                    // floatingLabelText="Password"
                                    type="password"
                                />
                            </ListItem>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItem>
                                <Button
                                    variant="contained"
                                    sx={{ width: "100%" }}
                                    onClick={handleLogin}
                                >
                                    SIGN IN
                                </Button>
                            </ListItem>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItem>
                                <Link to="/playlister/register">
                                    Dont have an account?
                                </Link>
                            </ListItem>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default LoginScreen;
