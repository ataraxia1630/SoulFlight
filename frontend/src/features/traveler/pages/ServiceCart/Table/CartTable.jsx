// src/components/CartTable.jsx

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, Checkbox, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import CustomTable from "../../../../../shared/components/Table";

export default function CartTable({ columns, data, onCartChange, onCheckout }) {
  const [selected, setSelected] = useState([]);

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? data.map((_, i) => i) : []);
  };

  const handleSelect = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const updateQuantity = (index, delta) => {
    const newData = [...data];
    newData[index].quantity = Math.max(1, newData[index].quantity + delta);
    onCartChange(newData);
  };

  const removeItem = (index) => {
    const newData = data.filter((_, i) => i !== index);
    onCartChange(newData);
    setSelected(selected.filter((i) => i !== index));
  };

  const total = useMemo(() => {
    return data
      .filter((_, i) => selected.includes(i))
      .reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
  }, [data, selected]);

  // Gắn hành động vào cột (nếu cần)
  const enhancedColumns = columns.map((col) => {
    if (col.id === "select") {
      return {
        ...col,
        render: (_, __, index) => (
          <Checkbox
            size="small"
            checked={selected.includes(index)}
            onChange={() => handleSelect(index)}
          />
        ),
        header_render: () => (
          <Checkbox
            size="small"
            checked={selected.length === data.length && data.length > 0}
            indeterminate={selected.length > 0 && selected.length < data.length}
            onChange={handleSelectAll}
          />
        ),
      };
    }
    if (col.id === "quantity") {
      return {
        ...col,
        render: (_, row, index) => (
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              size="small"
              onClick={() => updateQuantity(index, -1)}
              disabled={row.quantity <= 1}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ minWidth: 30, textAlign: "center", fontWeight: 500 }}>
              {row.quantity}
            </Typography>
            <IconButton size="small" onClick={() => updateQuantity(index, 1)}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        ),
      };
    }
    if (col.id === "action") {
      return {
        ...col,
        render: (_, __, index) => (
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => removeItem(index)}
          >
            Xóa
          </Button>
        ),
      };
    }
    return col;
  });

  return (
    <Box>
      <CustomTable columns={enhancedColumns} data={data} />

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Đã chọn ({selected.length}) dịch vụ
        </Typography>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Box textAlign="right">
            <Typography variant="body2">Tổng thanh toán:</Typography>
            <Typography variant="h6" color="error" fontWeight={600}>
              {total.toLocaleString()}đ
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="error"
            size="large"
            disabled={selected.length === 0}
            onClick={onCheckout}
            sx={{ px: 4 }}
          >
            Đặt Dịch Vụ
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
