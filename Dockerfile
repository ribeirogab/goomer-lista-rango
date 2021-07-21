FROM node:alpine AS base
WORKDIR /app
COPY package.json .

FROM base AS dependencies
RUN yarn --no-progress

FROM dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
EXPOSE 3333
CMD yarn dev
