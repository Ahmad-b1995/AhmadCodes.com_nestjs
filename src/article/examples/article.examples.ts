export const ArticleExamples = {
  // Create article examples
  createArticleExamples: {
    blog: {
      summary: 'Blog article',
      description: 'Create a new blog article',
      value: {
        title: 'Getting Started with NestJS',
        content: 'NestJS is a progressive Node.js framework for building efficient and scalable server-side applications...',
        excerpt: 'Learn the basics of NestJS framework',
        tags: ['nestjs', 'nodejs', 'backend'],
        published: true,
        featured: false
      }
    },
    tutorial: {
      summary: 'Tutorial article',
      description: 'Create a new tutorial article',
      value: {
        title: 'Complete Guide to TypeScript',
        content: 'TypeScript is a strongly typed programming language that builds on JavaScript...',
        excerpt: 'Master TypeScript with this comprehensive guide',
        tags: ['typescript', 'javascript', 'programming'],
        published: false,
        featured: true
      }
    }
  },

  // Update article examples
  updateArticleExamples: {
    update: {
      summary: 'Update article',
      description: 'Update article information',
      value: {
        title: 'Advanced NestJS Concepts',
        content: 'Updated content with advanced concepts...',
        excerpt: 'Deep dive into advanced NestJS features',
        tags: ['nestjs', 'advanced', 'backend'],
        published: true,
        featured: true
      }
    },
    publish: {
      summary: 'Publish article',
      description: 'Publish a draft article',
      value: {
        published: true
      }
    }
  }
};

export const ArticleResponses = {
  // Create article response
  createArticleResponse: {
    status: 201,
    description: 'Article created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Getting Started with NestJS' },
        content: { type: 'string', example: 'NestJS is a progressive Node.js framework...' },
        excerpt: { type: 'string', example: 'Learn the basics of NestJS framework' },
        tags: { type: 'array', items: { type: 'string' }, example: ['nestjs', 'nodejs', 'backend'] },
        published: { type: 'boolean', example: true },
        featured: { type: 'boolean', example: false },
        authorId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  },

  // Get all articles response
  getAllArticlesResponse: {
    status: 200,
    description: 'Articles retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Getting Started with NestJS' },
          excerpt: { type: 'string', example: 'Learn the basics of NestJS framework' },
          tags: { type: 'array', items: { type: 'string' }, example: ['nestjs', 'nodejs', 'backend'] },
          published: { type: 'boolean', example: true },
          featured: { type: 'boolean', example: false },
          authorId: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },

  // Get article by ID response
  getArticleByIdResponse: {
    status: 200,
    description: 'Article retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Getting Started with NestJS' },
        content: { type: 'string', example: 'NestJS is a progressive Node.js framework...' },
        excerpt: { type: 'string', example: 'Learn the basics of NestJS framework' },
        tags: { type: 'array', items: { type: 'string' }, example: ['nestjs', 'nodejs', 'backend'] },
        published: { type: 'boolean', example: true },
        featured: { type: 'boolean', example: false },
        authorId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  },

  // Update article response
  updateArticleResponse: {
    status: 200,
    description: 'Article updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Advanced NestJS Concepts' },
        content: { type: 'string', example: 'Updated content with advanced concepts...' },
        excerpt: { type: 'string', example: 'Deep dive into advanced NestJS features' },
        tags: { type: 'array', items: { type: 'string' }, example: ['nestjs', 'advanced', 'backend'] },
        published: { type: 'boolean', example: true },
        featured: { type: 'boolean', example: true },
        authorId: { type: 'number', example: 1 },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  }
}; 