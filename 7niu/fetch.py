# -*- coding: utf-8 -*-
# flake8: noqa

from qiniu import Auth
from qiniu import BucketManager
from qiniu.services.cdn.manager import CdnManager

access_key = '6CurTj6AmR5GrCAuxtvPS2QZ5ByDMIG9UPCLAB-w'
secret_key = 'cxmuGQZFLPaZXAUzNTVuMth7l_g-A4JrSRNrNXfj'

bucket_name = 'blog'

q = Auth(access_key, secret_key)

bucket = BucketManager(q)
cdn = CdnManager(q)

f = open("renewlist.txt")
lines = f.readlines()
f.close()
urls = [l[:-1] for l in lines]


keys = [u.replace("http://www.hanlindong.com/", "") for u in urls]
keys.append("/")

for key in keys:
    ret, info = bucket.prefetch(bucket_name, key)
    print "key:" + key
    print(info)

info = cdn.refresh_urls(urls)
print(info)

