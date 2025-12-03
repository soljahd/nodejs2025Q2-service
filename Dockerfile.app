FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY ./tsconfig.json ./
COPY ./prisma ./prisma

RUN npx prisma generate

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY ./tsconfig.json ./
COPY ./src ./src
COPY ./doc ./doc

COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/@prisma/client-runtime-utils ./node_modules/@prisma/client-runtime-utils
COPY --from=builder /app/generated ./generated

EXPOSE $PORT

CMD ["npm", "run", "start:dev-poll"]