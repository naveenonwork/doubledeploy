// import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
// import * as THREE from "three";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import {
//   Backdrop,
//   Environment,
//   OrbitControls,
//   Stage,
//   Sky,
//   useGLTF as useGLTFImpl,
// } from "@react-three/drei";
// import ApiSteps from "../components/ux/ApiSteps";
// import Template from "../components/ux/Template";
// import Rigg from "../components/3d/Rigg";

// import { KTX2Loader } from "three-stdlib";
// import Template2 from "../components/ux/Template2";
// import RingLight from "../components/3d/RingLight";
// import UxIcons from "../components/ux/UxIcons";
// import SizeButtons from "../components/ux/SizeButtons";

// const kTX2Loader = new KTX2Loader();

// function useGLTF(url) {
//   const gl = useThree((state) => state.gl);
//   return useGLTFImpl(url, true, true, (loader) => {
//     kTX2Loader.detectSupport(gl);
//     kTX2Loader.setTranscoderPath("/basis/");
//     loader.setKTX2Loader(kTX2Loader);
//   });
// }

// function ModelViewF(props) {
//   const [modelIndex, setModelIndex] = useState(0);
//   const ref = useRef();
//   const modelFiles = [
//     "/bandanaShirtGreen.glb",
//     "/bandanaShirtBlack.glb",
//     "/bandanaShirtBlue.glb",
//     "/bandanaShortGreen.glb",
//     "/bandanaShortBlue.glb",
//     "/bandanaShortBlack.glb",
//     "/SuitJacketBlack.glb",
//     "/SuitJacketBrown.glb",
//     "/PantsSuitBlack.glb",
//     "/PantsSuitBrown.glb",
//     "/TurquoiseShirtMS.glb",
//     "/YellowShirtMS.glb",
//     "/SkyBlueShirtMS.glb",
//     "/SandShirtMS.glb",
//     "/LightPinkShirtMS.glb",
//     "/LightGreenShirtMS.glb",
//     "/LightBlueShirtMS.glb",
//     "/BrownShirtMS.glb",
//     "/IndigoBlueShirtMS.glb",
//     "/HoodieYellowM.glb",
//     "/HoodieOrangeM.glb",
//     "/HoodieLillacM.glb",
//     "/HoodieLightGreenM.glb",
//     "/HoodieLightBlueM.glb",
//     "/HoodieGreenM.glb",
//     "/HoodieBlueM.glb",
//     "/GreenShirtMS.glb",
//     "/DarkBlueShirtMS.glb",
//     "/BlackShirtMS.glb",
//     "/BlackShirtMS.glb",
//     "/BeigeShirtMS.glb",
//   ];

//   const modelPositions = [
//     // Posiciones personalizadas para los modelos específicos
//     [-0.02, -1.218, 0.012],
//     [-0.02, -1.218, 0.012],
//     [-0.02, -1.218, 0.012],
//     [-0.005, -1.217, 0.084999],
//     [-0.005, -1.217, 0.084999],
//     [-0.005, -1.217, 0.084999],
//     [-0.009, -1.22, 0.085],
//     [-0.009, -1.22, 0.085],
//     [-0.005, -1.217, 0.084999],
//     [-0.005, -1.217, 0.084999],
//     [0, -1.223, -0.001], // Modelo en la posición por defecto
//     [0, -1.223, -0.001], // Modelo en la posición por defecto
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     [0, -1.223, -0.001],
//     // ... agregar más posiciones personalizadas si es necesario
//   ];

//   const gltf = useGLTF(modelFiles[modelIndex]);
//   const handleNextModel = () => {
//     setModelIndex((prevIndex) => (prevIndex + 1) % modelFiles.length);
//   };

//   const getModelPosition = (index) => {
//     // Obtener la posición del modelo según su índice
//     if (modelPositions[index]) {
//       return modelPositions[index];
//     }
//     // Usar la posición por defecto para el resto de los modelos
//     // return [0, -1.223, -0.001];
//   };

//   const modelPosition = getModelPosition(modelIndex);
//   useFrame((state) => {
//     if (!ref.current) {
//       return;
//     }
//     // ref.current.rotation.y += state.clock.elapsedTime( )* .2 ;
//   });
//   return (
//     <group ref={ref}>
//       <primitive
//         {...props}
//         position={modelPosition}
//         object={gltf.scene}
//         onClick={handleNextModel}
//       />
//     </group>
//   );
// }

// const Adan = (props) => {
//   const { scene } = useGLTF("/avatarM.glb", true);
//   const ref = useRef();
//   // Recorre los materiales del modelo y modifícalos según sea necesario
//   useEffect(() => {
//     scene.traverse((child) => {
//       if (child.isMesh) {
//         const { material } = child;
//         if (material) {
//           // Modificar las propiedades del material según sea necesario
//           material.roughness = 0.71;
//           material.metalness = 0;
//           material.color.set("hsl(126, 1%, 17%)"); // Cambiar el color a rojo
//         }
//       }
//     });
//   }, [scene]);
//   useFrame((state) => {
//     if (!ref.current) {
//       return;
//     }
//     // ref.current.rotation.y += 0.01;
//   });
//   // console.log(scene);
//   return <primitive ref={ref} object={scene} position={[0, 0, 0]} />;
// };

// const Test2 = () => {
//   return (
//     <div className="home">
//       <div className="canvas-wrapper">
//         <Canvas camera={{ position: [2, 0, 2] }}>
//           <Suspense fallback={null}>
//             <Stage
//               intensity={0.5}
//               environment="city"
//               shadows={{ type: "accumulative", bias: -0.001 }}
//               adjustCamera={false}
//             >
//               <ModelViewF />
//               <Adan />
//               <RingLight />
//             </Stage>
//           </Suspense>
//           <OrbitControls
//             dampingFactor={0.009}
//             minDistance={0.7}
//             maxDistance={4}
//             rotateSpeed={0.5}
//             // minAzimuthAngle={Math.PI / -4} // Ángulo mínimo de panorámica
//             maxAzimuthAngle={Math.PI / 4} // Ángulo máximo de panorámica
//             minPolarAngle={Math.PI / 6}
//             maxPolarAngle={Math.PI / 2.4}
//             enablePan={true}
//           />
//           {/* <Backdrop scale={[100, 20, 7]} floor={1.5} position={[0, -5, -5]}>
//             <meshStandardMaterial
//           color={"hsl(126, 0%, 99%)"}
//                 roughness={.4}
//                 metalness={1}
//             />
//           </Backdrop> */}
//           <Environment preset="forest" background={false} blur={0.8} />
          
//         </Canvas>
//       </div>
//       {/* <UxIcons /> */}
//       <SizeButtons />

//       <Template2 />
//     </div>
//   );
// };

// export default Test2;
