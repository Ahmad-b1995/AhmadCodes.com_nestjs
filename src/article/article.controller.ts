import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiNoContentResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, Permission, User } from '../user/entities/user.entity';
import { ArticleExamples, ArticleResponses } from './examples/article.examples';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Permissions(Permission.CREATE_ARTICLES)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new article',
    description:
      'Create a new article. Only admins and editors with CREATE_ARTICLES permission can create articles.',
  })
  @ApiBody({
    type: CreateArticleDto,
    description: 'Article creation data',
    examples: ArticleExamples.createArticleExamples,
  })
  @ApiResponse(ArticleResponses.createArticleResponse)
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: User,
  ) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all articles',
    description:
      'Retrieve a list of all published articles. No authentication required for public access.',
  })
  @ApiResponse(ArticleResponses.getAllArticlesResponse)
  findAll() {
    return this.articleService.findAll();
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get article by slug',
    description:
      'Retrieve a specific published article by its slug. Returns full content.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Article slug',
    type: 'string',
    example: 'getting-started-with-nestjs',
  })
  @ApiResponse(ArticleResponses.getArticleByIdResponse)
  @ApiNotFoundResponse({ description: 'Article not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get article by ID',
    description:
      'Retrieve a specific article by its ID. Returns full content for published articles.',
  })
  @ApiParam({
    name: 'id',
    description: 'Article ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse(ArticleResponses.getArticleByIdResponse)
  @ApiNotFoundResponse({ description: 'Article not found' })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Permissions(Permission.UPDATE_ARTICLES)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update article by ID',
    description:
      'Update a specific article by its ID. Only admins and editors with UPDATE_ARTICLES permission can update articles.',
  })
  @ApiParam({
    name: 'id',
    description: 'Article ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateArticleDto,
    description: 'Article update data',
    examples: ArticleExamples.updateArticleExamples,
  })
  @ApiResponse(ArticleResponses.updateArticleResponse)
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.DELETE_ARTICLES)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete article by ID',
    description:
      'Delete a specific article by its ID. Only admins with DELETE_ARTICLES permission can delete articles.',
  })
  @ApiParam({
    name: 'id',
    description: 'Article ID',
    type: 'number',
    example: 1,
  })
  @ApiNoContentResponse({ description: 'Article deleted successfully' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
