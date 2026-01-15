"use client";

import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  styled,
} from "@mui/material";
import Link from "next/link";
import withAdminTrainer from "@/app/components/withAdminTrainer";

const defaultTheme = createTheme();

interface StyledNextLinkProps {
  className?: string;
  href: string;
  children: React.ReactNode;
}

const StyledNextLink = styled(
  ({ className, href, children }: StyledNextLinkProps) => (
    <Link href={href} passHref className={className}>
      {children}
    </Link>
  )
)`
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: whitesmoke;

  &:hover {
    opacity: 0.9;
  }

  /* Add individual background colors for different links */
  &.assignDiet {
    background-color: #6495ed;
    &:hover {
      background-color: ${(props) => props.theme.palette.primary.main};
    }
  }

  &.manageFoods {
    background-color: #ff6043;
    &:hover {
      background-color: ${(props) => props.theme.palette.error.main};
    }
  }
};`;

const DietPage: React.FC = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />

        <Box
          component="div"
          sx={{
            mt: 5,
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <StyledNextLink href="/diet/manage-foods" className="manageFoods">
            Manage Foods
          </StyledNextLink>
          <StyledNextLink href="/diet/assign-diet" className="assignDiet">
            Assign Diet
          </StyledNextLink>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default DietPage;
