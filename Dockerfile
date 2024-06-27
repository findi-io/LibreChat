

FROM onlyoffice/documentserver:8.0.1 AS nginx-client
COPY onlyoffice-plugin /var/www/onlyoffice/documentserver/sdkjs-plugins/doc2md/
COPY autocomplete /var/www/onlyoffice/documentserver/sdkjs-plugins/autocomplete/

COPY client/dist /var/www/onlyoffice/documentserver/sdkjs-plugins/doc2md/
COPY onlyoffice-plugin/ds-librechat.conf /etc/onlyoffice/documentserver/nginx/includes/ds-docservice.conf
#COPY sdk-all.js /var/www/onlyoffice/documentserver/sdkjs/slide/sdk-all.js
#COPY sdk-all-min.js /var/www/onlyoffice/documentserver/sdkjs/slide/sdk-all-min.js
#COPY web-apps /var/www/onlyoffice/documentserver/web-apps
#RUN rm -fr /var/www/onlyoffice/documentserver/sdkjs/slide/themes/src
#COPY blue.pptx /var/www/onlyoffice/documentserver/sdkjs/slide/themes/src/blue.pptx
