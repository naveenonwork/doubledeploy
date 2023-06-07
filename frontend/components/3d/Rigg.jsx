import { useFrame } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';

function Rigg({ vec = new THREE.Vector3() }) {
      const width = window.innerWidth;
      console.log(width);

      let adapt = 17

      useFrame((s) => {
      s.camera.position.lerp(
        vec.set(
          Math.sin(s.clock.elapsedTime / 6) * 1.2,
           Math.cos(s.clock.elapsedTime / 6) * 0.5,
           adapt
        ),
        0.01
      );
  
      s.camera.lookAt(.4, 0, 0);
    });
  }
  export default Rigg;
