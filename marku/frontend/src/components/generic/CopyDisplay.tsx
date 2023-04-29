import { type FC, useState } from "react";
import { Input, Button, message } from "antd";

type CodeDisplayProps = {
  code: string;
};
const CodeDisplay : FC<CodeDisplayProps> = ({ code }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 3000);
    message.success("Code copied to clipboard");
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Input
        value={code}
        readOnly
        style={{ marginRight: "10px" }}
      />
      <Button type="primary" onClick={copyToClipboard}>
        {copySuccess ? "Copied" : "Copy"}
      </Button>
    </div>
  );
};

export default CodeDisplay;
