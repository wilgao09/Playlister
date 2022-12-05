import AppBanner from "./AppBanner";
import AuthContext from "../auth";

import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Lock from "@mui/icons-material/Lock";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import LoginScreenStyle from "./LoginScreen.module.css";

import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { Password } from "@mui/icons-material";

function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = useContext(AuthContext);

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
    };
    return (
        <>
            <AppBanner />;
            <div
                style={{
                    height: "90%",
                    backgroundColor: "blue",
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
                            {/* <ListItem> */}
                            <Avatar
                                sx={{
                                    backgroundColor: "green",
                                }}
                            >
                                <Lock sx={{ color: "white" }} />
                            </Avatar>
                            {/* </ListItem> */}
                        </Grid>
                        //TODO: center
                        <Grid item xs={12}>
                            <ListItem>
                                <div style={{ textAlign: "center" }}>
                                    SIGN IN
                                </div>
                            </ListItem>
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
                                <Link to="/register">
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
