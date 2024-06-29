

FROM onlyoffice/documentserver:8.1.0 AS nginx-client
COPY onlyoffice-plugin /var/www/onlyoffice/documentserver/sdkjs-plugins/doc2md/

COPY client/dist /var/www/onlyoffice/documentserver/sdkjs-plugins/doc2md/
COPY onlyoffice-plugin/ds-librechat.conf /etc/onlyoffice/documentserver/nginx/includes/ds-docservice.conf
