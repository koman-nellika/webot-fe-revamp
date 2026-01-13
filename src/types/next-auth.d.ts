import type { DefaultAccount } from "next-auth";

type Provider = 'credentials';

declare module "next-auth" {
    interface Session {
        expires?: string;
        access_token?: string;
        accessTokenExpiresAt?: number;
        error?: string | null;
        isAdmin?: boolean;
        user?: {
            _id?: string;
            first_name?: string;
            last_name?: string;
            fullname?: string;
            role?: string;
        };
    }

    interface User {
        sub: string,
        access_token: string,
        refreshToken: string,
        accessTokenExpiresAt: number,
        refreshTokenExpiresAt: number
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Account extends DefaultAccount { }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub: string,
        access_token: string,
        refreshToken: string,
        accessTokenExpiresAt: number,
        refreshTokenExpiresAt: number,
        error?: string | null;
        _id: string;
        first_name: string;
        last_name: string;
        fullname: string;
        role?: {
            name: string;
        };

    }
}