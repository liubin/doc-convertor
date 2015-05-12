FROM centos:centos7

MAINTAINER Bin Liu <liubin0329@gmail.com>

RUN yum update -y
RUN yum install -y libreoffice-headless libreoffice-writer libreoffice-calc libreoffice- libreoffice-impress libreoffice-langpack-zh-Hans libreoffice-langpack-zh-Hant libreoffice-langpack-ja ImageMagick curl

RUN curl -sL https://rpm.nodesource.com/setup | bash -

RUN yum install -y nodejs npm

RUN yum clean all

RUN npm install qiniu

WORKDIR /

ADD uploader.js /uploader.js