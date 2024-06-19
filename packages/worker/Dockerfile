FROM node:iron-slim AS base

ENV PACKAGE=worker

FROM base AS build-base
COPY . /cwd
WORKDIR /cwd

FROM build-base AS prod-deps
RUN npm install -w @webwisp/${PACKAGE} --omit=dev --omit=optional

FROM build-base AS build
RUN npm install
RUN npm run build -w @webwisp/${PACKAGE}

FROM base AS runtime
ENV NODE_ENV=production

COPY ./LICENSE-MIT ./LICENSE-APACHE ./packages/${PACKAGE}/README.md ./packages/${PACKAGE}/package.json /app/
COPY --from=prod-deps /cwd/node_modules /app/node_modules
COPY --from=build /cwd/packages/${PACKAGE}/dist /app/dist

WORKDIR /app

CMD ["node", "dist/main.js"]