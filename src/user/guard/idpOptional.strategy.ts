import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { UserService } from '../user.service';
import { IdpService } from 'src/idp/idp.service';
import { User } from '@prisma/client';
import { UserInfo } from 'src/idp/types/userInfo.type';

@Injectable()
export class IdPOptionalStrategy extends PassportStrategy(
  Strategy,
  'idp-optional',
) {
  constructor(
    private readonly userService: UserService,
    private readonly idpService: IdpService,
  ) {
    super();
  }

  async validate(token: string): Promise<{
    gistalk: User;
    idp: UserInfo;
  } | void> {
    const idp = await this.idpService.getUserInfo(token).catch(() => {
      return undefined;
    });
    if (!idp) return undefined;
    const gistalk = await this.userService
      .findUserOrCreate({
        uuid: idp.uuid,
        name: idp.name,
      })
      .catch(() => {
        undefined;
      });
    if (!gistalk) return undefined;
    return { gistalk, idp };
  }
}
