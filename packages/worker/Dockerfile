FROM node:iron-slim AS base

ENV PACKAGE=worker

FROM base AS deps
COPY ./packages/${PACKAGE}/package.json /cwd/packages/${PACKAGE}/package.json
COPY ./package.json ./package-lock.json /cwd/
WORKDIR /cwd

FROM deps AS prod-deps
RUN npm install -w @webwisp/${PACKAGE} --omit=dev --omit=optional

FROM deps AS dev-deps
RUN npm install
RUN npx playwright install chromium --with-deps

FROM base AS build
COPY ./packages/${PACKAGE} /cwd/packages/${PACKAGE}
COPY ./package.json ./tsconfig.base.json /cwd/
COPY --from=dev-deps /cwd/node_modules /cwd/node_modules
WORKDIR /cwd

RUN npm run build -w @webwisp/${PACKAGE}

FROM base AS runtime
ENV NODE_ENV=production

COPY ./LICENSE-MIT ./LICENSE-APACHE ./packages/${PACKAGE}/README.md ./packages/${PACKAGE}/package.json /app/
COPY --from=prod-deps /cwd/node_modules /app/node_modules
COPY --from=build /cwd/packages/${PACKAGE}/dist /app/dist

WORKDIR /app

CMD ["node", "dist/main.js"]