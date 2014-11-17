FROM centos:centos7

MAINTAINER Bin Liu <liubin0329@gmail.com>

RUN yum install -y libreoffice-headless libreoffice-writer libreoffice-calc libreoffice- libreoffice-impress libreoffice-langpack-zh-Hans libreoffice-langpack-zh-Hant libreoffice-langpack-ja && yum clean all
