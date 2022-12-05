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

function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [password2, setPassword2] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const auth = useContext(AuthContext);

    let handle = (where: String) => {
        let fns: any = {
            email: setEmail,
            pwd: setPassword,
            pwd2: setPassword2,
            uname: setUsername,
            fname: setFname,
            lname: setLname,
        };

        return (e: any) => fns[`${where}`](e.target.value);
    };

    let handleLogin = () => {
        console.log(auth);
        auth.registerUser(username, fname, lname, email, password, password2);
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
                        sx={{
                            paddingTop: "10%",
                        }}
                        rowSpacing={0.5}
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
                                    REGISTER
                                </div>
                            </ListItem>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItem>
                                <TextField
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    onChange={handle("uname")}
                                />
                            </ListItem>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItem>
                                <TextField
                                    label="Email Address"
                                    variant="outlined"
                                    fullWidth
                                    onChange={handle("email")}
                                />
                            </ListItem>
                        </Grid>
                        <Grid item xs={6}>
                            <ListItem>
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    onChange={handle("fname")}
                                />
                            </ListItem>
                        </Grid>
                        <Grid item xs={6}>
                            <ListItem>
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    fullWidth
                                    onChange={handle("lname")}
                                />
                            </ListItem>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItem>
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    onChange={handle("pwd")}
                                />
                            </ListItem>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItem>
                                <TextField
                                    label="Password Verify"
                                    variant="outlined"
                                    fullWidth
                                    onChange={handle("pwd2")}
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
                                    REGISTER
                                </Button>
                            </ListItem>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItem>
                                <Link to="/login">
                                    Have an account already?
                                </Link>
                            </ListItem>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default RegisterScreen;
