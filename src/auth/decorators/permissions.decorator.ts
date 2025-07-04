import { SetMetadata } from '@nestjs/common';
import { Permission } from '../../user/entities/user.entity';

export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions); 