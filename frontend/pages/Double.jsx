import { useSearchParams } from "react-router-dom";
import { useState } from "react";
 
 
  export default function Tool() {
  let [searchParams, setSearchParams] = useSearchParams();
 
 
  const product_id=searchParams.id;
   const host=searchParams.host;  
  return (
    <div className="app">
     welcome to test page {product_id}
    </div>
  );
}
 