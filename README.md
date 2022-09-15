# 巡天 Night Sky Traveller
一个网页巡天应用，目标是提供市面上常用巡天软件的功能，但要更加便携、更加自定义、更加易用
希望借此应用的开发，了解更多的天文知识

**本人非专业也缺少天文知识储备，应用最终的结果也许是完全不可靠的，请谨慎使用！如有意见建议请联系**

# 开发
## 1 天文数据库
- 资料
    - [CDS星表库](https://gerry.lamost.org/blog/?p=417)
    - [星明天文台 - 常用链接](http://xjltp.china-vo.org/cylj.html)
    - [一些可用于星图制作的星表](http://luly.lamost.org/blog/star_catalogue_for_astro_amateur.html)

- 数据库选择
  - 准备先用BSC试试手
    - http://cdsarc.u-strasbg.fr/viz-bin/Cat?V/50
    - “它给出了全天9110颗亮于6.5等的星，肉眼可见的星都在其中。”

- VizieR
  - VizieR是法国斯特拉斯堡数据中心开发的数据融合工具。它提供了目前已发表数据的各种查询方式：按任务、波段或源的类型查、按关键字查（作者姓名、标题等信息）、按 星表名查、日期查、图像或光谱查、首字母缩写查、最常用的星表查；对单个源按位置坐标或星名查询等。对单个星表查询，用户可以自由选择所需参数。另外它也 提供了简单的交叉证认功能，用户可以上传文件与感兴趣的星表交叉证认。 [软件工具 - 国家天文科学数据中心](https://nadc.china-vo.org/article/20200518151543)
  - [Basic tutorial VizieR](https://cds.u-strasbg.fr/tutorials/pdf/vizier-basic-tutorial.pdf)

- 坐标系
  - 背景
    - [关于J2000.0坐标系与WGS84坐标系的理解](https://blog.csdn.net/qq_24172609/article/details/111460719)
    - 岁差
      - 地轴会绕一根轴（黄道轴）旋转，这根轴和地轴约23°26′，周期约25700年，主要原因是月球
    - 章动
      - 地轴随机摆动，大体分布再，原因是天体引力，相对岁差很小，约9.2″
      - 岁差和章动里，地轴不相对地球运动，因此不影响经纬度，但可能影响天体坐标系
    - 极移
      - 地轴相对地球本身移动，会造成经纬度变化
  - J2000.0
    - J2000.0的“J”代表儒略历，从上文可以了解地球自转轴和春分点是不断变化的，如果坐标系以自转轴或者春分点做参考的话，则必须指定某一瞬时作为参考基准，这一时刻称为历元。J2000.0的历元就是2000年1月1.5日TBD（质心动力学时），对应的儒略日为2451545.0日。
    - J2000.0坐标系以历元J2000.0的平天极及平春分点建立的协议天球坐标系，也称协议惯性坐标系，其与地球自转无关。Z轴指向北平天极，X轴指向平春分点，Y轴与Z、X成右手直角坐标系。
  - 坐标转换
    - J2000.0 → LLA → Local
    - 可能暂时不考虑很高的精度
      - 第一阶段：暂不考虑支持行星，如果整个太阳系当作一个质点误差会有多少？此时只考虑旋转角，因为距离非常远不考虑相对位置，只考虑朝向
      - 第二阶段：支持行星，对行星来说不能忽略相对位置了...
      - 除非能找到现有的库..
        - Python有，novas，甚至支持observer的功能，直接帮忙完成坐标转换...
        - https://stackoverflow.com/questions/11957633/getting-j2000-xyz-coordinates-for-a-location-on-earth-in-python
        - Astronomy支持Observer！
          - https://astronomy.stackexchange.com/questions/34129/client-side-javascript-astronomy-libraries-which-are-not-based-on-node-js

- 数据格式
  - 天文数据格式很多...

## 2 渲染