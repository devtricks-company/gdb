import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-snapchat';

@Injectable()
export class SnapchatStrategy extends PassportStrategy(
  Strategy as any,
  'snapchat',
) {
  constructor(private readonly configurationService: ConfigService) {
    super({
      clientID: configurationService.get<string>('snapchat.client_ID') || '',
      clientSecret:
        configurationService.get<string>('snapchat.client_secret') || '',
      callbackURL:
        configurationService.get<string>('snapchat.callbackURL') || '',
      profileFields: ['id', 'displayName', 'bitmoji'],
      scope: ['user.display_name', 'user.bitmoji.avatar'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    console.log('profile', profile);
    //Snapchat profile may not include email. so we handle that case
    // const email =
    //   profile.emails && profile.emails.length > 0
    //     ? profile.emails[0].value
    //     : `${profile.id}@snapchat.user`;
    const user = {
      email: `${profile.id}@snapchat.user`,
      displayName: profile.displayName,
      id: profile.id,
      photos: 'bitmojitest',
      accessToken,
    };
    done(null, user);
  }
}
