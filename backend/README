### LƯU Ý TO BỰ
- Luôn check commit ko dính .env

### CÁC LỆNH CHẠY BACKEND 
// chạy theo thứ tự nhé
- Chuyển hướng vô thư mục backend:
cd backend
- Cài đặt thư viện:
npm install
- Đồng bộ DB:
npx prisma generate
- Chạy server:
npm run dev

### CÁC BƯỚC LÀM VIỆC VỚI PRISMA

## 1. Trước khi sửa:
- Pull main
- Chạy lệnh sau để đảm bảo là schema đồng bộ với DB hiện tại:
npx prisma generate

## 2. Sửa Schema:
- Sửa prisma/schema.prisma trên branch riêng.
- Sau khi sửa, chạy:
npx prisma migrate dev --name ten_migration
Ví dụ: npx prisma migrate dev --name add_user.

## 3. Cập Nhật Client:
- Luôn chạy sau khi sửa schema hoặc migration:
npx prisma generate

## 4. Commit và Merge vô main sớm nhất có thể


