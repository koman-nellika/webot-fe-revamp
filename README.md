## Web OT Revamp

## Getting Started

`NEXT_PUBLIC_ENV` ใช้แยก stage env ที่ต้องการ
`NODE_ENV` ควรเป็น `production` เสมอ ยกเว้น Run local

```bash
NODE_ENV=production

NEXT_PUBLIC_HOSTNAME=
NEXT_PUBLIC_PREFIX=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_BASE_API=
NEXT_PUBLIC_APP_PORT=3000
NEXT_PUBLIC_ENV=
NEXT_TELEMETRY_DEBUG=1

USE_HTTPS=
SSL_CERT=
SSL_KEY=
SSL_CA=

LOG_PATH=
LOG_ENABLED=
LOG_ROTATE_TIME=
LOG_SITE_NAME=
LOG_TOPIC_NAME=

KAFKA_ENABLED=
KAFKA_HOST=
KAFKA_TOPIC_PREFIX=

ALLOW_ORIGIN=
```

## Run Local

เพิ่ม `.env.local` โดยดูตัวอย่างได้ที่ไฟล์ `.env.example`

```bash
npm run dev
```

## Run Development or Production

```bash
npm run build
npm run start
```
