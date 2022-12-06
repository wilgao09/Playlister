import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

interface SongEditProps {
    published: boolean;
}

function SongEditTools(props: SongEditProps) {
    let lhs = [<Grid item xs={6}></Grid>];
    if (!props.published) {
        lhs = [
            <Grid item xs={2}>
                <Button variant="outlined">Undo</Button>
            </Grid>,
            <Grid item xs={2}>
                <Button variant="outlined">Redo</Button>
            </Grid>,
            <Grid item xs={2}></Grid>,
        ];
    }

    return (
        <Grid
            container
            sx={{
                width: "100%",
                paddingTop: "16px",
            }}
        >
            {lhs}
            <Grid item xs={2}>
                <Button variant="outlined">Publish</Button>
            </Grid>
            ,
            <Grid item xs={2}>
                <Button variant="outlined">Delete</Button>
            </Grid>
            ,
            <Grid item xs={1}>
                <Button variant="outlined">Duplicate</Button>
            </Grid>
            ,
        </Grid>
    );
}

export default SongEditTools;
