// import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
// import * as THREE from "three";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import {
//   Backdrop,
//   Environment,
//   OrbitControls,
//   Stage,

//   useGLTF as useGLTFImpl,
// } from "@react-three/drei";
// import ApiSteps from "../components/ux/ApiSteps";
// import Template from "../components/ux/Template";
// import Rigg from "../components/3d/Rigg";

// import { KTX2Loader } from "three-stdlib";
// import RingLight from "../components/3d/RingLight";
// import SizeButtons from "../components/ux/SizeButtons";
// import UxIcons from "../components/ux/UxIcons";

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
//     "/TurquoiseShirtF.glb",
//     "/YellowShirtFS.glb",
//     "/SkyBlueShirtFS.glb",
//     "/SandShirtFS.glb",
//     "/SandShirtF.glb",
//     "/LightPinkShirtFS.glb",
//     "/LightGreenShirtFS.glb",
//     "/LightBlueShirtFS.glb",
//     "/IndigoShirtF.glb",
//     "/IndigoShirtBlueF.glb",
//     "/HoodieYellowF.glb",
//     "/HoodieOrangeF.glb",
//     "/HoodieLillacF.glb",
//     "/HoodieLightGreenF.glb",
//     "/HoodieLightBlueF.glb",
//     "/HoodieGreenF.glb",
//     "/HoodieBlueF.glb",
//     "/GreenShirtFS.glb",
//     "/GreenShirtFS.glb",
//     "/GreenShirtF.glb",
//     "/DarkBlueShirtF.glb",
//     "/BlackShirtFS.glb",
//     "/BlackShirtFS.glb",
//     "/BeigeShirtFB.glb",
//   ];
//   const gltf = useGLTF(modelFiles[modelIndex]);
//   const handleNextModel = () => {
//     setModelIndex((prevIndex) => (prevIndex + 1) % modelFiles.length); // Avanzar al siguiente modelo en el array
//   };
//   return (
//     <group ref={ref}>
//       <primitive {...props} object={gltf.scene} onClick={handleNextModel} />
//     </group>
//   );
// }

// const Eva = (props) => {
//   const { scene } = useGLTF("/avatarF.glb", true);

//   // Recorre los materiales del modelo y modifícalos según sea necesario
//   useEffect(() => {
//     scene.traverse((child) => {
//       if (child.isMesh) {
//         const { material } = child;
//         if (material) {
//           material.roughness = .4;
//           material.metalness = 0;
//           material.color.set("hsl(126, 1%, 17%)") 
//         }
//       }
//     });
//   }, [scene]);

//   // console.log(scene);
//   return (
//     <mesh  castShadow receiveShadow  {...props}>
//       <primitive object={scene} />
//     </mesh>
//   );
// };

// const Test2 = () => {
//   return (
//     <div className="home">
//       <div className="canvas-wrapper">
//         <Canvas camera={{ position: [2, 0, 2] }}>
//           <Stage intensity={0.5} environment="city" shadows={{ type: 'accumulative', bias: -0.001 }} adjustCamera={false}>
//           <Suspense fallback={null}>

//             <ModelViewF position={[0, -1.118, 0.00181]} />
//             {/* <Adan /> */}
//           <directionalLight
//             position={[5, 5, 5]} // Ajusta la posición de la luz
//             intensity={.1} // Ajusta la intensidad de la luz
//             castShadow // Habilita la generación de sombras para esta luz
//             shadow-mapSize-width={1024} // Ajusta el tamaño del mapa de sombras
//             shadow-mapSize-height={1024} // Ajusta el tamaño del mapa de sombras
//             shadow-camera-near={0.1} // Ajusta el plano cercano de la cámara de sombras
//             shadow-camera-far={50} // Ajusta el plano lejano de la cámara de sombras
//           />
//           </Suspense>
//             <RingLight />
//             <Eva />
//             </Stage>
//           <OrbitControls
//             dampingFactor={0.009}
//             minDistance={0.45}
//             maxDistance={4}
//             rotateSpeed={0.5}
//             // minAzimuthAngle={}
//             maxAzimuthAngle={Math.PI / 2}
//             minPolarAngle={Math.PI / 6}
//             maxPolarAngle={Math.PI / 2.4}
//             enablePan={false}
//           />
//           {/* <ambientLight intensity={1} /> */}
//           {/* <Backdrop
//             receiveShadow
//             scale={[100, 16, 5]}
//             floor={0.5}
//             position={[0, -1.44, -2]}
//           >
//             <meshStandardMaterial
//               color={"hsl(43, 82%, 88%)"}
//               roughness={0.33}
//               metalness={0}
//             />
//           </Backdrop> */}
//           <Environment preset="forest" background={false} blur={0.8} />
//           {/* <rectAreaLight position={[1, 0, 1]} intensity={0.1} />
//           <pointLight position={[0, 10, 0]} intensity={0.2} />
//           <pointLight position={[0, 0, 1]} intensity={0.2} />
//           <pointLight position={[4, 5, 0]} intensity={0.1} />
//           <pointLight position={[-6, 5, 0]} intensity={0.1} />
//           <pointLight position={[0, -3, 1]} intensity={0.1} />
//           <pointLight
//             position={[10, 0, 10]}
//             args={["white", 10, 20, 20]}
//             intensity={0.1}
//           />
//           <pointLight
//             position={[0, 4, -5]}
//             args={["white", 10, 20, 20]}
//             intensity={0.1}
//           />
//           <pointLight position={[0, 3, -10]} intensity={0.05} />
//           <pointLight position={[2, 1, -10]} intensity={0.01} />
//           <pointLight position={[-2, 1, -10]} intensity={0.01} />
//           <pointLight position={[0, 1, 6]} intensity={0.4} />
//           <pointLight position={[0, 8, -6]} intensity={0.4} />
//           <pointLight position={[0, 3, 2]} intensity={0.4} />
//           <pointLight position={[0, 3, -2]} intensity={0.4} />
//           <pointLight position={[1, 0, 1]} intensity={0.9} />
//           <pointLight position={[1, 0, 1]} intensity={0.9} />
//           <pointLight position={[-1, 0, 1]} intensity={0.4} />
//           <pointLight position={[-1, 0, -1]} intensity={0.4} /> */}
//           {/* <Rigg /> */}
//         </Canvas>
//       </div>
//       <SizeButtons />
//       {/* <UxIcons /> */}
//       <Template />
//     </div>
//   );
// };

// export default Test2;
