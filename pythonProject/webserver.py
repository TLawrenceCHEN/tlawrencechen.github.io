__author__ = 'TongyuChen'
# -*- coding: utf-8 -*-

import sys, os
from http.server import HTTPServer, CGIHTTPRequestHandler
webdir = '.'                                    #存放html文件和脚本的文件夹
port = 80                                      #缺省http://localhost/
os.chdir(webdir)                            #改变目录到指定目录
srvraddr = ('', port)                        #主机名和端口号
srvrobj  = HTTPServer(srvraddr, CGIHTTPRequestHandler)
srvrobj.serve_forever()

