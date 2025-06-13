

import React, { useState, useEffect } from 'react';
import TiltedCard from '../../blocks/Components/TiltedCard/TiltedCard';
import '../../../styles/Music.css';
import axios from 'axios';

const baseurl = 'http://127.0.0.1:8000/api/imaginative';

async function getImage(song) {
  //return {'images':[{'url':'/photo/JJ1.jpg'}]};
  try {
    const response = await axios.get(baseurl + song.head);
    return response.data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}

function Imaginative({ song }) {
  const [imageData, setImageData] = useState(null);

  useEffect(() => { 
    // 异步获取图片数据
    getImage(song).then((data) => {
      setImageData(data); // 设置图片数据
    }).catch((error) => {
      console.error("图片数据加载失败:", error);
    });
  }, [song]); // 每次song变化时重新请求

  if (!imageData) {
    return <div>正在生成图片，请稍候...</div>;
  }
  console.log('图片数据:', imageData);
  return (
    <div className="music-sub-cover">
        <TiltedCard
          imageSrc={imageData.images[0].url}
          // imageSrc={imageData}
          containerHeight="100%"
          containerWidth="100%"
          imageHeight="100%"
          imageWidth="100%"
          rotateAmplitude={12}
          scaleOnHover={1.2}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
        />
    </div>
  );
}

export default Imaginative;