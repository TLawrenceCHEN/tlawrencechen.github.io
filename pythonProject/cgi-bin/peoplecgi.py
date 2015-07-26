__author__ = 'TongyuChen'
# -*- coding: utf-8 -*-

import cgi, shelve, sys, os
shelvename = 'staffInfo.shelve'
fieldnames = ('name', 'age', 'position', 'salary')

form = cgi.FieldStorage()       # 解析表单数据
print('Content-type: text/html')
sys.path.insert(0, os.getcwd())
# 主html模板
replyhtml = """
<html>
<title>People Input Form</title>
<body>
<form method=POST action="cgi-bin/peoplecgi.py">
    <table>
    <tr><th>key<td><input  type=text  name=key  value="%(key)s">
    <tr><th>key<td><input  type=text  name=key  value=“%(name)s">
    <tr><th>key<td><input  type=text  name=key  value="%(age)s">
    <tr><th>key<td><input  type=text  name=key  value="%(position)s">
    <tr><th>key<td><input  type=text  name=key  value="%(salary)s">
    </table>
     <p>
    <input type=submit value="Fetch",  name=action>
    <input type=submit value="Update", name=action>
</form>
</body></html>
"""

def htmlize(adict): 			#将字典adict的值转义成html响应
    new = adict.copy()
    for field in fieldnames:
        value = new[field]
        new[field] = cgi.html.escape(repr(value))
    return new

def fetchRecord(db, form):        		#处理fetch按钮
    try:
        key = form['key'].value                           #根据表单中的key获取员工数据
        record = db[key]
        fields = record.__dict__                           #使用员工属性字典
        fields['key'] = key                                   #填充员工属性字符串
    except:
        fields = dict.fromkeys(fieldnames, '?')
        fields['key'] = 'Missing or invalid key!'
    return fields                                                  #返回员工属性字典

def updateRecord(db, form):		#处理update按钮
    if not 'key' in form:
        fields = dict.fromkeys(fieldnames, '?')
        fields['key'] = 'Missing key input!'
    else:
        key = form['key'].value
        if key in db:
            record = db[key]                                  #更新已有记录
        else:
            from staff import Staff
            record = Staff(name='?', age='?')
        for field in fieldnames:
            setattr(record, field, eval(form[field].value))
        db[key] = record
        fields = record.__dict__
        fields['key'] = key
    return fields

db = shelve.open(shelvename)                                             #打开员工数据库db
action = form['action'].value if 'action' in form else None
if action == 'Fetch':                                                               #处理Fetch
    fields = fetchRecord(db, form)
elif action == 'Update':                                                         #处理Update
    fields = updateRecord(db, form)
else:
    fields = dict.fromkeys(fieldnames, '?')                              # 处理异常提交
    fields['key'] = 'Missing or invalid action!'
db.close()
print(replyhtml %htmlize(fields))                    # 输出响应，对表单域的值转义
