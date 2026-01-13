import { AuthController } from "@/api/controllers/auth";
import Typography from "@/components/Typography";
import { Col, Progress, Row, Statistic } from "antd";
import { NextPage } from "next";
import { useQuery } from "react-query";
// import { Column, Pie } from "@ant-design/charts";
import dynamic from "next/dynamic";
const Pie = dynamic(() => import("@ant-design/charts").then((m) => m.Pie), {
  ssr: false,
});

const HomePage: NextPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["db-stats"],
    queryFn: AuthController().getDashboard,
    refetchInterval: 60_000, // refresh ทุก 1 นาที
  });

  const chartData = [
    { type: "Data Size", value: Number(data?.dataSizeMB) },
    { type: "Storage Size", value: Number(data?.storageSizeMB) },
    { type: "Index Size", value: Number(data?.indexSizeMB) },
  ];

  // const config = {
  //   data: chartData,
  //   angleField: "value",
  //   colorField: "type",
  //   radius: 0.8,
  //   label: {
  //     type: "outer",
  //     content: "{name} {percentage}",
  //   },
  // };

  const config = {
    data: chartData,
    angleField: "value",
    colorField: "type",
    label: {
      // text: "type",
      text: ({ type, value }: any) => {
        return `${type}: ${value}MB`;
      },
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "left",
        rowPadding: 5,
      },
    },
  };

  return (
    <>
      <Typography.Text size="48" weight={500}>
        Home
      </Typography.Text>
      <Typography.Title className="mt-10" size="96">
        Welcome to
      </Typography.Title>
      <Typography.Title size="72" weight={100}>
        Web OT
      </Typography.Title>

      <Row gutter={16}>
        <Col span={6}>
          <Statistic title="Collections" value={data?.collections} />
        </Col>
        <Col span={6}>
          <Statistic title="Data Size (MB)" value={data?.dataSizeMB} />
        </Col>
        <Col span={6}>
          <Statistic title="Storage (MB)" value={data?.storageSizeMB} />
        </Col>
        <Col span={6}>
          <Statistic title="Index (MB)" value={data?.indexSizeMB} />
        </Col>
        {/* <Col>
          <Progress
            percent={(Number(data?.storageSizeMB) / data?.indexSizeMB) * 100}
            format={(p) => `${p?.toFixed(1)}% of ${data?.indexSizeMB}MB`}
          />
        </Col> */}
        <Col span={20}>
          <Pie {...config} />
        </Col>
      </Row>
      {/* <Row >
        <Col >
          <Pie {...config} />
        </Col>
      </Row> */}
    </>
  );
};

export default HomePage;
