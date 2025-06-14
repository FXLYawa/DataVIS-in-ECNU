// HomeView.js
import React from 'react';
import '../styles/Home.css';
import FlowingMenu from './blocks/Components/FlowingMenu/FlowingMenu';
import CircularGallery from './blocks/Components/CircularGallery/CircularGallery';
import DecryptedText from './blocks/TextAnimations/DecryptedText/DecryptedText';
import FuzzyText from './blocks/TextAnimations/FuzzyText/FuzzyText';


const intro = '「林俊杰音乐可视化互动平台Always Online」上线！沉浸式探索JJ的旋律宇宙。\n      首页以林俊杰经典演唱会高光影像为视觉锚点，搭配「必听金曲歌单」，瞬间\n唤醒乐迷DNA。用户可通过左侧导航栏一键切换「歌词可视化」与「旋律星图」双\n维度可视化模块，开启沉浸式音乐探索之旅。\n     歌词可视化实验室包含：词云宇宙、词频柱状图、情感分布、意象链接。旋律星图\n分析舱内含：实时频谱瀑布流，同步歌词滚轴。播放器与可视化界面深度联动，歌词\n随旋律精准滚动，打造视听一体化体验。\n      本平台将音乐作品解构为可交互的数字艺术，让每首歌曲背后的创作密码与情感\n肌理清晰可见，发现林俊杰音乐宇宙的全新维度。现在点击开启，让数据与旋律共振，\n重写你的音乐认知！';

function Home() {
  // 示例数据：可播放歌曲列表（仅用于展示）
  const Songs = [
    { link: '#', text: '交换余生', image: '/cover/cover_jhys.jpg' },
    { link: '#', text: '暂时的记号', image: '/cover/cover_zsdjh.jpg' },
    { link: '#', text: '最好是', image: '/cover/cover_zhs.jpg' },
    { link: '#', text: '离开的那一些', image: '/cover/cover_lkdnyx.jpg' },
    { link: '#', text: '幸存者', image: '/cover/cover_xcz.jpg' }
  ];

  const imagelist = [
    {image:'/photo/JJ1.jpg',text:''},
    {image:'/photo/JJ2.jpg',text:''},
    {image:'/photo/JJ3.jpg',text:''},
    {image:'/photo/JJ4.jpg',text:''}
  ];

  return (
    <div className="home-container">
      <aside className="home-left">
        <div className="cover-box">
          <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} items={imagelist} />
        </div>

        <div className='song-list-box'>
          <FlowingMenu items={Songs} color='black' />
        </div>
      </aside>

      {/* 右侧：上方“标题”卡片 + 下方卡片 */}
      <aside className="home-right">
        <div className="title-box">
          <FuzzyText 
            baseIntensity={0.2} 
            hoverIntensity={0.5} 
            enableHover={0.8}
            color='black'
          >
            Always
          </FuzzyText>
          <FuzzyText 
            baseIntensity={0.2} 
            hoverIntensity={0.5} 
            enableHover={0.8}
            color='black'
          >
            Online
          </FuzzyText>
        </div>

        <div className='sub-box'>
          <DecryptedText
            text={intro}
            animateOn="view"
            revealDirection="center"
            speed={200}
          />
        </div>
      </aside>
    </div>
  );
}

export default Home;
