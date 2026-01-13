import { App, ConfigProvider } from "antd";
import Head from "next/head";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";

import Layout from "@/components/Layout";
// import { AuthProvider } from "@/libs/hooks/useAuth";
import "@/styles/globals.scss";
import theme from "@/styles/theme/themeConfig";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/libs/hooks/use-auth/use-auth.hook";

function MyApp({ Component, pageProps }: any) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );

  return (
    <>
      <Head>
        <title>Web CFG OT Push</title>
        <meta name="description" content="Web CFG OT Push" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ConfigProvider theme={theme}>
              <AuthProvider>
                <App>
                  <Layout layout={Component.layout}>
                    <Component {...pageProps} />
                  </Layout>
                </App>
              </AuthProvider>
            </ConfigProvider>
          </Hydrate>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
