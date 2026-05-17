export {}; // thêm đoạn này vào để compiler biết đây là module
// kỹ thuật rất phổ biến khi dùng TypeScript với framework Express.js, được gọi là Type Augmentation (Mở rộng kiểu) hoặc cụ thể hơn là Declaration Merging (Gộp khai báo).
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
