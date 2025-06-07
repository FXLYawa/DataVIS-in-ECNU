from http import HTTPStatus
from urllib.parse import urlparse, unquote
from pathlib import PurePosixPath
import requests
from dashscope import ImageSynthesis
import os


def get_api_key(file_path: str) -> str:
    """从指定的文件中读取 API 密钥"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"API 密钥文件未找到: {file_path}")
    with open(file_path, 'r') as f:
        return f.read().strip()
    
def get_prompt(file_path: str) -> str:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"歌词文件未找到: {file_path}")
    with open(file_path, 'r') as f:
        return f.read().strip()

def ask(s:str, api_key: str):
    rsp = ImageSynthesis.call(api_key=api_key,
                            model="wanx2.1-t2i-turbo",
                            prompt=s,
                            n=1,
                            size='1024*1024')
    res = []
    if rsp.status_code == HTTPStatus.OK:
        # 在当前目录下保存图片
        for result in rsp.output.results:
            res.append(result.url)
    else:
        print('sync_call Failed, status_code: %s, code: %s, message: %s' %
            (rsp.status_code, rsp.code, rsp.message))
    return res


def imaginative(name):
    file_dir = os.path.dirname(os.path.abspath(__file__))
    api_key_file = os.path.join(file_dir, 'data', 'apikey.txt')  
    api_key = get_api_key(api_key_file)
    
    prompt_file = os.path.join(file_dir, 'data', name + '.txt')
    prompt = get_prompt(prompt_file)
    arr = ask(prompt)
    for x in arr:
        file_name = PurePosixPath(unquote(urlparse(x).path)).parts[-1]
        with open('./{}'.format(file_name), 'wb+') as f:
            f.write(requests.get(x).content)
    return arr


if __name__ == "__main__":
    file_dir = os.path.dirname(os.path.abspath(__file__))
    api_key_file = os.path.join(file_dir, 'data', 'apikey.txt')  
    api_key = get_api_key(api_key_file)
    
    prompt = input()
    arr = ask(prompt)
    for x in arr:
        file_name = PurePosixPath(unquote(urlparse(x).path)).parts[-1]
        with open('./{}'.format(file_name), 'wb+') as f:
            f.write(requests.get(x).content)