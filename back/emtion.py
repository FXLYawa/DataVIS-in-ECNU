import jieba
from snownlp import SnowNLP
from collections import defaultdict
import re
import os
from typing import List


def analyze_lyrics_to_vectors(name: str) -> List[list]:
    """
    将歌词文本文件转换为情感向量数组
    
    参数:
        file_name: 位于back/data目录下的歌词文件名(不含路径)
    
    返回:
        list: [[情感1, 情感2, 词语, 词频], ...]
    """
    # 1. 获取文件绝对路径
    file_dir = os.path.dirname(os.path.abspath(__file__))
    text_path = os.path.join(file_dir, 'data', name + 'txt')
    
    # 2. 读取文件内容
    if not os.path.exists(text_path):
        raise FileNotFoundError(f"歌词文件未找到: {text_path}")
    with open(text_path, 'r', encoding='utf-8') as f:
        text = re.sub(r'[^\w\s\u4e00-\u9fff]', '', f.read())
    
    # 3. 中文分词与词频统计
    words = jieba.lcut(text)
    word_freq = defaultdict(int)
    stopwords = {'的', '了', '和', '是', '我', '你', '他'}  # 可扩展
    
    for word in words:
        word = word.strip()
        if len(word) > 1 and word not in stopwords:
            word_freq[word] += 1
    
    # 4. 情感分析并生成结果
    result = []
    for word, freq in word_freq.items():
        s = SnowNLP(word)
        # 第一维度：情感极性（-1负面 ~ 1正面）
        polarity = round(s.sentiments * 2 - 1, 6)  
        # 第二维度：情感波动强度（基于词频）
        intensity = round(min(freq/10, 1.0), 6)   
        result.append([polarity, intensity, word, freq])
    
    return result

if __name__ == "__main__":
    a=analyze_lyrics_to_vectors("JJ1-jhys")
    print(a)