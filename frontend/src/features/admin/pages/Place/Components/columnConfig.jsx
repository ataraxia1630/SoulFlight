import formatPrice from "@/shared/utils/FormatPrice";

const columnConfig = [
  {
    id: "index",
    label: "STT",
    width: "8%",
    header_align: "center",
    cell_align: "center",
    render: (index) => index + 1,
  },
  {
    id: "main_image",
    label: "HÌNH ẢNH",
    width: "15%",
    header_align: "center",
    cell_align: "center",
    is_picture: true,
  },
  {
    id: "name",
    label: "TÊN ĐỊA ĐIỂM",
    width: "25%",
    header_align: "left",
    cell_align: "left",
    search: true,
  },
  {
    id: "address",
    label: "ĐỊA CHỈ",
    width: "30%",
    header_align: "left",
    cell_align: "left",
    search: true,
  },
  {
    id: "entry_fee",
    label: "VÉ VÀO CỔNG",
    width: "15%",
    header_align: "center",
    cell_align: "center",
    render: (value) => formatPrice(value),
  },
  {
    id: "actions",
    label: "HÀNH ĐỘNG",
    width: "15%",
    header_align: "center",
    cell_align: "center",
  },
];

export default columnConfig;
