import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'
import { Model } from './Model'
import { degToRad } from 'three/src/math/MathUtils.js'
import { useFrame } from '@react-three/fiber'

const CameraController = () => {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse position (-1 to 1)
      mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ camera }) => {
    // Camera position ko smoothly update karo
    const targetX = mousePosition.current.x * 0.2;
    const targetY = mousePosition.current.y * 0.2;

    camera.position.x += (targetX - camera.position.x) * 0.1;
    camera.position.y += (targetY - camera.position.y) * 0.1;

    // Camera ko center ki taraf point karo
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const Scene = () => {
  return (
    <Canvas shadows flat className="w-full h-screen">
        {/* <OrbitControls/> */}
        <CameraController/>
        <Environment preset='city'/>
        <Model scale={5} rotation-x={Math.PI / 2 - degToRad(30)} position-z={-1} position-y={-0.5} />
   </Canvas>
  )
}

export default Scene