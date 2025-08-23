export const ArticleExamples = {
  // Create article examples
  createArticleExamples: {
    blog: {
      summary: 'Blog article',
      description: 'Create a new blog article',
      value: {
        title: 'Getting Started with NestJS',
        content:
          'NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. It uses modern JavaScript, is built with TypeScript and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).',
        image: {
          alt: 'NestJS framework tutorial cover image',
          src: 'https://example.com/images/nestjs-tutorial.jpg',
        },
      },
    },
    tutorial: {
      summary: 'Tutorial article',
      description: 'Create a new tutorial article',
      value: {
        title: 'Complete Guide to TypeScript',
        content:
          'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. This comprehensive guide will teach you everything you need to know about TypeScript.',
        image: {
          alt: 'TypeScript programming guide illustration',
          src: 'https://example.com/images/typescript-guide.jpg',
        },
      },
    },
  },

  // Update article examples
  updateArticleExamples: {
    update: {
      summary: 'Update article',
      description: 'Update article information',
      value: {
        title: 'Advanced NestJS Concepts',
        content:
          'Updated content with advanced concepts including guards, interceptors, pipes, and custom decorators for building robust applications.',
        image: {
          alt: 'Advanced NestJS concepts tutorial',
          src: 'https://example.com/images/advanced-nestjs.jpg',
        },
      },
    },
    partialUpdate: {
      summary: 'Partial update',
      description: 'Update only specific fields',
      value: {
        title: 'Updated Article Title',
      },
    },
  },
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
        content: {
          type: 'string',
          example: 'NestJS is a progressive Node.js framework...',
        },
        image: {
          type: 'object',
          properties: {
            alt: {
              type: 'string',
              example: 'NestJS framework tutorial cover image',
            },
            src: {
              type: 'string',
              example: 'https://example.com/images/nestjs-tutorial.jpg',
            },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
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
          content: {
            type: 'string',
            example: 'NestJS is a progressive Node.js framework...',
          },
          image: {
            type: 'object',
            properties: {
              alt: {
                type: 'string',
                example: 'NestJS framework tutorial cover image',
              },
              src: {
                type: 'string',
                example: 'https://example.com/images/nestjs-tutorial.jpg',
              },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
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
        content: {
          type: 'string',
          example: 'NestJS is a progressive Node.js framework...',
        },
        image: {
          type: 'object',
          properties: {
            alt: {
              type: 'string',
              example: 'NestJS framework tutorial cover image',
            },
            src: {
              type: 'string',
              example: 'https://example.com/images/nestjs-tutorial.jpg',
            },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
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
        content: {
          type: 'string',
          example: 'Updated content with advanced concepts...',
        },
        image: {
          type: 'object',
          properties: {
            alt: {
              type: 'string',
              example: 'Advanced NestJS concepts tutorial',
            },
            src: {
              type: 'string',
              example: 'https://example.com/images/advanced-nestjs.jpg',
            },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  },
};
