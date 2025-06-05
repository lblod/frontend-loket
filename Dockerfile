FROM node:20.12 as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM semtech/static-file-service:0.2.0

COPY ./proxy/file-upload.conf /config/file-upload.conf

COPY --from=builder /app/dist /data
