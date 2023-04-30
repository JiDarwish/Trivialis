# Set nginx base image
FROM nginx

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom configuration file
COPY default.conf /etc/nginx/conf.d/