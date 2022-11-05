import { Alert } from "antd";
import Button from "antd/lib/button";
import { useState } from "react";
import { login } from "./login";

export const LoginPrompt = () => {

  const [result, setResult] = useState<string| null>(null)

    return  <>
      <Button type="primary" onClick={async () => setResult(JSON.stringify(await login()))}>
          Login to Web3
      </Button>
      <Alert message="Web3 Login" description={result} />
  </>
};
