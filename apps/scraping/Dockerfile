FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/scraping/package.json ./apps/scraping/
COPY shared/db/package.json ./shared/db/

RUN npm ci --workspace=apps/scraping --workspace=shared/db

COPY apps/scraping ./apps/scraping
COPY shared/db ./shared/db

EXPOSE 8081

CMD ["npx", "tsx", "./apps/scraping/src/server.ts"]
