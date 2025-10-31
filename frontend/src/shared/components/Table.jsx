import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function CustomTable({ columns, data }) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ mt: 4, borderRadius: 2, overflow: "hidden" }}
    >
      <Table sx={{ minWidth: 650, tableLayout: "fixed" }} size="medium">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.header_align || "center"}
                width={column.width}
                sx={{
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontWeight: "600",
                  borderBottom: "1px solid #E0E0E0",
                  padding: "16px",
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                },
              }}
            >
              {columns.map((column) => {
                const value = row[column.id];

                const content = column.render ? column.render(value, row) : value;

                return (
                  <TableCell
                    key={column.id}
                    align={column.cell_align || "left"}
                    sx={{
                      padding: "16px",
                      borderBottom: "1px solid #F0F0F0",
                      ...column.sx,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: column.sx?.fontWeight || 400 }}>
                      {content}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
