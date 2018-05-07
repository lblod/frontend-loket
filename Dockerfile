FROM madnificent/ember:3.0.0 as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN ember build -prod


FROM semtech/ember-proxy-service:1.3.0

ENV STATIC_FOLDERS_REGEX "^/(assets|font|file-service)/"

COPY --from=builder /app/dist /app
