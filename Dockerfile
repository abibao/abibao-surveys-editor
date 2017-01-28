FROM mhart/alpine-node:6

MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json /usr/app
ADD src /usr/app/src
ADD config /usr/app/config
ADD server /usr/app/server
ADD public /usr/app/public

RUN apk add --update make gcc g++ python git

RUN npm install  && \
    npm run build  && \
    npm prune --production && \
    npm uninstall -g npm

RUN apk del make gcc g++ python git && \
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

COPY public/editor.html /usr/app/build
ADD public/surveyjs /usr/app/build/surveyjs
ADD public/surveyjs.editor /usr/app/build/surveyjs.editor
COPY robot.txt /usr/app/build

EXPOSE 80
CMD ["node", "server/start"]
