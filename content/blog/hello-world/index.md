---
title: "Hello World"
date: "2024-01-15"
excerpt: "欢迎来到我的个人网站，这里将记录我的技术学习和项目分享。"
coverImage: "./images/cover.jpg"
---

# Hello World - 我的第一篇博客文章

欢迎来到我的个人网站！这是一篇 Hello World 文章。

![网站首页截图](./images/homepage-screenshot.png)

## 关于我

我是一名专注于后端开发的程序员，主要技术栈包括：

- **Node.js** - 服务器端JavaScript运行环境
- **Express.js** - Web应用框架
- **MongoDB** - NoSQL数据库
- **Redis** - 内存数据库
- **Docker** - 容器化技术
- **Git** - 版本控制

![技术栈架构图](./images/tech-stack.png)

## 网站特色

这个网站采用静态网站生成的方式构建，具有以下特点：

1. **内容与代码分离** - 使用Markdown格式编写文章，便于维护
2. **自动构建部署** - 支持GitHub Pages自动部署
3. **响应式设计** - 适配各种设备屏幕
4. **极简风格** - 简洁清新的设计风格

![响应式设计展示](./images/responsive-design.png)

## 技术实现

网站使用以下技术栈构建：

```javascript
// 构建脚本示例
const fs = require('fs-extra');
const { marked } = require('marked');
const matter = require('gray-matter');

// 读取Markdown文件
const content = await fs.readFile('content/blog/hello-world/index.md', 'utf-8');
const { data, content: markdown } = matter(content);

// 转换为HTML
const htmlContent = marked(markdown);
```

![构建流程图](./images/build-process.png)

## 未来计划

在这个网站上，我计划分享：

- **技术文章** - 后端开发、系统架构、性能优化等
- **项目展示** - 个人项目的开发过程和经验总结
- **学习笔记** - 新技术的学习心得和最佳实践
- **工具分享** - 提高开发效率的工具和资源

![学习计划图](./images/learning-plan.png)

## 联系方式

如果你对我的文章或项目感兴趣，欢迎通过以下方式联系我：

- **GitHub**: [@skybluues](https://github.com/skybluues)
- **邮箱**: skybluues@example.com

感谢你的访问，期待与你交流！

---

*最后更新时间：2024年1月15日*
