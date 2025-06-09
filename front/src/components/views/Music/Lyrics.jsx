// https://github.com/mebtte/react-lrc

import React, { useState, useEffect, useCallback } from 'react';
import { Lrc } from "react-lrc";
import styled, { css } from "styled-components";

/**
 * Props:
 *   - lrcPath: string —— 相对于 public 目录下的路径，例如 "lyrics/song1.lrc"
 *   - currentTime: number —— 当前播放进度，单位：毫秒
 *
 * 注意：如果 .lrc 文件本身是 GB2312 编码，必须先 fetch ArrayBuffer，
 * 然后用 TextDecoder('gb2312')（或 'gbk'）把它正确解码成 UTF-8 字符串。
 */


const Line = styled.div`
  min-height: 10px;
  padding: 5px 20px;

  text-align: center;
  width: 100%;
  text-align: center;  // 可选，歌词居中显示
  font-size: 16px;     // 可选，根据需要调整字体大小
  margin: 5px 0;      // 可选，调整行间距

  ${({ active }) => css`
    color: ${active ? "red" : "black"};
  `}
`;

function Lyrics({ lrcPath, currentTime }) {
  const [lrcText, setLrcText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log('Fetching LRC file from:', lrcPath); // 查看 LRC 文件路径
    fetchLrcFile();
  }, [lrcPath]);

  const fetchLrcFile = async () => {
    setLoading(true);
    setError(null);
    try {
      const realUrl = lrcPath.startsWith('/') ? lrcPath : `/${lrcPath}`;
      const resp = await fetch(realUrl, { method: 'GET' });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      // 获取文件内容
      const buffer = await resp.arrayBuffer();
      // console.log('Fetched LRC file successfully, decoding...');
      const decoder = new TextDecoder('gb2312', { fatal: true, ignoreBOM: true });
      const text = decoder.decode(buffer);

      // 清洗文本，去除多余的换行符
      const cleanLrcText = text.replace(/[\r\n]+/g, '\n');
      // console.log('Cleaned LRC Text:', cleanLrcText);  // 调试：输出清洗后的歌词

      setLrcText(cleanLrcText);  // 设置清洗后的 LRC 内容
    } catch (err) {
      console.error('Failed to load LRC file:', err);
      setError('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const lineRenderer = useCallback(
    ({ active, line: { content } }) => (
      <Line active={active}>{content}</Line>
    ),
    []
  );

  

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(65, 170, 51, 0.8)', zIndex: 10
        }}>
          <span>歌词加载中...</span>
        </div>
      )}
      {error && !loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(71, 207, 66, 0.8)', zIndex: 10, color: 'red'
        }}>
          <span>加载失败：{error}</span>
        </div>
      )}
      {/* <Lrc> 组件会根据 currentMillisecond 自动滚动到对应行 */}
      <Lrc
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'hidden',  // 隐藏滚动条
          overflowX: 'hidden',  // 隐藏滚动条
        }}
        // style={{ overflow: 'hidden !important' }}
        recoverAutoScrollInterval={50}
        lrc={lrcText}
        lineRenderer={lineRenderer}
        currentMillisecond={currentTime * 1000}
        verticalSpace={true}
      />
    </div>
  );
}

export default Lyrics;