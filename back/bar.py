import os
import json
import jieba
import re
import numpy as np
from sklearn.cluster import KMeans
from collections import Counter
from random import shuffle

jieba.initialize()
jieba.add_word('听雨')
jieba.add_word('雷电交加')
jieba.add_word('平行时空')
jieba.add_word('交换余生')
jieba.add_word('慢动作')
jieba.add_word('阴天之后')
jieba.add_word('日升换月落')
jieba.add_word('出尔反尔')


# 停用词集合（示例）

file_dir = os.path.dirname(os.path.abspath(__file__))

# 添加歌曲名称到文件名的映射字典
SONG_FILE_MAPPING = {
    "最好是": "JJ3-zhs.txt",
    "交换余生": "JJ1-jhys.txt",      # 示例，根据实际文件修改
    "暂时的记号": "JJ2-zsdjh.txt",
    "离开的那一些":"JJ4-lkdnyx.txt",
    "幸存者":"JJ5-xcz"# 示例，根据实际文件修改
}

SONG_ID_MAPPING = {
    "zhs": "最好是",
    "jhys": "交换余生",
    "zsdjh": "暂时的记号",
    "lkdnyx": "离开的那一些",
    "xcz": "幸存者"
}

def get_lyrics(name: str) -> str:
    # 从映射字典获取实际文件名，如果找不到则使用原名称
    filename = SONG_FILE_MAPPING.get(name, name + ".txt")
    lyrics_file = os.path.join(file_dir, 'data', filename)  
    with open(lyrics_file, 'r', encoding='utf-8') as f:
        return f.read().strip()
# 2. 文本清洗函数
def clean_lyrics(lyrics_text: str) -> str:
    """将连续的空白字符（空格、换行、制表符等）替换为单个空格
    去除一切“非中文、非数字字母、非下划线、非空白”的字符
    """
    # 把所有连续的空白字符替换成一个空格
    cleaned = re.sub(r'\s+', ' ', lyrics_text)
    # 去掉所有非中文字、非字母数字、非下划线、非空白的字符
    cleaned = re.sub(r'[^\w\s\u4e00-\u9fff]', '', cleaned)
    return cleaned.strip()

#3. 分词并统计词频（返回列表形式）
def get_word_frequency(lyrics_text: str) -> list:
    """
    将清洗后的歌词文本进行 jieba 分词，去掉单字词和停用词后统计频率，
    最终返回一个列表，格式为：name & value。按 value 从大到小排序。
    """
    words = jieba.lcut(lyrics_text)
    # 过滤单字词 & 停用词
    filtered = [w for w in words if len(w) > 1 ]
    counter = Counter(filtered)
    # 转成字典列表并排序
    word_freq = sorted(
        [{"name": w, "value": c} for w, c in counter.items()],
        key=lambda x: x["value"],
        reverse=True
    )
    return word_freq


#4. 生成词云数据（直接返回 word_freq 即可）
def generate_wordcloud_data(word_freq: list) -> list:
    return word_freq


#5. 生成柱状图数据（返回二维数组的格式）
def generate_barchart_data(word_freq: list, top_n: int = 20) -> dict:
    return word_freq


# 6. 生成弧长连接图（arc diagram）数据
#节点：取前 30 个高频词，按词频大小设定 symbolSize
#边：如果在同一行歌词里同时出现这两个词，就连一条边
#分类：用 KMeans（或按需求可不聚类）给节点分组
def generate_arc_data(lyrics_text: str, word_freq: list, num_categories: int = 3) -> dict:
    """
    边的生成逻辑：  
      1. 先从 word_freq 里取前 30 个高频词 top_words；  
      2. 给每个 top_word 人为分配一个节点 ID（“0”, “1”, ...）；  
      3. 遍历歌词的每一行，对每一行做 jieba 分词 & 停用词过滤，记录该行里出现了哪些 top_words；  
      4. 如果某一行里 top_words[i] 与 top_words[j] 都出现，就把 (i, j) 作为一条链接。  
      5. 最后用 KMeans 将这 30 个词做简单聚类，给每个节点分配一个 category 编号。
    """
    #拿前 30 个高频词（如果不足 30，就取全部）
    top_words = [wf["name"] for wf in word_freq[:]]
    top_values = {wf["name"]: wf["value"] for wf in word_freq}

    #给每个top_word生成一个随机向量用于聚类
    vectors = np.random.rand(len(top_words), 5)
    kmeans = KMeans(n_clusters=min(num_categories, len(top_words)), random_state=42)
    kmeans.fit(vectors)
    labels = kmeans.labels_

    #构建节点列表 
    nodes = []
    for idx, w in enumerate(top_words):
        nodes.append({
            "id": str(idx),
            "name": w,
            "symbolSize": top_values[w]*8,
            "value": top_values[w],
            "category": int(labels[idx])
        })
    shuffle(nodes)  # 打乱顺序，增加随机性
    #构建边（links）：基于“同一行歌词共同出现”
    #把清洗后的歌词按行拆分
    lines = [line.strip() for line in lyrics_text.split("\n") if line.strip()]
    #对每一行再做 clean + 分词 + 停用词过滤，并记录该行里出现了哪些 top_words
    links_set = set()  #防止重复边 (i,j) 和 (j,i)
    for raw_line in lines:
        line = clean_lyrics(raw_line)
        words_in_line = set(jieba.lcut(line))  # 该行分词结果
        #保留既在top_words里满足len>1且非停用词
        filtered_in_line = [
            w for w in words_in_line
            if w in top_words and len(w) > 1 
        ]
        # 如果同一行里出现了多个 top_words，就把它们两两连边
        for i in range(len(filtered_in_line)):
            for j in range(i + 1, len(filtered_in_line)):
                w1 = filtered_in_line[i]
                w2 = filtered_in_line[j]
                idx1 = top_words.index(w1)
                idx2 = top_words.index(w2)
                a, b = min(idx1, idx2), max(idx1, idx2)#防止边重复
                links_set.add((a, b))

    links = []
    for (a, b) in links_set:
        links.append({
            "source": str(a),
            "target": str(b)
        })

    categories = [{"name": f"主题{chr(65 + i)}"} for i in range(num_categories)]

    return {
        "nodes": nodes,
        "links": links,
        "categories": categories
    }

#整合调用
def process_lyrics(song_name: str) -> dict:
    #读取并清洗原始歌词
    raw_lyrics = get_lyrics(song_name)
    cleaned = clean_lyrics(raw_lyrics)

    #统计词频
    word_freq = get_word_frequency(cleaned)

    #组织各类可视化数据
    data = {
        "song": song_name,
        "wordCloud": generate_wordcloud_data(word_freq),
        "arcDiagram": generate_arc_data(raw_lyrics, word_freq, num_categories=6)
    }
    return data

if __name__ == "__main__":
    song_name_input = "最好是"  # 可以改成 “江南” 或 “背对背拥抱” 测试

    # 处理歌词并获取可视化数据（wordCloud、barChart、arcDiagram）
    try:
        viz_data = process_lyrics(song_name_input)
    except FileNotFoundError as e:
        print(str(e))
        exit(1)

    # 直接把结果打印到控制台演示
    print(json.dumps(viz_data, ensure_ascii=False, indent=2))

    # 如果你想把它存成文件，也可以手动调用 save_to_json
    # save_to_json(viz_data, f"{song_name_input}_visualization.json")
