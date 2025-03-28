FROM node:18-alpine AS base

# Cài đặt các phụ thuộc
RUN apk add --no-cache libc6-compat openssl

# Thiết lập thư mục làm việc
FROM base AS builder
WORKDIR /app

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt phụ thuộc
RUN npm ci

# Sao chép tất cả các file khác
COPY . .

# Tạo Prisma client
RUN npx prisma generate

# Build ứng dụng
RUN npm run build

# Tạo container production
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Sao chép các thư mục cần thiết từ builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# Đặt quyền thực thi cho script khởi động
RUN chmod +x ./scripts/start.sh

# Đặt người dùng và quyền
USER nextjs

# Expose port 3000
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Chạy ứng dụng với script khởi động
CMD ["./scripts/start.sh"]