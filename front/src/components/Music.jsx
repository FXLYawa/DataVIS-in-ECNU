import React, { useState, useEffect, useRef } from 'react';
import Imaginative from './views/Music/Imaginative';
import Wave from './views/Music/Wave';
import SongController from './views/Music/SongController';
import Lyrics from './views/Music/Lyrics';
import '../styles/Music.css';


const Music = ({ song }) => {

  const [currentTime, setCurrentTime] = useState(0);
  const [audioEl, setAudioEl] = useState(null);
  const songControllerRef = useRef(null);

  // 当 ReactAudioWave 播放进度更新时，会传过来 time（秒）
  const handleTimeChange = (time) => {
    setCurrentTime(time);
  };

  // 当父组件想要拿内部 <audio> 时，可以这么写
  useEffect(() => {
    if (songControllerRef.current) {
      const el = songControllerRef.current.getAudio();
      if (el) {
        setAudioEl(el);
      }
    }
  }, []); // 如果你只想初始时拿一次，也可以留空依赖。或者根据其它逻辑在时机成熟时再拿。

  const handlePlayClick = () => {
    // 先让 SongController 播放
    songControllerRef.current?.play();

    // 再尝试立刻拿到 <audio>
    const el = songControllerRef.current?.getAudio();
    if (el) {
      setAudioEl(el);
      // el.play(); // 如果你想要在这里直接调用，也可以
    }
  };

  const handlePauseClick = () => {
    songControllerRef.current?.pause();
  };

  
  return (
    <div className="music-container">
      <div className="music-top">

        <div className="music-cover">
          <Imaginative song={song} />
        </div>

        <div className='music-lyrics'>
          <Lyrics lrcPath={song.lyrics} currentTime={currentTime*1000} />
        </div>

      </div>
      <div className="music-bottom">

        <div className="music-chart">
          {/* react-audio-visualize */}
          {audioEl && <Wave audioElement={audioEl} />}
        </div>

        <div className="music-audio">
          {/* react-audio-wave */}
          <SongController
            ref={songControllerRef}
            audioSrc={song.music_url}
            onTimeChange={handleTimeChange}
            onPlayClick={handlePlayClick}
            onPauseClick={handlePauseClick}
          />
        </div>

      </div>
    </div>
  );
};

export default Music;
