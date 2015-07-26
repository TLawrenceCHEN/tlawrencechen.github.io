__author__ = 'TongyuChen'
# -*- coding: utf-8 -*-

import shelve
from tkinter import *
from tkinter.messagebox import showinfo

def insertInfo():
    key = entries['name'].get()
    if(key in db):
        showinfo(title='Reply', message='This name already exists!')
    else:
        from staff import Staff             # 在该键值下生成/保存新记录
        record = Staff(name='?', age='?')    # eval: strings must be quoted
        for field in fieldnames:
            setattr(record, field, entries[field].get())
        db[key] = record
        showinfo(title='Reply', message='Insert success!')

def searchAll():
    info = Tk()
    form = Frame(info)
    form.pack()
    i = 0
    for key in db:
        labAll = Label(form, text='name: %s age: %s position: %s salary: %s' %(db[key].name, db[key].age,
                                                                               db[key].position, db[key].salary))
        labAll.grid(row=i, column=0)
        i += 1
    Button (info, text='Quit', command=info.destroy).pack(side=RIGHT)

shelvename = 'staffInfo.shelve'
fieldnames = ('name', 'age', 'position', 'salary')
def makeWidgets():
    global entries
    window = Tk()
    form = Frame(window)
    form.pack()
    entries = {}
    for (ix, label) in enumerate(fieldnames):
        lab = Label(form, text=label)
        ent = Entry(form)
        lab.grid(row=ix, column=0)
        ent.grid(row=ix, column=1)
        entries[label] = ent
    Button(window, text="Insert",  command=insertInfo).pack(side=LEFT)
    Button(window, text="Search", command=searchAll).pack(side=LEFT)
    Button(window, text="Quit",   command=window.quit).pack(side=RIGHT)
    return window
db = shelve.open(shelvename)
window = makeWidgets()
window.mainloop()
db.close()



