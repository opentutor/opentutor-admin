FROM node:12.18.3 as builder
ARG NODE_ENV
RUN apt-get update && \
    apt-get install -y \
        build-essential \
        libgif-dev \
        libglu1 \
        libjpeg-dev \
        libpng-dev \
        libtiff-dev \
        libxi-dev && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /
COPY . .
RUN cd /build/client && \
    yarn install --frozen-lockfile --ignore-optional && \
    npx gatsby telemetry --disable && \
    yarn run build
FROM node:12.18.3-slim
ENV TINI_VERSION=v0.16.1
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini 
WORKDIR /app
COPY . .
RUN rm -rf build
COPY --from=builder /build/client/public /app/public/admin
RUN yarn install --frozen-lockfile --ignore-optional --production 
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/tini", "--", "/app/entrypoint.sh"]