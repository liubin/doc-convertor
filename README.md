docker-pdf-convertor
====================

with libre office installed on CentOS

# How to use

## Convert office documents to pdf files.

```
sudo docker run  -v /YOUR_HOST_PATH/:/tmp liubin/docker-pdf-convertor libreoffice  \
--headless --convert-to pdf /tmp/SOME_OFFICE_FILE --outdir /tmp
```

Where `YOUR_HOST_PATH` is somewhere your file located in your host filesystem, and `SOME_OFFICE_FILE` is the office file name.

## Convert pdf file to image files.

```
$ sudo docker run -v /YOUR_HOST_PATH:/tmp liubin/docker-pdf-convertor convert /tmp/SOME.PDF /tmp/test-%02d.png
```

for more information, please refer to [doc](http://www.imagemagick.org/script/command-line-processing.php)
