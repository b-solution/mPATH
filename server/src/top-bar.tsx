import { Box, Button, Icon } from "@adminjs/design-system";
import React, { useState } from "react";
const ExampleTabs = () => {
  const CLIENT_URL = window.AdminJS.env.REACT_APP_CUSTOM_VARIABLE;
  return (
    <Box flex flexGrow={1} justifyContent="end" alignItems="center">
      <Button color="text" as="a" href={CLIENT_URL}>
        <Icon icon="User" />
        Client Panel
      </Button>
    </Box>
  );
};

export default ExampleTabs;
