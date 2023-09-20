FROM node:18 as builder

LABEL maintainer="info@redpencil.io"

ARG CONTROLE=false
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN CONTROLE=$CONTROLE npm run build

FROM semtech/ember-proxy-service:1.5.1

ENV STATIC_FOLDERS_REGEX "^/(assets|font|files|toezicht/bestanden|@appuniversum)/"

COPY ./proxy/file-upload.conf /config/file-upload.conf

COPY --from=builder /app/dist /app
