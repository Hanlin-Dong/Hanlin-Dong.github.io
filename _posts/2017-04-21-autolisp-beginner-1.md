---
layout:     post
title:      "AutoLisp入门实例教程(1)"
subtitle:   "AutoLisp实例详细解读，入门AutoCAD二次开发的捷径"
date:       2017-04-21 12:00:00
author:     董翰林
header-img: "img/header-autolisp-beginner-1.jpg"
catalog:    true
tags:
    -   AutoCAD二次开发
    -   AutoLisp
    -   入门教程
---

本文是``AutoLisp``从零开始入门的指南。``AutoLisp``语言是``AutoCAD二次开发``的重要语言。只要有最基本的编程基础，通过本教程都可以快速地掌握``AutoLisp``语言的应用方法。

本文首先对``AutoLisp``语言做了简明的介绍，然后直接进入实例部分，通过实例脚本的解读和联想来快速介绍``AutoLisp``的使用方法。这样做的好处是易于上手，易于理解，但是缺乏系统性。读者可以在读完本教程之后再系统性地读``AutoLisp``的开发者文档，这样就可以实现从入门到精通。

本教程共分为4个部分。在本文中，主要编写了一个简点的三角函数圆自动绘图脚本，用于介绍以下内容

* ``defun``函数，用于定义用户命令。
* ``setq``函数，用于为变量赋值。
* ``getint``函数和一系列相关的``get``类输入函数，用于程序与用户交互。
* ``if``函数，用于条件判断。
* ``command``函数，用于调用``AutoCAD``命令。
* 列表的建立和元素提取。
* ``osnap``函数，用于捕捉点。
* ``rtos``函数和一系列字符串转换函数，用于字符串与数字转换。
* ``polar``函数和一系数相关的图形处理函数，用于确定点的位置、距离、角度等。

下面，让我们开始吧！

## AutoLisp简介

#### 什么是AutoLisp语言

``AutoLisp``是由``Autodesk``公司开发的一种``LISP``程序语言，``LISP``是``List Processor``的缩写，有时中文翻译成``表处理语言``。这种语言和``Python``、``Javascript``、``Matlab``等语言类似，``LISP``也是一门解释型语言。``AutoCAD``软件中内置了``AutoLisp``语言解释器。因此，只要安装了``AutoCAD``，就可以直接执行``AutoLisp``程序。

#### AutoLisp语言有什么用

通过``AutoLisp``语言编程，可以节省``AutoCAD``使用者的很多时间。其作用主要体现在以下几个方面

* ``AutoLisp``语言是``AutoCAD``软件最直接、最简单、最易用的编程语言。
* ``AutoLisp``语言可以完全取代``AutoCAD``的全部命令，同时还可以提供更丰富的功能。
* ``AutoLisp``语言作为一种编程语言满足一些编程语言的结构和功能。
* ``AutoLisp``在批量操作、参数化绘图方面有重要作用。
* ``AutoLisp``有强大的图形操作能力。

#### AutoLisp语言的特点

``AutoLisp``语言具有如下特点

* ``AutoLisp``语言是一种函数式语言，一切都以函数给出，没有语句的概念和语法结构。
* ``AutoLisp``语言是表处理语言，函数的调用是通过表来完成的。表通过圆括号``()``来定义。
* ``AutoLisp``的程序和数据都是表结构，所以程序可以当作数据来处理，数据也可以当作程序来处理。


## Hello, World!

略去冗长的介绍，我们通过实例，由浅入深地学习``AutoLisp``吧！

#### 第一段AutoLisp脚本

打开``AutoCAD``，在控制台（即输入命令的文本框）中输入

```
(alert "Hello, world!")
```

回车提交，发现弹出一个警告对话框，里面写着``Hello, world!``。

**这就是你的第一段AutoLisp脚本。怎么样，简单吧！**

正如上一章中所说，本程序中我们使用``AutoLisp``语言只写了一行语句。这行语句被圆括号``()``括起来，形成了一个所谓的``表``（也就是我们所说的“表处理语言”中的“表”）。这个``表``中有两个元素，``alert``和``"Hello, world!"``。 其中``alert``是函数名，表示在这个语句中，我们要调用``alert``这个函数。``"Hello, world!"``是一个字符串（字符串是一种数据类型）。这个字符串作为``alert``这个函数的参数。程序在解释这句话时，调用``alert``函数，它的功能是弹框输出一条警告信息，内容为其后根随的字符串。因此产生了您看到的对话框。

#### 通过AutoCAD命令来运行

``AutoCAD``的控制台中，如果直接输入字母，可以调用``AutoCAD``命令。如果输入括号，则可以使用``AutoLisp``。上一小节中，我们就是使用输入括号的方式来执行``AutoLisp``命令的。通过``AutoLisp``可以自定义新的命令。这一小节我们就来介绍如何通过命令来运行上一小节中的``Hello world``脚本。

首先，用文本编辑软件新建一个文本文件，命名为``hello_world.lsp``。这里推荐使用``Sublime Text 3``，其教程可以[在这里][2]找到。也可以根据您的喜好选择``Notepad++``、``UltraEdit``等文本编辑软件，不要使用Windows操作系统自带的``记事本``软件。在文本文件中输入如下代码

~~~ lisp
(defun c:hello(/)
(alert "Hello, world!"))
~~~

打开``AutoCAD``，输入命令

~~~
appload
~~~

在弹出的对话框中选择刚才创建的``hello_world.lsp``文件，单击``load``，忽略安全提示。在控制台中出现

~~~
hello_world.lsp successfully loaded.
~~~

说明脚本已经成功加载。这时输入我们在脚本中定义的命令

~~~
hello
~~~

用回车或空格提交，发现弹出了对话框，内容显示：Hello, world!

在本例中，``defun`` 定义了一个``lisp函数``。在``AutoLisp``中，以``c:``开头的函数表示注册一条可执行的命令。本例中``c:hello``就表示注册一个命令``hello``。``alert``函数的用法和上一小节中所述相同。

#### 添加用户交互

下面我们在上一个脚本的基础上添加一些用户交互的内容。

创建一个新文件``hello_name.lsp``，键入如下代码

~~~ lisp
(defun c:hello(/ name)
(setq name (getstring "What's your name? "))
(setq msg (strcat "Hello, " name))
(write-line msg))
~~~

重新加载，在控制台中输入

~~~
hello
~~~

会发现出控制台中出现提示

~~~
What's your name? 
~~~

继续输入

~~~
Jack
~~~

回车，控制台中输出字符串

~~~
"Hello, Jack"
~~~

在本例中，对函数的定义多了一个参数``name``。这一参数通过``getstring``命令从控制台读入，再通过``setq``命令存储在变量``name``中。再通过``strcon``函数将两个字符串连接起来，最后用``write-line``在控制台输出。

以上是一些最简单的入门。下面我们通过几个实例由浅入深地学习``AutoLisp``语言。建议读者每一个实例的代码都自己输入并测试一遍。这样读完本文后就基本可以掌握``AutoLisp``的使用方法了。

## 绘制三角函数圆

在这一章中，我们通过一个绘制三角函数圆的程序来学习``AutoLisp``最重要的几个函数。它们是

* ``defun``函数，用于定义用户命令。
* ``setq``函数，用于为变量赋值。
* ``getint``函数和一系列相关的``get``类输入函数，用于程序与用户交互。
* ``if``函数，用于条件判断。
* ``command``函数，用于调用``AutoCAD``命令。
* 列表的建立和元素提取。
* ``osnap``函数，用于捕捉点。
* ``rtos``函数和一系列字符串转换函数，用于字符串与数字转换。
* ``polar``函数和一系数相关的图形处理函数，用于确定点的位置、距离、角度等。


#### 脚本功能

三角函数圆是我们初中就接触的知识，可以用图解的方式得出某个角的正弦和余弦值。在本章中我们利用``AutoLisp``语言自动画一个简单的三角函数圆，用户可以输入想计算三角函数的弧度值，得到相应的三角函数圆。

#### 脚本代码

~~~ lisp
(defun c:tricircle(/ rad)
    (setq rad (getint "input rad <1.0>:"))
    (if (= rad nil) (setq rad 1.0))
    (command "line" '(-120 0) '(120 0) "")
    (command "text" '(110 -20) 10 0 "cos")
    (command "line" '(0 -120) '(0 120) "")
    (command "text" '(-30 110) 10 0 "sin")
    (command "circle" '(0 0) 100)
    (command "line" '(0 0) (polar '(0 0) rad 110) "")
    (command "line" (polar '(0 0) rad 100) (osnap '(20 0) "per") "")
    (command "line" (polar '(0 0) rad 100) (osnap '(0 20) "per") "")
    (command "arc" "c" '(0 0) '(20 0) (polar '(0 0) rad 20))
    (command "text" '(20 5) 10 0 (rtos rad 2 1))
    (setq cos (car (polar '(0 0) rad 1)))
    (setq sin (cadr (polar '(0 0) rad 1)))
    (command "text" (list (- (* cos 100) 25) -15) 10 0 (rtos cos 2 4))
    (command "text" (list -50 (* sin 100)) 10 0 (rtos sin 2 4))
)
~~~

以上代码可以[点击下载][1]。

打开``AutoCAD``，键入命令

~~~
appload
~~~

选择代码所保存的文件加载。成功后，键入

~~~
tricircle
~~~

根所提示，输入所求弧度：1，回车，发现图形已经画好，如下图所示。

![render][2]

*注意，请关闭捕捉功能。否则某些点可能被错误捕捉。*

[1]: /resource/lisp/tricircle.zip

[2]: /img/autolisp-beginner-1-render.jpg


## 代码解读

### ``defun``函数

首先，定义一个``lisp``函数，使用的是``defun``函数。使用方法为

~~~ lisp
(defun [函数名](/ [局部变量1] [局部变量2]) [表达式1] [表达式2] ... )
~~~

**函数名：** 函数名在定义时，如果采用``c:``开头，表示注册一个``AutoCAD``命令。此后可以在控制台中直接输入``c:``后面的命令来调用这一函数，而无输再输入``AutoLisp``代码。

**局部变量：** 局部变量的含义是，这一变量在函数执行完毕后就被释放。通常把用户输入的变量设为局部变量。这里我们把用户输入的弧度值``rad``设为局部变量。

**表达式：** 当函数被调用时，表达式的内容被执行。

### ``setq``函数

在函数的定义中，我们首先用了``setq``函数。这个函数用于为变量赋值。使用方法为

~~~ lisp
(setq [变量名] [值])
~~~

**变量名：** 即要被赋值的变量名。

**值：** 即要赋的值。

在``AutoLisp``中，有以下几种数据类型

数据类型 | 代表字母 | 备注
----|---- | ----
整型数 | INT | 一般从-32768到32767
实型数 | REAL | 一般有6位有效数字
变量 | SYM | 变量必须用``SETQ``赋值
字符串 | STR | 用双引号，支持转义
表 | LIST | 分为标准表、引用表、点对
文件描述符 | FILE | 文件操作使用
选择集 | PICKSET | 存储一系列AutoCAD实体
实体名 | ENAME | 存储一个AutoCAD实体

在``setq``语句中可以把上述任意数据类型赋给变量。

``setq``语句还支持多个变量的同时赋值，方法为

~~~ lisp
(setq [变量名1] [值1] [变量名2] [值2] ...)
~~~

### ``getreal``函数和其它GET类函数

在本例的``setq``语句中，还用到了``getreal``函数。这个函数在执行时，由用户在控制台中输入数字，并返回这个数字。用法为

~~~ lisp
(getreal [字符串])
~~~

这里的字符串为引导用户输入的提示字符。

与``getreal``函数相似，还有一些用户输入用的函数，列举如下。

函数名 | 用法 | 备注
-----|-----|-----
getint | (getint [字符串]) | 输入整数
getreal | (getreal [字符串] | 输入实数
getstring | (getstring [字符串] | 输入字符串
getpoint | (getpoint [字符串]） | 在屏幕上点取点
getcorner | (getcorner [基点] [字符串]) | 在屏幕上画矩形框，输入角点
getdist | (getdist [字符串]) | 在屏幕上点两点，求距离
getangle | (getangle [基点] [字符串] | 在屏幕上点一点，求基点与之连线与当前x轴夹角
getorient | (getorient [基点] [字符串] | 与getangle类似，不过是求与正右方向夹角

在本例中，还使用了一个默认值输入的方法。``get``类函数本身是不支持默认值的，但是我们通过对用户输入空值情况的处理来实现默认值输入。这里我们用了一个``if``函数。

### ``if``函数

``if``函数是条件判断函数，用法为

~~~ lisp
(if [布尔表达式] [条件为真执行] [条件为假执行])
~~~

在``AutoLisp``中，数学表达式和布尔表达式用以下几种常见形式

表达式 | 运算 | 举例
---- | ---- | ----
+ | 加法 | (+ 1 2) 返回3
- | 减法 | (- 1 2) 返回-1
* | 乘法 | (* 1 2) 返回2
/ | 除法 | (/ 1 2) 返回0（与C语言类似）
rem | 取余 | (rem 1 2) 返回1
< | 小于 | （< 1 2) 返回T
> | 大于 | （> 1 2) 返回nil
<= | 不大于 | (<= 1 2) 返回T
>= | 不小于 | （>= 1 2) 返回nil
= | 等于 | （= 1 2）返回nil
/= | 不等于 | (/= 1 2) 返回T
and | 并 | (and nil t) 返回nil
or | 或 | (or nil t) 返回T
not | 非 | (not t) 返回nil

此外还有一些常用的数学运算函数，如``log``、``sin``、``max``等，请读者自行尝试。

在本例中，如果用户没有输入，则``getreal``函数返回nil，触发``getq``表达式，给变量``rad``赋值为1.0。

### ``command``函数

``command``函数是``AutoLisp``中最重要的函数。它可以调用所有``AutoCAD``命令。用法如下

~~~ lisp
(command [命令名] [参数1] [参数2] ...)
~~~

**命令名：** 即``AutoCAD``命令的名字，用一个字符串来表示，也就说要用双引号引起来。在本例中，我们使用了``"line"``、``"text"``、``"circle"``、``"arc"``几个命令。

**参数：** 即在执行命令时，所需要用户输入的参数。

以``"line"``命令为例，首先我们要确定输入哪些参数。打开``AutoCAD``，在控制台中输入

~~~
line
~~~

回车，看到提示输入一个点，这就是我们要给出的第一个参数。

按提示输入点后，又提示再输入一个点，这是我们要给出的第二个参数。

输入好第二个点后，提示再输一个点，会再画一条线，这时我们不想继续画，输入回车结束命令。这是我们要给出的第三个参数。

这样，我们就确定了要输出的三个参数，分别是两个点和一个回车。因此本例中，我们用两个列表来表示点，用一个空字符串来表示回车（``AutoLisp``的约定）。得到

~~~ lisp
(command "line" '(-120 0) '(120 0) "")
~~~

关于点如何输入在下一节中介绍。

其它命令的用法也类似，请读者自己体会。

### 列表

上一节的``command``命令中需要输入点，我们用列表输入点的坐标的方式来完成。本节介绍列表的使用方法。

在！！！！数据类型部分，我们介绍过列表分为标准表、引用表和点对，这里我们详细解释它们各自的用法。

**标准表：** 就是``AutoLisp``作为一种``表语言``所用的最常见的表。在这种表中，第一个元素为函数名，后面的元素为函数的参数。程序在解释时，会执行函数名所代表的函数。

**引用表：** 是一种特殊的表，其第一个元素不是函数名，不作为函数执行。与其它编程语言中的数组类似。

引用表有两种定义方式。当其元素都是定值时，可以在圆括号前加一个单引号表示。例如

~~~ lisp
'(120 0)
~~~

这个用法在本例的第4、5、6、7等行有体现。

当其元素中有变量时，不应采用这种形式，而可以采用``list``函数来创建，其使用方法为

~~~ lisp
(list 120 0)
~~~

这个用法在本例的16、17行中有体现。

二者的结果是相同的。

**点对：** 点对是一种只有两个元素的表，在列表中间用一个圆点隔开。例如

~~~ lisp
'(120 . 0)
~~~

常用于构建关联表。

对于列表中元素的提取，有两个函数``car``和``cdr``及它们的组合。

``car``函数用于取出列表中的第一个数。例如

~~~ lisp
(setq a '(1 2))
(setq b (car a))
~~~

这时``b``的值为1。

``cdr``函数用于排除列表中的第一个数，返回一个新列表。例如

~~~ lisp
(setq a '(1 2))
(setq b (cdr a))
(setq c '(1 . 2))
(setq d (cdr c))
~~~

可以看到，``b``返回的值为``(2)``，而``d``返回的值为``2``。这就是引用表与点对的区别。点对只有两个元素，所以用``cdr``返回的不是表，而是它的右元素。而引用表中``cdr``返回的是只有一个元素的表。

``car``和``cdr``可以结合在一起递归调用。举例来说，函数``cadr``就是先执行一次``cdr``，去掉第一个元素，再执行一次``car``，取出第一个元素。也就是取出原表中的第二个元素。这在提取点的坐标时非常有用。例如

~~~ lisp
(setq p '(1 2 3))
(setq x (car p))
(setq y (cadr p))
(setq z (caddr p))
~~~

``x``、``y``、``z``分别为点``p``的三个坐标值。

在本例的第14、15行有对这些函数的应用。

### ``osnap``函数

在本例第10、11行中，使用了``osnap``函数，用于临时捕捉点。用法为

~~~ lisp
(osnap [点] [捕捉模式])
~~~

它的用法和``AutoCAD``中临时捕捉点时的用法基本相同。其中**捕捉模式**包括

捕捉模式 | 功能 
---- | ----
NEA | 最近点
END | 线、弧的端点
MID | 线、弧的中点
CEN | 弧、圆的圆心
INT | 两条线交点
INS | 图形、文本、属性、块的插入点
PER | 垂足或法线
TAN | 切点


### ``rtos``等字符串转换函数

``rtos``是把实数转化为格式化的字符串的函数。我们知道，实数有多种表示方法，该函数支持多种格式化字符串的表示。最常用的是十进制模式。用法为

~~~ lisp
(rtos [实数] 2 [小数位数])
~~~

在本例的第13、16、17行有这个函数的应用。

其中2就表示十进制模式，对于其它模式不是很常用，本例中不作介绍。

对于数字和字符串的转换是经常需要用到的。这里介绍一些其它常用的字符串转换函数。

函数名 | 用途 | 举例
---- | ---- | ----
itoa | 将整数转为字符串 | (itoa 100) 返回 "100"
atoi | 将字符串转为整数 | (atoi "12.6") 返回 12（截尾取整）
atof | 将字符串转为实数 | (atof "12.6") 返回 12.6

### ``polar``等图形处理函数

在本例第10、11行用了``polar``函数。``polar``是用极坐标的方式求点坐标的函数，用法为

~~~ lisp
(polar [基点] [方向角] [距离])
~~~

返回一个新的点。这在确定点的方位的时候常常用到。

类似的常用图形处理函数列举如下

函数名 | 用途 | 使用方法
---- | ---- | ----
distance | 求两点距离 | (distance [点1] [点2])
angle | 求两点连线与x轴夹角 | (angle [点1] [点2])
inters | 求两直线交点 | (inters [线1端点1] [线1端点2] [线2端点1] [线2端点2] nil)

其中，``inters``后面的``nil``表示可以在延长线上相交。