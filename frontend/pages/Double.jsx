import { useSearchParams } from "react-router-dom";
import {  useAppBridge } from "@shopify/app-bridge-react"; 
import { useState } from "react";
// import { OrbitControls } from "@react-three/drei";

 import {  useAuthenticatedFetch } from "../hooks";
import { Canvas } from "@react-three/fiber";
import {useGLTF } from "@react-three/drei";// import ScenarioH from '../components/3d/ScenarioH' 
import FormApi from "../components/ux/FormApi";

  // function ModelViewer({ glbUrl }) {
  //   const { nodes, materials } = useGLTF(glbUrl);
  //     console.log(nodes);
  //   return (
  //     <group>
  //       {/* <mesh geometry={nodes.Mesh_0.geometry} material={materials.Material_0} /> */}
  //     </group>
  //   );
  // }

  export default function Tool() {
  let [searchParams, setSearchParams] = useSearchParams();
  let  localOrigin ;
  const app = useAppBridge();  
  if (app) {     
    localOrigin=app.localOrigin ;
  }
  const fetch = useAuthenticatedFetch();
  /* const product_id=searchParams.id;
   const host=searchParams.host; */
  return (
    <div className="app">
      {/* <ScenarioH /> */}
      <FormApi localOrigin={localOrigin} />
      {/* <Avatarization /> */}
    </div>
  );
}
// function FormApi() {
//   const [photo, setPhoto] = useState([]);
//   const [height, setHeight] = useState("");
//   const [gender, setGender] = useState("");
//   const [modelUrl, setModelUrl] = useState('');
//   const [showModel, setShowModel] = useState(false);
//   const onChangePhoto = (e) => {
//     setPhoto( e.target.files[0]);
    
//   };
   
//   const handleSubmit = async (event) => {
//     event.preventDefault();
    
//     try {
//     const formdata = new FormData();
//     formdata.append("file", photo);
//      formdata.append("size", height );
//      formdata.append("session_id", "e285a6fc0232de3067a65c8152b7b73a" );
//      formdata.append("gender", gender );
     
//         const response =  await fetch('/static/avatar',{
//           method: 'POST',
//           body:    formdata , 
          
//         });
         
//         if (response.ok) {
            
//           response.text().then(function (text) {
            
//            console.log('GLB file ->',text);
//            setModelUrl(text); // Guardar la URL del modelo GLB
//            setShowModel(true); // Mostrar el modelo
//           });
//         }else{
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }    // setModelUrl(text); // Guardar la URL del modelo GLB
//             // setShowModel(true); 
        
//     } catch (error) {
//       console.error(error); 
//     }   
//   };
  

//   return (
//     <div className="api-form">
//       <form onSubmit={handleSubmit}>
//         <label>
//           Photo URL:
//           <input type="file"  onChange={(e) => onChangePhoto(e)} />
//         </label>
//         <label>
//           Height:
//           <input
//             type="text"
//             value={height}
//             onChange={(e) => setHeight(e.target.value)}
//           />
//         </label>
//         <label>
//           Gender:
//           <select value={gender} onChange={(e) => setGender(e.target.value)}>
//             <option value="">Select...</option>
//             <option value="m">Male</option>
//             <option value="f">Female</option>
//           </select>
//         </label>
//         <input type="submit" value="Submit" />
//       </form>
//       <div className="show">

//       </div>
//       <Canvas
//         >
//  {showModel  && modelUrl !== '' && <ModelViewer glbUrl={modelUrl} />} Mostrar el modelo
//     {/* <ScenarioH /> */}
//       </Canvas>
//     </div>
//   );
// }
