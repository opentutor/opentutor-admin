/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      // color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

interface Data {
  id: string;
  date: string;
  username: string;
  userAnswer: string;
  classifierGrade: string;
  confidence: string;
  grade: string;
  session: string;
  accurate: string;
}

interface FilteringProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rows: Data[];
  setRows: React.Dispatch<React.SetStateAction<Data[]>>;
  rowsUnfiltered: Data[];
  setPage: (value: React.SetStateAction<number>) => void;
}

interface Filter {
  dirty: boolean;
  hideUngraded: boolean;
}

export default function FilteringDialog(props: FilteringProps): JSX.Element {
  const defaultFilter: Filter = { hideUngraded: false, dirty: false };
  const [filter, setFilter] = React.useState(defaultFilter);

  const handleClose = () => {
    console.log(filter);
    //Update the rows
    // TODO: Only update on change, i.e. only setPage(0) on change
    const tempRows: Data[] = [];
    props.rowsUnfiltered.forEach((row: Data) => {
      console.log(row);
      if (filter.hideUngraded) {
        console.log("Requested hiding ungraded");
        if (row.grade) {
          console.log("Adding log");
          tempRows.push(row);
        }
      } else {
        console.log("Adding log");
        tempRows.push(row);
      }
    });
    props.setRows(tempRows);
    if (filter.dirty) {
      props.setPage(0);
      setFilter({ ...filter, dirty: false });
    }
    console.log(tempRows);
    props.setOpen(false);
  };

  // const handleSave = () => {
  //   setFilter({})
  //   handleClose();
  // }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Filters
      </DialogTitle>
      <DialogContent dividers>
        <FormControlLabel
          control={
            <Switch
              checked={filter.hideUngraded}
              onChange={() => {
                console.log("Toggled");
                setFilter({
                  ...filter,
                  hideUngraded: !filter.hideUngraded,
                  dirty: true,
                });
              }}
            />
          }
          label="Hide Ungraded"
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// import React from 'react';
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';

// interface FilteringProps {
//   open: boolean,
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>
// }

// export default function FilteringDialog(props:FilteringProps): JSX.Element {
//   const handleClose = () => {
//     props.setOpen(false);
//   };

//   return (
//     // <div>
//       <Dialog
//         open={props.open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Let Google help apps determine location. This means sending anonymous location data to
//             Google, even when no apps are running.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Disagree
//           </Button>
//         </DialogActions>
//       </Dialog>
//     // </div>
//   );
// }
