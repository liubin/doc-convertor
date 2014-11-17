docker-pdf-convertor
====================

with libre office installed on CentOS

# How to use

```
sudo docker run  -v /YOUR_HOST_PATH/:/tmp liubin/docker-pdf-convertor libreoffice  \
--headless --convert-to pdf /tmp/SOME_OFFICE_FILE --outdir /tmp
```

Where `YOUR_HOST_PATH` is somewhere your file located in your host filesystem, and `SOME_OFFICE_FILE` is the office file name.

