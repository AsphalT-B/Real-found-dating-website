import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class ProfilesService {
  async findByUserId(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
    });
  }

  async updateForUser(userId: string, dto: UpdateProfileDto) {
    const birthDate = dto.birthDate
      ? this.parseAndValidateBirthDate(dto.birthDate)
      : undefined;

    const profileData = {
      bio: dto.bio,
      birthDate,
      city: dto.city,
      country: dto.country,
      gender: dto.gender,
      datingIntent: dto.datingIntent,
    };

    return prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        ...profileData,
      },
      update: profileData,
    });
  }

  private parseAndValidateBirthDate(value: string) {
    const [year, month, day] = value.split('-').map(Number);
    const birthDate = new Date(Date.UTC(year, month - 1, day));

    const isRealDate =
      birthDate.getUTCFullYear() === year &&
      birthDate.getUTCMonth() === month - 1 &&
      birthDate.getUTCDate() === day;

    if (!isRealDate) {
      throw new BadRequestException('birthDate must be a real calendar date.');
    }

    const today = new Date();
    let age = today.getUTCFullYear() - year;

    const birthdayHasNotHappenedYet =
      today.getUTCMonth() < month - 1 ||
      (today.getUTCMonth() === month - 1 && today.getUTCDate() < day);

    if (birthdayHasNotHappenedYet) {
      age -= 1;
    }

    if (age < 18) {
      throw new BadRequestException(
        'You must be at least 18 years old to create a dating profile.',
      );
    }

    return birthDate;
  }
}
