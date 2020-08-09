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
  format?: (v: number) => string;
}

export const ColumnHeader = (props: {
  columns: ColumnDef[];
  sortBy: string;
  sortDesc: boolean;
  onSort: any;
}) => {
  const { columns, sortBy, sortDesc, onSort } = props;

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align}
            style={{ minWidth: column.minWidth }}
          >
            {!column.id ? undefined : (
              <TableSortLabel
                active={sortBy === column.id}
                direction={
                  sortBy === column.id ? (sortDesc ? "asc" : "desc") : "asc"
                }
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
