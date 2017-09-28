---
layout:     post
title:      OpenSees从零开始入门
subtitle:   OpenSees初学者第一课的入门教程
date:       2017-09-26 20:00:00
author:     董翰林
catalog:    true
tags:
    -   入门教程
    -   OpenSees
    -   有限元
---

## 简介

本文先介绍了OpenSees的安装方法，然后对OpenSees使用的tcl语言进行介绍，接着介绍一个文本编辑器Sublime Text，以及其专门针对OpenSees的插件Sublime-OpenSees，再介绍几个基本的OpenSees模型，包括OpenSees单自由度体系的特征值分析和静力分析、OpenSees单自由度体系时程分析，和用OpenSees绘制地震反应谱。最后介绍了OpenSees进一步学习的方法。

本文面向零基础的OpenSees用户，旨在提供一个快速的OpenSees入门教程，适合从没有使用过OpenSees的用户。对于已经接触过OpenSees的用户，本文可能会提供一种新的使用途径。对于熟练使用OpenSees并已经形成习惯的用户，本文可能并不适合您。

[OpenSees](http://opensees.berkeley.edu/)是一个开源软件，它的名字是"The Open System for Earthquake Engineering Simulation"的缩写，由美国[Pacific Earthquake Engineering Research Center (PEER)](http://peer.berkeley.edu/)开发。这款软件最适用于建筑结构和岩土结构的地震响应模拟，当然也可以进行结构在静力作用下的数值模拟。与商业有限元软件相比，OpenSees单元库相对简单，但是恢复力模型丰富，这致使该软件在简化结构模型的地震响应模拟方面有突出的表现。同时它作为一款开源软件，单元库一直在不断更新中，实现了与时俱进，暗中契合了当下互联网快速发展形势下软件快速迭代的要求。

OpenSees由[C++语言](https://baike.baidu.com/item/C%2B%2B)编写而成。为了方便用户调用，采用了[tcl语言](https://baike.baidu.com/item/TCL/5779974#viewPageContent)作为用户交互接口。除此之外，暂无[GUI界面](https://baike.baidu.com/item/GUI)。因此，对于不熟悉软件开发的结构工程师来说，使用OpenSees稍显困难。但是与GUI操作相比，计算机编程是当前科研人员的研究利器，熟练使用脚本建模之后，会发现它很多时候比GUI建模更具有优势。

下面我们就从零开始使用OpenSees完成第一个结构模型的建立和分析。

## 下载和安装OpenSees

### 下载OpenSees

首先，打开[OpenSees的下载页面](http://opensees.berkeley.edu/OpenSees/user/download.php)。在打开的页面中可以看到OpenSees的当面版本。写这篇文章的时候，OpenSees的版本为2.5.0。本文的所有内容都是基于2.5.0版本展开的。在页面中可以看到一个文本框，要求"Registered User"输入E-Mail。对于新用户来说想必没有注册。请点击下面的 `Register` 链接。点击后页面会跳转到[The OpenSees Community](http://opensees.berkeley.edu/community/ucp.php?mode=register)。这个论坛是OpenSees的官方论坛。如果用户在使用过程中有什么不能解决的问题，可以到这个论坛中提问，会得到开发者和一些同行的回答。该论坛的使用方法与一般的论坛无异，这里不作过多介绍，不过建议读者好好利用。

单击 `I agree to these terms` ，进入注册页面。输入注册用的邮箱和密码等信息。这个注册页面没有验证码，而是提出了一个简单的有限元问题让注册者作答，算是网站的一个特色，请读者自行作答。填写好注册信息后，单击 `Submit` ，完成注册。回到刚才的下载页面，把注册的邮箱填写进去，单击 `Submit` 进入下载页面。

在下载页面中，提供了三种可执行文件供下载。分别是：Windows-32位版、Windows-64位版、Mac版。用户根据自己的需要选择其中的一个版本。每个版本对应两个文件，一个是OpenSees可执行文件，一个是tcl解释器。两个文件都可以直接单击下载。

### 安装OpenSees

拿到下载的两个文件，我们现在在计算机中安装OpenSees。首先要安装的是tcl解释器。双击打开安装包，按一般软件的安装方法安装即可。但是在安装中要注意两个问题。第一，对于Windows用户，安装的路径不能默认，要做一下更改。默认的路径是 *C:\tcl* ，请读者改成 *C:\Program Files\Tcl* 。第二，请用户在安装时勾选 *把tcl所在文件夹加入环境变量* 一项。这样可以更方便地在命令提示符（或Mac终端）执行tcl。

安装好tcl解释器后，我们再来安装OpenSees。事实上，从zip压缩包中解压出的 `OpenSees.exe` 是一个直接可用的可执行文件，无须再安装。只不过为了使用方便，我们要把这个文件放到一个合适的地方。在这里，我建议把这个文件复制到tcl可执行文件所在的文件夹，即 *C:\Program Files\Tcl\bin\\* 目录中。这样做的好处是，刚才在安装tcl解释器时，已经把这个文件夹添加到环境变量$PATH中，所以OpenSees可以直接在命令提示符（或Mac终端）中执行。如果读者不想把 `OpenSees.exe` 文件放在这里，请自行把它所在的文件夹添加到[环境变量$PATH](https://baike.baidu.com/item/PATH/7287515#viewPageContent)中。 

### 安装验证

上述步骤操作完成后，OpenSees就安装好了。下面我们来验证一下安装是否正确。在控制台中输入（注意 `$` 是提示符，Windows中是 `>` ，不要输入，后面的 `%` 也是一样）

``` bash
$ tclsh
```

会发现，控制台的提示符变成了 `%` 这说明tcl解释器安装成功。接下来输入一个tcl命令

``` tcl
% puts $tcl_version
```

控制台输出

``` tcl
8.5
```

意思为该tcl解释器的版本为8.5。如果您从别处（而非官网）获得了tcl解释器，版本低于8.5的话，请进行升级。

如果您的tcl不能正常运行，请检查在安装的过程中是否勾选了"加入环境变量"一项。

在控制台中按下 `Ctrl` + `C` 快捷键，退出tcl环境。此时控制台的提示符已经不再是 `%` 。然后再输入

``` bash
$ OpenSees
```

会发现控制台中输出了类似信息

```
         OpenSees -- Open System For Earthquake Engineering Simulation
                 Pacific Earthquake Engineering Research Center
                        Version 2.5.0 (rev 6228) 32-Bit

      (c) Copyright 1999-2016 The Regents of the University of California
                              All Rights Reserved
  (Copyright and Disclaimer @ http://www.berkeley.edu/OpenSees/copyright.html)


OpenSees > 

```

命令提示符随之变成了 `OpenSees >` 。说明OpenSees安装成功。请按 `Ctrl` + `C` 退出。

如果您的OpenSees不能正常运行，请检查是否把OpenSees所在的文件夹加入环境变量。

## 一起玩玩tcl

### Hello, world!

`tcl` 是一个解释型的语言，与 `Python` 、`Javascript` 、 `Ruby` 和 `Matlab` 等类似，而与 `C` 、 `Pascal` 等编译语言不同。tcl命令是逐条执行的，可以把它写成脚本（或称为命令流）一次性执行，也可以在解释器中一次仅输入一条命令，人机交互执行。又与Python这一面向对象的语言不同，tcl是一种面向过程的语言，不支持面向对象，这降低了tcl的竞争力。不过，OpenSees官网上的信息表明，它即将支持Python语言的用户接口，其面向对象的特性必将为OpenSees增色不少。尽管如此，目前tcl语言仍是调用OpenSees的最佳方法。本节中我们一起来接触tcl语言，相信你会很快上手。

打开控制台，输入

``` bash
$ tclsh
```

进入tcl解释器，接着输入

``` tcl
% puts "Hello, world!"
```

控制台输出

``` tcl
Hello, world!
```

这时已经完成了一条命令的解释。这条命令的意思是，在控制台输出指定的字符串，"Hello, world!"。

后面为了方便，把用户的输入和控制台的输出放在一起，提示符 `%` 后面即为要输出的内容，请读者自行区分。`;#` 及以后的内容为行内注释（单行注释符号为 `#`，tcl中 `;` 表示换行），用户在输入的时候可以忽略。

### 变量与运算

继续输入

``` tcl
% set a 1 ;# 创建变量a，赋值"1"
1
% set b 2 ;# 创建变量b，赋值"2"
2
% set c 3.0 ;# 创建变量c，赋值"3.0"
3.0
% set d 4. ;# 创建变量d，赋值"4."
4.
% set e "Tom" ;# 创建变量e，赋值"Tom"
Tom
```


这里声明并创建了几个变量。在tcl中，变量不需要声明，用set命令进行赋值，如果变量名没有出现过，则自动声明。这里创建了五个变量，变量名分别为 `a` 、 `b` ... `e` 。要注意的是，这些变量都是字符串。当字符串没有空格时，双引号可以省略。对于 `a` ~ `d` 这些变量的赋值操作就是使用省略了双引号的字符串。这些字符串在运算的时候会被转换为相应的整数和浮点数。

下面我们对这些变量进行一些运算

``` tcl
% set sqt [expr sqrt($b)] ;# 计算b的开平方
1.4142135623730951
% puts [format "%.2f" $sqt] ;# 输出保留两位小数的形式
1.41
% set sum [expr $a + $b] ;# 计算a加b，并赋值给sum
3
% set quo1 [expr $a / $b] ;# 计算a除以b，并赋值给quo1
0
% set quo2 [expr $a / $d] ;# 计算a除以d，并赋值给quo2
0.25
```

tcl的每一条 `命令` 包含用一个或多个空格隔开的一个或多个 `单词` 。第一个单词为 `命令名` ，后面的 `单词` 都被当成字符串看待。但是这些字符串会被解释器分析，如果满足某些条件，就会被做 `置换` 处理，也就是说把字符串按规则进行替换。相应的置换规则有

`变量置换` 是最简单的置换，只要在变量名之前加上 `$` 符号，就可以把后面所跟的变量名置换为变量所代表的值。

`命令置换` 是在命令中嵌套命令的方法。对于要置换的命令，用方括号 `[]` 把它括起来，这样解释器就会先执行内层括号中的命令，得到命令的返回值之后，替换掉相应的括号，再执行外层的命令。

要注意的是，在使用双引号的时候，双引号内的分隔符不作处理（认为是字符串中的字符），但是对于换行符、`$`置换符和`[]`置换符会照常处理。如果不想让这些被处理，请用花括号 `{}` 将它们括起来。

在上面的代码中，就使用了变量替换和命令置换两种置换方式。 `expr` 命令代表执行运算，对于凡是要进行数学运算的都要使用 `expr` 命令来执行。上例中可以看出， `expr` 命令不仅可以进行一般的加减乘除运算外，还支持一些数学函数，如 `sqrt()` 表示开平方等。`expr` 的更多用法可以参考[tcl文档-expr命令](http://www.tcl.tk/man/tcl8.7/TclCmd/expr.htm)。

上例中的第一条命令得到了一个很多位的浮点数。有时在输出的时候我们并不需要那么多位，所以可以对它进行格式化。格式化的命令为 `format` 。所使用的格式化字符串与C语言很相似，如上例中的 `"%.2f"` 就表示保留两位小数等等。具体的使用方法可以参考[tcl文档-format命令](http://www.tcl.tk/man/tcl8.7/TclCmd/format.htm)。

上例中有一个值得非常注意的事情，就是 `1 / 2` 运算的结果为 `0` 。实际上，这里和C语言一样，对于两个整数的除法，得到的是商的整数部分，而非一个浮点数。这在实际使用的时候经常造成错误。所以读者在做除法运算的时候，如不是有特殊目的，请把被除数与除数至少二者之一指定为浮点数。如本例最后一条 `1 / 4.` 这样。

### 列表

继续输入

``` tcl
% set lst [list $a $b $c $d] ;# 建立一个有四个元素的列表
1 2 3.0 4.
% puts [llength $lst] ;# 输出列表的长度
4
% puts [lindex $lst 0] ;# 输出列表中下标为0的元素
1
% lappend lst $e $sum ;# 在列表后面追加两个元素
1 2 3.0 4. Tom 3
```

以上介绍了一种tcl中常用的数据结构： `列表` 。可以通过 `list` 命令来创建一个列表。 `llength` 可以获得列表的长度， `lindex` 可以通过下标获得列表中的元素，要注意向这个命令传递的是列表的变量名而不是列表本身（不加 `$` ）， `lappend` 可以在列表后面追加元素。以上几个命令是在使用OpenSees时经常可以用到的。更多对于列表的操作可以在[tcl文档-list命令中找到](http://www.tcl.tk/man/tcl8.7/TclCmd/list.htm)。

### 控制流

继续输入

``` tcl
% set a 1
1
% # if 命令
% if {a > 2} {
	puts True
} else {
	puts False
}
False
% # foreach 命令
% foreach name {Tom Jerry} {
	puts $name
}
Tom
Jerry
% # for 命令
% for {set i 0} {$i < 5} {incr i} {
	puts $i
}
0
1
2
3
4
% # while 命令
% while {$a < 4} {
	puts "Now a = $a"
	incr a
}
Now a = 1
Now a = 2
Now a = 3
```

以上介绍了四个控制命令，虽然这些命令非常重要，但是非常容易理解。这里就不再做过多的解释。有一点要注意的就是 `incr` 命令，用于把整数的值加1，后面跟的是变量名，不用 `$` 符号。

### 执行脚本文件

刚才创建控制流的时候您可能会发现有一些不便。因为对于控制结构，并不能一句一句地与计算机交互，而是一次要输出很多条命令。这就让我们想到了把命令保存在一个脚本文件中，希望执行的时候直接调用脚本文件即可。tcl语言的脚本文件一般命名为 `.tcl` 文件（虽然任何扩展名都可以，甚至可以不用扩展名）。可以通过tcl语言的 `source` 命令调用，也可以从控制台中直接在 `tclsh` 命令后面添加参数调用。在演示之前，要先创建一个tcl脚本文件。这时，您需要一个文本编辑器。也许您早已经有使用习惯了的文本编辑器，如Windows平台下的 `Notepad++` 、 `UltraEdit` ，Mac平台下的 `TextMate` ，甚至是终端下的 `Vim` 等。但是这里我非常推荐使用一款支持全平台的文本编辑器：Sublime Text。这个编辑器的免费版本除了保存一定次数后会弹窗提示未注册外，其功能与付费版本没有区别。

下面我们从tcl中休息一下，安装Sublime Text 3编辑器

## Sublime Text 文本编辑器的安装和使用

### 下载和安装 Sublime Text

登陆Sublime Text的[官方网站](http://www.sublimetext.com/)，网站已经帮助您选好了适合您的版本，直接点击下载即可。然后根据安装向导的提示进行安装即可。这里注意，对于Windows用户，Sublime Text也提供绿色免安装版本，但是这里不推荐使用这个版本，因为很多功能在这个版本中是不被支持的。

### 开始使用 Sublime Text

安装好后，打开 Sublime Text，可以看到它的界面与一般的文本编辑器无异。在左侧有一个文件导航栏，如果没有，可以通过 `View` > `Side Bar` > `Show Side Bar` 打开。主界面是文本编辑区域，上面有放置选项卡的容器，每个选项卡代表一个文本文件。如果文本编辑区域的字太小，可以按住 `ctrl` 键（Mac用户按 `cmd` 键），然后通过 `+` 键和 `-` 键调节字体大小。

下面和我一起尝试几个常用的快捷键。在此之前，把下面的文本复制到你的 Sublime Text 中。

``` text
Hello, world! I'm Jack.
Hello, world! I'm Tom.
Hello, world! I'm Henry.
```

`列块选择` 是很多文本编辑器都具有的功能，Sublime Text也不例外。您可以按下鼠标的中键并拖动进行选择，也可以按住 `alt` 键，然后通过鼠标的左键拖动并选择。下面我们用中键选中所有的"world", 再用键盘输入 `Hanlin` 。这时，所有的"world"已经被替换成了"Hanlin"。

`相同字符选择` 是一个特色功能。很多时候适用于变量名的快速替换。首先选中第一行的"Hello"，然后按快捷键 `ctrl` + `D` （Mac用户按 `cmd` + `D`），会发现，第二行相同的"Hello"也被选中了。再按一次，三行的都被选中。我们现在把它改成"Hola"。是不是很方便？

`分割列` 也是一个非常实用的功能。现在我们按 `ctrl` + `A` （Mac用户按 `cmd` + `A`），把全部文字选中。现在只有一个闪烁的光标，再按下 `ctrl` + `shift` + `L` （Mac用户按 `cmd` + `shift` + `L` ），会发现，现在每一列都出现了一个光标。这时我们就可以同时编辑所有列了。按 `Home` 键（Mac用户按 `cmd` + 左箭头），光标会移到行首。按 `End` 键（Mac用户按 `cmd` + 右箭头），光标会移到行尾。这时，按住 `ctrl` + `shift` （Mac用户相同），会发现最后一个单词（人名）被选中了。这里，`ctrl` 表示移动一个单词， `shift` 表示在移动光标的同时选中。我们把选中的词改为"fine!"。这样，尽管这三个名字参差不齐，也可以同时修改。

`复制行` 可以快速地复制一行文本。我们把光标移到最下面一行，按下 `ctrl` + `shift` + `D` （Mac用户按 `cmd` + `shift` + `D`），发现在这一行下方多了一行相同的文字。

以上四个功能合并在下面的gif中演示。Sublime 的快捷键远不止这些，请读者在以后的使用中自行体会。

![opensees快捷键](/img/opensees-bootstrap-sublime.gif)

目前为止，Sublime Text的优秀之处还没有完全表现出来。下面，我们安装Sublime Text的一些常用插件，以安装Sublime-OpenSees插件为例。


### 安装Sublime-OpenSees插件

Sublime Text有一个插件管理器：Package Control。通过这个插件管理器可以轻松地获取和安装更多的插件。2017年9月发布的最新版本的Sublime Text为安装 Package Control提供了一个按钮。通过 `Preferences` > `Package Control` 按钮即可轻松安装(Mac用户的 `Preferences` 在 `Sublime Text` 菜单中）。安装成功后会有一个弹窗提示。

安装了Package Control之后，就可以轻松地安装所有Sublime Text插件了。这里介绍一个插件[Sublime-OpenSees](https://github.com/bzarco/Sublime-OpenSees)的安装方法。

这个插件是我参与开发的，一个基于MIT开源软件协议的插件，旨在使Sublime Text用户能更轻松地使用OpenSees。它提供了在Sublime Text环境内直接调用OpenSees的能力，也提供了一些代码高亮和自动填写功能。目前这个插件也在升级中，未来还会加入更多更好的功能供用户使用。

下面我们使用Package Control安装Sublime-OpenSees插件。按快捷键 `ctrl` + `shift` + `P` （Mac用户按 `cmd` + `shift` + `P` ）或单击 `Tools` > `Command Palette` ，调出命令对话框，在里面键入 `package` 。此时可以看到Package Control提供的一系列功能了。我们点选其中的"Package Control: Install Package"，稍等几秒中，面板上会重新弹出一个列表，列表中罗列了所有可用的插件。我们输入 `opensees` 会在列表中找到一个名为 `opensees` 的插件。这正是我们想要安装的。单击这一项，过几秒中，插件就安装完成了。这时会弹出一个消息文件。关闭它即可。

以相同的方式，可以安装插件库里的其它插件。读者可以在[Package Control的官网](https://packagecontrol.io/)上寻找想要的插件。

安装好了插件，但是如何使用呢？下面我们来配置OpenSees环境。在 `Preferences` 中有一个菜单 `Package Settings` 可以发现，所有安装的插件的设置都在这里。找到 `OpenSees` 一项，里面有两个配置文件，一个是 `Settings - Default` ，一个是 `Settings - User`。前者是在安装时候就有的一些默认设置，是不能修改的。而后者是用户对插件一些设置是的重新定义，会覆盖前者的定义。这些定义是通过[json](https://baike.baidu.com/item/JSON/2462549?fr=aladdin)格式的文件完成的。如果您不知道json是什么也没关系，我们只需要进行简单的配置。打开 `Settings - User` ，会产生一个空文档。在里面输入

``` json
{
	"opensees": "OpenSees"
}
```

然后按 `ctrl` + `S` 保存（Mac用户按 `cmd` + `S`），就完成了配置。这句话的意思是，在想运行OpenSees的时候，只需要Sublime Text在控制台中调用 `OpenSees` 这个命令。这得益于我们把OpenSees.exe文件所在的路径加入了环境变量$PATH。

安装和配置完成，下面我们一起来使用OpenSees吧！

## 第一个OpenSees脚本

### Hello, world!

在前面的[一起玩玩tcl](#一起玩玩tcl)部分，我们都是通过在控制台中与计算机交互输入命令的。一条两条命令尚可，如果加入了循环等控制流，就会显得吃力。所以对于OpenSees模型，还是通过 `脚本` 来建立和执行。

下面我们就写一条最简单的Hello world脚本。

在计算机中先建立一个文件夹，用来保存本例中的脚本文件。然后在Sublime Text中，单击 `File` > `Open Folder` （Mac用户选 `File` > `Open...`），打开刚刚建立的文件夹。这时文件夹显示在Sublime Text左侧的Sidebar中。按 `ctrl` + `N` （Mac用户按 `cmd` + `N`）新建一个文件，先保存，命名为 `hello.tcl` ，保存在刚建立的文件夹中。然后在这个文件打开的状态下，按 `ctrl` + `shift` + `P` （Mac用户按 `cmd` + `shift` + `P`）打开命令面板，输入 `ssop` ，会找到 "Set Syntax: OpenSees Input" 一项，点击它，把这个文件的语言高亮设置为OpenSees。

下面在文件中输入

``` tcl
puts "Hello, world!"
```

OpenSees中使用的命令是扩展了的tcl命令，所以所有的tcl命令都可以在OpenSees脚本中很好地执行。

保存文件，这就是一个最简单的OpenSees脚本（或者说是tcl脚本，因为没有使用OpenSees扩展的命令）。

下面介绍脚本的调用方法。这里主要介绍三种。

第一种运行方法，是在Sublime Text中直接执行。得益于刚刚安装的Sublime-OpenSees插件，我们可以让Sublime Text 帮忙调用OpenSees脚本。按快捷键 `ctrl` + `B` （Mac用户按 `cmd` + `B`），或点击 `Tools` > `Build` ，会弹出几个运行选项。这里选择第一个 `OpenSees` 。此时Sublime Text的下部会弹出一个"Build Result"框，显示运行的结果。这里显示为

``` text
[RUN OpenSees Sequential for "hello.tcl" Started]



         OpenSees -- Open System For Earthquake Engineering Simulation
                 Pacific Earthquake Engineering Research Center
                        Version 2.5.0 (rev 6228) 32-Bit

      (c) Copyright 1999-2016 The Regents of the University of California
                              All Rights Reserved
  (Copyright and Disclaimer @ http://www.berkeley.edu/OpenSees/copyright.html)


Hello, world!


[RUN OpenSees Sequential for "hello.tcl" Finished in 0.1s]

```

表示这个脚本已经被OpenSees运行完毕，用时0.1s。

第二种运行方法，是在控制台中运行。打开控制台，通过 `cd` 命令切换到刚建立的文件夹下（如不会使用可以参考[这里](https://baike.baidu.com/item/cd/3516393#viewPageContent)），在控制台中输入

``` bash
$ OpenSees hello.tcl
```

可以看到同样OpenSees执行完毕，信息打印在控制台中。

第三种运行方法是使用 `source` 命令。这是一个tcl命令，用于引用文件中的脚本。后面加文件名即可。在控制台中输入

``` bash
$ OpenSees
```

启动OpenSees解释器，然后在提示符后输入

``` tcl
OpenSees > source hello.tcl
```

可以发现这个脚本文件也被执行了。

### 单自由度体系的动力特性

下面我们用一个最简单的例子来介绍OpenSees的使用方法。

我们现在建立一个单自由度体系。它的刚度为2N/mm，质量为1t。

一般来说，我们概念中的单自由度体系是一个竖直的杆，顶部连接一个质点的“糖葫芦”模型。杆件本身没有质量，其抗侧刚度就是单自由度体系的刚度。但是在本例中，对这样的模型再进一步进行简化，通过一个质点连接一个弹簧，这个弹簧的刚度就是单自由度体系的刚度。且这个质点所在的位置与基础的位置相重合。注意在很多其它有限元软件中是不允许两个点重合的。

新建一个文件，命名为 `SDOF-Identification.tcl` ，输入以下脚本

``` tcl
model BasicBuilder -ndm 1 -ndf 1 ;# 建立一个1维1自由度模型
node 0 0. ;# 基础点的坐标
fix 0 1 ;# 固定基础点
node 1 0. ;# 单自由度点的坐标
mass 1 1. ;# 单自由度点的质量，为1
uniaxialMaterial Elastic 1 2. ;# 弹性滞回模型，刚度为2
element twoNodeLink 1 0 1 -mat 1 -dir 1 ;# 连接基础和单自由度点的弹簧单元
puts [eigen -fullGenLapack 1]
```

先来解释一下这段脚本。第一行是每一个OpenSees模型的开端。`model` 表示建立一个模型， `BasicBuilder` 是默认的建立模型方法，目前只有这一种。后面根两个参数。 `-ndm` 后面加的是模型的维度，可以是一维模型，也可以是二维、三维模型。 `-ndf` 后面加的是模型的自由度数。对于一维模型，只能有一个自由度。对于二维模型，一般有三个自由度，有时也可以使用两个自由度（无转动自由度，桁架模型）。对于三维模型，一般有六个自由度，也可以为三个自由度。模型的维度和自由度数要匹配。这两个数字必须定义好，才能继续建立模型。因为后面的命令需要输入了参数数量是与这两个数字有关的。

`node` 命令用于创建一个节点。紧随其后的整数表示节点的编号。可以是任意正整数（不能过大）。再后面跟的是节点的坐标。对于一维模型，只有一个坐标。注意坐标最好用浮点数表达，而不是用整数。

`fix` 命令用于创建约束。紧随其后的整数表示这一条命令所约束节点的编号。后面跟的整数表示约束情况，整数的个数与自由度数相等。1表示在这个自由度上有约束，0表示在这个自由度上无约束。

`mass` 命令用于在节点上创建质量。紧随其后的整数表示这质量所在节点的编号。后面跟数表示质量的大小，个数与自由度数相等。质量是与自由度相关的，可以在不同的自由度上定义不同的质量。注意，质量与质量产生的荷载在OpenSees中是两个不相关的概念，这里定义的质量是不产生荷载的，只影响惯性力。如果用户希望考虑结构的自重，请额外再加入重力的定义，与质量的定义完全无关。

这里还要注意一个单位的问题。OpenSees是没有默认的单位的，用户可以自己定义单位系统。如果您习惯使用国际单位建模，那么这是一个好习惯。如果您习惯使用 N, mm, s 单位系统（本例中用这一单位系统），那么一定要非常注意与质量有关的单位。因为在这套单位系统中，质量的单位为t，重力加速度应为9800。

`uniaxialMaterial` 命令用于定义一个滞回模型。这里注意，在OpenSees中，滞回模型是不区分 **应力-应变模型** 和 **力-位移模型** 的。这取决于这个模型是用在什么单元上。尽管这个命令的名字是"单轴材料"，但它并不意味着这一定是一个 **应力-应变模型** 。我们在后面把这个模型用在了一个 `twoNodeLink` 单元上，这意味着它被用于描述 **力-位移关系** 。这在其它有限元软件中是没有的。 `uniaxialMaterial` 后面跟的 `Elastic` 表示单轴弹性模型。再后面的整数表示这个单轴模型的编号为1（是与节点、单元等分开编号的，不会冲突）。 再后面的数字为 `Elastic` 模型所需要的参数，即表示应力-应变关系时的弹性模量，和表示力-位移关系时的刚度。这里作刚度讲。

`element` 表示创建一个单元。这里我们采用 `twoNodeLink` 单元。这是一个应用比较广泛的连接单元。后跟的三个整数分别表示单元编号，和所连接的两个节点的编号。 `-mat` 后面的整数为使用的 `uniaxialMaterial` 单轴模型的编号， `-dir` 为相应模型所处的自由度编号。两个编号个数相同（这里是1个），一一对应。

`eigen` 命令是用来求解特征值的，是OpenSees中使用最简单的求解器。 `-fullGenLapack` 定义了求解器的求解方法。在多数情况下，所求特征值数小于结构总自由度数，这时可以不使用这个求解器。本例中结构只有一个自由度，因此要加上这一求解器。后面跟的整数就表示所求特征值的数量。这里为1。 `eigen` 命令后返回一个 `list` ，长度即为所求特征值数。按特性值从小到大排列。

在输入 `twoNodeLink` 等命令的时候，你会发现，在 Sublime-OpenSees 插件的支持下，自动联想出了一些自动填充的信息。您可以通过按回车键使用自动填充功能。用 `tab` 键可以在需要填写的位置跳转切换。如下面的gif所示

![Sublime-OpenSees自动填充功能](/img/opensees-bootstrap-sublime-opensees.gif)

现在我们运行脚本，看到输出了一个数字

``` text
2.000000e+00  
```

这个数字就是这个单自由度体系的特征值\\(\lambda\\)。在 OpenSees 中，对特征值的定义为

\\[
(K-\lambda M)\Phi = 0
\\]

也就是说，这个\\(\lambda\\)就是我们平时所说的\\(\omega^2\\)。因此，要想得到结构的周期，只需再通过公式

\\[
T=\frac{2\pi}{\sqrt{\lambda}}
\\]

计算即可。本例中单自由度体系的周期为4.44s。

### 单自由度体系静力作用下的变形

下面我们来看静力加载的求解。新建一个文件，命名为 `SDOF-Static-LoadControl.tcl` ，把上一个模型的代码复制进去。把光标放在最后一行，按 `ctrl` + `/` （Mac用户按 `cmd` + `/`），即可把最后一行注释掉（或手动在行首加一个 `#`）。现在我们不计算特征值，给单自由度体系一个5kN的力，分析其变形。在下面继续添加代码

``` tcl
model BasicBuilder -ndm 1 -ndf 1
node 0 0.
fix 0 1
node 1 0.
mass 1 1.
uniaxialMaterial Elastic 1 2.
element twoNodeLink 1 0 1 -mat 1 -dir 1
# puts [eigen -fullGenLapack 1]
timeSeries Linear 1 ;# 建立一个线性的时间序列
pattern Plain 1 1 { ;# 建立一个荷载工况
	load 1 5.0e3  ;# 给节点1加一个5kN的力
}
constraints Plain ;# 约束方法
numberer RCM ;# 编号方法
system BandGeneral ;# 结构体系
test EnergyIncr 1.0e-6 200 ;# 收敛条件
algorithm Newton ;# 迭代算法
integrator LoadControl 1 ;# 控制方法
analysis Static ;# 静力、动力分析
analyze 1 ;# 执行分析
print -node 1
```

`timeSeries` 命令创建一个与伪时间有关的序列。这里的伪时间与大多数商业有限元软件的定义是相同的。对于动力分析，它就是真实的时间，而对于静力分析，它表示的是加载的幅度，这里的时间time也可以理解为倍数。这里定义了一个 `Linear` 时间序列，大多数静力分析中都是定义这样一个序列。表示受力的大小是与伪时间成正比的。这里只定义这个 `Linear` 关系，并用编号1来表示。并不定义荷载水平。荷载是在 `pattern` 中进行定义的。

`pattern` 定义了荷载工况。每个 `pattern` 是与一个 `timeSeries` 相关联的。在这里，`pattern` 后面的 `Plain` 表示静力荷载工况，再后面两个1，第一个表示 `pattern` 的编号为1，第二个表示对应 `timeSeries` 的编号为1。然后把在这一工况中定义的荷载用大括号括起来。

`load` 表示节点荷载，只能在定义 `pattern` 的大括号中使用。 `load` 后面的整数是要施加荷载的节点，再后面要跟与自由度数相同的浮点数，表示荷载的幅值。这里采用真实的荷载值来定义，加5kN荷载，就定义为5.0e3。

后面的7行，是用来定义分析的时候用的求解器类型的。这里不过多介绍。用户直接输入 `analyze-static` ，再按回车，就可以输出上面的全部信息。这里值得一提的是， `integrator LoadControl` 是指用力的大小来控制结构的加载，1就表示每分析一步，伪时间增加1。

`analyze` 表示执行分析，后面的整数表示分析的步数。这里分析1步，正好可以得到伪时间1，正好是所加的荷载。这里注意，如果想分多步加载（弹性结构没有必要，但非弹性结构可能须要），可以把 `LoadControl` 后面的数字改成0.1，也就是说，每分析一步伪时间增加0.1，然后分析10步，仍然得到伪时间1。也可以把荷载定义时 `load` 的幅值改为5.0e2，分析10步。那么这时得到伪时间10，再乘上荷载定义的赋值，也可以得到同样的结果。也就是说，对于 `timeSeries Linear` 来说，实际的受力就是 `pattern` 中定义的幅值乘当前的伪时间。

`print` 是输出命令，用于输出结构中的信息。这里我们将分析过后的节点1信息输出。运行，可以看到以下内容

``` text
 Node: 1
	Coordinates  : 0 
	Disps: 2500 
	Velocities   : 0 
	 unbalanced Load: 5000 
	Mass : 
1 

	 Rayleigh Factor: alphaM: 0
	 Rayleigh Forces: 0 
	ID : 0 
```

可以看到，节点1的位移为2500，受力为5000。

### 单自由度体系已知变形求受力

刚才我们得到了结构在力作用下的变形，那么反过来，也可以得到在变形作用下结构的受力。新建文件，命名为 `SDOF-Static-DisplacementControl.tcl` ，把 `SDOF-Static-DisplacementControl.tcl` 中的内容全部复制过去。把其中的

``` tcl
integrator LoadControl 1
```

改为

``` tcl
integrator DisplacementControl 1 1 10
```

这意味着加载是用位移控制的。这个位移是节点1在1自由度方向上产生10的位移。

运行分析，得到

``` text
 Node: 1
	Coordinates  : 0 
	Disps: 10 
	Velocities   : 0 
	 unbalanced Load: 20 
	Mass : 
1 

	 Rayleigh Factor: alphaM: 0
	 Rayleigh Forces: 0 
	ID : 0 
```

可以看到，这时节点的位移为10，受到的力为20。

这里值得一提的是，在 OpenSees 中，要想求得位移控制下的荷载，必须要在 `pattern` 中先定义能在这个自由度上产生位移的荷载。也就是说，这不是真实的位移加载，而是预先定义好了受力的情况，然后搜索得到目标位移时，所定义的力的实际比例（这个比例此时等于伪时间）。这与商业有限元软件的位移加载是有本质的不同的。

### 单自由度体系的地震响应

以上介绍了静力分析，下面举一个动力分析的例子。建立文件 `SDOF-dynamic.tcl` 。输出以下代码

``` tcl
model BasicBuilder -ndm 1 -ndf 1
node 0 0. 
fix 0 1 
node 1 0.
mass 1 1. 
uniaxialMaterial Elastic 1 2. 
element twoNodeLink 1 0 1 -mat 1 -dir 1 
puts [eigen -fullGenLapack 1]
timeSeries Path 1 -dt 0.01 -filePath accel.txt ;# 创建地震加速度时间序列
pattern UniformExcitation 1 1 -accel 1 -fact 9800 ;# 创建地震工况
recorder Node -file node_disp.txt -time -node 1 -dof 1 disp ;# 位移记录器
recorder Node -file node_vel.txt -time -node 1 -dof 1 vel ;# 速度记录器
recorder Node -file node_accel.txt -timeSeries 1 -time -node 1 -dof 1 accel ;# 加速度记录器
constraints Transformation ;# 动力分析约束
numberer RCM
system UmfPack
test EnergyIncr 1.0e-6 200
algorithm Newton
integrator Newmark 0.5 0.25 ;# Newmark积分
analysis Transient ;# 动力分析
analyze 3000 0.01
```

在执得这段代码之前，要先准备一个地震波文件。这里可以[点击下载](/resource/ops/accel.txt)。把下载的 `accel.txt` 与 `SDOF-dynamic.tcl` 放在同一目录下。这个地震波文件是一个加速度时程，共有3000个点，点与点之间的时间间隔为0.01s。加速度单位为g。

`timeSeries Path` 是用于从文件中读取地震时程的命令。这里编号为1，时间间距定义在 `-dt` 后面，为0.01，文件路径定义在 `-filePath` 后面。这里文件与脚本在同一目录，所以直接输入文件名即可。

`pattern UniformExcitation` 是做地震时程分析的工况。后面跟的第一个1是工况的编号，第二个1是对应的时程编号。 `-accel` 定义了加速度的方向，这里加在1自由度上。 `-fact` 后面的后定义的是对每个点的值乘一个系数。这里由于时程文件的单位是g，所以乘9800。

`recorder` 是分析的记录器。分为 `Node` 和 `Element` 两种。这里我们采用 `Node` 记录器。 `-file` 后面加的是记录的文件名，`-time` 表示首先输出时间（或伪时间）， `-node` 表示要记录的节点， `-dof` 表示要记录节点的自由度。均可以输入多个。 `disp` 表示记录的内容，这里记录位移。注意，在时程分析中， `accel` 、 `vel` 和 `disp` 输出的都是相对值。如果要得到 `accel` 的绝对值，要在定义中加入 `-timeSeries 1` 。不仅是动力分析，在任何分板中都可以使用 `recorder` 把关心的内容输出到文件中。

与静力分析类似，后面有很多定义求解器的内容，这里不进行介绍。用户可以通过输入 analyze-dynamic 按回车，直接输入这些内容。在 `integrator Newmark` 部分，采用的是 `Newmark` 方法进行积分，后面跟的是 `Newmark` 法的两个参数。这里取0.5、0.25，也就是最常用的平均加速度法。

`analyze` 后面跟了两个参数，第一个表示分析的步数，一般等于点数。第二个表示每一步分析的时间间隔，一般等于地震波文件中点的时间间隔。

下面运行分析，很快完成，控制台输出的仍是结构的特征值。目录中产生了三个新文件。打开 `node_disp.txt` 可以看到有两列数据。第一列是时间，第二列是对应的相对位移。我们把这些数据画到一张图中，得到

![OpenSees时程分析](/img/opensees-bootstrap-timehistory.png)

### 用OpenSees画反应谱

下面我们把一些tcl语言的命令和OpenSees结合起来，看如何在OpenSees中灵活运用。通过一个画反应谱的算例来完成。

首先我们来复习一下。对于每一条地震波，和一个指定的阻尼比，有一个反应谱与之对应。这个反应谱的横轴是周期，纵轴是结构响应。反应谱上的点表示对应该周期的弹性结构在地震作用下的最大响应。下面我们通过OpenSees对单自由度体系的时程分析，来获得一条地震波的反应谱。

实现这个目标，就要获得一系列反应谱上的点，再把它们连接起来。获得反应谱上点的基本思路是，建立一个相应周期的单自由度弹性体系，在地震作用下进行时程分析，然后获得响应的最大值，就得到了一个反应谱上的点。

##### 代码

现在我们建立文件 `SDOF-spectra.tcl` ，并输出下面的代码

``` tcl
proc PeakResponse {period} {
	wipe
	wipeAnalysis
	model BasicBuilder -ndm 1 -ndf 1
	node 0 0. 
	fix 0 1 
	node 1 0.
	mass 1 1. 
	set stiffness [expr pow(2 * 3.141593 / $period, 2)]
	uniaxialMaterial Elastic 1 $stiffness 
	element twoNodeLink 1 0 1 -mat 1 -dir 1 
	timeSeries Path 1 -dt 0.01 -filePath accel.txt 
	set dampingRatio 0.05
	set alpha [expr 4*3.141593 / $period * $dampingRatio]
	rayleigh $alpha 0 0 0
	pattern UniformExcitation 1 1 -accel 1 -fact 9800
	constraints Transformation
	numberer RCM
	system UmfPack
	test EnergyIncr 1.0e-6 200
	algorithm Newton
	integrator Newmark 0.5 0.25
	analysis Transient
	set maxAccel 0.0
	set maxDisp 0.0
	for {set i 0} {$i < 3000} {incr i} {
		analyze 1 0.01
 		if {$maxAccel < [expr abs([lindex [eleResponse 1 forces] 0])]} {
 			set maxAccel [expr abs([lindex [eleResponse 1 forces] 0])]
 		}
 		if {$maxDisp < [expr abs([lindex [nodeDisp 1]])]} {
 			set maxDisp [expr abs([lindex [nodeDisp 1]])]
 		}
	}
	return [list [expr $maxAccel / 9800] $maxDisp]
}
set excitationFile [open accel.txt r]
set maxExcitation 0.0
while {[gets $excitationFile excitation] >= 0} {
	if {$maxExcitation < [expr abs($excitation)]} {
		set maxExcitation [expr abs($excitation)]
	}
}
close $excitationFile
set spectraFile [open spectra.txt w]
puts $spectraFile [format "%.2f\t%.4f\t%.4f" 0.00 $maxExcitation 0]
for {set i 1} {$i <= 200} {incr i} {
	set period [expr $i * 0.02]
	set response [PeakResponse $period]
	puts $spectraFile [format "%.2f\t%.4f\t%.4f" $period [lindex $response 0] [lindex $response 1]]
}
close $spectraFile
```

下面详细解释一下以上代码。

#### tcl语言定义过程

首先是一个重要的控制流：过程 `procedure` 。对于面向过程的语言 tcl ，过程可以说是相当重要了。它类似于C语言中的函数。对于学过 Pascal 语言的读者，会认为过程和函数是两个不同的概念，但他们的差别不大，过程没有返回值，而函数有返回值。这在C语言中被函数所统一，而在 tcl 语言中，被过程所统一，其实都是一样的概念。也就是说， tcl 的过程是有返回值的。当然，也可以不返回任何值。

过程的定义，使用 `proc` 命令。紧接着是过程名，也就是以后在调用这个过程时要使用的命令名，这里叫 `PeakResponse` 也就是返回最大响应的意思。然后是参数表，用大括号括起来。不同的参数之间用空格隔开。这里只需要一个参数，那就是周期。再后面就是过程体，也用大括号括起来。过程体中是调用过程时要执行的命令。在过程的最后，可以用 `return` 命令返回一个值。在执行完 `return` 命令后，过程即退出。

过程对于某种结构的参数化分析是十分方便的。把要分析的参数提取出来，定义在过程的参数表中，那么每调用一次过程，都可以给这个结构赋一组参数进行分析。不过这里要注意，使用 `recorder` 的话，要把文件路径参数化定义，以免旧文件被新生成的文件覆盖。

在本例中，为了方便，把过程的定义和调用过程的脚本放在了同一个脚本文件中。一般情况下，我们的过程定义文件会比较大（因为实例结构一般很复杂），所以建议把过程的定义和调用分别放在不同的文件中。例如，把过程的定义放在一个名为 `procedure.tcl` 的文件中，再建立一个脚本文件，在其头部使用

``` tcl
source procedure.tcl
```

来引用过程文件，这时就可以调用已定义的过程了。有些时候，有一些在不同结构中可以通用的代码，比如为结构施加 Rayleigh 阻尼等等，也可以定义在一个过程中，方便在以后建模时直接调用。本站资源[下载页面](/download-page.html)的 OpenSees 部分就有一些预定义好的过程，在结构建模和分析时使用十分方便，欢迎读者下载。

在过程体中，首先用了 `wipe` 和 `wipeAnalysis` 两个命令。因为在执行中反复调用过程体，每次建立的模型之间可能会相互冲突，所以用这两个命令分别把之前建立的模型和分析结果抹掉。

##### 定义刚度和阻尼比

为了建立单自由度模型，我们需要从所需要的周期推算出模型的刚度。这很简单，只要用公式

\\[
k = \omega^2m = \left(\frac{2\pi}{T}\right)^2m
\\]

计算即可。这里我们把计算得到的刚度定义为一个变量 $stiffness 。在后面定义弹簧的单轴材料模型时，在刚度部分输入 $stiffness 。事实上，在定义结构时，用一个语义化的变量名来代替直接输入数值是一个很好的习惯，例如用 `$yield` 表示屈服强度， `$MOE` 表示弹性模量等等。这样做的好处是，一来可以使定义的参数更直观，二来在修改的时候可以一并修改不会遗漏，包括在定义几何尺寸的时候可以方便地参数化调整几何尺寸。

在计算反应谱时，必须考虑阻尼比。这里我们用5%的阻尼比。用 Rayleigh 阻尼来定义。由于这里是单自由度体系，我们认为阻尼与质量成正比。比例系数为 \\(\alpha\\) 。通过

\\[
c_0 = 2\xi m\omega_0
\\]
\\[
\alpha = \frac{c_0}{m}
\\]

可以推导出 Rayleigh 阻尼系数，用 `rayleigh` 命令来定义。

##### 获取最大响应

这里为了在程序内得到结构响应的最大值，我们用了一个 `for` 循环来一步一步完成分析。每分析一步，都考察两个量，一个是弹簧中的力，一个是质点的位移。弹簧中的力用 `eleResponse` 命令来获取，后面紧跟的是所关心单元的编号，然后是所关心的量。这里我们获得的是1号单元的力。由于是单自由度体系，这个力只有一个分量。如果是多自由度体系，会输出多个分量。不管是一个还是多个分量，都是通过一个列表输出的。我们用 `lindex` 命令来获得这个列表中唯一的值，即为单元的内力。由于质点的质量为1，这个内力数值上是等于质点的绝对加速度的。这里不去获取质点加速度的原因是，这个结果是质点的相对加速度，还要加上地震加速度才是绝对加速度。通过单元内力换算显然更方便一些。对于质点的位移，可以用 `nodeDisp` 命令获取，后面只要加节点的编号即可。返回值也是一个列表，元素个数与自由度数相同。

定义两个变量 `maxAccel` 和 `maxDisp` 分别保存最大加速度和最大位移。在循环之前为它们赋初值0。每次循环时，与得到的加速度和位移的绝对值（用 `abs` 函数得到）比较，取其大值，最后得到的就是加速度和位移的最大值。最后，用 `list` 命令创建一个列表，把这两个最大值返回。对加速度除以9800，意味着返回值的单位为g。

过程定义完成后，我们来看执行过程的脚本。一个很重要的内容是 tcl 语言的文件读写。

#### tcl语言文件读写

首先我们来看如何读文件。

我们知道，对于结构，假如周期为0，刚度就是无穷大，这意味着刚度计算公式中0出现在分母上，这是不允许的。那么对于无穷大刚度的结构，则是完全随大地一起运动，它的最大绝对加速度就是大地的最大加速度。它的最大相对位移就是0。因此，在加速度反应谱上，周期0点对应的谱加速度就是地面运动最大加速度（PGA）。下面我们打开加速度时程文件，从中读取这个PGA值。

打开一个文件，用的是 `open` 命令。这个命令后面跟的是文件名，再后面是打开方式。如果要读取文本文件，用 `r` 方式(read)打开。如果要创建文件并写入，用 `w` 方式(write)。如果要打开已有文件并追加，用 `a` 方式(append)。 `open` 命令返回一个文件句柄（可以理解为这个被打开文件的代表）。要把这个句柄传递给一个变量。这里命名为 `excitationFile` 。

在读文件时，用 `gets` 命令(get string)。这个命令后面跟一个文件句柄，再跟一个变量名，意思是从这个文件中读取一行，以字符串的形式保存在变量中。 `gets` 命令会逐行读取文件，如果读到文件结尾，或者发生错误，会返回一个负值。所以我们通过它的返回值是否非负来判断是否读完文件。用一个 `while` 循环来实现。

在文件使用完毕后，要用 `close` 命令来关闭文件。

写文件非常简单。我们现在把周期、最大加速度、最大位移写入文件。用 `w` 方式创建一个名为 `spectra.txt` 的文件，然后用 `puts` 命令向文件中写入。如果 `puts` 直接加字符串，就会输出到控制台。如果在 `puts` 后面加一个文件句柄，那么就会写入到文件中。先把周期原点写入文件，然后再用一个 `for` 循环，每隔0.02s取一个点，调用刚定义的 `PeakResponse` 过程，得到最大响应，再逐行写入文件中。最后关闭文件。

##### 运行结果

执行脚本，等待几十秒时间，运行结束。看文件夹中新生成了一个 `spectra.txt` 的文件。把文件中的数据作图，得到加速度反应谱和位移反应谱如下图所示。

![用OpenSees画反应谱](/img/opensees-bootstrap-spectra.png)

作图工具可以是 `excel` 、 `matlab` 、 `origin` 等等，不过这里推荐使用 `python` 的一个库 `matplotlib` 作图。与 `excel` 和 `origin` 不同，它是一个用命令作图的工具，这意味着不用每计算一次结构就机械地重复画图的动作，只要执行一次作图的代码即可。而与 `matlab` 不同，它是开源免费软件，而且很小巧，作图的命令又与 `matlab` 相似。但是这里不对作图方法进行介绍，用户根据自己习惯即可。

## 进一步了解OpenSees

OpenSees的入门部分到此就结束了，相信读者已经对这个软件有了一定的认识。但是本文只介绍了一些很简单的模型，复杂结构模型的建立方法，还要读者进一步探索。下面就谈谈学习OpenSees的方法，给读者提供一些参考资料，以便后面的学习。

### OpenSees官网

学习使用一款开源软件，必定离不来它的官网。[OpenSees官网](http://opensees.berkeley.edu)是维护得非常好的，有丰富的软件文档，也有很多实例。建议读者从这里开始学习。首先可以打开[教程页面](http://opensees.berkeley.edu/wiki/index.php/Examples)。这里有几种教程，首先可以看 "Basic Examples Manual" 里面的例子，都非常简单，而且有代表性。然后可以参考其它实例教程。

在阅读教程的同时，也可以开始建立自己的模型。在建立模型的时候，总会遇到使用什么材料、单元等的问题，以及如何定义它们。这就要查阅[用户文档](http://opensees.berkeley.edu/wiki/index.php/Command_Manual)。里面介绍了所有 OpenSees 命令的使用方法。

当你看完了这些教程后，你已经是 OpenSees 的深度用户了。这里可能现有的单元库已经不能满足你的要求。没关系，你需要开发自己的单元。[开发者文档](http://opensees.berkeley.edu/wiki/index.php/OpenSees_Developer)是你要去的地方。按这个文档的指导，你可以很快地开发出自己需要的滞回模型或单元。

如果您在使用和开发的过程中有任何问题，都可以在[OpenSees论坛](http://opensees.berkeley.edu/community/index.php)中发表，会有同行或开发者为您回答。

在官网上您还可以找到一些[辅助工具](http://opensees.berkeley.edu/OpenSees/user/tools.php)，包括一些前后处理程序和编辑器等。感兴趣的读者可以自行试用。

### 中文资料

由于 OpenSees 官网上的资源都是英文的，对于英文不好的读者来说，看起来会有一些吃力。下面我们就推荐一些中文的资料。

本站中包含一些 OpenSees 的资料，包括 `文章` 版块下的 "[OpenSees五问](/2017/04/06/opensees-5questions-1.html)" 系列，会对 OpenSees 的一些难题进行专题的探讨。在 `工具` 版块下有一个分类是 "[OpenSees辅助](/tool-catalog.html#OpenSees辅助" ，提供一些在线的工具供OpenSees用户使用，如在线快速作图等，欢迎打开体验。在 `下载` 版块中也有一个 "[OpenSees小程序](/download-catalog.html#OpenSees小程序)" 的分类，里面有一些非常实用的子程序，可以实现一系列的功能，比如往复加载、自动减小步长、定义阻尼等，欢迎读者下载使用。本站上的所有内容都是开源的，也欢迎有向网站贡献资源的用户通过 contact@hanlindong.com 与我联系。如果你喜欢本文，欢迎点击主页边栏的 `小额捐赠` 按钮。

对于OpenSees的书籍，陈学伟博士有一本著作《结构弹塑性分析程序OpenSEES原理与实例》。书中以例题的形式介绍了一些 OpenSees 模型，包含了一些脚本的写法，还附有光盘，是一本不错的参考书籍。[陈博士的个人网站](http://www.dinochen.com)中也有一些相关的内容。

## 结语

看过本文，希望您对OpenSees有了一定的了解，能够开始运行一些OpenSees计算了。很多科研人员喜欢 OpenSees 的原因在于，它是开源软件，假以时日，可以完全把握它的所有计算方法。它回归了有限元最基础的部分。其实，有限元软件只是运行分析的途径，而有限元理论才是结构分析的核心。掌握了其中的原理，才能灵活地运用有限元软件。因此，结构工程师不是软件操作员，掌握了结构概念和有限元理论，借助软件进行研究自会如鱼得水。最后，感谢阅读本文，希望能有一些启发，欢迎留言。
