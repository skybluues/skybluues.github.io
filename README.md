# SkyBluues Personal Website

一个基于 Node.js 的静态网站生成器，用于展示个人品牌、项目和想法。

## ✨ 特性

- 🚀 **静态网站生成** - 基于 Node.js，支持 GitHub Pages 部署
- 📝 **Markdown 支持** - 使用 Markdown 编写内容，支持 Front Matter
- 🎨 **极简设计** - 清新简洁的 UI，响应式布局
- ⚡ **快速构建** - 高效的构建系统，支持文件监听
- 🔧 **易于维护** - 内容与代码分离，便于更新
- 📱 **响应式** - 完美适配桌面和移动设备
- 🎯 **高度可配置** - 通过配置文件高度自定义
- 🌍 **多语言支持** - 通过配置轻松实现多语言

## 📁 项目结构

```
skybluues/
├── build.js              # 主构建脚本
├── config.js             # 网站配置文件
├── package.json          # 项目依赖
├── README.md            # 项目文档
├── templates/           # HTML 模板
│   ├── base.html       # 基础模板
│   └── post.html       # 博客文章模板
├── content/            # 内容目录
│   ├── blog/          # 博客文章
│   ├── projects/      # 项目文件
│   ├── ideas/         # 想法文件
│   └── tools/         # 工具分类
├── public/            # 静态资源
│   └── images/        # 图片和媒体文件
├── dist/              # 构建输出
└── .github/           # GitHub Actions
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

启动文件监听模式 - 当内容文件发生变化时，网站会自动重新构建。

### 3. 构建网站

```bash
npm run build
```

构建的文件将输出到 `dist/` 目录。

### 4. 本地预览

```bash
npm run serve
```

在浏览器中访问 `http://localhost:3000` 查看网站。

## ⚙️ 配置指南

### 基本配置

编辑 `config.js` 来自定义你的网站：

```javascript
module.exports = {
  // 基本信息
  title: 'SkyBluues',
  description: 'Programmer, independent developer, guitar enthusiast',
  
  // 主页配置
  homepage: {
    // 个人信息
    name: 'SkyBluues',
    signature: '很多事情，越做越简单，越想越困难，越拖越想放弃',
    tags: ['Programmer', 'Independent Developer', 'Guitar Enthusiast'],
    
    // 社交媒体链接
    social: {
      github: {
        url: 'https://github.com/skybluues',
        icon: '📦',
        label: 'GitHub'
      },
      twitter: {
        url: 'https://twitter.com/skybluues',
        icon: '🐦',
        label: 'Twitter'
      },
      email: {
        url: 'mailto:skybluuues@gmail.com',
        icon: '📧',
        label: 'Email'
      }
    }
  },
  
  // 导航配置
  navigation: {
    items: [
      { name: '首页', url: 'index.html', id: 'home' },
      { name: '博客', url: 'blog.html', id: 'blog' },
      { name: '项目', url: 'projects.html', id: 'projects' },
      { name: '想法', url: 'ideas.html', id: 'ideas' },
      { name: '工具', url: 'tools.html', id: 'tools' }
    ]
  },
  
  // 页面配置
  pages: {
    blog: {
      title: '博客文章',
      description: '技术博客文章',
      readMore: '阅读更多'
    },
    projects: {
      title: '项目展示',
      description: '我的个人项目集合。',
      pageDescription: '个人项目展示'
    },
    ideas: {
      title: '想法与计划',
      description: '待开发的想法和计划，记录灵感和项目构思。',
      pageDescription: '项目想法和计划',
      projectCount: '个项目'
    },
    tools: {
      title: '效率工具',
      description: '日常使用的高效开发工具和资源链接，帮助提高工作效率。',
      pageDescription: '效率工具和资源链接'
    },
    home: {
      latestArticles: '最新文章'
    }
  },
  
  // 状态配置
  status: {
    inProgress: '进行中',
    planned: '计划中',
    completed: '已完成',
    unknown: '未知'
  },
  
  // 头像配置
  avatar: {
    localImage: '/images/avatar.jpg',  // 本地图片
    useGradient: true,  // 使用渐变背景
    gradientColors: 'from-blue-400 to-purple-600',  // 渐变背景
    initial: 'S'  // 字母
  }
};
```

### 头像配置

支持两种头像显示方式：

#### 方式 1: 本地图片文件
1. 将头像图片放在 `public/images/` 目录
2. 在 `config.js` 中配置：
```javascript
avatar: {
  localImage: '/images/avatar.png'
}
```

#### 方式 2: 渐变背景 (默认)
```javascript
avatar: {
  gradientColors: 'from-green-400 to-blue-600',
  initial: 'A'
}
```

**优先级**: `localImage` > 渐变背景

### 多语言配置示例

将网站改为英文：

```javascript
module.exports = {
  title: 'SkyBluues',
  description: 'Programmer, independent developer, guitar enthusiast',
  
  homepage: {
    name: 'SkyBluues',
    signature: '很多事情，越做越简单，越想越困难，越拖越想放弃',
    tags: ['Programmer', 'Independent Developer', 'Guitar Enthusiast'],
    social: {
      github: {
        url: 'https://github.com/skybluues',
        icon: '📦',
        label: 'GitHub'
      }
    }
  },
  
  navigation: {
    items: [
      { name: 'Home', url: 'index.html', id: 'home' },
      { name: 'Blog', url: 'blog.html', id: 'blog' },
      { name: 'Projects', url: 'projects.html', id: 'projects' },
      { name: 'Ideas', url: 'ideas.html', id: 'ideas' },
      { name: 'Tools', url: 'tools.html', id: 'tools' }
    ]
  },
  
  pages: {
    blog: {
      title: 'Blog Posts',
      description: 'Technical blog articles',
      readMore: 'Read More'
    },
    projects: {
      title: 'Projects',
      description: 'My personal project collection.',
      pageDescription: 'Personal project showcase'
    },
    ideas: {
      title: 'Ideas & Plans',
      description: 'Ideas and plans to be developed, recording inspiration and project concepts.',
      pageDescription: 'Project ideas and plans',
      projectCount: ' projects'
    },
    tools: {
      title: 'Productivity Tools',
      description: 'Efficient development tools and resource links for daily use, helping to improve work efficiency.',
      pageDescription: 'Efficient tools and resource links'
    },
    home: {
      latestArticles: 'Latest Articles'
    }
  },
  
  status: {
    inProgress: 'In Progress',
    planned: 'Planned',
    completed: 'Completed',
    unknown: 'Unknown'
  }
};
```

## 📝 内容管理

### 博客文章

#### 新的文章目录结构（推荐）

每篇文章使用独立的目录结构，便于管理文章内容和相关图片：

```
content/blog/
├── hello-world/              # 文章目录
│   ├── index.md             # 文章内容
│   └── images/              # 文章相关图片（可选）
│       ├── cover.jpg        # 封面图片
│       ├── screenshot.png   # 截图
│       └── diagram.svg      # 图表
```

**文章内容示例** (`content/blog/hello-world/index.md`):

```markdown
---
title: "Hello World - 我的第一篇博客文章"
date: "2024-01-15"
excerpt: "欢迎来到我的个人网站，这里将记录我的技术学习和项目分享。"
coverImage: "./images/cover.jpg"
---

# Hello World - 我的第一篇博客文章

欢迎来到我的个人网站！

![网站截图](./images/screenshot.png)

## 关于我

我是一名专注于后端开发的程序员...

![技术栈图](./images/tech-stack.png)
```

**Front Matter 字段**:
- `title` (必需): 文章标题
- `date` (必需): 发布日期
- `excerpt` (必需): 简短描述
- `coverImage` (可选): 封面图片路径（使用相对路径）

**图片管理**:
- 将文章相关的图片放在 `文章目录/images/` 中
- 在 Markdown 中使用相对路径引用图片：`![描述](./images/图片名.jpg)`
- 构建时会自动将相对路径转换为正确的绝对路径
- 支持所有常见图片格式：JPG、PNG、GIF、SVG、WebP 等

#### 传统单文件结构（向后兼容）

也支持传统的单文件结构：

```markdown
---
title: "我的第一篇博客文章"
date: "2024-01-15"
excerpt: "这是文章的简短摘要"
coverImage: "/images/blog/post-thumbnail.jpg"
---

# 博客文章内容

你的 Markdown 内容...
```

### 项目展示

项目页面采用简洁的列表格式，只展示已完成的项目。在 `content/projects/` 目录下创建项目文档：

```markdown
---
title: "项目展示"
description: "我的已完成项目集合"
---

## 已完成项目

- [x] **个人博客系统** - 基于 Node.js 的静态网站生成器，支持 Markdown 和自动部署，使用 GitHub Pages 部署
- [x] **自定义导航页Chrome插件** - 一个可以自我定义、自我管理的个性化导航页面浏览器插件
```

**配置说明**:
- 使用 `- [x]` 表示已完成的项目（显示 ✅）
- 格式：`- [x] **项目名称** - 项目描述`
- 系统会自动按项目名称字母顺序排序
- 只显示已完成的项目，简洁明了

### 想法与计划

想法页面采用简洁的列表格式，所有想法配置在一个 markdown 文件中。在 `content/ideas/` 目录下创建想法文档：

```markdown
---
title: "想法与计划"
description: "我的开发想法和未来计划"
---

## 技术项目

- [x] **个人博客系统** - 基于 Node.js 的静态网站生成器，支持 Markdown 和自动部署
- [x] **浏览器导航页插件** - 可以自定义的Chrome浏览器导航页插件
- [ ] **临时文件分享** - 一个可以分享临时文件的网页

## 学习计划

- [ ] **写个编译器** - 跟随[acwj](https://github.com/DoctorWkt/acwj)，用C++实现一遍

## 开源贡献

- [ ] **一个小目标** - 给Linux内核贡献一个提交
```

**配置说明**:
- 使用 `- [x]` 表示已完成的想法（显示 ✅）
- 使用 `- [ ]` 表示计划中的想法（显示 ⭕）  
- 格式：`- [状态] **想法名称** - 一句话描述`
- 可以使用 `##` 标题来分组不同类型的想法（技术项目、学习计划、开源贡献等）
- 系统会自动按完成状态分类显示：先显示已完成，再显示计划中

### 工具页面

工具页面通过 `content/tools/` 目录下的 markdown 文件配置：

```markdown
---
title: "开发工具"
description: "必备的开发工具和平台"
layout: "list"
order: 1
---

# 开发工具

## VS Code
- **URL**: https://code.visualstudio.com
- **图标**: 💻
- **描述**: 功能强大的代码编辑器，拥有丰富的扩展

## Git
- **URL**: https://git-scm.com
- **图标**: 📝
- **描述**: 分布式版本控制系统
```

**Front Matter 字段**:
- `title` (必需): 分类标题
- `description` (必需): 分类描述
- `layout` (可选): `list` 或 `grid` (默认: `list`)
- `order` (可选): 显示顺序 (数字越小越靠前)

## 🖼️ 图片管理

### 博客图片管理

博客文章的图片管理采用文章目录结构：

1. **文章图片**: 放在 `content/blog/article-name/images/` 目录（可选）
2. **在线图片**: 使用完整 URL
3. **默认封面**: 如果未指定封面图片，使用 `public/images/default-cover.svg`

**推荐图片规格**:
- **尺寸**: 宽度 400-600px，高度 200-300px
- **格式**: JPG, PNG, WebP, SVG
- **宽高比**: 2:1 或 16:9
- **文件大小**: 小于 500KB

**注意**: 当前项目中的博客文章可能没有图片目录，这是正常的。如果需要添加图片，可以手动创建 `images/` 目录。



## 🚀 部署

### GitHub Pages 部署

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 设置构建源为 `dist` 目录
4. GitHub Actions 会在每次推送时自动构建和部署

### GitHub Actions 配置

项目已包含 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build website
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 自定义域名 (可选)

如果你有自己的域名：

1. 在 GitHub 仓库的 "Settings" > "Pages" 中
2. 在 "Custom domain" 部分输入你的域名
3. 点击 "Save"
4. 在你的域名提供商处添加 CNAME 记录，指向 `your-username.github.io`

## 📊 页面说明

- **首页** (`index.html`) - 个人介绍和最新文章
- **博客** (`blog.html`) - 所有博客文章列表
- **项目** (`projects.html`) - 个人项目展示
- **想法** (`ideas.html`) - 开发想法和计划
- **工具** (`tools.html`) - 效率工具和资源 (完全可配置)

## 🔄 排序和组织

### 博客文章
- 按日期排序 (最新的在前)
- 首页显示最新 3 篇文章

### 项目
- 按项目名称字母顺序排序
- 只显示已完成的项目

### 想法
- 按状态排序: 已完成 > 计划中
- 每个状态内按标题字母顺序排序

## 💡 最佳实践

### 内容管理
- 使用描述性的文件名
- 保持 Front Matter 简洁但信息丰富
- 定期更新状态
- 使用一致的标签约定

### 图片优化
- 添加前压缩图片
- 使用适当的格式 (照片用 WebP，图标用 SVG)
- 保持一致的宽高比
- 保持合理的文件大小

### 配置管理
- 备份你的 `config.js` 文件
- 使用有意义的分类名称
- 在开发模式下测试更改
- 保持文档更新

## 🔧 故障排除

### 构建问题
1. 检查所有必需的 Front Matter 字段是否存在
2. 验证文件路径和图片位置
3. 确保 Front Matter 中的 YAML 语法正确
4. 检查文件编码 (应该是 UTF-8)

### 图片显示问题
1. 验证图片路径是否正确
2. 检查图片文件是否存在且可访问
3. 确保图片格式受支持
4. 如需要，尝试不同的图片格式

### 内容不更新
1. 运行 `npm run build` 重新构建
2. 清除浏览器缓存
3. 检查文件权限
4. 验证文件更改已保存

## 🛠️ 技术栈

- **Node.js** - 运行时环境
- **Marked** - Markdown 解析器
- **Gray Matter** - Front Matter 解析器
- **Tailwind CSS** - 样式框架
- **Chokidar** - 文件监听
- **fs-extra** - 增强的文件系统操作

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License

---

*由 SkyBluues 创建和维护*
