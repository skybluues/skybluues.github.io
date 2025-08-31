const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');
const chokidar = require('chokidar');

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
  renderer: new marked.Renderer()
});

// Custom renderer for images to handle relative paths
const renderer = new marked.Renderer();
renderer.image = function(href, title, text) {
  // If it's a relative path starting with ./, convert it to absolute path
  if (href && href.startsWith('./')) {
    // This will be processed later when we know the article slug
    return `<img src="${href}" alt="${text}" title="${title || ''}">`;
  }
  return `<img src="${href}" alt="${text}" title="${title || ''}">`;
};

marked.use({ renderer });

// Import site configuration
const config = require('./config.js');

// Utility functions
const utils = {
  // Read template file
  readTemplate: (templateName) => {
    return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.html`), 'utf-8');
  },

  // Generate avatar HTML
  generateAvatar: () => {
    const avatar = config.avatar;
    
    if (avatar.localImage) {
      return `<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32" style="background-image: url('${avatar.localImage}');"></div>`;
    }
    
    return `<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 bg-gradient-to-br ${avatar.gradientColors} flex items-center justify-center">
      <span class="text-white text-4xl font-bold">${avatar.initial}</span>
    </div>`;
  },

  // Generate navigation HTML
  generateNav: (currentPage = 'home') => {
    const navItems = config.navigation.items;

    return navItems.map(item => {
      const activeClass = item.id === currentPage ? 'border-b-[#30bde8] text-[#0e181b]' : 'border-b-transparent text-[#4e8697]';
      return `<a class="flex flex-col items-center justify-center border-b-[3px] ${activeClass} pb-[13px] pt-4" href="${item.url}">
        <p class="text-sm font-bold leading-normal tracking-[0.015em]">${item.name}</p>
      </a>`;
    }).join('');
  },

  // Generate status badge HTML
  generateStatusBadge: (status) => {
    const configs = {
      'in-progress': { class: 'bg-yellow-100 text-yellow-800', text: config.status.inProgress },
      'planned': { class: 'bg-gray-100 text-gray-800', text: config.status.planned },
      'completed': { class: 'bg-green-100 text-green-800', text: config.status.completed }
    };
    
    const badgeConfig = configs[status] || { class: 'bg-gray-100 text-gray-800', text: config.status.unknown };
    return `<span class="${badgeConfig.class} text-xs px-2 py-1 rounded-full font-medium">${badgeConfig.text}</span>`;
  },



  // Parse tools from markdown content
  parseToolsFromMarkdown: (markdown) => {
    const tools = [];
    const sections = markdown.split('## ').slice(1); // Skip the first empty section
    
    for (const section of sections) {
      const lines = section.split('\n');
      const toolName = lines[0].trim();
      
      if (toolName) {
        const tool = {
          name: toolName,
          url: '',
          icon: '',
          description: ''
        };
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          // Match URL
          if (trimmedLine.startsWith('- **URL**:')) {
            tool.url = trimmedLine.replace('- **URL**:', '').trim();
          }
          
          // Match icon
          if (trimmedLine.startsWith('- **图标**:')) {
            tool.icon = trimmedLine.replace('- **图标**:', '').trim();
          }
          
          // Match description
          if (trimmedLine.startsWith('- **描述**:')) {
            tool.description = trimmedLine.replace('- **描述**:', '').trim();
          }
        }
        
        if (tool.url) { // Only add if we have at least a URL
          tools.push(tool);
        }
      }
    }
    
    return tools;
  },

  // Parse ideas from markdown list
  parseIdeasFromMarkdown: (markdown) => {
    const ideas = [];
    const lines = markdown.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Match checkbox list items: - [x] or - [ ] followed by **title** - description
      const checkboxMatch = trimmedLine.match(/^- \[([ x])\] \*\*([^*]+)\*\* - (.+)$/);
      if (checkboxMatch) {
        const [, checked, title, description] = checkboxMatch;
        ideas.push({
          title: title.trim(),
          description: description.trim(),
          completed: checked === 'x',
          status: checked === 'x' ? 'completed' : 'planned'
        });
      }
    }
    
    return ideas;
  },

  // Parse projects from markdown list
  parseProjectsFromMarkdown: (markdown) => {
    const projects = [];
    const lines = markdown.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Match checkbox list items: - [x] followed by **title** - description
      const checkboxMatch = trimmedLine.match(/^- \[x\] \*\*([^*]+)\*\* - (.+)$/);
      if (checkboxMatch) {
        const [, title, description] = checkboxMatch;
        projects.push({
          title: title.trim(),
          description: description.trim(),
          status: 'completed'
        });
      }
    }
    
    return projects;
  }
};

// Content processors
const contentProcessors = {
  // Get blog posts
  getBlogPosts: async (limit = null) => {
    const postsDir = path.join(__dirname, 'content', 'blog');
    const items = await fs.readdir(postsDir, { withFileTypes: true });
    const posts = [];
    
    for (const item of items) {
      if (item.isDirectory()) {
        // Check if directory contains index.md
        const indexPath = path.join(postsDir, item.name, 'index.md');
        if (await fs.pathExists(indexPath)) {
          const content = await fs.readFile(indexPath, 'utf-8');
          const { data, content: markdown } = matter(content);
          
          // Process cover image path
          let coverImage = data.coverImage || '/images/default-cover.svg';
          if (coverImage.startsWith('./')) {
            // Convert relative path to absolute path for the website
            coverImage = `/images/blog/${item.name}${coverImage.substring(1)}`;
          }
          
          posts.push({
            ...data,
            slug: item.name,
            excerpt: markdown.substring(0, 100) + '...',
            content: markdown,
            coverImage: coverImage
          });
        }
      } else if (item.isFile() && item.name.endsWith('.md')) {
        // Handle legacy single file structure
        const content = await fs.readFile(path.join(postsDir, item.name), 'utf-8');
        const { data, content: markdown } = matter(content);
        
        posts.push({
          ...data,
          slug: item.name.replace('.md', ''),
          excerpt: markdown.substring(0, 100) + '...',
          content: markdown,
          coverImage: data.coverImage || '/images/default-cover.svg'
        });
      }
    }
    
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return limit ? posts.slice(0, limit) : posts;
  },

  // Get projects
  getProjects: async () => {
    const projectsDir = path.join(__dirname, 'content', 'projects');
    const files = await fs.readdir(projectsDir);
    const allProjects = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(projectsDir, file), 'utf-8');
        const { data, content: markdown } = matter(content);
        
        // Parse projects from markdown content
        const projectsList = utils.parseProjectsFromMarkdown(markdown);
        
        // Add file metadata to each project
        projectsList.forEach(project => {
          allProjects.push({
            ...data,
            ...project,
            sourceFile: file.replace('.md', '')
          });
        });
      }
    }
    
    // Sort by title
    allProjects.sort((a, b) => a.title.localeCompare(b.title));
    return allProjects;
  },

  // Get ideas
  getIdeas: async () => {
    const ideasDir = path.join(__dirname, 'content', 'ideas');
    const files = await fs.readdir(ideasDir);
    const allIdeas = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(ideasDir, file), 'utf-8');
        const { data, content: markdown } = matter(content);
        
        // Parse ideas from markdown content
        const ideasList = utils.parseIdeasFromMarkdown(markdown);
        
        // Add file metadata to each idea
        ideasList.forEach(idea => {
          allIdeas.push({
            ...data,
            ...idea,
            sourceFile: file.replace('.md', '')
          });
        });
      }
    }
    
    // Sort by status: completed first, then planned
    const statusOrder = { 'completed': 0, 'planned': 1 };
    allIdeas.sort((a, b) => {
      if (a.status !== b.status) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return a.title.localeCompare(b.title);
    });
    
    return allIdeas;
  },

  // Get tools
  getTools: async () => {
    const toolsDir = path.join(__dirname, 'content', 'tools');
    const files = await fs.readdir(toolsDir);
    const tools = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(toolsDir, file), 'utf-8');
        const { data, content: markdown } = matter(content);
        
        // Parse tools from markdown content
        const toolsList = utils.parseToolsFromMarkdown(markdown);
        
        tools.push({
          ...data,
          slug: file.replace('.md', ''),
          content: markdown,
          tools: toolsList
        });
      }
    }
    
    // Sort by order field
    tools.sort((a, b) => (a.order || 999) - (b.order || 999));
    return tools;
  }
};

// Page builders
const pageBuilders = {
  // Build homepage
  homepage: async () => {
    console.log('Building homepage...');
    
    const template = utils.readTemplate('base');
    const nav = utils.generateNav('home');
    const blogPosts = await contentProcessors.getBlogPosts(3);
    
    const content = `
      <div class="flex p-4 @container">
        <div class="flex w-full flex-col gap-4 items-center">
          <div class="flex gap-4 flex-col items-center">
            ${utils.generateAvatar()}
            <div class="flex flex-col items-center justify-center justify-center">
              <p class="text-[#0e181b] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">${config.homepage.name}</p>
              ${config.homepage.tags.map(tag => `<p class="text-[#4e8697] text-base font-normal leading-normal text-center">${tag}</p>`).join('')}
            </div>
          </div>
        </div>
      </div>
      <p class="text-[#0e181b] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
        ${config.homepage.signature}
      </p>
      
      <!-- Social network links -->
      <div class="flex justify-center gap-6 px-4 py-4">
        ${Object.entries(config.homepage.social).map(([key, social]) => `
          <a href="${social.url}" class="flex items-center gap-2 text-[#4e8697] hover:text-[#30bde8] transition-colors">
            <span class="text-xl">${social.icon}</span>
            <span class="text-sm font-medium">${social.label}</span>
          </a>
        `).join('')}
      </div>
      
      <div class="pb-3">
        <div class="flex border-b border-[#d0e1e7] px-4 gap-8">
          ${nav}
        </div>
      </div>
      <h2 class="text-[#0e181b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">${config.pages.home.latestArticles}</h2>
      ${blogPosts.map(post => `
        <div class="p-4">
          <a href="/blog/${post.slug}.html" class="block hover:bg-gray-50 transition-colors rounded-lg">
            <div class="flex items-stretch justify-between gap-4 rounded-lg">
              <div class="flex flex-col gap-1 flex-[2_2_0px]">
                <p class="text-[#4e8697] text-sm font-normal leading-normal">${post.date}</p>
                <p class="text-[#0e181b] text-base font-bold leading-tight">${post.title}</p>
                <p class="text-[#4e8697] text-sm font-normal leading-normal">${post.excerpt}</p>
              </div>
              <div class="w-full aspect-video rounded-lg flex-1 bg-cover bg-center" style="background-image: url('${post.coverImage}');">
                <div class="w-full h-full bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span class="text-white text-2xl font-bold">📝</span>
                </div>
              </div>
            </div>
          </a>
        </div>
      `).join('')}
    `;
    
    const html = template
      .replace('{{TITLE}}', config.title)
      .replace('{{DESCRIPTION}}', config.description)
      .replace('{{CONTENT}}', content);
    
    await fs.outputFile(path.join(__dirname, 'dist', 'index.html'), html);
  },

  // Build blog page
  blog: async () => {
    console.log('Building blog page...');
    
    const template = utils.readTemplate('base');
    const nav = utils.generateNav('blog');
    const posts = await contentProcessors.getBlogPosts();
    
    const content = `
      <div class="pb-3">
        <div class="flex border-b border-[#d0e1e7] px-4 gap-8">
          ${nav}
        </div>
      </div>
      <h2 class="text-[#0e181b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">${config.pages.blog.title}</h2>
      ${posts.map(post => `
        <div class="p-4">
          <div class="flex items-stretch justify-between gap-4 rounded-lg">
            <div class="flex flex-col gap-1 flex-[2_2_0px]">
              <p class="text-[#4e8697] text-sm font-normal leading-normal">${post.date}</p>
              <p class="text-[#0e181b] text-base font-bold leading-tight">${post.title}</p>
              <p class="text-[#4e8697] text-sm font-normal leading-normal">${post.excerpt}</p>
              <a href="blog/${post.slug}.html" class="text-[#30bde8] text-sm font-medium hover:underline">${config.pages.blog.readMore}</a>
            </div>
            <div class="w-full aspect-video rounded-lg flex-1 bg-cover bg-center" style="background-image: url('${post.coverImage}');">
              <div class="w-full h-full bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                <span class="text-white text-2xl font-bold">📝</span>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    `;
    
    const html = template
      .replace('{{TITLE}}', '博客 - ' + config.title)
      .replace('{{DESCRIPTION}}', config.pages.blog.description)
      .replace('{{CONTENT}}', content);
    
    await fs.outputFile(path.join(__dirname, 'dist', 'blog.html'), html);
  },

  // Build projects page
  projects: async () => {
    console.log('Building projects page...');
    
    const template = utils.readTemplate('base');
    const nav = utils.generateNav('projects');
    const projects = await contentProcessors.getProjects();
    
    const generateProjectRows = () => {
      return projects.map(project => `
        <div class="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
          <span class="text-lg">✅</span>
          <div class="flex-1">
            <h3 class="text-[#111618] text-base font-medium leading-normal">${project.title}</h3>
            <p class="text-[#637f88] text-sm font-normal leading-normal mt-1">${project.description}</p>
          </div>
        </div>
      `).join('');
    };
    
    const content = `
      <div class="pb-3">
        <div class="flex border-b border-[#d0e1e7] px-4 gap-8">
          ${nav}
        </div>
      </div>
      <div class="flex flex-wrap justify-between gap-3 p-4">
        <div class="flex min-w-72 flex-col gap-3">
          <p class="text-[#111618] tracking-light text-[32px] font-bold leading-tight">${config.pages.projects.title}</p>
          <p class="text-[#637f88] text-sm font-normal leading-normal">
            ${config.pages.projects.description}
          </p>
        </div>
      </div>
      <div class="p-4">
        <div class="bg-white rounded-lg border border-gray-200">
          ${generateProjectRows()}
        </div>
      </div>
    `;
    
    const html = template
      .replace('{{TITLE}}', '项目 - ' + config.title)
      .replace('{{DESCRIPTION}}', config.pages.projects.pageDescription)
      .replace('{{CONTENT}}', content);
    
    await fs.outputFile(path.join(__dirname, 'dist', 'projects.html'), html);
  },

  // Build ideas page
  ideas: async () => {
    console.log('Building ideas page...');
    
    const template = utils.readTemplate('base');
    const nav = utils.generateNav('ideas');
    const ideas = await contentProcessors.getIdeas();
    
    const ideasByStatus = {
      'completed': ideas.filter(idea => idea.status === 'completed'),
      'planned': ideas.filter(idea => idea.status === 'planned')
    };
    
    const generateIdeaRow = (idea) => {
      const checkboxIcon = idea.completed ? '✅' : '⭕';
      return `
        <div class="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
          <span class="text-lg">${checkboxIcon}</span>
          <div class="flex-1">
            <h3 class="text-[#111618] text-base font-medium leading-normal">${idea.title}</h3>
            <p class="text-[#637f88] text-sm font-normal leading-normal mt-1">${idea.description}</p>
          </div>
        </div>
      `;
    };
    
    const generateStatusSection = (status, ideas, title) => {
      if (ideas.length === 0) return '';
      
      const ideasHTML = ideas.map(idea => generateIdeaRow(idea)).join('');
      
      return `
        <div class="p-4">
          <h2 class="text-[#111618] text-xl font-bold mb-4 flex items-center gap-2">
            ${utils.generateStatusBadge(status)}
            <span>${ideas.length} ${config.pages.ideas.projectCount}</span>
          </h2>
          <div class="bg-white rounded-lg border border-gray-200">
            ${ideasHTML}
          </div>
        </div>
      `;
    };
    
    const content = `
      <div class="pb-3">
        <div class="flex border-b border-[#d0e1e7] px-4 gap-8">
          ${nav}
        </div>
      </div>
      <div class="flex flex-wrap justify-between gap-3 p-4">
        <div class="flex min-w-72 flex-col gap-3">
          <p class="text-[#111618] tracking-light text-[32px] font-bold leading-tight">${config.pages.ideas.title}</p>
          <p class="text-[#637f88] text-sm font-normal leading-normal">
            ${config.pages.ideas.description}
          </p>
        </div>
      </div>
      
      ${generateStatusSection('completed', ideasByStatus['completed'], config.status.completed)}
      ${generateStatusSection('planned', ideasByStatus['planned'], config.status.planned)}
    `;
    
    const html = template
      .replace('{{TITLE}}', '想法 - ' + config.title)
      .replace('{{DESCRIPTION}}', config.pages.ideas.pageDescription)
      .replace('{{CONTENT}}', content);
    
    await fs.outputFile(path.join(__dirname, 'dist', 'ideas.html'), html);
  },

  // Build tools page
  tools: async () => {
    console.log('Building tools page...');
    
    const template = utils.readTemplate('base');
    const nav = utils.generateNav('tools');
    const toolsCategories = await contentProcessors.getTools();
    
    const generateToolsLayout = () => {
      const gridCategories = toolsCategories.filter(cat => cat.layout === 'grid');
      const listCategories = toolsCategories.filter(cat => !cat.layout || cat.layout === 'list');
      
      let layoutHTML = '';
      
      if (listCategories.length > 0) {
        const listHTML = listCategories.map(category => {
          const itemsHTML = category.tools.map(tool => 
            `<a href="${tool.url}" class="flex items-center gap-3 text-[#4e8697] hover:text-[#30bde8] transition-colors">
              <span class="text-xl">${tool.icon}</span>
              <span>${tool.name}</span>
            </a>`
          ).join('');
          
          return `<div class="border border-[#d0e1e7] rounded-lg p-6">
            <h3 class="text-[#111618] text-lg font-bold mb-4">${category.title}</h3>
            <p class="text-[#637f88] text-sm mb-4">${category.description}</p>
            <div class="space-y-3">
              ${itemsHTML}
            </div>
          </div>`;
        }).join('');
        
        layoutHTML += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${listHTML}
        </div>`;
      }
      
      if (gridCategories.length > 0) {
        gridCategories.forEach(category => {
          const itemsHTML = category.tools.map(tool => 
            `<a href="${tool.url}" class="flex items-center gap-2 text-[#4e8697] hover:text-[#30bde8] transition-colors">
              <span class="text-xl">${tool.icon}</span>
              <span>${tool.name}</span>
            </a>`
          ).join('');
          
          layoutHTML += `<div class="border border-[#d0e1e7] rounded-lg p-6">
            <h3 class="text-[#111618] text-lg font-bold mb-4">${category.title}</h3>
            <p class="text-[#637f88] text-sm mb-4">${category.description}</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              ${itemsHTML}
            </div>
          </div>`;
        });
      }
      
      return layoutHTML;
    };
    
    const content = `
      <div class="pb-3">
        <div class="flex border-b border-[#d0e1e7] px-4 gap-8">
          ${nav}
        </div>
      </div>
      <div class="flex flex-wrap justify-between gap-3 p-4">
        <div class="flex min-w-72 flex-col gap-3">
          <p class="text-[#111618] tracking-light text-[32px] font-bold leading-tight">${config.pages.tools.title}</p>
          <p class="text-[#637f88] text-sm font-normal leading-normal">
            ${config.pages.tools.description}
          </p>
        </div>
      </div>
      <div class="p-4 space-y-6">
        ${generateToolsLayout()}
      </div>
    `;
    
    const html = template
      .replace('{{TITLE}}', '工具 - ' + config.title)
      .replace('{{DESCRIPTION}}', config.pages.tools.pageDescription)
      .replace('{{CONTENT}}', content);
    
    await fs.outputFile(path.join(__dirname, 'dist', 'tools.html'), html);
  },

  // Build individual blog posts
  blogPosts: async () => {
    console.log('Building blog posts...');
    
    const posts = await contentProcessors.getBlogPosts();
    const template = utils.readTemplate('post');
    
    for (const post of posts) {
      // Process relative image paths in content
      let processedContent = post.content;
      if (post.slug) {
        // Replace relative image paths in markdown syntax
        processedContent = processedContent.replace(
          /!\[([^\]]*)\]\(\.\/images\/([^)]+)\)/g,
          `![$1](/images/blog/${post.slug}/images/$2)`
        );
      }
      
      const htmlContent = marked(processedContent);
      const nav = utils.generateNav('blog');
      
      const content = `
        <div class="pb-3">
          <div class="flex border-b border-[#d0e1e7] px-4 gap-8">
            ${nav}
          </div>
        </div>
        <div class="flex flex-wrap gap-2 p-4">
          <a class="text-[#637f88] text-base font-medium leading-normal" href="../blog.html">${config.navigation.items.find(item => item.id === 'blog').name}</a>
          <span class="text-[#637f88] text-base font-medium leading-normal">/</span>
          <span class="text-[#111618] text-base font-medium leading-normal">${post.title}</span>
        </div>
        <h2 class="text-[#111618] tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">${post.title}</h2>
        <p class="text-[#637f88] text-sm font-normal leading-normal pb-3 pt-1 px-4">发布于 ${post.date}</p>
        <div class="px-4 prose prose-lg max-w-none">
          ${htmlContent}
        </div>
      `;
      
      const html = template
        .replace('{{TITLE}}', post.title + ' - ' + config.title)
        .replace('{{DESCRIPTION}}', post.excerpt)
        .replace('{{CONTENT}}', content);
      
      await fs.outputFile(path.join(__dirname, 'dist', 'blog', `${post.slug}.html`), html);
    }
  }
};

// Main build function
async function build() {
  console.log('Starting website build...');
  
  // Clean dist directory
  await fs.remove(path.join(__dirname, 'dist'));
  
  // Create necessary directories
  await fs.ensureDir(path.join(__dirname, 'dist', 'blog'));
  
  // Copy public directory to dist
  if (await fs.pathExists(path.join(__dirname, 'public'))) {
    await fs.copy(path.join(__dirname, 'public'), path.join(__dirname, 'dist'));
  }
  
  // Copy article images to dist
  const postsDir = path.join(__dirname, 'content', 'blog');
  if (await fs.pathExists(postsDir)) {
    const items = await fs.readdir(postsDir, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isDirectory()) {
        const articleImagesDir = path.join(postsDir, item.name, 'images');
        if (await fs.pathExists(articleImagesDir)) {
          const targetDir = path.join(__dirname, 'dist', 'images', 'blog', item.name);
          await fs.copy(articleImagesDir, targetDir);
        }
      }
    }
  }
  
  // Build all pages
  await pageBuilders.homepage();
  await pageBuilders.blog();
  await pageBuilders.projects();
  await pageBuilders.ideas();
  await pageBuilders.tools();
  await pageBuilders.blogPosts();
  
  console.log('Website build completed!');
}

// File watcher for development
function watch() {
  console.log('Starting file watcher...');
  
  const watcher = chokidar.watch([
    'content/**/*',
    'templates/**/*',
    'build.js'
  ]);
  
  watcher.on('change', async (path) => {
    console.log(`File changed: ${path}`);
    await build();
  });
}

// Main program
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--watch')) {
    await build();
    watch();
  } else {
    await build();
  }
}

main().catch(console.error);
