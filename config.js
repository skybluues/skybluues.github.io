// Website configuration file
module.exports = {
  // Basic information
  title: 'SkyBluues',
  description: 'Personal tech blog and project showcase website, sharing backend development experience, technical articles and open source projects',
  
  // Homepage configuration
  homepage: {
    // Personal information
    name: 'SkyBluues',
    signature: '很多事情，越做越简单，越想越困难，越拖越想放弃',
    
    // Tags displayed under the name
    tags: [
      'Programmer',
      'Independent Developer',
      'Guitar Enthusiast'
    ],
    
    // Social media links with icons
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
  
  // Navigation configuration
  navigation: {
    items: [
      { name: '首页', url: 'index.html', id: 'home' },
      { name: '博客', url: 'blog.html', id: 'blog' },
      { name: '项目', url: 'projects.html', id: 'projects' },
      { name: '想法', url: 'ideas.html', id: 'ideas' },
      { name: '工具', url: 'tools.html', id: 'tools' }
    ]
  },
  
  // Page configurations
  pages: {
    // Blog page
    blog: {
      title: '博客文章',
      description: '技术博客文章',
      readMore: '阅读更多'
    },
    
    // Projects page
    projects: {
      title: '项目展示',
      description: '我的个人项目集合。',
      pageDescription: '个人项目展示'
    },
    
    // Ideas page
    ideas: {
      title: '想法与计划',
      description: '待开发的想法和计划，记录灵感和项目构思。',
      pageDescription: '项目想法和计划',
      projectCount: '个项目'
    },
    
    // Tools page
    tools: {
      title: '效率工具',
      description: '日常使用的高效开发工具和资源链接，帮助提高工作效率。',
      pageDescription: '效率工具和资源链接'
    },
    
    // Homepage
    home: {
      latestArticles: '最新文章'
    }
  },
  
  // Status configurations
  status: {
    inProgress: '进行中',
    planned: '计划中',
    completed: '已完成',
    unknown: '未知'
  },
  
  // Avatar configuration
  avatar: {
    // Method 1: Use local image file (place in public/images/ directory)
    localImage: '/images/avatar.jpg',
    
    // Method 2: Use gradient background + letter (fallback method)
    useGradient: true,
    gradientColors: 'from-blue-400 to-purple-600',
    initial: 'S'
  }
};
