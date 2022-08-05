import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signin() {
    return 'I am sign in';
  }

  signup() {
    return 'I am sign up';
  }
}
