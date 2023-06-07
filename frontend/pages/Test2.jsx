import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Backdrop,
  Center,
  ContactShadows,
  Environment,
  Loader,
  OrbitControls,
  PresentationControls,
  Sky,
  Stage,
  useGLTF,
} from "@react-three/drei";
import ApiSteps from "../components/ux/ApiSteps";
import Template from "../components/ux/Template";
import Rigg from "../components/3d/Rigg";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import ModelView from "../components/3d/ModelView";
import { Link } from "react-router-dom";
import RingLight from "../components/3d/RingLight";
import UxIcons from "../components/ux/UxIcons";
// import SizeButtons from "../components/ux/SizeButtons";
import { motion } from "framer-motion";
import Reveal from "../components/ux/Reveal";
import { show } from "@shopify/app-bridge/actions/ContextualSaveBar";
///MODEL VIEWER///
import "../components/ux/SizeButtons.scss";

///MODEL VIEWER///

const ModeloGlb = ({ glbUrl }) => {
  const { scene } = useGLTF(glbUrl, true);
  const ref = useRef();
  // Recorre los materiales del modelo y modifícalos según sea necesario
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const { material, geometry } = child;
        if (material) {
          // Modificar las propiedades del material según sea necesario
          material.flatShading = false; // Cambiar el color a rojo
          material.roughness = 0.71;
          material.metalness = 0;

          material.color.set("#000000");
        }
        if (geometry) {
          geometry.computeVertexNormals();
        }
      }
    });
  }, [scene]);

  console.log({ scene });
  return <primitive object={scene} ref={ref} />;
};

const MaskGlb = ({ mask }) => {
  const { scene } = useGLTF(mask, true);
  const ref = useRef();
  // Recorre los materiales del modelo y modifícalos según sea necesario
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const { material, geometry } = child;
        if (material) {
          // Modificar las propiedades del material según sea necesario
          material.flatShading = false; // Cambiar el color a rojo
          material.roughness = 0.71;
          material.metalness = 0;

          material.color.set("hsl(126, 1%, 17%)");
        }
        if (geometry) {
          geometry.computeVertexNormals();
        }
      }
    });
  }, [scene]);

  console.log({ scene });
  return (
    <primitive
      object={scene}
      scale={[0.95, 1, 1.06]}
      position={[0.0105, 0.005, 0.007]}
      ref={ref}
    />
  );
};

const UpperGarmentGlb = ({ garmentGlb }) => {
  const scene = useGLTF(garmentGlb, true);
  console.log(garmentGlb);

  return (
    <primitive
      object={scene.scene}
      // scale={2.05}
      position={[.013, 0.026, 0.02]}
    />
  );
};

const LowerGarmentGlb = ({ lowerGarmentGlb }) => {
  const scene = useGLTF(lowerGarmentGlb, true);
  // console.log();
  return (
    <primitive
      object={scene.scene}
      // rotation={[-0.01, 0, 0]}
      // position={[-0.01, 0, 0.002]}
    />
  );
};

const Test2 = ({ name }) => {
  const app = useAppBridge();
  const [glbUrl, setGlbUrl] = useState("");
  const [mask, setMask] = useState("");
  const [maskUrl, setMaskUrl] = useState("");
  const [modelUrl, setModelUrl] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [garmentGlb, setGarmentGlb] = useState("");
  const [lowerGarmentGlb, setLowerGarmentGlb] = useState("");
  const [showGarment, setShowGarment] = useState(false);
  const [yesAvatar, setYesAvatar] = useState(false);
  const [noAvatar, setNoAvatar] = useState(false);
  const [user, setUser] = useState("");
  const [step, setStep] = useState(0);
  const [garmentLoad, setGarmentLoad] = useState(false);
  const [selectedSize, setSelectedSize] = useState("xl");
  console.log("load", garmentLoad);
  let localOrigin;
  if (app) {
    localOrigin = app.localOrigin;
  }
  const handleGarmentCall = async (selectedSize) => {
    event.preventDefault();
    setShowGarment(true);
    setGarmentLoad(true);
    var productid = "ed56cb15a";
    var session = "fem3";
    // var size = selectedSize;
    const payload = {
      method: "POST",
      body: JSON.stringify({
        productid: productid,
        session: session,
        size: selectedSize.toLowerCase(),
        localOrigin: localOrigin,
      }),
      headers: { "Content-Type": "application/json" },
    };

    try {
      const response = await fetch("/static/garment", payload) //cambiar testgarment a garment
        .then((response) => response.json())
        .then((data) => {
          console.log("garment api response", data);
          let avatarglb = data.avatarglb;
          console.log("avatarglb ", data.avatarglb);
          let garmentglb = data.uppergarmentglb;
          let lowerGarmentGlb = data.lowergarmentglb;
          console.log("garmentglb ", data.uppergarmentglb);
          setGarmentGlb(garmentglb);
          setLowerGarmentGlb(lowerGarmentGlb);
          setGarmentLoad(false);
          
          console.log("url garment", garmentglb);
        })
        .catch((error) => {
          console.error(error);
          setGarmentLoad(false);
          // result = error;
        });
      } catch (error) {
        console.error(error);
        setGarmentLoad(false);
    }
  };

  const modeloMemo = useMemo(() => <ModeloGlb glbUrl={glbUrl} />, [glbUrl]);
  const maskMemo = useMemo(() => <MaskGlb mask={mask} />, [mask]);
  const garmentsMemo = useMemo(
    () => <UpperGarmentGlb garmentGlb={garmentGlb} />,
    [garmentGlb]
  );
  const lowerGarmentsMemo = useMemo(
    () => <LowerGarmentGlb lowerGarmentGlb={lowerGarmentGlb} />,
    [lowerGarmentGlb]
  );

  const handleFormSubmit = (data) => {
    setGlbUrl(data.avatarglb);
    setMask(data.maskglb);
    setGarmentGlb(data.uppergarmentglb);
    // setModelUrl(data); // Guardar la URL del modelo GLB
    setShowModel(true);
    console.log("URL obtenida:", data);
  };

  const handleRegenerateAvatar = () => {
    setGlbUrl(""); // Borrar la información del estado glbUrl
    setShowModel(false); // Mostrar nuevamente el componente ApiSteps
  };

  const handleUserName = (event) => {
    setUser(event.target.value);
    console.log('userName:', event.target.value);
}

  //////////////size buttons //////////////
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleSizeClick = async (size) => {
    setSelectedSize(size);
    await handleGarmentCall(size)
  };

  return (
    <Suspense fallback={null}>
      <div className="home">
        {showModel && step === 0 && (
          <Reveal>
            <div className="text-input">
              <h2>
                Set a name for your
                <span style={{ color: "#1d977a" }}> Avatar </span>
                <input
                  type="texts"
                  placeholder="Your name"
                  value={user}
                  onChange={handleUserName}
                />
              </h2>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 1.3 }}
                className="next-btn"
                onClick={(e) => setStep(1)}
              >
                <span class="arrow"></span>
              </motion.button>
            </div>
          </Reveal>
        )}
        {showModel && step === 1 && (
          <Reveal>
            <div className="canvas-wrapper">
              <Canvas>
                <Stage
                  preset="rembrandt"
                  adjustCamera={false}
                  environment={{
                    background: false,
                    files: "./littleParis.hdr", // Cambia este valor según tu necesidad
                    intensity: 0.5, // Cambia este valor según tu necesidad
                    // Puedes agregar más propiedades aquí si es necesario
                  }}
                  shadows={{ position: [0, 0, 0] }}
                  intensity={0.7}
                >
                  <ContactShadows
                    position={[0, -1.4, 0]}
                    opacity={0.75}
                    scale={10}
                    blur={0.5}
                    far={4}
                  />
                  <Suspense fallback={null}>
                    {/* <Center disableX={false}> */}

                    {glbUrl && modeloMemo}
                    {mask && maskMemo}
                    {garmentGlb && garmentsMemo}
                    {/* </Center> */}
                    {lowerGarmentGlb && lowerGarmentsMemo}
                  </Suspense>

                  {showModel ? (
                    <>
                      <OrbitControls
                        dampingFactor={0.009}
                        minDistance={0.7}
                        maxDistance={2}
                        rotateSpeed={0.5}
                        // minAzimuthAngle={}
                        target={[0, 0.36, 0]}
                        maxAzimuthAngle={Math.PI / 2}
                        minPolarAngle={Math.PI / 4.5}
                        maxPolarAngle={Math.PI / 1.4}
                        enablePan={false}
                      />
                      <ambientLight intensity={1} />
                      <RingLight garmentLoad={garmentLoad} />
                    </>
                  ) : null}
                  {/* <Environment preset="forest" /> */}
                  {/* {showModel ? null : <Rigg />} */}
                </Stage>
              </Canvas>
            </div>

            {!showGarment ? (
              <motion.div
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="avatar-btn"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="no-avatar"
                  transition={{ duration: 0.6 }}
                  onClick={(e) => {
                    handleRegenerateAvatar(e);
                    setStep(0);
                  }}
                >
                  Regenerate Avatar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.6 }}
                  onClick={setShowGarment(true)}
                  className="yes-avatar"
                >
                  Approve Avatar
                </motion.button>
              </motion.div>
            ) : (
              <div className="size-buttons">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-button ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={(e) => {
                      handleSizeClick(size);
                      handleGarmentCall(e);
                    }}
                    // disabled={garmentLoad}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
            {/* <Template /> */}
          </Reveal>
        )}

        {showModel ? null : (
          <>
            <ApiSteps
              onFormSubmit={handleFormSubmit}
              // onUserName={handleUserName}
            />
            <Loader
              containerStyles={{ backgroundColor: "rgb(219, 219, 219)" }}
              barStyles={{ backgroundColor: "#177962", color: "white" }}
              initialState={(a) => a}
            />
          </>
        )}
      </div>
    </Suspense>
  );
};

export default Test2;

// const SizeButtons = ({ selectedSize, setSelectedSize }) => {

//   return (

//   );
// };
