

FROM onlyoffice/documentserver:8.1.0 AS nginx-client
RUN rm -fr /var/www/onlyoffice/documentserver/sdkjs/slide/themes/src/*
RUN add-apt-repository ppa:openjdk-r/ppa && \
    apt-get update && \
    apt-get install -y openjdk-17-jdk && \
    apt-get clean
# Verify the installation
RUN java -version

COPY onlyoffice-plugin /var/www/onlyoffice/documentserver/sdkjs-plugins/doc2md/

COPY client/dist /var/www/onlyoffice/documentserver/sdkjs-plugins/doc2md/
COPY onlyoffice-plugin/ds-librechat.conf /etc/onlyoffice/documentserver/nginx/includes/ds-docservice.conf
COPY sdkjs/deploy/sdkjs/slide/sdk-all.js /var/www/onlyoffice/documentserver/sdkjs/slide/sdk-all.js
COPY sdkjs/deploy/sdkjs/slide/sdk-all-min.js /var/www/onlyoffice/documentserver/sdkjs/slide/sdk-all-min.js
COPY web-apps/deploy/web-apps/apps/presentationeditor /var/www/onlyoffice/documentserver/web-apps/apps/presentationeditor

