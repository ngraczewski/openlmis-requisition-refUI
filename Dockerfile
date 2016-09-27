FROM debian:jessie

#COPY build /usr/share/nginx/html
COPY build /etc/nginx/html

EXPOSE 9000