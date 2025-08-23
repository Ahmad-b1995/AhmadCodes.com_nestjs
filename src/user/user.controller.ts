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
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
} from '../auth/dto/auth.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, Permission, User } from './entities/user.entity';
import { UserExamples, UserResponses } from './examples/user.examples';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.MANAGE_USERS)
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Create a new user account. Only admins with MANAGE_USERS permission can create users.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation data',
    examples: UserExamples.createUserExamples,
  })
  @ApiResponse(UserResponses.createUserResponse)
  @ApiBadRequestResponse({
    description: 'Validation error or email already exists',
  })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Permissions(Permission.MANAGE_USERS)
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieve a list of all users. Only admins and editors with MANAGE_USERS permission can access this.',
  })
  @ApiResponse(UserResponses.getAllUsersResponse)
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description: "Retrieve the authenticated user's own profile information.",
  })
  @ApiResponse(UserResponses.getUserProfileResponse)
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  getProfile(@CurrentUser() user: User) {
    return this.userService.findById(user.id);
  }

  @Get(':id')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Permissions(Permission.MANAGE_USERS)
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieve a specific user by their ID. Only admins and editors with MANAGE_USERS permission can access this.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number', example: 1 })
  @ApiResponse(UserResponses.getUserByIdResponse)
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  findOne(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update current user profile',
    description:
      "Update the authenticated user's own profile. Users can only update their firstName and lastName.",
  })
  @ApiBody({
    ...UserResponses.updateProfileBodySchema,
    examples: UserExamples.updateProfileExamples,
  })
  @ApiResponse(UserResponses.updateProfileResponse)
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Users can only update their own profile (limited fields)
    const allowedFields = {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
    };
    return this.userService.update(user.id, allowedFields);
  }

  @Patch(':id')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.MANAGE_USERS)
  @ApiOperation({
    summary: 'Update user by ID',
    description:
      'Update a specific user by their ID. Only admins with MANAGE_USERS permission can update users.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number', example: 1 })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User update data',
    examples: UserExamples.updateUserExamples,
  })
  @ApiResponse(UserResponses.updateUserResponse)
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.MANAGE_USERS)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete user by ID',
    description:
      'Delete a specific user by their ID. Only admins with MANAGE_USERS permission can delete users.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number', example: 1 })
  @ApiNoContentResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change user password',
    description:
      "Change the authenticated user's password. Requires current password for verification.",
  })
  @ApiBody({
    type: ChangePasswordDto,
    description: 'Password change data',
    examples: UserExamples.changePasswordExamples,
  })
  @ApiResponse(UserResponses.changePasswordResponse)
  @ApiBadRequestResponse({
    description: 'Current password is incorrect or validation error',
  })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}
