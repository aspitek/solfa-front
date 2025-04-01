# pulling base images
FROM node:20.12.2-alpine3.18 as base

# resolves /tmp security issue in latest debian version which prevents to update packages
RUN chmod 1777 /tmp

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json ./
RUN yarn install

FROM base as dev
WORKDIR /var/www/node/solfa

COPY --from=deps /app/node_modules /var/www/node/solfa/node_modules

# set up node and yarn
COPY --from=base /usr/lib /usr/lib
COPY --from=base /usr/local/share /usr/local/share
COPY --from=base /usr/local/lib /usr/local/lib
COPY --from=base /usr/local/include /usr/local/include
COPY --from=base /usr/local/bin /usr/local/bin

COPY docker-entrypoint.sh /usr/local/bin/app-docker-entrypoint.sh
RUN chmod 755 /usr/local/bin/app-docker-entrypoint.sh
EXPOSE 5173
ENTRYPOINT ["app-docker-entrypoint.sh"]
