"use client";

import WithUser from "@/app/components/withUser";
import { Box, Typography } from "@mui/material";

const MyDietPage = () => {
  return (
    <Box>
      <Typography variant="h2">My Diet</Typography>
    </Box>
  );
};

export default WithUser({ Component: MyDietPage });
