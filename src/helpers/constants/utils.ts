import NodeRSA from "encrypt-rsa";

const nodeRSA = new NodeRSA();

export const PATH_AVATAR = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/avatar`;
const privateKey = `-----BEGIN PRIVATE KEY-----\n${process.env.NEXT_PUBLIC_RSA_PRIVATE_KEY}\n-----END PRIVATE KEY-----`;

export const NUMBER_OF_ROWS = [10, 20, 50, 100];

const isFunction = (checker: any) => typeof checker === "function";

// Encrypt the credentials
const decryptData = (data: string) => {
    const decryptData = nodeRSA.decryptStringWithRsaPrivateKey({
        text: data,
        privateKey: privateKey, // The public key you received from the server
    });
    return decryptData;
};

export { isFunction, decryptData };
