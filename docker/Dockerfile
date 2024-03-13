FROM nginx
VOLUME ["/tmp"]
COPY ./dist/ /usr/share/nginx/html/
RUN pwd
RUN ls -lh
ADD ./docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80