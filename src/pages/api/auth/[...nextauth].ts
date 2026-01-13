import { AUTH_OPTIONS } from '@/libs/auth-options';
import NextAuth, { NextAuthOptions } from 'next-auth';

const authOptions: NextAuthOptions = AUTH_OPTIONS

export default NextAuth(authOptions);
// const handler = NextAuth(authOptions);ß

// export { handler as GET, handler as POST };