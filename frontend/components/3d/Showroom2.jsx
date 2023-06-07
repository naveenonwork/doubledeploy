import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { KTX2Loader } from "three-stdlib";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Loader, useGLTF as useGLTFImpl } from "@react-three/drei";

const kTX2Loader = new KTX2Loader();

function Showroom(props) {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  const [modelIndex, setModelIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const modelFiles = [
    "/bandanaShirtGreen.glb",
    "/bandanaShirtBlack.glb",
    "/bandanaShirtBlue.glb",
    "/bandanaShortGreen.glb",
    "/bandanaShortBlack.glb",
    "/bandanaShortBlue.glb",
    // "/SuitJacketBlack.glb",
    // "/SuitJacketBrown.glb",
    // "/PantsSuitBlack.glb",
    // "/PantsSuitBrown.glb",
  ];

  const models = useMemo(
    () =>
      modelFiles.map((file) => {
        return useGLTF(file);
      }),
    [modelFiles]
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setModelIndex((prevIndex) => (prevIndex + 1) % models.length);
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, [modelIndex, models.length]);

  useFrame((state) => {


    ref1.current.rotation.y = -1.5 +Math.sin(state.clock.elapsedTime / 2) * 0.65;
    ref2.current.rotation.y = .75 +Math.sin(state.clock.elapsedTime / 2) * 0.65;
    ref3.current.rotation.y = 2.5 +Math.sin(state.clock.elapsedTime / 2) * 0.65;
    ref4.current.rotation.y = -1.5 +Math.sin(state.clock.elapsedTime / 2) * 0.65;
    ref5.current.rotation.y = .75 +Math.sin(state.clock.elapsedTime / 2) * 0.65;
    ref6.current.rotation.y = 2.5 +Math.sin(state.clock.elapsedTime / 2) * 0.65;


    state.camera.fov = 50;
  });

  return (
    <group scale={2} position={[-1.8, -.91, -1.8]} dispose={null}>
      <primitive
        ref={ref1}
        {...props}
        object={models[2].scene}
        position={[-1.2, 0.9, 0]}
      />{" "}
      <primitive
        ref={ref4}
        {...props}
        object={models[5].scene}
        position={[-1.2, 0.5, 0]}
      />{" "}
      <primitive
        ref={ref2}
        {...props}
        object={models[1].scene}
        position={[1, 0.9, 1]}
      />{" "}
      <primitive
        ref={ref6}
        {...props}
        object={models[3].scene}
        position={[1, 0.5,-1]}
      />
      <primitive
        ref={ref3}
        {...props}
        object={models[0].scene}
        position={[1, 0.9, -1]}
      />
      <primitive
        ref={ref5}
        {...props}
        object={models[4].scene}
        position={[1, 0.5, 1]}

      />{" "}
    </group>
  );
}

export default Showroom;

function useGLTF(url) {
  const gl = useThree((state) => state.gl);
  return useGLTFImpl(url, true, true, (loader) => {
    kTX2Loader.detectSupport(gl);
    kTX2Loader.setTranscoderPath("/basis/");
    loader.setKTX2Loader(kTX2Loader);
  });
}

// useGLTFImpl.preload( "/bandanaShirtGreen.glb")