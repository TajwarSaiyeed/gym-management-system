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
  &.manageExercise {
    background-color: #6495ed;
    &:hover {
      background-color: ${(props) => props.theme.palette.primary.main};
    }
  }

  &.assignExercise {
    background-color: #ff6043;
    &:hover {
      background-color: ${(props) => props.theme.palette.error.main};
    }
  }
};`;

const ExercisePage: React.FC = () => {
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
          <StyledNextLink
            href="/exercise/manage-exercise"
            className="manageExercise"
          >
            Manage Exercise
          </StyledNextLink>
          <StyledNextLink
            href="/exercise/assign-exercise"
            className="assignExercise"
          >
            Assign Exercise
          </StyledNextLink>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ExercisePage;
