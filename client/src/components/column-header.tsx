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
  onSort: (id: string) => void;
}) => {
  const { columns, sortBy, sortAsc, onSort } = props;

  return (
    <TableHead id="column-header">
      <TableRow>
        {columns.map((column) => (
          <TableCell
            id={column.id}
            key={column.id}
            align={column.align}
            style={{ minWidth: column.minWidth }}
          >
            {!column.sortable ? (
              column.label
            ) : (
              <TableSortLabel
                id="sort"
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
