FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm build
CMD [ "pnpm", "start:prod" ]