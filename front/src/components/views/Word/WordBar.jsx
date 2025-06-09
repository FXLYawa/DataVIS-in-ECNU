// https://echarts.apache.org/examples/en/editor.html?c=dataset-encode0

import React, { useLayoutEffect, useRef } from 'react';
import * as echarts from 'echarts';
import '../../../styles/Word.css';
import axios from 'axios';

const baseurl='http://127.0.0.1:8000/api';

async function getData(song) {
   try {
    const response = await axios.get(baseurl+song.bar);
  /*  console.log('API响应数据:', response.data);
    console.log([
    { 'name': '医学研究', 'value': 300 },
    { 'name': '动物保护', 'value': 130 },
    { 'name': '航海', 'value': 200 }
  ])*/
    return response.data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}

/*return ([
    { 'name': '医学研究', 'value': 300 },
    { 'name': '动物保护', 'value': 130 },
    { 'name': '航海', 'value': 200 }
  ]);*/
async function BarDraw(chartDom, song) {
  var myChart = echarts.init(chartDom);
  const data=await getData(song);
  var option = {
    dataset: {source: data},
    grid: { containLabel: true },
    xAxis: { 
      name: '频率' ,
      nameLocation: 'middle',
      nameGap: 30,
    },
    yAxis: { type: 'category' },
    series: [
      {
        type: 'bar',
        encode: {
            // Map the "amount" column to X axis.
            x: 'value',
            // Map the "product" column to Y axis
            y: 'name'
        }
      }
    ]
  };
  
  option && myChart.setOption(option);
  window.addEventListener('resize', () => {
    myChart.resize();
  });
}

function WordBar({ song }) {
  const chartRef = useRef(null);
  
  useLayoutEffect(() => {
    if (chartRef.current) {
      BarDraw(chartRef.current, song);
    }
    return () => {
      if (chartRef.current) {
        echarts.dispose(chartRef.current);
      }
    };
  }, [song]);
  return <div ref={chartRef} className='word-sub-bar' />;
}

export default WordBar;