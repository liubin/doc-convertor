docker-pdf-convertor
====================

With libre office installed on CentOS, and also can upload to qiniu cloud storage.

# How to use

## Build Image

```
sudo docker build -t doc-convertor .
```

## Convert office documents to pdf files.

Since libreoffice is installed, you can use it directly.

```
sudo docker run  -v /YOUR_HOST_PATH/:/tmp doc-convertor libreoffice  \
--headless --convert-to pdf /tmp/SOME_OFFICE_FILE --outdir /tmp
```

Where `YOUR_HOST_PATH` is somewhere your file located in your host filesystem, and `SOME_OFFICE_FILE` is the office file name.

## Convert pdf file to image files.

```
$ sudo docker run -v /YOUR_HOST_PATH:/tmp doc-convertor convert /tmp/SOME.PDF /tmp/test-%02d.png
```

for more information, please refer to [doc](http://www.imagemagick.org/script/command-line-processing.php)


## Conver tp pngs and upload to qiniu

```
$ sudo docker run -v /YOUR_HOST_PATH:/THIS_PATH_WILL_BE_QINIU_KEY \
  -e QINIU_BUCKET_NAME=xxx \
  -e QINIU_SECRET_KEY=yyy \
  -e QINIU_ACCESS_KEY=zzz-4jkG4n5kro \
  -e DOC_PATH=/THIS_PATH_WILL_BE_QINIU_KEY/SOMETHING-LIKE-UUID-TO-BE-A-KEY \
  doc-convertor node uploader.js
```

And this will convert files under `/YOUR_HOST_PATH` and upload them and the generated png files to qiniu, the key prefix will be the path mapped in the container `/THIS_PATH_WILL_BE_QINIU_KEY`.

The output likes:

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

The rules are:

* original file is d.docx;
* pdf file will be d.pdf;
* png file will be d-%03d.png, you can change this by modify the code;
* page_count is the total pages, by counting the png files' count;
* uploaded file will be output by key: hash format.


