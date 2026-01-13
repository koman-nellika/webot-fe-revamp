import { lowerCase } from 'lodash';
import { AuthOptions, User } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from 'next-auth/providers/index';

const providers: Provider[] = [
    CredentialsProvider({
        id: "credentials",
        name: "credentials",
        type: "credentials",
        credentials: {
            username: { label: "username", type: "text" },
            password: { label: "password", type: "password" },
        },
        async authorize(credentials) {
            try {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
                }

                const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    cache: 'no-store',
                    body: JSON.stringify(credentials),
                });

                if (!authResponse.ok) {
                    const contentType = authResponse.headers.get('content-type');
                    if (contentType === 'application/json; charset=utf-8') {
                        const data = await authResponse.json();
                        throw new Error(data?.message);
                    } else {
                        throw new Error(authResponse.statusText);
                    }
                }

                const dataResponse = await authResponse.json();
                return dataResponse as User;
            } catch (error) {
                console.log('error', error)
                let errorMessage = '';
                if (error instanceof Error) {
                    errorMessage = error.message;
                    console.error('Sign in error with message:', error);
                } else {
                    errorMessage = 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ กรุณาตรวจสอบข้อมูล และลองใหม่อีกครั้งในภายหลัง';
                    console.error('Sign in error:', error);
                }

                throw new Error(errorMessage);
            }
        }
    })
];

const AUTH_OPTIONS: AuthOptions = {
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
        error: '/auth/error',
    },
    providers: providers,
    jwt: {
        maxAge: 60 * 30, // 30 minutes
    },
    callbacks: {
        async signIn(params) {
            const {
                user,
                account,
            } = params;
            if (account?.provider === 'credentials' || account?.type === 'credentials') {
                // check the "user" object from authorize callback is valid or not
                if (!user?.access_token) return "/auth/error?error=invalid-user-login-response";
                return true;
            }

            return false;
        },
        async jwt({ token, user, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account && account?.type === 'credentials') {
                token = { ...token, ...user };
                token.provider = 'credentials';
            }
            delete token.name;
            delete token.email;
            delete token.picture;
            return token
        },
        async session({ session, token }) {
            delete session.user;

            // session.user = {
            //     first_name: token.first_name,
            //     last_name: token.last_name,
            //     fullname: token.fullname,
            //     role: token.role?.name,
            // };

            const userData = {
                _id: token._id,
                first_name: token.first_name,
                last_name: token.last_name,
                fullname: token.fullname,
                role: token?.role?.name,
                
            }
            const sessionData = {
                ...session,
                access_token: token.access_token,
                user: userData,
                isAdmin: lowerCase(token?.role?.name) === lowerCase(ROLE.ADMIN),
                error: token.error,
            };
            return sessionData;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export enum ROLE {
  ADMIN = "Admin",
  VIEWER = "Viewer",
}

// const fetchUserRole = async (accessToken: string) => {
//     const response = await fetch(`${environments.baseApi}/api/v2/users/profile`, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${accessToken}`,
//         },
//     });

//     const data = await response.json();
//     const roles = data.data.roles || [];
//     const roleSlug = roles.map((role: any) => role.role?.slug);
//     return roleSlug;
// };

// const getServerAuthSession = async () => {
//     const session = await getServerSession(AUTH_OPTIONS);

//     if (!session) {
//         return null;
//     }

//     const accessToken = session?.accessToken;
//     if (!accessToken) {
//         return null;
//     }

//     const roles = await fetchUserRole(accessToken);
//     const adminRoles = ['ADMIN', 'IT_SUPPORT', 'BDM_SUPERVISOR'];
//     const isAdmin = roles.some((role: string) => adminRoles.includes(role));

//     return {
//         ...session,
//         isAdmin,
//     };
// };
export { AUTH_OPTIONS };

