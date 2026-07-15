# Multi-Social-Analytic-MSA (MSA)

## Tổng quan
Hệ thống phân tích hiệu suất nội dung đa nền tảng theo thời gian thực — theo dõi KOL, phân tích cảm xúc khán giả (sentiment), so sánh đối thủ, và cảnh báo khủng hoảng truyền thông. Đây là dự án có chiều sâu kỹ thuật AI cao nhất trong danh mục (dù chỉ 0★).

## Vấn đề giải quyết
Đội ngũ marketing/truyền thông cần theo dõi nhiều kênh mạng xã hội cùng lúc, phát hiện sớm khủng hoảng (bình luận tiêu cực tăng đột biến) và đo lường hiệu quả KOL — việc này khó làm thủ công ở quy mô lớn.

## Công nghệ
- Frontend: Next.js/React
- Backend AI/NLP: Python FastAPI, dùng **PhoBERT** (mô hình BERT tiếng Việt) để phân loại cảm xúc bình luận
- Backend đồng bộ: C# .NET
- Dữ liệu: PostgreSQL + Redis cache
- Triển khai: Docker

## Điểm nổi bật
- Dùng PhoBERT — mô hình NLP chuyên biệt cho tiếng Việt, xử lý theo batch 100 bình luận kèm garbage collection chủ động để giữ RAM ở mức ~100MB — cho thấy tư duy tối ưu tài nguyên thực chiến, không chỉ "gọi API AI" hời hợt.
- Có cơ chế cảnh báo khủng hoảng tự động dựa trên xu hướng cảm xúc — bài toán ứng dụng thực tế rõ ràng cho doanh nghiệp.
- Kiến trúc đa ngôn ngữ (Python + C#), microservice, thể hiện năng lực system design ngoài AI thuần tuý.

## Vai trò
Thiết kế kiến trúc hệ thống và pipeline AI/NLP.

## Gợi ý ý tưởng hình ảnh (để tự viết prompt Gemini)
- Ẩn dụ trung tâm: một mạng lưới các "nút mạng xã hội" (đại diện nhiều nền tảng) kết nối về một lõi xử lý trung tâm, các luồng dữ liệu đổi màu theo cảm xúc (có thể dùng cyan cho trung tính/tích cực, đỏ cảnh báo cho tiêu cực — nhưng vẫn giữ tông chủ đạo Tron đen-cyan).
- Có thể minh hoạ dạng "bảng điều khiển" holographic với biểu đồ 3D cyan nổi trên sàn phản chiếu, không hiện chữ.
- Nhấn mạnh cảm giác "giám sát thời gian thực" — ánh sáng chuyển động, không tĩnh.
