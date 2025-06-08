from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bar import process_lyrics, SONG_ID_MAPPING,SONG_FILE_MAPPING  # 导入映射表
from emotion import analyze_lyrics_to_vectors
from Imaginative import imaginative
import os



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_song_name(song_id: str) -> str:
    """将英文标识转换为中文歌名"""
    return SONG_ID_MAPPING.get(song_id, song_id)  # 如果找不到映射，原样返回

def get_song_file(song_id: str) -> str:
    """将英文标识转换为文件名"""
    # 从ID映射到中文名，再从中文名映射到文件名
    song_name = SONG_ID_MAPPING.get(song_id)
    if song_name:
        return SONG_FILE_MAPPING.get(song_name, f"{song_id}.txt")
    return f"{song_id}.txt"


# 运行方式：uvicorn main:app --reload

@app.get("/")
def read_root():
    return {"message": "访问 /api/bar/cloud/{song_id} 等接口获取数据"}

@app.get("/api/bar/cloud/{song_id}")
def wordcloud(song_id: str):
    song_name = get_song_name(song_id)
    data = process_lyrics(song_name)
    return data["wordCloud"]

@app.get("/api/bar/barchart/{song_id}")
def barchart(song_id: str):
    song_name = get_song_name(song_id)
    data = process_lyrics(song_name)
    return data["wordCloud"]

@app.get("/api/bar/arc/{song_id}")
def arc(song_id: str):
    song_name = get_song_name(song_id)
    data = process_lyrics(song_name)
    return data["arcDiagram"]

@app.get("/api/emotion/{song_id}")
def emotion_vectors(song_id: str):
    """
    获取歌词情感向量数据
    支持的song_id: jhys, zsdjh, zhs, lkdnyx, xcz
    """
    try:
        vectors = analyze_lyrics_to_vectors(song_id)
        return {
            "song_id": song_id,
            "song_name": get_song_name(song_id),
            "vectors": vectors
        }
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/api/imaginative/{song_id}")
async def generate_imaginative(song_id: str):
    """
    生成歌词意象图
    支持的song_id: jhys, zsdjh, zhs, lkdnyx, xcz
    返回: 生成的图片URL列表
    """
    try:
        # 验证song_id是否有效
        if song_id not in SONG_ID_MAPPING:
            valid_ids = list(SONG_ID_MAPPING.keys())
            return {"error": "Invalid song ID", "valid_ids": valid_ids}
        
        # 调用imaginative函数生成图片
        image_urls = imaginative(song_id)
        
        # 获取当前文件所在目录
        file_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 构建图片文件路径列表
        image_files = []
        for url in image_urls:
            file_name = os.path.basename(url)
            image_path = os.path.join(file_dir, file_name)
            image_files.append({
                "url": url,
                "local_path": image_path
            })
        
        return {
            "song_id": song_id,
            "song_name": get_song_name(song_id),
            "images": image_files
        }
        
    except Exception as e:
        return {"error": str(e)}

