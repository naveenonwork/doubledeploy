import React, { useEffect } from 'react'

import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";
const shopifyApp = createApp({
  apiKey: process.env.SHOPIFY_API_KEY,
});
const sessionToken = await getSessionToken(shopifyApp);
 console.log(sessionToken);