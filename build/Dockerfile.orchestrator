FROM node:iron-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ENV PORT=3000
ENV PACKAGE=orchestrator

FROM base AS build-base
COPY . /cwd
WORKDIR /cwd

FROM build-base AS prod-deps
RUN pnpm config set node-linker hoisted --location=project
RUN pnpm install --frozen-lockfile --prod --filter @webwisp/${PACKAGE}

FROM build-base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter @webwisp/${PACKAGE}
RUN pnpm exec lerna run build --scope @webwisp/${PACKAGE}

FROM base AS runtime
ENV NODE_ENV=production

COPY ./LICENSE-MIT ./LICENSE-APACHE ./packages/${PACKAGE}/README.md ./packages/${PACKAGE}/package.json /app/
COPY --from=prod-deps /cwd/node_modules /app/node_modules
COPY --from=build /cwd/packages/${PACKAGE}/dist /app/dist

WORKDIR /app

EXPOSE $PORT
CMD ["node", "dist/main.js"]