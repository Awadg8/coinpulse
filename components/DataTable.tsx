import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const DataTable = <T,>({
  columns,
  data,
  rowKey,
  tableClassName,
  headerRowClassName,
  headerCellClassName,
  bodyRowClassName,
  bodyCellClassName,
  headerClassName,
}: DataTableProps<T>) => {
  return (
    <Table className={cn("custom-scrollbar", tableClassName)}>
      <TableHeader className={headerClassName}>
        <TableRow className={cn("hover:bg-transparent!", headerRowClassName)}>
          {columns.map((column, index) => (
            <TableHead
              key={index}
              className={cn(
                "bg-dark-400 text-purple-100 py-4 first:pl-5 last:pr-5",
                headerCellClassName,
                column.headClassName,
              )}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center py-4"
            >
              No recent trades found
            </TableCell>
          </TableRow>
        ) : (

          data.map((row, rowIndex) => (
            <TableRow
              key={rowKey(row, rowIndex)}
              className={cn(
                "overflow-hidden rounded-lg border-b border-purple-100/5 hover:bg-dark-400/30! relative",
                bodyRowClassName,
              )}
            >
              {columns.map((column, columnIndex) => (
                <TableCell
                  key={columnIndex}
                  className={cn(
                    "py-4 first:pl-5 last:pr-5",
                    bodyCellClassName,
                    column.cellClassName,
                  )}
                >
                  {column.cell(row, rowIndex)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )
        }
      </TableBody>
    </Table>
  );
};

export default DataTable;
