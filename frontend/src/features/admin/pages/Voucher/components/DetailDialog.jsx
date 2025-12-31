import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import DateInput from "@/shared/components/input/DateInput";
import ServiceService from "@/shared/services/service.service";

const voucherSchema = Yup.object().shape({
  isGlobal: Yup.boolean(),
  serviceId: Yup.string()
    .nullable()
    .when("isGlobal", {
      is: false,
      then: () => Yup.string().required("Vui lòng chọn dịch vụ (hoặc tích Global)"),
      otherwise: () => Yup.string().nullable(),
    }),
  title: Yup.string().required("Tiêu đề bắt buộc").min(3).max(200),
  code: Yup.string()
    .required("Code bắt buộc")
    .uppercase()
    .matches(/^[A-Z0-9_-]+$/, "Code chỉ chứa chữ hoa, số, _ và -")
    .min(4)
    .max(20),
  discountPercent: Yup.number()
    .required("Giảm giá bắt buộc")
    .min(0, "Tối thiểu 0%")
    .max(100, "Tối đa 100%"),
  description: Yup.string().nullable(),
  validFrom: Yup.mixed().nullable(),
  validTo: Yup.mixed()
    .nullable()
    .test("is-after-start", "Ngày kết thúc phải sau ngày bắt đầu", function (value) {
      const { validFrom } = this.parent;
      if (!validFrom || !value) return true;
      return dayjs(value).isAfter(dayjs(validFrom)) || dayjs(value).isSame(dayjs(validFrom));
    }),
  maxUses: Yup.number().nullable().min(1, "Tối thiểu 1 lượt"),
});

export default function AdminVoucherDialog({ open, onClose, onSubmit, voucher }) {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(voucherSchema),
    defaultValues: {
      isGlobal: false,
      serviceId: "",
      title: "",
      code: "",
      discountPercent: 0,
      description: "",
      validFrom: null,
      validTo: null,
      maxUses: 20,
    },
  });

  const isGlobalChecked = watch("isGlobal");

  useEffect(() => {
    if (open) {
      const fetchServices = async () => {
        setLoadingServices(true);
        try {
          const res = await ServiceService.getAll();
          const serviceList = res.data?.services || res.data || res || [];
          setServices(Array.isArray(serviceList) ? serviceList : []);
        } catch (error) {
          console.error("Failed to fetch services", error);
        } finally {
          setLoadingServices(false);
        }
      };
      fetchServices();
    }
  }, [open]);

  useEffect(() => {
    if (voucher) {
      reset({
        isGlobal: voucher.isGlobal || false,
        serviceId: voucher.isGlobal
          ? ""
          : voucher.serviceId || (voucher.service ? voucher.service.id : ""),
        title: voucher.title || "",
        code: voucher.code || "",
        discountPercent: voucher.discountPercent || 0,
        description: voucher.description || "",
        validFrom: voucher.validFrom ? dayjs(voucher.validFrom) : null,
        validTo: voucher.validTo ? dayjs(voucher.validTo) : null,
        maxUses: voucher.maxUses || 10,
      });
    } else {
      reset({
        isGlobal: false,
        serviceId: "",
        title: "",
        code: "",
        discountPercent: 0,
        description: "",
        validFrom: null,
        validTo: null,
        maxUses: 20,
      });
    }
  }, [voucher, reset]);

  const handleFormSubmit = (data) => {
    const payload = {
      title: data.title,
      code: data.code,
      discountPercent: data.discountPercent,
      description: data.description,
      maxUses: data.maxUses,
      validFrom: data.validFrom ? dayjs(data.validFrom).toISOString() : null,
      validTo: data.validTo ? dayjs(data.validTo).toISOString() : null,
    };
    if (!voucher) {
      payload.serviceId = Number(data.serviceId);
      payload.isGlobal = data.isGlobal;
    }

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{voucher ? "Chỉnh sửa Voucher (Admin)" : "Tạo Voucher mới (Admin)"}</DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1, mb: 1 }}>
          <Controller
            name="isGlobal"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      if (e.target.checked) {
                        setValue("serviceId", "");
                        trigger("serviceId");
                      }
                    }}
                    disabled={!!voucher}
                  />
                }
                label="Áp dụng toàn sàn (Global Voucher)"
              />
            )}
          />
        </Box>

        <Controller
          name="serviceId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Áp dụng cho dịch vụ cụ thể"
              fullWidth
              margin="normal"
              disabled={isGlobalChecked || loadingServices || !!voucher}
              error={!!errors.serviceId}
              helperText={errors.serviceId?.message}
              sx={{ opacity: isGlobalChecked ? 0.6 : 1 }}
            >
              {loadingServices ? (
                <MenuItem disabled>
                  <CircularProgress size={20} /> Đang tải...
                </MenuItem>
              ) : (
                services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name} {service.provider ? `(${service.provider.user?.name})` : ""}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}
        />

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tiêu đề Voucher"
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mã Code"
                fullWidth
                margin="normal"
                error={!!errors.code}
                helperText={errors.code?.message}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            )}
          />
          <Controller
            name="discountPercent"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Giảm giá (%)"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.discountPercent}
                helperText={errors.discountPercent?.message}
              />
            )}
          />
        </Box>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mô tả chi tiết"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Controller
            name="validFrom"
            control={control}
            render={({ field }) => (
              <DateInput
                {...field}
                label="Ngày bắt đầu"
                error={!!errors.validFrom}
                helperText={errors.validFrom?.message}
              />
            )}
          />
          <Controller
            name="validTo"
            control={control}
            render={({ field }) => (
              <DateInput
                {...field}
                label="Ngày kết thúc"
                error={!!errors.validTo}
                helperText={errors.validTo?.message}
              />
            )}
          />
        </Box>

        <Controller
          name="maxUses"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Số lượt sử dụng tối đa"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.maxUses}
              helperText={errors.maxUses?.message}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">
          {voucher ? "Cập nhật" : "Tạo mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
