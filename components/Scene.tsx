'use client';

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { OrbitControls } from '@react-three/drei'
import { BufferGeometry, Points, PointsMaterial, Color, Matrix4 } from 'three'

interface PointCloudComponentProps {
  url: string
}

const PointCloudComponent: React.FC<PointCloudComponentProps> = ({ url }) => {
  const points = useRef<Points>(null)
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null)

  useEffect(() => {
    new PLYLoader().load(url, (loadedGeometry) => {
      loadedGeometry.computeVertexNormals()
      
      // Create a rotation matrix to flip the model 180 degrees around the X-axis
      const rotationMatrix = new Matrix4().makeRotationX(Math.PI);
      loadedGeometry.applyMatrix4(rotationMatrix);
      
      setGeometry(loadedGeometry)
    })
  }, [url])

  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += 0.001
    }
  })

  if (!geometry) return null

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.01}
        vertexColors={true}
        sizeAttenuation={true}
      />
    </points>
  )
}

interface SceneProps {
  url: string
}

const Scene: React.FC<SceneProps> = ({ url }) => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <PointCloudComponent url={url} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default Scene