import { useRouter } from "next/router";
import { Button, Form, Card, message } from "antd";
// import api from "@/api/index";
import Input from "@/components/Input";
import { signIn, useSession } from "next-auth/react";

const LoginPage = () => {
  const router = useRouter();

  // const onFinish = async (values: any) => {
  //   try {
  //     const authResponse = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/login`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-type": "application/json",
  //         },
  //         cache: "no-store",
  //         body: JSON.stringify(values),
  //       }
  //     );
  //     const dataResponse = await authResponse.json();
  //     console.log('dataResponse', dataResponse)
  //   //   const res = await api.post("v1/auth/login", values);
  //   //   console.log("res", res);
  //     localStorage.setItem("token", dataResponse?.access_token);
  //     message.success("Login success");
  //       router.push("/");
  //   } catch {
  //     message.error("Login failed");
  //   }
  // };

  const onFinish = async (values: any) => {
    const response = await signIn("credentials", {
      username: values.username,
      password: values.password,
      callbackUrl: "/",
      redirect: false,
    });

    // message.success("Login success");
    // router.push("/");

    if (!response?.ok && response?.error) {
      message.error("Login failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card title="Login" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input size="small" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password size="small" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};
LoginPage.layout = null;
export default LoginPage;
