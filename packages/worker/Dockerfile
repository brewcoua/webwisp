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

FROM base AS build
COPY ./packages/${PACKAGE} /cwd/packages/${PACKAGE}
COPY ./package.json /cwd/
COPY --from=dev-deps /cwd/node_modules /cwd/node_modules
WORKDIR /cwd

RUN npm run build -w @webwisp/${PACKAGE}

FROM base AS playwright
RUN npx playwright install chromium --with-deps

FROM playwright AS runtime
ENV NODE_ENV=production

COPY ./LICENSE-MIT ./LICENSE-APACHE ./packages/${PACKAGE}/README.md ./packages/${PACKAGE}/package.json /app/

# If a .env is present, copy it to the app directory
COPY ./packages/${PACKAGE}/.env /app/.env

COPY --from=prod-deps /cwd/node_modules /app/node_modules
COPY --from=build /cwd/packages/${PACKAGE}/dist /app/dist

WORKDIR /app

CMD ["node", "dist/main.js"]