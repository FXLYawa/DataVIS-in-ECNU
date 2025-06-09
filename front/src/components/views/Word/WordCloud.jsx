// https://github.com/ecomfe/echarts-wordcloud

import React, { useLayoutEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import '../../../styles/Word.css';
import axios from 'axios';

const baseurl='http://127.0.0.1:8000/api';

async function getData(song) {
  try {
    const response = await axios.get(baseurl+song.bar);
    return response.data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}

async function  CloudDraw(chartDom, song) {
  var myCloud = echarts.init(chartDom);
  const data=await getData(song);
  var option = {
    tooltip: {
      show: true
    },
    series: [{
      type: 'wordCloud',
      gridSize: 8, // 控制词云图的网格大小，值越大词语之间的间距越大
      sizeRange: [10, 40], // 控制词语的大小范围
      rotationRange: [0, 0], // 控制词语的旋转角度范围
      rotationStep: 45, // 控制词语旋转的步长
      shape: 'circle', // 控制词云图的形状，可选值为 'circle', 'cardioid', 'diamond', 'triangle-forward', 'triangle', 'pentagon', 'star'
      drawOutOfBound: false, // 控制词云图是否允许词语超出绘制区域
      // 布局的时候是否有动画
      layoutAnimation: true,
      // 图的位置
      left: 'center',
      top: 'center',
      // 词汇样式
      textStyle: {
        fontFamily: 'sans-serif',
        // fontWeight: 'bold',
        color: function () {
          return 'rgb(' + [Math.round(Math.random() * 160),Math.round(Math.random() * 160),Math.round(Math.random() * 160)].join(',') + ')';
        }
      },  
      data: data, // 词云图的数据
      emphasis: {
        focus: 'self',
        textStyle: {
          fontSize: 60 // 点击的词放大
        }
      }
    }]
  };
  
  option && myCloud.setOption(option);
  window.addEventListener('resize', () => {
    myCloud.resize();
  });
}

function WordCloud({ song }) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (chartRef.current) {
      CloudDraw(chartRef.current, song);
    }
    return () => {
      if (chartRef.current) {
        echarts.dispose(chartRef.current);
      }
    };
  }, [song]);

  return <div ref={chartRef} className="word-sub-cloud" />;
}

export default WordCloud;