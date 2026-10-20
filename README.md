# Gửi Huyền, dưới trời tím

Một website tĩnh một trang chúc mừng 20/10 dành cho Vũ Minh Huyền. Dự án dùng HTML, CSS và JavaScript thuần; không cần cài package hay chạy build.

## Chạy trên máy

Mở `index.html` trực tiếp trong trình duyệt, hoặc chạy một máy chủ tĩnh từ thư mục này, ví dụ:

```powershell
python -m http.server 8000
```

Sau đó mở `http://localhost:8000`.

## Đưa lên GitHub Pages

1. Đẩy các file của thư mục này lên nhánh `main` của repository.
2. Trong GitHub, mở **Settings → Pages**.
3. Ở **Build and deployment**, chọn **Deploy from a branch**, chọn nhánh `main` và thư mục `/(root)`, rồi lưu.
4. Chờ GitHub Pages hoàn tất lần triển khai đầu tiên. Repository tên `huyen` sẽ được phục vụ tại `https://17thedevv.github.io/huyen/` nếu tài khoản và tên repository vẫn giữ như hiện tại.

Trang dùng đường dẫn tương đối cho CSS và JavaScript nên chạy được ở đường dẫn con của GitHub Pages. Không có bước build.
