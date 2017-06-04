---
layout:     post
title:      "在Mac中使用\\(\\LaTeX\\)的方法"
subtitle:   "在Mac系统中配置和使用LaTeX也十分方便"
date:       2017-05-27 12:00:00
author:     董翰林
header-img: "img/header-latex-on-mac.jpg"
catalog:    true
tags:
    -   入门教程
    -   LaTeX
---


## \\(\\LaTeX\\)简介

也许你觉得这篇文章的标题很奇怪，几个大写字母歪歪扭扭的。没错，我在第一次看到它的时候，也觉得很奇怪。但是，它就是这样书写的。在条件允许的情况下，写作\\(\\LaTeX\\)，如果条件不允许，就写作``LaTeX``。注意区分大小写哦，不要和``latex``（乳胶）这个英文单词混淆。

\\(\\LaTeX\\)是一种文字排版系统。它是众多文字排版系统之一。我们熟悉的``Microsoft Word``，``Pages``等都属于文字排版系统。\\(\\LaTeX\\)与其它排版系统相比有很多独特性。本节中就主要介绍一下\\(\\LaTeX\\)以及\\(\\LaTeX\\)的优缺点。

#### 什么是\\(\\TeX\\)

在谈\\(\\LaTeX\\)之前，先说说\\(\\TeX\\)。

在美国斯坦福大学的计算机系，有一个叫Donald Ervin Knuth的教授。1977年，他审阅的书籍已经开始使用计算机排版，但是排版质量很差。这时他就开始构思一个高质量的排版系统。他研究了古今的排版技术，把其中最的部分用在了自己的排版系统中。这个系统被他取名为TeX。这个名字的灵感源自希腊语中艺术和技术两个单词的前3个希腊字母\\(\\tau\\varepsilon\\chi\\)。他原创了这个标识符\\(\\TeX\\)，用下移字母\\(E\\)提示人们这是一个排版软件，并可以明显地区别于其它系统的名称。在1978年，\\(\\TeX\\)第一版问世。后来，Knuth教授还不断改进\\(\\TeX\\)，他用无理数\\(\\pi\\)的近似值作为\\(\\TeX\\)的版本序号，每升级一次就增加一位小数，表达了他不断追求完美的愿望。


#### 什么是\\(\\LaTeX\\)

1984年，Knuth教授撰写的``The TeX Book``一书出版，成为最权威的\\(\\TeX\\)写作工具。然而，同年，美国数学家、计算机科学家Leslie Lamport在撰写论文时，感到虽然\\(\\TeX\\)功能很强，但是多达900条的\\(\\TeX\\)命令让人感到不便。为了便于使用，他给\\(\\TeX\\)编写了一组自定义的宏包，并命名为LaTeX。前缀La取自其姓氏。Lamport为它也设计了一个特殊的标识符，写为\\(\\LaTeX\\)，读作lay-tecks。

有了\\(\\LaTeX\\)，作者只须专注于文稿的内容编写就可以了，\\(\\LaTeX\\)会自动将整本书或论文的版面和标题按照典型格式来设置。这是\\(\\LaTeX\\)为作者带来的最大方便。

\\(\\LaTeX\\)可以认为是一个特殊版本的\\(\\TeX\\)，因为每一个\\(\\LaTeX\\)命令到最后都会被分解成一个或若干个\\(\\TeX\\)命令。


## \\(\\LaTeX\\)的优点

#### 排版质量高

提高排版质量是\\(\\TeX\\)诞生时的唯一目的。\\(\\LaTeX\\)的排版质量体现在对版面尺寸的严格控制，对字距、词距、行距和段距等字符间距松紧适中的掌握，对数学公的精确细致设计，对表格和插图的灵活处理等等。

#### 具备注释功能

在\\(\\LaTeX\\)源文件中，可在任何位置使用注释标记，将所需要的注释内容完整地保存下来，以备作者查阅。注释功能也可用于临时删除某些内容。

#### 格式自动处理

\\(\\LaTeX\\)将文稿的内容处理与格式处理分离，作者只要选定文稿类型，就可专心于文章的内容，至于文章格式的各种细节都由\\(\\LaTeX\\)统一规划设置。文中章节、图表、公式的位置都可以任意调整，无须考虑序号问题。

#### 数学式精美

\\(\\LaTeX\\)的特长之一就是数学式排版，其方法简单直观，排版效果精致细腻，而且数学式越复杂，这一特点就越明显。

#### 参考文献管理

创建参考文献是\\(\\LaTeX\\)的强项之一。\\(\\LaTeX\\)自带一个辅助工具BibTeX，可以根据作者的要求，搜索文献数据库，然后自动为文稿创建所需要的参考文献列表。

#### 可扩充性强

用户可以像搭积木那样对\\(\\LaTeX\\)进行功能扩充或者添加新的功能。这些可以通过各种宏包实现。调用相关宏包，甚至可以实现排版专业水准象棋谱、五线谱或化学方程式的能力。

#### 安全稳定灵活

\\(\\LaTeX\\)源文件是纯文本文件，所有插图都是在编译时才调入，所以同一篇论文，用\\(\\LaTeX\\)编排，其源文件尺寸要小很多倍，不会对文件存取和编辑过程产生明显影响。为了便于写作或多人合著，\\(\\LaTeX\\)允许采用子源文件的形式，其中章节和图表可以随意增删，不会影响最后编译的效果。

#### 免费使用

相比于价格昂贵的``Microsoft Word``， \\(\\TeX\\)和\\(\\LaTeX\\)都是开源免费软件。用于扩展\\(\\LaTeX\\)排版功能的各种宏包，也都可以免费下载。

#### 通用性强

由于\\(\\LaTeX\\)的源代码是公开的，所以人们开发了用于各种操作系统的版本。所以含有各种语言文字的\\(\\LaTeX\\)源文件可以毫无阻碍地跨系统使用。


---

\\(\\LaTeX\\) 有如此多的优点，一定心动了吧。不过，本文中只介绍在Mac系统中\\(\\LaTeX\\)的使用方法，并不介绍用\\(\\LaTeX\\)编写文档的具体方法。有兴趣的读者可以参考以下网站和书籍。

[LaTeX Online Tutorial](https://www.latex-tutorial.com/)

[LaTeX Tutorial Slides](http://www.rpi.edu/dept/arc/training/latex/class-slides-pc.pdf)

胡伟. \\(\\LaTeX 2\\varepsilon\\) 完全学习手册（第二版）.北京: 清华大学出版社, 2013.

本文中的介绍只针对Mac用户。对于Windows用户，使用CTeX套件安装是非常容易的，具体方法请参考[这个页面](http://www.ctex.org/CTeXDownload)


## MacTeX + Texpad

下面我们介绍如何在Mac系统中使用\\(\\LaTeX\\)。在介绍Texpad之前，先请读者区分编译器和编辑软件。编译器是一个程序，把代码编译成排版过的可视的文档。所谓的\\(\\LaTeX\\)就是一个编译器。而编辑软件是辅助代码编写的。值得指出的是，即使没有编辑软件，用写字板甚至终端都可以完成编辑。

在Mac中，推荐使用MacTeX套装中的TeX Live作为编译器，用Texpad作为编译软件。下面逐一进行介绍。

#### MacTeX

MacTeX（[官方网站](http://www.tug.org/mactex/)）是一个针对于Mac系统的\\(\\LaTeX\\)软件套装。内含了TeX Live和一些编辑器（TeX Shop, LaTeXit等）。这里主要利用其中的TeX Live编译器。

MacTeX可以(在此下载)[http://www.tug.org/mactex/mactex-download.html]运行下载的pkg文件即可完成安装，安装非常简单。

安装完成后，您的系统中已经有了TeX Live编译器。打开终端，输入

~~~
$ latex --version
~~~

会弹出\\(\\LaTeX\\)的版本信息。

#### Texpad

尽管MacTeX套装中已经带有了一些编辑器，但是使用起来都不够理想。在这里推荐使用Texpad。

Texpad是Mac上非常好用的一款软件，具体介绍请参考其[官方网站](https://www.texpad.com/)。该软件可以从[这里](https://www.texpad.com/osx)下载。除了Mac版本，还支持iOS版本。不过，该软件为付费软件。

下载的格式dmg文件。安装也非常方便。在安装后，软件会自动识别系统中已经安装的TeX Live编译器。打开软件，如果在欢迎页面的左下角有这样一行提示，说明编译器已经配置好。

![Texpad配置TexLive](/img/latex-on-mac-LoadTeXLive.png)

如果没有配置好，可以进行手动配置。点击Texpad -> Preferences -> Distributions 在 Installed Distributions 中可以看到已经安装的TeX Live选项。选择即可。

#### 使用举例

打开Texpad，弹出欢迎页面。选择模板为 Basic Article ,单击 Create a single file ，进入如图所示编辑页面

![Texpad编辑页面](/img/latex-on-mac-EditPage.png)

页面分为三栏，左边栏为文档的一些基本信息，中间栏为输入\\(\\LaTeX\\)代码的区域，右边栏为预览生成pdf的区域。

下面我们开始编辑中间栏中的\\(\\LaTeX\\)代码。可以看到，在模版中已经给出了5行语句。我们将其改为

~~~ LaTeX
\documentclass[11pt]{article}
\title{My First \LaTeX article}
\author{Hanlin DONG}
\date{2017-05-25}

\begin{document}
\maketitle
\tableofcontents

\section{Greeting}
\subsection{subsection1}
Hello, world!
\subsection{subsection2}
Hello, universe!
\subsection{subsection3}
Hello, heart!

\section{Math}
\begin{equation}
\sigma_{ji,j} + f_i = \rho\ddot{u}_i
\end{equation}
\end{document}
~~~

单击左上角的 Typeset ，可以在右边的预览栏中看到所生成的pdf文档。在左边栏中则列出了相应信息。

![Texpad生成Hello](/img/latex-on-mac-TypesetHello.png)

如果你保存了这段代码，再Typeset之后，可以在相同的路径中找到生成的pdf文档。

更多的用法，请参考[官方网站](https://www.texpad.com/)。

## \\(\\LaTeX\\)与Word的相互转换:Pandoc

有时用户有把用\\(\\LaTeX\\)编写的文档转换为Word文档的需求，可以通过Pandoc来实现。

Pandoc（[官方网站](http://www.pandoc.org/)）可谓是文档转换界的“瑞士军刀”。它可以实现多种文档格式的相互转换。该软件为免费软件，可以由此进入[下载页面](http://www.pandoc.org/installing.html)。

安装完成后，在终端中输入

~~~
$ pandoc --version
~~~

可以看到软件的版本信息。

用pandoc把\\(\\LaTeX\\)文档转换成Word文档很容易。把刚才的代码保存为``hello.tex``，从终端进入该文件所在的文件夹，输入

~~~
$ pandoc -o hello.docx hello.tex
~~~

其意义为，把``hello.tex``文件输出为``hello.docx``。系统会自动识别输出的格式。执行后可以看到，系统中已经生成了一个名为``hello.docx``的文件。打开，如图所示。

![pandoc转换成word](/img/latex-on-mac-PandocToWord.png)

可见，section和subsection都对应了相应的格式，只需要在格式栏中编辑成为想要的格式即可。公式已被用word的公式编辑器重写，但是有些位置与\\(\\LaTeX\\)生成的不尽相同。目录在转换的过程中丢失。

可见，**转换过的文档不能完全保持原样**，读者要特别注意。


## \\(\\LaTeX\\)的中文支持：ctex宏包

为了使\\(\\LaTeX\\)支持中文，在TeXLive中已经自带了ctex宏包。利用这一宏包可以实现录入中文。把上面的``hello.tex``修改为``你好.tex``，内容改为

~~~
\documentclass[11pt]{article}
\usepackage{ctex}
\title{我的第一篇\LaTeX 文档}
\author{董翰林}
\date{2017-05-25}

\begin{document}
\maketitle
\tableofcontents

\section{问好}
\subsection{一级}
你好，世界！
\subsection{二级}
你好，宇宙！
\subsection{三级}
你好，内心！

\section{数学}
\begin{equation}
\sigma_{ji,j} + f_i = \rho\ddot{u}_i
\end{equation}
\end{document}
~~~

注意：代码中加入了``\usepackage{ctex}``命令。

点击左上角Typeset按钮的下拉箭头，按图手动选择编译器XeLaTeX。然后编译，得到相应的中文pdf.

![LaTeX中文支持](/img/latex-on-mac-LaTeXChinese.png)

本文中的源代码可以[点击下载](/resource/latex/latex-on-mac.zip)。