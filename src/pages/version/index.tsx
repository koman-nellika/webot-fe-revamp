import Typography from "@/components/Typography";
import { Col, Row } from "antd";
import { readFileSync } from "fs";
import path from "path";

export async function getServerSideProps() {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageData = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  return {
    props: {
      version: packageData.version,
    },
  };
}

const VersionPage = ({ version }: any) => {
  return (
    <div className="wrapper-full-h">
      <Row className="text-center" justify="center" align="middle">
        <Col span={24}>
          <Typography.Text size="30" weight={400}>
            App Version: {version}
          </Typography.Text>
        </Col>
      </Row>
    </div>
  );
};

VersionPage.layout = null;
export default VersionPage;
