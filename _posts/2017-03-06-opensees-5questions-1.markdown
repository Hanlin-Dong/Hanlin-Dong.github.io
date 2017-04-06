---
layout:     post
title:      "OpenSees五问(1)"
subtitle:   "有关OpenSees的疑难问题总结"
date:       2017-04-05 22:00:00
author:     董翰林
catalog:    true
tags:
    -   OpenSees
    -   有限元
---

## 第1问 如何在时程分析中改变步长

#### 减小时程分析步长可以改善收敛性
首先，建立一个简单的弹性时程分析模型。模型采用单自由度，两个节点，位置重合，用``twoNodeLink``单元相连。``twoNodeLink``单元中赋予材料属性，用单轴材料模型``Elastic``来实现。具体代码如下

```tcl
model BasicBuilder -ndm 1 -ndf 1
node 0 0.
node 1 0.
fix  0 1
mass 1 1.
uniaxialMaterial Elastic 1 1.0e5
element twoNodeLink 1 0 1 -mat 1 -dir 1
timeSeries Path 1 -dt 0.01 -filePath accel.txt
pattern UniformExcitation 1 1 -accel 1 -fact 9800
rayleigh 0. 0. 0. [expr 2*0.02/pow([eigen -fullGenLapack 1],0.5)]
recorder Node -file node.txt -time -node 1 -dof 1 disp    

constraints Transformation
numberer Plain
system BandGeneral
test NormDispIncr 1.0e-8 10
algorithm Newton
integrator Newmark 0.5 0.25
analysis Transient
analyze 3000 0.01
```
    
由于本例中结构为弹性，所以分析很快结束。但是当结构非线性较强时，可能会发生不能收敛的情况。例如，将上面代码中

```tcl
uniaxialMaterial Elastic 1 1.0e5
```
    
改为

```tcl
uniaxialMaterial Steel01 1 200. 1.0e5 0.1
```
    
即增加材料非线性，使``twoNodeLink``单元的内力达到``200``后，刚度褪化为初始刚度的``0.1``倍。这时再运行，得到以下错误信息

```
WARNING: CTestNormDispIncr::test() - failed to converge 
after: 10 iterations  current Norm: 0.0072 (max: 1e-08, Norm deltaR: 360)
NewtnRaphson::solveCurrentStep() -the ConvergenceTest object failed in test()
DirectIntegrationAnalysis::analyze() - the Algorithm failed at time 1.82
OpenSees > analyze failed, returned: -3 error flag
```
	
即迭代不收敛。这时很容易想到，由于增加了几何非线性，模型收敛更加困难。一个很容易的解决方法是，把原代码中的

```tcl
analyze 3000 0.01
```
    
改成

```tcl
analyze 6000 0.005
```
    
即缩小每一分析步的步长。这时发现，模型收敛。

#### 计算时间与收敛性的平衡

尽管减小分析步步长可以改善收敛性，但是会增长计算时间，这就形成了一对矛盾。在地震作用较小的时段，结构非线性发展很小，可以用较大的步长快速算过。但是在地震作用较大的时段，结构可能产生较强非线性，所以要用足够小的步长来保证收敛。

发了平衡模型分析所用的总时间和模型的收敛性，就要在运算的过程中动态地改变步长，以达到平衡。

下面介绍一种动态改变分析步长的方法。代码如下

```tcl
proc timeHistoryAnalyze {npts dt tol} {
# 输入参数：
# npts: 地震文件中数据点的个数
# dt: 地震文件中数据点之间的时间间隔
# tol: 最小允许的时间步长

# 当前分析时间
set current 0.0
# 是否收敛 收敛时ok=0
set ok 0
# 增加的步数，用于屏幕输出
set incr 0
# 在指定时间范围内循环，如果不收敛则退出
while {$ok == 0 && $current < [expr $npts * $dt] } {
# 设置初始时间间隔与地震记录时间间隔相同
set interval $dt
# 以$interval时间间隔分析一步
set ok [analyze 1 $interval]
# 计数器加1
set incr [expr $incr + 1]
# 如果刚才的分析步不收敛，减小步长，但不小于定义的最小步长
while {$ok != 0 && $interval>1.0e-7} {
	# 步长减半
	set interval [expr $interval/2]
	puts "Fail to convenge at time $current, set a new step length = $interval"
	# 重新分析
	set ok [analyze 1 $interval]
	# 计数器加1
	set incr [expr $incr + 1]
}
# 当前时间增加
set current [expr $current + $interval]
# 每10步输入一次信息
if {[expr $incr % 10] == 0} {
	puts "analyzing at time $current"
}
}
puts "analyze done with code $ok!"
}
```

将上述代码放入文件中，就可以在分析中调用了。保存文件名为 ``opq1-dynamic-interval.tcl`` ，再将原代码中的

```tcl
analyze 3000 0.01
```
改为

```tcl
source opq1-dynamic-interval.tcl
timeHistoryAnalyze 3000 0.01 1.0e-4
```
运行，从控制台中可以看出，在某些分析步中第一次使用``0.01``步长没有收敛，程序自动将步长调整为``0.005``，实现了收敛。

#### 源码下载

本问的源代码可以[点击下载][1]。

[1]: /resource/ops/opq01.zip

## 第2问 twoNodeLink和zeroLength单元的正负向

#### 正负向问题何时产生

有的时候，一些简单的接触问题中，可能会采用简化的模拟方法，用只压不拉的模型来近似模拟接触。即在接触面所定义的两个点相互挤压时，单元产生一个较大的刚度，而两个点相互脱开时，刚度几乎没有。在``OpenSees``中，有一个简单的单轴材料模型，即``ENT``（[Elastic No Tension Material][2]），可以较好地模拟这一特性。

通常，可以把这一材料模型作为力-位移关系模型来使用，赋于``zeroLength``单元或``twoNodeLink``单元中。这两个单元都支持``零长度``，而通常接触面会被自然地视为是一个零长度的单元。那么此时就会产生问题，对于``零长度``的单元，如果采用``ENT``模型，什么方向是拉，什么方向是压呢？

#### 算例

下面代码代表的模型，是平面模型，用两个``twoNodeLink``将两个位置相同的节点连接起来，其中一个赋予``ENT``材料，另一个赋予``Elastic``材料，以避免结构刚度矩阵奇异。两个节点中一个固定，另一个被施加**正向**的单位位移。观察结构的力-位移关系。

```tcl
model BasicBuilder -ndm 2 -ndf 3
node 0 0. 0.
node 1 0. 0.
fix  0 1 1 1
fix  1 0 1 1
uniaxialMaterial Elastic 1 10
uniaxialMaterial ENT 2 10
element twoNodeLink 1 0 1 -mat 1 -dir 1
# element twoNodeLink 2 0 1 -mat 2 -dir 1
element twoNodeLink 2 1 0 -mat 2 -dir 1
pattern Plain 1 Linear {
	load 1 1. 0. 0.
}
recorder Node -file node.txt -time -node 1 -dof 1 disp    
constraints Plain
numberer Plain
system BandGeneral
test NormDispIncr 1.0e-8 10
algorithm Newton
# integrator DisplacementControl 1 1 0.2
integrator DisplacementControl 1 1 -0.2
analysis Static
analyze 5
```

输出的文件``node.txt``的内容为

```
2 0.2
4 0.4
6 0.6
8 0.8
10 1
```

可以看出，此时结构刚度为10，与``Elastic``材料的刚度相同。

现在把位移控制语句

```
integrator DisplacementControl 1 1 0.2
```

改为

```
integrator DisplacementControl 1 1 -0.2
```

即赋予一个**负向**的位移，这时的``node.txt``文件的内容为

```
-4 -0.2
-8 -0.4
-12 -0.6
-16 -0.8
-20 -1
```

可见此时结构的刚度发生了变化。为``ENT``和``Elastic``材料并联后的刚度。

那么同样是将两个重合的点拉开，为什么正向拉开被``ENT``材料认为是受拉，而负向拉开被认为是受压呢？很容易想到，*这与定义单元时，两个节点``iNode``与``jNode``的定义顺序有关。*

为了验证，把原代码中

```
element twoNodeLink 2 0 1 -mat 2 -dir 1
```

改为

```
element twoNodeLink 2 1 0 -mat 2 -dir 1
```

仍采用负向加载，得到的``node.txt``结果为

```
-2 -0.2
-4 -0.4
-6 -0.6
-8 -0.8
-10 -1
```

可以发现，刚度确实发生了变化。

采用``zeroLength``单元替换``twoNodeLink``单元，得到的结果完全相同。

#### 避免节点顺序的影响

虽然发现了这一特性，可以通过仔细定义两个节点的顺序来解决这一问题，但还是不尽人意。所以在实际使用中，建议将两个节点隔开一点距离，避免完全重合。这样，两个节点距离减小的方向就是压缩的方向，两个节点距离增大的方向就是拉伸的方向，与节点的定义顺序无关。

将上面代码中

```
node 1 0. 0.
```

改为

```
node 1 0.01 0.
```

再进行尝试，发现不论顺序如何，拉和压正常了。

#### 源码下载

本问的源代码可以[点击下载][3]。

[2]: http://opensees.berkeley.edu/wiki/index.php/Elastic-No_Tension_Material

[3]: /resource/ops/opq02.zip

## 第3问 如何施加预拉力

#### 用材料模型施加预拉力

在一些有限元软件中，施加预拉力可以通过**降温法**方便地完成。然而，由于``OpenSees``的热学模块还不完善，不能用这一方法来施加预拉力，但是，``OpenSees``中的单轴材料模型``Steel02``可以帮助用户施加预拉力。

``Steel02``代表[Menegotto-Pinto][4]模型，有很多参数可以选择。用于施加预拉力时，最重要的参数是``$sigInit``，也就是初始应力。定义了初始应力，也就相应地定义了施加的预拉力。通常``Steel02``可以与``truss``，``corotTruss``，``twoNodeLink``等单元配合使用。

#### 预拉力定义方法

下面通过一个算例来介绍有预拉力模型的建立方法。在平面两自由度体系中，设置两个节点，用一个``truss``单元来模拟受压结构，再用另一个``truss``单元来模拟一个后张法预应力钢绞线，张拉于简支梁的两端。

```tcl
model BasicBuilder -ndm 2 -ndf 2
node 0 0. 0.
node 1 2000. 0.
fix 0 1 1
fix 1 0 1
uniaxialMaterial Elastic 1 2.0e5
# Steel02 Arguments      #tag #Fy   #E    #b  #R0 #cR1  #cR2 #a1 #a2 #a3 #a4 #sigInit
uniaxialMaterial Steel02 2    2.0e4 2.0e6 0.1 15  0.925 0.15 1.0 1.0 1.0 1.0 2.0e3
# truss       #tag iNode #jNode #Area #Mat
element truss 1    0     1      1.0e5 1
element truss 2    0     1      500. 2 
recorder Node -file node.txt -time -node 1 -dof 1 disp
recorder Element -file ele1.txt -time -ele 1 force
recorder Element -file ele2.txt -time -ele 2 force
constraints Plain
numberer Plain
system BandGeneral
test EnergyIncr 1.0e-6 200
algorithm Newton
integrator LoadControl 1
analysis Static
analyze 1
```

对于``Steel02``的参数，重要的几个是``Fy``，``E``，``sigInit``。由于不希望预应力钢绞线出现屈服，所以一些与材料非线性有关的参数在这里暂不细致考虑。用``truss``单元来模拟钢绞线，通过分析1步，可以实现预拉力的施加。

在本模型中，两个``truss``的刚度分别为

\\[
K_1 = \frac{E_1A_1}{L} = \frac{2.0\times 10^5\times 1\times 10^5}{2000} =1\times 10^7
\\]
\\[
K_2 = \frac{E_2A_2}{L} = \frac{2\times 10^6\times 500}{2000}=5\times 10^5
\\]

定义了钢绞线的初应力为

\\[
\sigma_p = 2\times 10^3
\\]

在施加预拉力时，钢铰线产生了初始变形

\\[
\Delta_p = \frac{F_p}{K_2}=\frac{\sigma_p A_2}{K_2}
\\]


张拉后，预拉力由1单元承担。根据力的平衡，设\\(F_1\\)为1单元中的压力，\\(F_2\\)为2单元中的拉力，则有

\\[
F_1 = F_2
\\]

在此过程中，1单元和2单元同时产生了压缩变形\\(\Delta\\)，则此时钢铰线的实际变形为

\\[
\Delta_2 = \Delta_p -\Delta
\\]

根据物理关系，有

\\[
F_1 = K_1 \Delta
\\]
\\[
F_2 = K_2 \left(\Delta_p-\Delta\right)
\\]

代入上式，得

\\[
K_1 \Delta = K_2 \left(\frac{\sigma_p A_2}{K_2}-\Delta\right)
\\]

解得

\\[
\Delta = \frac{\sigma_p A_2}{K_1+K_2}=0.0952
\\]
\\[
F_1 = F_2 = K_1 \Delta=952000
\\]

查看输出的``node.txt``文件

```
1 -0.0952381
```

和``ele1.txt``文件

```
1 952381 0 -952381 -0
```

与计算的结果吻合。

#### 施加预拉力后的加载

在实际结构分析中，在施加预拉力后，通常要进行进一步加载。在本问中以轴向加载为例，探讨进一步加载的方法。

在上一小节模型的基础上，添加如下代码

```tcl
pattern Plain 1 Linear {
	load 1 1. 0.
}
integrator DisplacementControl 1 1 0.01
analyze 5
```
即将结构的1节点向正向按位移加载，此时得到``node.txt``文件为

```
1 -0.0952381
78750.5 -0.0852381
170625 -0.0752381
269063 -0.0652381
370781 -0.0552381
474141 -0.0452381
```

我们知道，两个单元并联，则并联后的刚度为

\\[
K=K_1+K_2=1.05\times 10^7
\\]

在第一次移动0.01位移的时候，施加的外力为

\\[
F=Kd_1=1.05\times 10^7\times 0.01 = 1.05\times 10^5
\\]

但是从``node.txt``中得到的外力为``78750.5``，与计算的结果不一致。其中的错误可能是因为，在加载过程中，在每一分析步运行时，预应力都被通过某种机制重复地施加了一次。详细原因这里不作细究。解决这一问题的方法很简单，只要在分析之间加上一句话

```tcl
loadConst -time 0.0
```
这时再运行，得到``node.txt``为

```
1 -0.0952381
105000 -0.0852381
210000 -0.0752381
315000 -0.0652381
420000 -0.0552381
525000 -0.0452381
```
与计算的结果一致。

以上分析表明，**含预拉力模型实际加载前要将time归零**。

#### 源码下载

本问的源代码可以[点击下载][5]。


[4]: http://opensees.berkeley.edu/wiki/index.php/Steel02_Material_--_Giuffr%C3%A9-Menegotto-Pinto_Model_with_Isotropic_Strain_Hardening

[5]: /resource/ops/opq3.zip

## 第4问 twoNodeLink单元的特性

#### twoNodeLink单元

在``OpenSees``的单元库中，目前的``连接单元``目录下只有一个单元[``twoNodeLink``][6]。这个单元可以把单轴应力-应变材料关系模型直接作为结构的力-位移关系模型，有广泛的应用情景。但是这一单元有很多难以把握的特性，如果不能充分理解，很容易出错。因此对``twoNodeLink``单元的特性要正确地理解。

#### 低维度空间中指定局部坐标轴方向

在有限单元法中，每一个单元都有自己的局部坐标系。如果定义为零长单元，则单元的局部坐标方向与整体坐标方向相同。如果为非零长单元，则单元的局部1轴为``iNode``指向``jNode``方向。但是局部2轴的方向没有指定。这就需要用户来指定。语句为

```
-orient <x1 x2 x3> y1 y2 y3
```

如果用户不指定y方向，程序会输出警告信息

```
WARNING TwoNodeLink::setUp() - element: 1
no local y vector specified
```

在指定方向的语句中，``y1``，``y2``，``y3``分别代表2轴方向向量的坐标（在全局坐标系下）。用户也可以用同样的方式指定局部1轴的坐标，即赋予语句中``x1``，``x2``，``x3``的值。

那么这时产生了一个问题。对于三维空间中的模型，定义一个方向向量需要三个坐标，但是如果在二维空间中，如何自定义``twoNodeLink``单元的方向呢？

下面我们建立一个算例，来探讨这个问题。

在二维三自由度空间中，建立一个两节点模型，用``twoNodeLink``单元相连。代码如下

```tcl
model BasicBuilder -ndm 2 -ndf 3
node 0 0. 0. 
node 1 1. 0. 
fix  0 1  1  1  
fix  1 0  1  1 
uniaxialMaterial Elastic 1 1.
element twoNodeLink 1 0 1 -mat 1 -dir 1 
recorder Node -file node.txt -time -node 1 -dof 1 2 3 disp    
pattern Plain 1 Linear {
	load 1 1. 0. 0. 
}
constraints Plain
numberer Plain
system BandGeneral
test NormDispIncr 1.0e-8 10
algorithm Newton
integrator LoadControl 1
analysis Static
analyze 5
```

查看``node.txt``文件，得到

```
1 1 0 0
2 2 0 0
3 3 0 0
4 4 0 0
5 5 0 0
```

这个模型没有太多实际意义，只是告诉我们，当前没有自定方方向时，局部1轴是两个节点的连线方向。那么如果想指定局部1轴的方向怎样处理？我们建立一个新的模型。

在这个模型中，希望把``twoNodeLink``单元的局部1轴坐标赋于全局坐标的2方向上。那就要用两个方向向量来分别定义局部1轴和局部2轴。在二维空间中，每个方向向量有两个坐标。把代码改为

```
model BasicBuilder -ndm 2 -ndf 3
node 0 0. 0. 
node 1 1. 0. 
fix  0 1  1  1  
fix  1 1  0  1 
uniaxialMaterial Elastic 1 1.
element twoNodeLink 1 0 1 -mat 1 -dir 1 -orient 0. 1. 1. 0.
recorder Node -file node.txt -time -node 1 -dof 1 disp    
pattern Plain 1 Linear {
	load 1 0. 1. 0. 
}
constraints Plain
numberer Plain
system BandGeneral
test NormDispIncr 1.0e-8 10
algorithm Newton
integrator LoadControl 1
analysis Static
analyze 5
```

这时程序会报错

```
WARNING insufficient arguments after -orient flag
twoNodeLink element: 1
```

既然提示输入的变量不够，在二维空间中，默认所有z坐标都为0，那就把z坐标为0加入进去，把单元定义语句改为

```
element twoNodeLink 1 0 1 -mat 1 -dir 1 -orient 0. 1. 0. 1. 0. 0.
```

此时再运行，控制台输出的信息表明，已经指定了方向。

```
WARNING TwoNodeLink::setUp() - element: 1
ignoring nodes and using specified local x vector to determine orientation
```
查看``node.txt``文件，发现结果正确

```
1 0 1 0
2 0 2 0
3 0 3 0
4 0 4 0
5 0 5 0
```

进一步探究发现，如果z坐标不为0，得到的结果会出现错误。因此，在对``twoNodeLink``单元赋方向时，如果坐标数小于3，**应对不存在的坐标值赋0**。

#### 用户定义方向坐标不垂直

如果用户定义的两个方向坐标不垂直，程序如何处理呢？

在上述二维模型的基础上做一些小的修改，输出结构的初始刚度矩阵

```
model BasicBuilder -ndm 2 -ndf 3
node 0 0. 0. 
node 1 1. 0. 
fix  0 1  1  1  
uniaxialMaterial Elastic 1 1.
uniaxialMaterial Elastic 2 2.
uniaxialMaterial Elastic 3 3.
element twoNodeLink 1 0 1 -mat 1 2 3 -dir 1 2 3 -orient 1. 0. 0. 0. 1. 0.
constraints Plain
numberer Plain
system FullGeneral
test NormDispIncr 1.0e-8 10
algorithm Newton
integrator LoadControl 1
analysis Static
analyze 1
printA
```

得到

```
1 0 0 
0 2 -1 
0 -1 3.5 
```

调整``y1``，``y2``两个坐标的值，使局部两轴不正交，发现得到的刚度矩阵不变。调整``x1``，``x2``两个坐标的值，发现刚度矩阵改变。

上面的小例子说明，如果定义的两个方向不正交，程序是以局部1轴的定义为准的。实际上，程序是采用定义的两个向量叉积作为局部3轴，再用局部3轴与局部1轴的叉积作为局部2轴的。与``geomTransf``定义坐标的方法类似。

#### twoNodeLink的自由度耦合

观察上一小节中得到的刚度矩阵，可以看出，``twoNodeLink``单元的局部2、3自由度是耦合的，这在使用的过程中要特别注意。如果不希望发生自由度耦合的话，应该定义多个在1方向上的``twoNodeLink``单元，而不是使用一个单元的多个方向。

对于程序给出的刚度矩阵

\\[
A_{ij}=\left[\begin{matrix}1&0&0\\\\0&2&-1\\\\0&-1&3.5\end{matrix}\right]
\\]

我们对矩阵中的元素一一进行考查。
对于\\(A_{11}\\)和\\(A_{22}\\)，很明显是我们定义的两个刚度。但是对于\\(A_{33}\\)，这个刚度与我们定义的刚度是不同的，因为发生了自由度耦合。这一点要特别注意。\\(A_{23}\\)和\\(A_{32}\\)元素不为0，也是由于自由度耦合造成的。那么这几个刚度值是如何计算出来的呢？

在这里，有一个``shear distance``的概念，直接影响了结构的刚度矩阵。``twoNodeLink``的原理如下图所示，``shear distance``主要影响的是代表局部2轴刚度，也就是图中\\(u_{b,2}\\)弹簧的位置。在默认状态下，``shear distance``定义为单元的中部，即如图所示位置。

![twoNodeLink][7]

此时，如果``iNode``固定，而``jNode``产生单位转角时，可以看到，对于\\(u_{b,2}\\)弹簧所连接的两个刚臂，与``iNode``一端相连的刚臂是固定的，而与``jNode``一端相连的刚臂产生了一个转角。由于``jNode``的平动自由度被约束，在\\(u_{b,2}\\)弹簧位置就会产生一个相对位移，大小为转角与转动刚臂长度的乘积（小变形情况下）。在本例中，刚臂长度为0.5，\\(u_{b,2}\\)弹簧的刚度为2，因此刚度矩阵中

\\[
A_{23}=A_{32}=-0.5\times2=-1
\\]

同时，刚臂转动后\\(u_{b,2}\\)弹簧产生的力会产生一个附加弯矩，作用在``jNode``上，大小为

\\[
M_s = 1\times 0.5=0.5 
\\]

与定义的转角弹簧刚度叠加，得到刚度矩阵中

\\[
A_{33}=3+0.5=3.5
\\]

#### 剪切距离的定义

剪切距离``shear distance``还可以由用户自定义。用剪切中心点与``iNode``之间的距离与单元长度之比来确定。在二维空间中定义一个区间\\([0, 1]\\)中的数，在三维空间中定义两个区间\\([0, 1]\\)中的数。默认状态下这个数取值为0.5。

将上面代码中单元定义的部分改成

```tcl
element twoNodeLink 1 0 1 -mat 1 2 3 -dir 1 2 3 -orient 1. 0. 0. 0. 1. 0. -shearDist 0.2
```

得到输出的刚度矩阵为

```
1 0 0 
0 2 -1.6 
0 -1.6 4.28 
```

发现与上一小节中得出的结论一致。

#### 源码下载

本问的源代码可以[点击下载][8]。



[6]: http://opensees.berkeley.edu/wiki/index.php/Two_Node_Link_Element

[7]: http://opensees.berkeley.edu/wiki/images/6/68/TwoNodeLinkElement.png

[8]: /resource/ops/opq04.zip

## 5 recorder输出的几个问题

#### 特征值与特征向量输出

想要获得结构的特征向量，需要使用``recorder``输出。以一个三维空间中的两自由度体系为例

```tcl
model BasicBuilder -ndm 2 -ndf 3
node 0 0. 0.
node 1 0. 2000.
node 2 0. 4000.
fix 0 1 1 1
mass 1 200. 200. 0.
mass 2 100. 100. 0.
geomTransf Linear 1
element elasticBeamColumn 1 0 1 1.0e4 2.0e6 1.0e8 1
element elasticBeamColumn 2 1 2 1.0e4 2.0e6 1.0e8 1
puts [eigen 2]
recorder Node -file eigen1.txt -node 1 2 -dof 1 2 3 eigen1
recorder Node -file eigen2.txt -node 1 2 -dof 1 2 3 eigen2
record
```

运行，控制台中输出了两个数字

```
7.782659e+01  2.065031e+03  
```

这就是结构的两个特征值。在``OpenSees``中，特征值\\(\lambda\\)的定义为

\\[
\left(K-\lambda M\right)\phi=0
\\]

即我们通常所说的\\(\omega^2\\)。它与结构周期的关系为

\\[
T=\frac{2\pi}{\omega}=\frac{2\pi}{\sqrt{\lambda}}
\\]

因此，算例结构的两阶周期为

\\[
T_1 = \frac{2\pi}{\sqrt{77.83}}=0.71s
\\]

\\[
T_2 = \frac{2\pi}{\sqrt{2065}}=0.14s
\\]

对应两个周期的振型，可以从``recorder``生成的两个文件中找到。打开``eigen1.txt``，内容为

```
0.029707 0 -2.58115e-05 0.0907468 -1.35525e-20 -3.28741e-05
```

由于``recorder``中输出了两个节点，每个节点输出了三个自由度，所以共输出了6个数字，前三个为节点1在三个自由度上对应1阶周期的振型，后三个为节点2的振型。可以看出，在1阶振型中，2方向和3方向的位移都远小于1方向，可以忽略。只关注在1方向上的位移即可。这个位移值与振型的值是一致的。即1阶振型为

\\[
\phi_1 = \left\\{ \begin{matrix}0.029707&0.0907468\end{matrix}\right\\}^T
\\]

可以根据用户的需要进行归一化。从``eigen2.txt``文件中可以找到2阶振型

\\[
\phi_2 = \left\\{ \begin{matrix}-0.0641677&0.0420121\end{matrix}\right\\}^T
\\]

值得一提的是，如果所求的特征值数与结构的振动自由度数相同，要将特征值输入语句改为

```tcl
eigen -fullGenLapack 2
```

否则程序会报错。这在小模型算例中可能会用到。

#### 节点加速度输出

在地震响应分析中，我们关心结构的位移和速度通常是相对于地面的**相对位移**和**相对速度**，而关心结构的加速度通常是**绝对加速度**，因为只有绝对加速度才能与牛顿第二定律建立关联。

在用``recorder``输出时程分析结果时，应该特别注意输出的是相对值还是绝对值。对于位移和速度，输出的都是相对值，和我们关注的一样。而对于加速度，要特别注意。

如果采用语句

```
recorder Node -file node.txt -node 1 -dof 1 accel
```

则输出的是相对加速度。如果希望输出绝对加速度，则必须将语句改为

```
recorder Node -file node.txt -timeSeries 1 -node 1 -dof 1 accel
```

这时输出的是绝对加速度。

#### 拟时间输出

将第一节中的模型稍作修改，得到一个悬臂柱水平位移加载的模型。

```tcl
model BasicBuilder -ndm 2 -ndf 3
node 0 0. 0.
node 1 0. 2000.
node 2 0. 4000.
fix 0 1 1 1
geomTransf Linear 1
element elasticBeamColumn 1 0 1 1.0e4 2.0e6 1.0e8 1
element elasticBeamColumn 2 1 2 1.0e4 2.0e6 1.0e8 1
pattern Plain 1 Linear {
	load 2 1000. 0. 0.
}
recorder Node -file node.txt -time -node 2 -dof 1 disp
recorder Element -file ele.txt -time -ele 1 force
constraints Plain
numberer Plain
system BandGeneral
test EnergyIncr 1.0e-6 200
algorithm Newton
integrator DisplacementControl 2 1 0.1
analysis Static
analyze 5
```
注意模型中对``pattern``的定义是必不可少的。在``OpenSees``中，``DisplacementControl``的实现采用了一种很巧妙的机制。首先，要用``pattern``命令定义结构中的荷载，这些定义为参照荷载。用\\(P_{ref, i}\\)来表示。在本例中，仅定义了一个水平向，大小为``1000``的参照荷载\\(P_{ref, 1}\\)。每个参照荷载可以定义一个对应的荷载放大系数\\(\lambda_i\\)。在本例中没有指定放大系数，则\\(\lambda_1=1\\)。

对于结构所受的实际外荷载，可以用下式描述。

\\[
P_f = P_c + \lambda\sum_{i=1}^{np}{\lambda_iP_{ref, i}}
\\]

式中的\\(\lambda\\)实际上就是所谓的拟时间（pseudo-time），也就是``recorder``中``-time``输出的对应值。对于\\(P_c\\)，实际上是指不参与被拟时间放大的荷载，比如第三问中的钢铰线预拉力，再比如低周往复加载时施加的重力荷载。这可以通过以下语句实现。

```tcl
loadConst -time 0.0
```
在该语句之前的荷载，不再被拟时间放大。同时拟时间也被归零。其它荷载都到乘上拟时间之后施加在结构上。

打开``node.txt``，可以看到输出结果

```
0.9375 0.1
1.875 0.2
2.8125 0.3
3.75 0.4
4.6875 0.5
```

第一列表示的是拟时间。也就是所有荷载的乘数。第二列是节点2的1方向位移。第一行数据的意思是，当节点2在1方向产生0.1的位移是，拟时间为0.9375，也就是结构所受的水平力为0.9375&times;1000=937.5。依次类推。

通过``node.txt``文件可以输出结构的荷载-位移曲线。在本站的[结构工具箱][9]中，OpenSees后处理模块有[绘制荷载-位移曲线的工具箱][10]。可以生成荷载-位移曲线，并支持保存。

#### 单元内力输出

打开上一小节中生成的``ele.txt``文件，内容如下。

```
0.9375 -937.5 0 3.75e+06 937.5 0 -1.875e+06
1.875 -1875 0 7.5e+06 1875 0 -3.75e+06
2.8125 -2812.5 0 1.125e+07 2812.5 0 -5.625e+06
3.75 -3750 0 1.5e+07 3750 0 -7.5e+06
4.6875 -4687.5 0 1.875e+07 4687.5 0 -9.375e+06
```

其中第1列为拟时间，第2到7列为单元受力。前三列为``iNode``节点受的等效外力，后三列为``jNode``节点受的等效外力。分别按1、2、3三个方向排序。这些力是定义在全局坐标系下的。单元力输出时，输了上节中使用的``force``一般还有另外两种选择：``localForce``和``basicForce``。

下面我们把上一小节中``elasticBeamColumn``单元替换成``dispBeamColumn``，并赋予一个250&times;250&times;14&times;14的H形纤维截面。一种快速生成纤维截面的方法是使用本站[结构工具箱][9]中OpenSees前处理模块的[纤维截面生成工具箱][11]。

生成的纤维截面的代码为

```
section Fiber 1001 {
#200x200x14x14
fiber 97.6667 -95.0000 46.6667 1
fiber 93.0000 -95.0000 46.6667 1
fiber 88.3333 -95.0000 46.6667 1
...
fiber -93.0000 95.0000 46.6667 1
fiber -88.3333 95.0000 46.6667 1
}
uniaxialMaterial Elastic 2001 404391249000
uniaxialMaterial Elastic 4001 2153846153.8462
uniaxialMaterial Elastic 3001 3589743589.7436
section Aggregator 1 3001 Vy 4001 Vz 2001 T -section 1001
```

该截面中聚合了抗剪和抗扭刚度。用这一截面替换上一小节的弹性截面，得到模型代码如下

```
model BasicBuilder -ndm 2 -ndf 3
node 0 0. 0.
node 1 0. 2000.
node 2 0. 4000.
fix 0 1 1 1
geomTransf Linear 1
uniaxialMaterial Elastic 1 2.0e5
source opq05-section-200x200x14x14.tcl
element dispBeamColumn 1 0 1 5 1 1 
element dispBeamColumn 2 1 2 5 1 1 
pattern Plain 1 Linear {
	load 2 1000. 0. 0.
}
recorder Node -file node.txt -time -node 2 -dof 1 disp
recorder Element -file ele.txt -ele 1 force
recorder Element -file ele-local.txt -ele 1 localForce
recorder Element -file ele-basic.txt -ele 1 basicForce
constraints Plain
numberer Plain
system BandGeneral
test EnergyIncr 1.0e-6 200
algorithm Newton
integrator DisplacementControl 2 1 0.1
analysis Static
analyze 5
```

模型中使用了三种单元``recorder``，分别输出``force``、``localForce``和``basicForce``。

``ele.txt``文件中内容为

```
-45.4835 2.74536e-14 181934 45.4835 -2.74536e-14 -90967
-90.967 5.95345e-14 363868 90.967 -5.95345e-14 -181934
-136.451 1.29617e-13 545802 136.451 -1.29617e-13 -272901
-181.934 9.29857e-14 727736 181.934 -9.29857e-14 -363868
-227.418 -8.92754e-14 909670 227.418 8.92754e-14 -454835
```

``ele-local.txt``文件中内容为

```
2.74536e-14 45.4835 181934 -2.74536e-14 -45.4835 -90967
5.95345e-14 90.967 363868 -5.95345e-14 -90.967 -181934
1.29617e-13 136.451 545802 -1.29617e-13 -136.451 -272901
9.29857e-14 181.934 727736 -9.29857e-14 -181.934 -363868
-8.92754e-14 227.418 909670 8.92754e-14 -227.418 -454835
```

``ele-basic.txt``文件中内容为

```
-2.74536e-14 181934 -90967
-5.95345e-14 363868 -181934
-1.29617e-13 545802 -272901
-9.29857e-14 727736 -363868
8.92754e-14 909670 -454835
```

不难看出，``force``语句得到的等效力是建立在全局坐标系下的，``localForce``语句得到的等效力是建立在单元局部坐标系下的。而``basicForce``中输出的力为轴力和两个端弯矩，同样也是在局部坐标系下建立。

对于``force``和``localForce``的输出都很好理解，那么为什么``basicForce``只输出了两个三个量呢？为什么剪力没有了呢？这与``OpenSees``中采用的有限单元法有关。这一部分比较复杂，将在其它文章中进行介绍。

#### 纤维截面应力应变输出

如果需要知道纤维截面的应力，可以通过``recorder``进行输出。在上例的代码中增加一句

```tcl
recorder Element -file stressStrain.txt -ele 1 section 1 fiber 93.00 -95.00 stressStrain
```

即可实现纤维截面应力和应变的输出。在增加的语句中，``section 1``表示单元的积分截面。由于在单元1的定义中取了5个积分截面，所以``section``后面的数字可以为1~5，表示5个积分截面。``fiber``后面的两个数字表示所考察纤维的局部坐标。

``stressStrain.txt``文件如下

```
0.34057 1.70285e-06
0.68114 3.4057e-06
1.02171 5.10855e-06
1.36228 6.8114e-06
1.70285 8.51425e-06
```

第一列表示应力，第二列表示应变。

#### 源码下载

本问的源代码可以[点击下载][12]。

[9]: /toolcatalog/

[10]: /tools/opensees-postprocess-xyfigure/

[11]: /tools/opensees-preprocess-fiber-section/

[12]: /resource/ops/opq05.zip

***

以上为五问的全部内容。您还可以到[OpenSees入门教程][13]中获取更多资料。

[13]: http://opensees.hanlindong.com