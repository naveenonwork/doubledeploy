import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";

import { Toast, useAppBridge } from "@shopify/app-bridge-react";


const Test = () => {
  const app = useAppBridge();
  let localOrigin;
  if (app) {
    localOrigin = app.localOrigin;
  }

const handleClick=async() => {
    var productid="4128gw016";
      var session="12344";
      var size="xl";
      const payload={
        method: 'POST',
        body: JSON.stringify({
          
            "productid": productid,
            "session": session,
            "size":size,
            localOrigin: localOrigin
          }),
        headers: {"Content-Type": "application/json"}
      };

      try {      
          const response =   fetch("/static/garment",payload)  
          .then((response) =>response.json())
          .then((data) => {
            console.log('garment api response',data.uppergarmentglb);
          
            })
          .catch((error) => {
               console.error(error);
              //result=error;
            });       
          
         
      }
      catch (error) {
          console.error(error);
      }  
  } 




  return (
    <div className="home">
    <button onClick={handleClick} >Test Click Button </button>
       
    </div>
  );
};

export default Test;
