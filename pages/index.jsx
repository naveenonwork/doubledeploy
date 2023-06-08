// import "@shopify/polaris/build/esm/styles.css";

import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";

import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { FrontButtonCard, PolarisProvider } from "../components";

export default function HomePage() {
  return (
    <PolarisProvider>
      <Page>
        <TitleBar title="Double" primaryAction={null} />
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Stack
                wrap={false}
                spacing="extraTight"
                distribution="trailing"
                alignment="center"
              >
                <Stack.Item fill>
                  <TextContainer spacing="loose">
                    <Text as="h2" variant="headingMd">
                      Welcome to Double App
                    </Text>
                    <p>This app help display product based avatar</p>
                    <p>Ready to go? please explore the product detail page</p>
                  </TextContainer>
                </Stack.Item>
                <Stack.Item>
                  <div style={{ padding: "0 20px" }}>
                    <Image source={trophyImage} alt="Double App" width={120} />
                  </div>
                </Stack.Item>
              </Stack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <FrontButtonCard></FrontButtonCard>
          </Layout.Section>
        </Layout>
      </Page>
    </PolarisProvider>
  );
}
