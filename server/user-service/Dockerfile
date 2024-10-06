FROM node:18-alpine
ARG PORT
ENV PORT=$PORT
WORKDIR /app
COPY . .
RUN npm install --omit=dev
CMD ["npm", "start"]
EXPOSE $PORT
