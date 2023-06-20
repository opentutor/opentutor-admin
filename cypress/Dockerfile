FROM cypress/base:16
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

ENV CI=1
RUN npm ci

RUN npx cypress verify
