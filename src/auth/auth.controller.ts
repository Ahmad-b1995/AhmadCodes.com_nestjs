import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { AuthExamples, AuthResponses } from './examples/auth.examples';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user with email and password. Returns JWT token for subsequent requests.'
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    examples: AuthExamples.loginExamples
  })
  @ApiResponse(AuthResponses.loginResponse)
  @ApiBadRequestResponse({ description: 'Invalid credentials or validation error' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'User registration',
    description: 'Register a new user account. Creates a new user with USER role by default.'
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration data',
    examples: AuthExamples.registerExamples
  })
  @ApiResponse(AuthResponses.registerResponse)
  @ApiBadRequestResponse({ description: 'Validation error or email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get user profile',
    description: 'Retrieve the authenticated user\'s profile information.'
  })
  @ApiResponse(AuthResponses.profileResponse)
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  getProfile(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: user.permissions,
      isActive: user.isActive,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'User logout',
    description: 'Logout the authenticated user. Since JWT is stateless, the client should remove the token from storage.'
  })
  @ApiResponse(AuthResponses.logoutResponse)
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  async logout() {
    // Since we're using stateless JWT, logout is handled on the client side
    // by removing the token from storage
    return { message: 'Logged out successfully' };
  }
} 