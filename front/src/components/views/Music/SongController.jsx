// https://github.com/llaurora/react-audio-wave?utm_source=chatgpt.com

import React, { useState, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
// import { ReactAudioWave } from 'react-audio-wave';
import { ReactAudioWave } from 'react-audio-wave/dist/react-audio-wave.cjs.js';
import '../../../styles/Music.css';

const SongController = forwardRef(({ audioSrc, onTimeChange, onPlayClick, onPauseClick }, ref) => {

  const containerRef = useRef(null);
  const [internalAudio, setInternalAudio] = useState(null);

  // 当 ReactAudioWave 加载状态改变时触发
  const handleLoadStateChange = useCallback(loadState => {
    if (loadState === 2 && containerRef.current) {
      // 通过容器 ref，去查找子节点中的 <audio>
      const audioEl = containerRef.current.querySelector('.wave-container audio');
      if (audioEl) {
        console.log('>>> 找到内部 <audio>：', audioEl);
        setInternalAudio(audioEl);
      }
    }
  }, []);

  useImperativeHandle(ref, () => ({
    play: () => {
      // 如果想直接触发播放，也可以用 internalAudio.play()
      // 但这里仍然让 ReactAudioWave 自己去管理波形播放
      containerRef.current.querySelector('.wave-container canvas')?.dispatchEvent(new Event('play')); 
      // （或者直接调用 wave 播放 API，这里仅示意。）
    },
    pause: () => {
      // 同理，这里用 internalAudio.pause() 也行
      containerRef.current.querySelector('.wave-container canvas')?.dispatchEvent(new Event('pause')); 
    },
    getAudio: () => internalAudio
  }), [internalAudio]);


  const colors = {
    waveColor: "#d8d8d8",
    progressColor: "#8E128E",
    cursorColor: "#8E128E",
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button
        onClick={() => {
          // 调用内部 wave.play()
          if (internalAudio) {
            internalAudio.play();
          }
          // 通知父组件：播放事件发生了
          if (onPlayClick) onPlayClick();
        }}
        style={{ marginRight: 8 }}
      >
        播放
      </button>
      <div className='music-sub-audio' ref={containerRef}>
        <ReactAudioWave
          supportPlaybackRate
          audioSrc={audioSrc}
          waveHeight={100}
          colors={colors}
          placeholder={"wait"}
          onCurrentTimeChange={time => onTimeChange?.(time)}
          onPlay={() => onPlayClick?.()}
          onPause={() => onPauseClick?.()}
          onChangeLoadState={handleLoadStateChange}
        />
      </div>
      <button
        onClick={() => {
          // 调用内部 wave.pause()
          if (internalAudio) {
            internalAudio.pause();
          }
          // 通知父组件：暂停事件发生了
          if (onPauseClick) onPauseClick();
        }}
        style={{ marginLeft: 8 }}
      >
        暂停
      </button>
    </div>
  );
});

export default SongController;
