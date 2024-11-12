FROM nginx:alpine
COPY api.conf /etc/nginx/conf.d/api.conf
COPY cors_support.conf /etc/nginx/conf.d/cors_support.conf
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]