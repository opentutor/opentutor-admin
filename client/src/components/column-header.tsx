import React from "react";
import {
  TableCell,
  TableHead,
  TableSortLabel,
  TableRow,
} from "@material-ui/core";

export interface ColumnDef {
  id: string;
  name?: string;
  label: string;
  minWidth: number;
  align?: "right" | "left" | "center";
  sortable?: boolean;
  format?: (v: number) => string;
}

export const ColumnHeader = (props: {
  columns: ColumnDef[];
  sortBy: string;
  sortAsc: boolean;
  onSort: any;
}) => {
  const { columns, sortBy, sortAsc, onSort } = props;

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align}
            style={{ minWidth: column.minWidth }}
          >
            {!column.sortable ? (
              column.label
            ) : (
              <TableSortLabel
                active={sortBy === column.id}
                direction={sortAsc ? "asc" : "desc"}
                onClick={() => {
                  onSort(column.id);
                }}
              >
                {column.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
