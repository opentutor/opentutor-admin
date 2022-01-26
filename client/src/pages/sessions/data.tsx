/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { withPrefix } from "gatsby";
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import clsx from "clsx";
import { lighten, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Container,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import AssessmentIcon from "@material-ui/icons/Assessment";
import CheckIcon from "@material-ui/icons/Check";
import FilterListIcon from "@material-ui/icons/FilterList";
import GetAppIcon from "@material-ui/icons/GetApp";
import NavBar from "components/nav-bar";
import { ExpectationsDataFilter, UserRole } from "types";
import SessionContext from "context/session";
import withLocation from "wrap-with-location";
import { Helmet } from "react-helmet";
import { useState, useEffect, useRef } from "react";
import FilteringDialog from "components/filtering-dialog";
import { SessionData, useWithSessionData } from "hooks/use-with-session-data";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | boolean },
  b: { [key in Key]: number | string | boolean }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof SessionData | "actions";
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: "date", numeric: false, disablePadding: false, label: "Date" },
  { id: "username", numeric: false, disablePadding: false, label: "User Name" },
  {
    id: "userAnswer",
    numeric: false,
    disablePadding: false,
    label: "User Answer",
  },
  { id: "grade", numeric: false, disablePadding: false, label: "Grade" },
  {
    id: "classifierGrade",
    numeric: false,
    disablePadding: false,
    label: "Classifier Grade",
  },
  {
    id: "confidence",
    numeric: false,
    disablePadding: false,
    label: "Confidence",
  },
  { id: "accurate", numeric: false, disablePadding: false, label: "Accurate" },
  { id: "actions", numeric: false, disablePadding: true, label: "" },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof SessionData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof SessionData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            data-cy={headCell.id}
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id !== "actions" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                className={classes.tableHeader}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              <></>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
    fontWeight: "bold",
  },
}));

interface EnhancedTableToolbarProps {
  numSelected: number;
  rows: SessionData[];
  rowsUnfiltered: SessionData[];
  expectation: string;
  setRows: React.Dispatch<React.SetStateAction<SessionData[]>>;
  setPage: (value: React.SetStateAction<number>) => void;
  onInvalidate: (invalid: boolean) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, expectation, rows } = props;
  const [openFilterView, setOpenFilterView] = useState(false);
  const fileDownloadAnchor = useRef<HTMLAnchorElement>(null);
  const [fileDownloadUrl, setFileDownloadUrl] = useState("");

  const handleFilterViewOpen = () => {
    setOpenFilterView(true);
  };

  function exportData() {
    // Prepare data:
    const contents: string[][] = [];
    contents.push([
      "Date",
      "User Name",
      "User Answer",
      "Grade",
      "Classifier Grade",
      "Confidence",
      "Accurate",
    ]);
    rows.forEach((row) => {
      contents.push([
        row.date,
        row.username,
        row.userAnswer,
        row.grade,
        row.classifierGrade,
        row.confidence,
        row.accurate,
      ]);
    });
    const output: string = makeCSV(contents);

    // Download it
    const blob = new Blob([output]);
    const fileDownloadUrl = URL.createObjectURL(blob);
    setFileDownloadUrl(fileDownloadUrl);
  }

  function makeCSV(content: string[][]) {
    let csv = "";
    content.forEach((value) => {
      value.forEach((item, i) => {
        const innerValue = item === null ? "" : item.toString();
        let result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) {
          result = '"' + result + '"';
        }
        if (i > 0) {
          csv += ",";
        }
        csv += result;
      });
      csv += "\n";
    });
    return csv;
  }

  useEffect(() => {
    //Callback
    if (fileDownloadUrl !== "") {
      if (fileDownloadAnchor.current) {
        fileDownloadAnchor.current.click();
      } else {
        console.log("Could not download csv.");
      }
      URL.revokeObjectURL(fileDownloadUrl); // free up storage--no longer needed.
      setFileDownloadUrl("");
    }
  }, [fileDownloadUrl]);

  //Filtering
  const defaultFilter: ExpectationsDataFilter = {
    hideUngraded: false,
    hideInvalid: false,
    dirty: false,
  };
  const [filter, setFilter] = React.useState(defaultFilter);

  return (
    <div>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography
            className={classes.title}
            color="inherit"
            variant="subtitle1"
            component="div"
            data-cy="selected-title"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
            data-cy="table-title"
          >
            Training Data: {expectation}
          </Typography>
        )}
        {numSelected > 0 ? (
          <>
            <Tooltip title="Include" arrow>
              <IconButton
                aria-label="include"
                data-cy="include-button"
                onClick={() => {
                  props.onInvalidate(false);
                  setFilter(defaultFilter);
                }}
              >
                <CheckIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exclude" arrow>
              <IconButton
                aria-label="exclude"
                data-cy="exclude-button"
                onClick={() => {
                  props.onInvalidate(true);
                  setFilter(defaultFilter);
                }}
              >
                <NotInterestedIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="Download Expectation Data" arrow>
              <IconButton
                aria-label="download expectation data"
                onClick={exportData}
                data-cy="download-button"
              >
                <GetAppIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter list" arrow>
              <IconButton
                aria-label="filter list"
                onClick={handleFilterViewOpen}
                data-cy="filter-button"
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Toolbar>
      <FilteringDialog
        open={openFilterView}
        setOpen={setOpenFilterView}
        filter={filter}
        setFilter={setFilter}
        {...props}
      />
      <a
        style={{ display: "none" }}
        download={"expectation_data.csv"}
        href={fileDownloadUrl}
        ref={fileDownloadAnchor}
      >
        Download File
      </a>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  progress: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  background: {
    height: "100vh",
    width: "100%",
  },
  tableHeader: {
    fontWeight: 600,
  },
  normalButton: {
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

function EnhancedTable(props: { lessonId: string; expectation: number }) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<string[]>([]);
  const [dense, setDense] = React.useState(false);
  const useSessionData = useWithSessionData(props.lessonId, props.expectation);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof SessionData>("date");
  const [rows, setRows] = React.useState(useSessionData.rows);

  React.useEffect(() => {
    setRows(useSessionData.rows);
  }, [useSessionData.rows]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof SessionData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id); //Used to be n.name
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  function handleInvalidate(invalid: boolean) {
    useSessionData.toggleInvalids(selected, invalid);
    setSelected([]);
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1; //used to be name

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root} data-cy="expectation-table">
      <Paper className={classes.paper} elevation={3}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          rows={rows}
          rowsUnfiltered={useSessionData.rows}
          setPage={setPage}
          setRows={setRows}
          onInvalidate={handleInvalidate}
          expectation={useSessionData.expectationTitle}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      data-cy={`table-row-${index}`}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          data-cy="checkbox"
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        style={row.invalid ? { color: "grey" } : {}}
                      >
                        {row.date}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={row.invalid ? { color: "grey" } : {}}
                      >
                        {row.username}
                      </TableCell>
                      <TableCell align="left">
                        {row.invalid ? (
                          <div
                            data-cy="invalid-answer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <span style={{ color: "grey" }}>
                              {row.userAnswer}
                            </span>
                            <Tooltip
                              title="This answer is not included in training"
                              arrow
                            >
                              <NotInterestedIcon
                                style={{ color: "orange", marginLeft: 5 }}
                                fontSize="small"
                              />
                            </Tooltip>
                          </div>
                        ) : (
                          <>{row.userAnswer}</>
                        )}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={row.invalid ? { color: "grey" } : {}}
                      >
                        {row.grade}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={row.invalid ? { color: "grey" } : {}}
                      >
                        {row.classifierGrade}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={row.invalid ? { color: "grey" } : {}}
                      >
                        {row.confidence}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={row.invalid ? { color: "grey" } : {}}
                      >
                        {row.accurate}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          data-cy="grade-button"
                          size="small"
                          className={classes.normalButton}
                          href={withPrefix(
                            `/sessions/session?sessionId=${row.session}`
                          )}
                        >
                          <AssessmentIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={9} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Compact Data View"
      />
    </div>
  );
}

export interface LessonExpectationSearch {
  lessonId: string;
  expectation: number;
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
function Data(props: { search: LessonExpectationSearch }): JSX.Element {
  const { lessonId, expectation } = props.search;
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);
  const styles = useStyles();

  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view settings.</div>;
  }
  if (!lessonId || !expectation) {
    return (
      <div data-cy="malformed-link">
        {
          "That's a bad link! Please double check your link and try again (Error: Missing query params)."
        }
      </div>
    );
  }
  if (!context.user) {
    return <CircularProgress className={styles.progress} />;
  }
  if (context.user.userRole !== UserRole.ADMIN) {
    return <div>You must be an admin to view this page.</div>;
  }

  // return (
  //   <div>
  //     <NavBar title="Expectation Data" />
  //     <AlertDialog/>
  //     {/*<Button variant="outlined" color="primary" onClick={() => {console.log("Done")}}>*/}
  //     {/*  Open alert dialog*/}
  //     {/*</Button>*/}
  //   </div>
  // );

  return (
    <>
      <div className={styles.background}>
        <Helmet>
          <style>{"body { background-color: #F5F5F5; }"}</style>
          {/* MUI Gray 100 */}
        </Helmet>
        <NavBar title="Expectation Data" />
        <Container maxWidth="xl">
          <div style={{ marginTop: 40 }}>
            <EnhancedTable lessonId={lessonId} expectation={expectation} />
          </div>
        </Container>
      </div>
    </>
  );
}

export default withLocation(Data);
