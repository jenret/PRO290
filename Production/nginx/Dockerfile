# FROM nginx

# WORKDIR /etc/nginx/conf.d
# RUN rm ./default.conf
# COPY nginx.conf .

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/
COPY sites-enabled/ /etc/nginx/conf.d/
