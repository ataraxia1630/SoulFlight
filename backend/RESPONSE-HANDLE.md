## CÁCH LÀM VIỆC VỚI API RESPONSE

### Xử lý lỗi (trong service hoặc controller)

- Dùng AppError(statusCode, message, code, params = {})
- 'code' ở đây chính là key để map với FE, 'message' là fallback trong trường hợp ko có translation phù hợp
- 'params' là những tham số muốn truyền vô translation cùng với 'code'
- VD: const translated = i18n.exists(code) ? i18n.t(code, params) : message;

### Trả về response (trong controller)

- Dùng ApiResponse (thường là ApiResponse.success, do ApiResponse.error đã được tự động gọi thông qua AppError và errorHandler rồi)
- Như này: res.status(...).json(ApiResponse.success(data, message = 'success', code = 'SUCCESS', params = {}))
- 'data' là dữ liệu trả về để FE xử lý
- 'code' ở đây chính là key để map với FE, 'message' là fallback trong trường hợp ko có translation phù hợp
- 'params' là những tham số muốn truyền vô translation cùng với 'code'

### Lưu ý:

- Thường thì các lỗi trả về sẽ bắt buộc cần có 'code' và 'message' để bắt lỗi, vì lỗi thì khó để biết trước hết đc
- Nhưng TH success thì hoàn toàn có thể bỏ qua, FE có thể viết thẳng vô: i18n.t(FE_key - key do FE tự định nghĩa) mà ko cần map từ key 'code' của BE, trừ TH cần thêm params
- Có thể tham khảo authService và authController để hình dung
