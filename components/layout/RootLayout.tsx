import { Container, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

type RootLayoutProps = {
  children?: ReactNode;
};
const RootLayout = (props: RootLayoutProps) => {
  return (
    <Container maxWidth="4xl" mt={8}>
      <VStack gap={6}>{props.children}</VStack>
    </Container>
  );
};

export default RootLayout;
