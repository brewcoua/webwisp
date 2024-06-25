FROM node:iron-slim AS base
LABEL org.opencontainers.image.source="https://github.com/brewcoua/webwisp"

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

FROM prod-deps AS playwright
RUN npx playwright install chromium --with-deps

FROM playwright AS runtime
ENV NODE_ENV=production

COPY ./LICENSE-MIT ./LICENSE-APACHE ./packages/${PACKAGE}/README.md /cwd/
COPY --from=build /cwd/packages/${PACKAGE}/dist /cwd/dist

CMD ["node", "dist/main.js"]