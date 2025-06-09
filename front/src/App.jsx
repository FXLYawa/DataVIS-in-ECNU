import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css'; // 可以放一些全局布局的样式

/**
 * 内容类型列表（可按需增删、修改）
 * “HOME” —— 首页视图
 * “MUSIC” —— 音乐可视化视图
 * “LYRICS” —— 歌词展示视图
 */
const CONTENT_OPTIONS = [
  { id: 'HOME', label: '首页' },
  { id: 'MUSIC', label: '音乐可视化' },
  { id: 'WORD', label: '歌词可视化' },
  { id: 'EMOTION', label: '情感分析' }
];

/**
 * 预定义的歌曲列表。实际项目中可以从后台接口获取，这里先写死几个示例。
 * 格式：{ id: string | number, name: string, artist: string, url: string (歌曲文件地址) … }
 */
const SONG_LIST = [
  { "id": '1', 'name': '交换余生', 'artist': '林俊杰', 'music_url': '/mp3/林俊杰-交换余生.mp3', "cover_url": 'https://upload.cc/i1/2025/06/01/zZ0Is5.jpg', 'lyrics': '/lrc/林俊杰-交换余生.lrc', 'bar':'/bar/cloud/jhys', 'emotion':'/emotion/jhys', 'link':'/bar/arc/jhys'},
  { "id": '2', 'name': '暂时的记号', 'artist': '林俊杰', 'music_url': '/mp3/林俊杰-暂时的记号.mp3', "cover_url": 'https://upload.cc/i1/2025/06/01/zZ0Is5.jpg', 'lyrics': '/lrc/林俊杰-暂时的记号.lrc', 'bar':'/bar/cloud/zsdjh', 'emotion':'/emotion/zsdjh', 'link':'/bar/arc/zsdjh'},
  { "id": '3', 'name': '最好是', 'artist': '林俊杰', 'music_url': '/mp3/林俊杰-最好是.mp3', "cover_url": 'https://upload.cc/i1/2025/06/01/zZ0Is5.jpg', 'lyrics': '/lrc/林俊杰-最好是.lrc' ,'bar':'/bar/cloud/zhs', 'emotion':'/emotion/zhs', 'link':'/bar/arc/zhs'},
  { "id": '4', 'name': '离开的那一些', 'artist': '林俊杰', 'music_url': '/mp3/林俊杰-离开的那一些.mp3', "cover_url": 'https://upload.cc/i1/2025/06/01/zZ0Is5.jpg', 'lyrics': '/lrc/林俊杰-离开的那一些.lrc' ,'bar':'/bar/cloud/lkdnyx', 'emotion':'/emotion/lkdnyx', 'link':'/bar/arc/lkdnyx'},
  { "id": '5', 'name': '幸存者', 'artist': '林俊杰', 'music_url': '/mp3/林俊杰-幸存者.mp3', "cover_url": 'https://upload.cc/i1/2025/06/01/zZ0Is5.jpg', 'lyrics': '/lrc/林俊杰-幸存者.lrc','bar':'/bar/cloud/xcz', 'emotion':'/emotion/xcz', 'link':'/bar/arc/xcz' }
];

function App() {
  const [selectedSong, setSelectedSong] = useState(SONG_LIST[0]); // 默认选中第一首歌
  const [selectedContent, setSelectedContent] = useState(CONTENT_OPTIONS[0].id);

  return (
    <div className="app-container">
      {/* 左侧侧边栏：歌曲列表和内容类型选择 */}
      <Sidebar
        songList={SONG_LIST}
        selectedSong={selectedSong}
        onSelectSong={setSelectedSong}
        contentOptions={CONTENT_OPTIONS}
        selectedContent={selectedContent}
        onSelectContent={setSelectedContent}
      />

      {/* 右侧主区域：根据 selectedContent 显示不同视图 */}
      <MainContent
        selectedContent={selectedContent}
        selectedSong={selectedSong}
      />
    </div>
  );
}

export default App;
