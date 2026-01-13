import Typography from "../Typography";

const CustomTextLabel: React.FC<CustomTextLabelProps> = ({ value }) => {
  /* value จาก Ant Form จะส่งมาให้อัตโนมัติ  */
  return !Array.isArray(value) ? (
    <div className="text-form-label">
      <Typography.Text weight={400} size="20">
        {value || `-`}
      </Typography.Text>
    </div>
  ) : (
    value.map((val, index) => (
      <div key={`${val}_${index}`} className="text-form-label">
        <Typography.Text weight={400} size="20">
          {val || ""}
        </Typography.Text>
      </div>
    ))
  );
};

interface CustomTextLabelProps {
  value?: string | string[];
}

export default CustomTextLabel;
