import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(private readonly prismaService: PrismaService) {}

  async findUserOrCreate({
    uuid,
    name,
  }: Pick<User, 'uuid' | 'name'>): Promise<User> {
    this.logger.log('findUserOrCreate called');
    const user = await this.prismaService.user
      .findUnique({
        where: { uuid },
      })
      .catch((error) => {
        this.logger.debug('findUserOrCreate, findUnique error');
        this.logger.error(error);
        if (error instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException('database error');
        }
        throw new InternalServerErrorException('unexpected error');
      });
    if (user) {
      this.logger.log('user found');
      return user;
    }
    this.logger.log('user not found, create new user');
    return this.prismaService.user
      .create({
        data: {
          uuid,
          name,
          consent: false,
        },
      })
      .catch((error) => {
        this.logger.debug('findUserOrCreate, create error');
        this.logger.error(error);
        if (error instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException('database error');
        }
        throw new InternalServerErrorException('unexpected error');
      })
      .then((user) => {
        this.logger.log('user created');
        return user;
      });
  }

  async findUserAndUpdate({
    uuid,
    name,
  }: Pick<User, 'uuid' | 'name'>): Promise<User> {
    return this.prismaService.user
      .update({
        where: { uuid },
        data: { name },
      })
      .catch((error) => {
        this.logger.debug('findUserAndUpdate error');
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            this.logger.debug('user not found');
            throw new NotFoundException('user not found');
          }
          this.logger.error(error);
          throw new InternalServerErrorException('database error');
        }
        this.logger.error(error);
        throw new InternalServerErrorException('unexpected error');
      })
      .then((user) => {
        this.logger.log('findUserAndUpdate finished');
        return user;
      });
  }

  async setConsent(user: User): Promise<User> {
    this.logger.log('setConsent called');
    return this.prismaService.user
      .update({
        where: { uuid: user.uuid },
        data: { consent: true },
      })
      .catch((err) => {
        this.logger.debug('setConsent error');
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            this.logger.log('user not found');
            throw new NotFoundException('user not found');
          }
          this.logger.error(err);
          throw new InternalServerErrorException('database error');
        }
        this.logger.error(err);
        throw new InternalServerErrorException('unexpected error');
      })
      .then((user) => {
        this.logger.log('setConsent finished');
        return user;
      });
  }

  async findUserByName({ name }: Pick<User, 'name'>): Promise<User | null> {
    this.logger.log('findUserByName called');
    return this.prismaService.user
      .findFirst({
        where: { name },
      })
      .catch((err) => {
        this.logger.debug('findUserByName error');
        if (err instanceof PrismaClientKnownRequestError) {
          this.logger.error(err);
          throw new InternalServerErrorException('database error');
        }
        this.logger.error(err);
        throw new InternalServerErrorException('unexpected error');
      });
  }

  async createTempUser({ name }: Pick<User, 'name'>): Promise<User> {
    this.logger.log('createTempUser called');
    return this.prismaService.user
      .create({
        data: {
          uuid: uuid(),
          name,
          consent: false,
        },
      })
      .catch((err) => {
        this.logger.debug('createTempUser error');
        if (err instanceof PrismaClientKnownRequestError) {
          this.logger.error(err);
          throw new InternalServerErrorException('database error');
        }
        this.logger.error(err);
        throw new InternalServerErrorException('unexpected error');
      });
  }
}
