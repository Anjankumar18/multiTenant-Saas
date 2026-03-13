FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# temporary DB url for build stage
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node","dist/src/main.js"]