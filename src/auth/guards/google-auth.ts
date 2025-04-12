import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('run.......');
      const result = (await super.canActivate(context)) as boolean;
      console.log('result', result);
      return result;
    } catch (error) {
      console.error('error', error);
      return false;
    }
  }
}
