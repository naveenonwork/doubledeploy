import "@shopify/polaris/build/esm/styles.css";
 import { useState , useEffect } from "react";
import { Card,Box,Heading, TextContainer, Text } from "@shopify/polaris";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function FrontButtonCard(props) {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const app = useAppBridge();   
  let sessionToken;
  let host;
  let  localOrigin;
  if (app) {
    localOrigin=app.localOrigin;
    host=window.__SHOPIFY_DEV_HOST  ;// display everything  
 
  /*  app.getState()
    .then((state) => console.log(state))
    .catch((err) => console.log(err));   */
  
   getSessionToken(app)
    .then((token) => {
      sessionToken=token;
    }
    )
    .catch((err) => console.log(err));  
     
  }
  const payload={
    method: 'POST',
    body: JSON.stringify({
      host: host,
      sessionToken:sessionToken,
      localOrigin:localOrigin
    }),
  headers: {"Content-Type": "application/json"}
};


  const {
    data,
    refetch: refetchSettings,
    isLoading: isLoadingCount,
    isRefetching: isSettingsCount,
  } =  useAppQuery({
    url: "/api/settings/get",payload,
    reactQueryOptions: {
      onSuccess: () => {
       
        setIsLoading(false);
      },
    },
  });
  
  
  const toastMarkup = toastProps.content   && !isSettingsCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

 
  const shop= isLoadingCount ? "-" : data.session.shop; 
  
  const code='<div id="double_button_opener_container" \n data-origin="'+localOrigin+'"  \n data-host="'+host+'" >\n</div>';

  
 
  const handlePopulate = async () => {
    
    setIsLoading(true);
    const payload={
      method: 'POST',
      body: JSON.stringify({
        host: host,
        sessionToken:sessionToken,
        localOrigin:localOrigin
      }),
    headers: {"Content-Type": "application/json"}
  };

  
    const response = await fetch("/api/doublebutton/process",payload);
  
    if (response.ok) {
      let result='No Response';
      response.text().then(function (text) {
        result=text;
      });
      setIsLoading(false);
       await refetchSettings();
      setToastProps({ content: result });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating setup",
        error: true,
      });
    }
  };

  return (
    
    <>
      {toastMarkup}
      <Card
        title="SetUp"
        sectioned
        primaryFooterAction={{
          content: (isLoadingCount) ? "" : (data.settings.length>0)?"Unpublish":"Publish",
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <Box  padding="2" >
          <Heading>
           Please add below code into sections/product-template.liquid 
          </Heading>
          </Box>
         
        <Box  padding="4" borderStyle='solid' borderColor='border-info' borderWidth="1">
        <pre style={{ whiteSpace: 'pre-wrap' }}>
                  {code}
                  </pre>
        </Box>
        <Box  padding="4"  >
          {!isLoadingCount &&             
            (data.settings.length>0) &&  
            <Heading>
            <Text as="span" color="success">
            Button is published    
            </Text></Heading>
            } 
            {!isLoadingCount && 
            (data.settings.length==0) &&  
            <Heading>
            <Text as="span" color="warning">
              Button is Unpublished .  
            </Text></Heading>
            } 
         </Box>    
           
         
      </Card>
    </>
  );
}
