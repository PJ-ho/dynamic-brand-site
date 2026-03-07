'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Float, useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Simple 3D Wallet Model (procedural)
function WalletModel({ color = '#8B6914' }: { color?: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation based on mouse position
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        pointer.x * 0.5,
        0.05
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        pointer.y * 0.2,
        0.05
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} position={[0, 0, 0]}>
        {/* Wallet Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.4, 0.3, 1.6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Wallet Fold Line */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[2.4, 0.02, 1.6]} />
          <meshStandardMaterial
            color="#3C2415"
            roughness={0.9}
            metalness={0}
          />
        </mesh>

        {/* Stitching Detail */}
        <mesh position={[1.1, 0.16, 0]}>
          <boxGeometry args={[0.02, 0.01, 1.4]} />
          <meshStandardMaterial color="#B8860B" metalness={0.3} />
        </mesh>
        <mesh position={[-1.1, 0.16, 0]}>
          <boxGeometry args={[0.02, 0.01, 1.4]} />
          <meshStandardMaterial color="#B8860B" metalness={0.3} />
        </mesh>

        {/* Logo Emboss */}
        <mesh position={[0, 0.17, 0.5]}>
          <boxGeometry args={[0.4, 0.02, 0.3]} />
          <meshStandardMaterial color="#3C2415" roughness={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

// Card Holder Model
function CardHolder({ color = '#5C4033' }: { color?: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={meshRef}>
        {/* Card slots */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, i * 0.05, 0]}>
            <boxGeometry args={[1.6, 0.02, 1]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
        ))}
        {/* Back panel */}
        <mesh position={[0, 0.03, -0.05]}>
          <boxGeometry args={[1.65, 0.2, 1.05]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
      </group>
    </Float>
  );
}

// Small Bag Model
function SmallBag({ color = '#C4A77D' }: { color?: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={meshRef}>
        {/* Bag body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 1.2, 0.6]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        {/* Flap */}
        <mesh position={[0, 0.3, 0.35]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[1.5, 0.4, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* Strap */}
        <mesh position={[0.8, 0.8, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.03, 0.03, 2, 16]} />
          <meshStandardMaterial color="#3C2415" roughness={0.9} />
        </mesh>
        {/* Clasp */}
        <mesh position={[0, 0.1, 0.45]}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
          <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

// Loading fallback
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#C4A77D" wireframe />
    </mesh>
  );
}

// Main 3D Scene Component
interface ProductSceneProps {
  product?: 'wallet' | 'cardholder' | 'bag';
  color?: string;
  interactive?: boolean;
}

export default function ProductScene({ 
  product = 'wallet', 
  color,
  interactive = true 
}: ProductSceneProps) {
  const defaultColors = {
    wallet: '#8B6914',
    cardholder: '#5C4033',
    bag: '#C4A77D',
  };

  const productColor = color || defaultColors[product];

  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <spotLight
            position={[-10, 5, -10]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
          />

          {/* Product */}
          {product === 'wallet' && <WalletModel color={productColor} />}
          {product === 'cardholder' && <CardHolder color={productColor} />}
          {product === 'bag' && <SmallBag color={productColor} />}

          {/* Ground shadow */}
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Environment */}
          <Environment preset="studio" />

          {/* Controls */}
          {interactive && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

// Standalone wallet component for easy import
export function Wallet3D({ color }: { color?: string }) {
  return <ProductScene product="wallet" color={color} />;
}

export function CardHolder3D({ color }: { color?: string }) {
  return <ProductScene product="cardholder" color={color} />;
}

export function Bag3D({ color }: { color?: string }) {
  return <ProductScene product="bag" color={color} />;
}
