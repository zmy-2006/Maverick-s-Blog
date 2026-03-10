# 笔记仓库模板

这个模板不是给程序读取的真实目录，而是给你参考的“标准摆放方式”。

真正要被博客读取的目录应该是：

```text
content/academic-ledger/
```

你以后只要照这个模板组织课程即可。

## 推荐结构

```text
content/academic-ledger/
  computer-networks/
    course.json
    fig/
      lecture1-topology.png
    lecture-01/
      review.md
      exam-focus.md
    lecture-02/
      review.md
```

## 规则

- 一个课程 = 一个文件夹
- 一个 chapter = 一个子文件夹，例如 `lecture-01`
- 一个 chapter 可以有一篇或多篇笔记
- 图片优先可以放在 chapter 内
- 如果你平时习惯统一放图，就放课程根目录的 `fig/`

## 最推荐做法

不要单独再维护一个完全独立的“笔记 GitHub 仓库”。  
最简单的方式是：

- 直接把你的笔记内容放进博客项目里的 `content/academic-ledger/`
- 然后把这个博客项目推到 GitHub
- Vercel 会自动部署

也就是说：

`这个博客仓库本身，就是你的笔记仓库`
