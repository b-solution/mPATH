import { DefaultAuthProvider } from "adminjs";

export interface LoginHandlerOptions {
  data: Record<string, any>;
  query?: Record<string, any>;
  params?: Record<string, any>;
  headers: Record<string, any>;
}

export interface RefreshTokenHandlerOptions extends LoginHandlerOptions {}

export class BaseAuthProvider {
  public getUiProps(): Record<string, any> {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handleLogin(opts: LoginHandlerOptions, context) {
    const { data = {} } = opts;
    const { email, password } = data;

    return this.authenticate({ email, password }, context);
  }

  public async handleLogout(context?: any): Promise<any> {
    return Promise.resolve();
  }

  public async handleRefreshToken(opts: RefreshTokenHandlerOptions, context?: any): Promise<any> {
    return Promise.resolve({});
  }
}
