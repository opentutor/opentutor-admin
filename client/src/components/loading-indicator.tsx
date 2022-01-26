import React from "react";
import {CircularProgress} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
    progressRoot: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
}));

export default function LoadingIndicator(): JSX.Element {
    const classes = useStyles();
    return(
        <div className={classes.progressRoot}>
            <CircularProgress style={{height: 100, width: 100}} />
        </div>
    );
}