/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { SessionData } from "hooks/use-with-session-data";
import { ExpectationsDataFilter } from "types";

interface FilteringProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rows: SessionData[];
  setRows: React.Dispatch<React.SetStateAction<SessionData[]>>;
  rowsUnfiltered: SessionData[];
  setPage: (value: React.SetStateAction<number>) => void;
  filter: ExpectationsDataFilter;
  setFilter: React.Dispatch<React.SetStateAction<ExpectationsDataFilter>>;
}

export default function FilteringDialog(props: FilteringProps): JSX.Element {
  const { filter, setFilter } = props;
  const handleClose = () => {
    if (filter.dirty) {
      //Update the rows
      const tempRows: SessionData[] = [];
      props.rowsUnfiltered.forEach((row: SessionData) => {
        if (filter.hideUngraded) {
          if (row.grade) {
            if (filter.hideInvalid) {
              if (!row.invalid) {
                tempRows.push(row);
              }
            } else {
              tempRows.push(row);
            }
          }
        } else {
          if (filter.hideInvalid) {
            if (!row.invalid) {
              tempRows.push(row);
            }
          } else {
            tempRows.push(row);
          }
        }
      });
      props.setRows(tempRows);
      props.setPage(0);
      setFilter({ ...filter, dirty: false });
    }
    props.setOpen(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <DialogTitle id="customized-dialog-title">Filters</DialogTitle>
      <DialogContent dividers>
        <FormControlLabel
          control={
            <Switch
              checked={filter.hideUngraded}
              onChange={() => {
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
        <FormControlLabel
          control={
            <Switch
              checked={filter.hideInvalid}
              onChange={() => {
                setFilter({
                  ...filter,
                  hideInvalid: !filter.hideInvalid,
                  dirty: true,
                });
              }}
            />
          }
          label="Hide Invalidated Data"
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
