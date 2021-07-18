FROM node:alpine AS base

WORKDIR /app
COPY package.json .

From base AS dependencies
RUN yarn

# Development
FROM dependencies AS development_environment
COPY . .
EXPOSE 3333
CMD yarn dev

# Production
FROM dependencies AS production_environment
COPY . .
EXPOSE 3333
CMD yarn start
