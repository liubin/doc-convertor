doc-convertor
====================

[English Version Document](README_en.md).

本镜像预安装了CentOS 7 和LibreOffice，以及Node.js，能将Office文档转换为PDF文件以及png图片，并上传到七牛云存储。

# 使用方法

## Build Image

```
sudo docker build -t doc-convertor .
```

## 将Offcie文档转换为Pdf文件

由于镜像内已经安装了LibreOffice，可以直接使用`libreoffice`命令进行文档转换。

```
sudo docker run  -v /YOUR_HOST_PATH/:/tmp doc-convertor libreoffice  \
--headless --convert-to pdf /tmp/SOME_OFFICE_FILE --outdir /tmp
```

其中`YOUR_HOST_PATH`是宿主机的文件夹路径，而`SOME_OFFICE_FILE`则是要转换的文件名（已经被映射到了容器的/tmp下）。

## 将Pdf文件转换为图像

```
$ sudo docker run -v /YOUR_HOST_PATH:/tmp doc-convertor convert /tmp/SOME.PDF /tmp/test-%02d.png
```

该命令的详细说明请参看[这里的文档](http://www.imagemagick.org/script/command-line-processing.php)


## 一站式解决方案

```
$ sudo docker run -v /YOUR_HOST_PATH:/THIS_PATH_WILL_BE_QINIU_KEY \
  -e QINIU_BUCKET_NAME=xxx \
  -e QINIU_SECRET_KEY=yyy \
  -e QINIU_ACCESS_KEY=zzz \
  -e DOC_PATH=/THIS_PATH_WILL_BE_QINIU_KEY/SOMETHING-LIKE-UUID-TO-BE-A-KEY \
  doc-convertor node uploader.js
```

该方法会将宿主机`/YOUR_HOST_PATH`下的文档转换为Pdf及图像后，并上传到七牛云存储。如果`QINIU_`开头的环境变量没有设置，则会略过上传步骤。上传到七牛时的key（即对象标识符）为容器内该文件的full path`/THIS_PATH_WILL_BE_QINIU_KEY`。

输出类似下面这样:

```
page_count: 8
/app2/temp/d-000.png: FvoI-yedq3BGxmCJOh1ne0P5bVLH
/app2/temp/d-006.png: Fu_0KFOH1eTy3kYsrvz6RkaLgEiA
/app2/temp/d-007.png: FpgptqUl72NiEwVttCE7_BcS0SK7
/app2/temp/d-001.png: FoCh4_FFGjy2PqXkikne171kjr_l
/app2/temp/d-005.png: FvrqA_Elrd5oXqpSkVjHpljrRZBz
/app2/temp/d-003.png: FjsUZFLb3sGzyksfqoKLx6qNGb-g
/app2/temp/d.docx: FnOCwMDsU8dDjv0WyCV0v7kchtPO
/app2/temp/d-004.png: FkFLGKaZXdjV3UFU4V43kNc2e8OK
/app2/temp/d-002.png: FkWirLGmINxYX0_5XuHTErss_Clu
/app2/temp/d.pdf: FrROdUt5aXhE9rXTnMzoCHg8xqTe
```

文件名映射规则为:

* 假设原文件名d.docx；
* 则pdf文件名为d.pdf，扩展名会替换为pdf；
* png文件默认采`d-%03d.png`这种形式，即加上了000,001这样的后缀；
* page_count是总页数，这是通过计算png文件数量实现的；
* 如果文件被上传到了七牛，则会输出`key: hash`。
