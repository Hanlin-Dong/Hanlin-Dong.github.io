---
layout:     post
title:      "我的第一篇博文"
subtitle:   "A big step of myself"
date:       2017-03-07 12:00:00
author:     董翰林
catalog:    true
tags:
    -   心情
---
## 新的开始

不知从何时起，有了一个心愿，就是拥有个人的站点。在这个站点里面有很多小工具，任何人都可以在浏览器中无限制地使用。还有很多好的资源，可以无限制地下载。再就是可以写写文章，有时能记录一下学到的东西，有时能分享自己的想法。

为了实现这个小工具的愿望，我做过很多探索。想想大概是从两年之前就开始了。最初的想法是采用服务器端完成运算。个人认为这种功能用[PHP][1]很难实现，所以我的探索是从[Python][2]开始的。[Python][2]作为一种胶水语言功能实在是太丰富，而且语法又很简单，自己又从很早就开始接触，自然就成为了首选。然而，随着知识储备不断增加，又相继接触了[node.js][3]，[ruby on rails][4]，感觉服务器端的语言五花八门，一个纠结满满的人真是摸不到头脑。

对于服务器端框架的选择，更是经历了很多纠结。从使用[PHP][1]时的[Drupal][5]，到选择了[Python][2]时纠结了很久的[flask][6]和[django][7]，再到[node.js][3]的[express][8]等等。一开始脑子里只有 ``MVC`` 模式，后来了解了 ``MTV`` 模式，还有[Restful][9]，很多巧妙的构思令人十分折服。有时选择太多真的不是一件好事，还是应该认准目标，深入钻研，才能领悟深层次的真谛。

纠结了这么多，现在跨出这一步，也有几个契机。由于[阿里云][10]的学生优惠政策缩紧，租ECS服务器的价格之高已经让我难以承担。所以决定还是把网站托管在[GitHub][11]上。利用[GitHub Pages][12]服务，来实现网站的搭建。然而[GitHub Pages][12]不支持任何服务端语言，所以决定把工具的所有功能在客户端实现。因此这个网站的雏形终于搭好，以后就是扩充内容。这是一个全新的开始。

## 架构 

本网站是一个纯静态网站，利用[GitHub Pages][12]默认的[jekyll][20]来开发。[jekyll][20]利用[liquid][21]模板，易于上手，又有很强的定制性。

网站最基本的页面有三种，分别是``博文``、``工具``、``标签``。

``博文``是基于``markdown``语法，使用[kramdown][22]进行渲染完成的。一直以来都在寻找可以很好地支持``markdown``的博客空间，但是没有满意的结果，干脆就自己搭建起来。在``博文``部分我会把自己的一些想法和感悟，学习的笔记等与大家分享。

``工具``是本站的一大特色。由于我的专业是土木工程，在科研和学习的过程中经常会遇到一此需要编程解决的问题。每个人遇到了都要写自己的程序，浪费了很多资源。所以就希望能有一个很好的平台把这些资源整合起来，做到开箱即用。现在我搭建起了一个基于浏览器的工具箱，把自己编的和网上搜集的一些小程序用``javascript``重构，发布于我的网站中，供大家在线使用。对于工具的编写模式也几经测试，改了几种实现途径，终于得到了现在看上去还算简便的方法。其实现在对工具功能的实现自己也不是很满意，因为对``javascript``的设计模式掌握不精，很多地方代码的鲁棒性很差。找到时间我一定会把现在的逻辑再次重构。

``标签``是一个搜集箱，把博文和工具融合起来，根据每一篇文章和每一个工具的特点重新排列，可以使网站中的内容更容易被找到。

网站的基础主题借用了[Hux][23]童鞋编写的模板，在此表示感谢。评论系统采用的是[多说][24]，流量统计采用的是[百度统计][25]。托管平台是[GitHub][11]。

## 工具开发

如果你也是热爱编程的土木工程师，欢迎参与平台工具的开发工作。这里有一个[模板][30]，是目前本站支持的全部控件，及这些控件支持的全部功能。实现这些功能的代码可以在``/tools/tool-template.html``文件中找到。然后通过编写一个``javascript``文件``/tools/tool-template.js``，就可以实现工具的编写。具体的方法我会再写一个开发者文档。如果对工具和控件有什么新的需求，欢迎在本文后加入评论。


[1]: http://www.php.net/

[2]: https://www.python.org/

[3]: https://nodejs.org/en/

[4]: http://rubyonrails.org/

[5]: https://www.drupal.org/

[6]: http://flask.pocoo.org/

[7]: https://www.djangoproject.com/

[8]: http://www.expressjs.com.cn/

[9]: http://baike.baidu.com/link?url=OBvLBFM-uIPOrJYYV8ACQTfqP84r67yS0fGy4gdr4tFrRcT8uR-hiOmiSPCJ3NjCNuSDkI9WPLM1PdjQCcHJEa

[10]: https://www.aliyun.com/

[11]: https://github.com/

[12]: https://pages.github.com/

[20]: http://jekyllrb.com/

[21]: https://shopify.github.io/liquid/

[22]: https://kramdown.gettalong.org/

[23]: http://huangxuan.me/

[24]: http://duoshuo.com/

[25]: http://tongji.baidu.com/web/welcome/login

[30]: http://www.hanlindong.com/tools/tool-template/