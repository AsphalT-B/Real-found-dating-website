import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ProfilesService } from './profiles.service.js';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  getMyProfile(@Session() session: UserSession) {
    return this.profilesService.findByUserId(session.user.id);
  }

  @Patch('me')
  updateMyProfile(
    @Session() session: UserSession,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.updateForUser(session.user.id, dto);
  }
}
