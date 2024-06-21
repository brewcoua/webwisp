FROM node:iron-slim AS base
LABEL org.opencontainers.image.source="https://github.com/brewcoua/webwisp"

ENV PACKAGE=orchestrator

FROM base AS deps
COPY ./packages/${PACKAGE}/package.json /cwd/packages/${PACKAGE}/package.json
COPY ./package.json ./package-lock.json /cwd/
WORKDIR /cwd

FROM deps AS prod-deps
RUN npm install -w @webwisp/${PACKAGE} --omit=dev --omit=optional

FROM deps AS dev-deps
RUN npm install

FROM base AS build
COPY ./packages/${PACKAGE} /cwd/packages/${PACKAGE}
COPY ./package.json /cwd/
COPY --from=dev-deps /cwd/node_modules /cwd/node_modules
WORKDIR /cwd

RUN npm run build -w @webwisp/${PACKAGE}

FROM base AS client-deps
COPY ./packages/client/package.json /cwd/packages/client/package.json
COPY ./package.json ./package-lock.json /cwd/
WORKDIR /cwd

RUN npm install

FROM base AS client-build
COPY ./packages/client /cwd/packages/client
COPY ./package.json /cwd/
COPY --from=client-deps /cwd/node_modules /cwd/node_modules
WORKDIR /cwd

RUN npm run build -w @webwisp/client

FROM base AS runtime
ENV NODE_ENV=production

COPY ./LICENSE-MIT ./LICENSE-APACHE ./packages/${PACKAGE}/README.md ./packages/${PACKAGE}/package.json /app/
COPY --from=prod-deps /cwd/node_modules /app/node_modules
COPY --from=build /cwd/packages/${PACKAGE}/dist /app/dist
COPY --from=client-build /cwd/packages/client/dist /app/public

WORKDIR /app

EXPOSE 3000
CMD ["node", "dist/main.js"]