FROM node:lts-iron AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /cwd
WORKDIR /cwd/apps/server

FROM base AS prod-deps
# Disable hoisting to avoid link issues
RUN pnpm config set node-linker hoisted --location=project
RUN --mount=type=cache,id=pnpm,target=/cwd/apps/server/node_modules pnpm install --frozen-lockfile --prod

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base AS prod
COPY ./package.json /app/package.json
WORKDIR /app
RUN rm -rf /cwd

COPY --from=prod-deps /cwd/node_modules /app/node_modules
COPY --from=build /cwd/apps/server/dist /app/dist
RUN pnpm exec playwright install chromium --with-deps

EXPOSE 3000
CMD ["node", "dist/main.js"]