FROM node:16.13.2-alpine3.15

WORKDIR /backend

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]