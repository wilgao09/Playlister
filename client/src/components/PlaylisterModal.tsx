import ModalStyle from "./PlaylisterModal.module.css";

import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface ModalProps {
    // children: JSX.ElementChildrenAttribute;
    title: string;
    confirm: () => void;
    cancel: () => void;
}

function PModal(props: React.PropsWithChildren<ModalProps>) {
    return (
        // <div className={ModalStyle["modal-container"]}>
        <Dialog
            open={true}
            sx={{
                width: "100%",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    width: "30vw",
                    height: "50vh",
                    backgroundColor: "red",
                }}
            >
                <div className={ModalStyle["banner"]}>
                    <div
                        style={{
                            paddingLeft: "12px",
                            verticalAlign: "middle",
                        }}
                    >
                        {props.title}
                    </div>
                </div>
                <div className={ModalStyle["body"]}>
                    <div className={ModalStyle["center-body"]}>
                        <>{props.children}</>
                    </div>
                </div>
                <div className={ModalStyle["footer"]}>
                    <Button
                        variant="contained"
                        sx={{
                            height: "60%",
                            marginTop: "8px",
                        }}
                        onClick={props.confirm}
                    >
                        Confirm
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            height: "60%",
                            marginTop: "8px",
                        }}
                        onClick={props.cancel}
                    >
                        Cancel
                    </Button>
                </div>
            </Box>
        </Dialog>
        // </div>
    );
}

export default PModal;
