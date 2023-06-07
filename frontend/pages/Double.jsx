import { useSearchParams } from "react-router-dom";
import {  useAppBridge } from "@shopify/app-bridge-react"; 
import { useState } from "react";
 
 
  export default function Tool() {
  let [searchParams, setSearchParams] = useSearchParams();
  let  localOrigin ;
  const app = useAppBridge();  
  if (app) {     
    localOrigin=app.localOrigin ;
  }
  const fetch = useAuthenticatedFetch();
  const product_id=searchParams.id;
   const host=searchParams.host; /* */
  return (
    <div className="app">
     welcome to test page {product_id}
    </div>
  );
}
 