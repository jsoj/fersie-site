FROM nginx:1.25-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy site contents into Nginx default serve directory
COPY . /usr/share/nginx/html/

# Remove build artifacts/config files from web root if present
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
