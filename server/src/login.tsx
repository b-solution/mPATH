import React, { useEffect, useRef } from "react";
import { Box, Button, Text } from "@adminjs/design-system";

const Login: React.FC<{}> = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  }, []);

  return (
    <>
      <Box bg="white" flex boxShadow="login" width={[1, 2 / 3, "auto"]}>
        <Box p="100px" flexGrow={1} action="login" method="POST" as="form">
          <Text textAlign="center">
            <Button
              ref={buttonRef}
              variant="primary"
              type="submit"
              style={{ display: "none" }} // Hide the button
            >
              Just let me in!
            </Button>
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Login;
