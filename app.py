import os
import json
import ast
import re
import datetime
import pytz
import requests

from flask import Flask, request, jsonify
from flask_cors import CORS

import transformers
from transformers import AutoModelForCausalLM, AutoTokenizer, TextStreamer

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
# cors
CORS(app)

MAX_RETRY = 5
DB_ENDPOINT_URL = os.environ.get('DB_ENDPOINT_URL')

CHAT_REPLACEMENT_KEY = "CHAT_MESSAGE"
todo_extraction_promt_templete = f"""USER: これから与えるメッセージの中からやるべきことを抽出してTODO（やること）リストに追加する項目をjson line形式で作成してください．
メッセージの送信主自身のTODOを抽出してください．
抽出する項目はタイトル(title)，具体的な説明(description)，期限(due_date)，優先度(priority)の4つです．
極力，タイトルは短く，説明は長くしてください．
優先度は低，中，高の3段階で表現してください．
期限は可能な限り具体的な日付か，「今日」，「明日」，「明後日」，「一週間後」のいずれかで表現してください．
もし，TODOが存在しない場合は[]を出力してください．
以下に与える情報を必要に応じて使用して下さい．
- 発言者：USER
ASSISTANT: はい．わかりました．では、抽出対象の文章を入力してください．<|endoftext|>
USER: 「こんにちは、みなさん！
今週の定例ミーティングの資料作成についてお知らせします。
進捗状況や見つかった課題をまとめて、資料に反映していきましょう。
締め切りは明日ですので、お願いします！」
ASSISTANT: メッセージの内容から，USERが行うべきことは，「資料の作成」です．また，資料には「進捗状況や見つかった課題」を反映する必要があります．
期限については「締め切りは明日」と書いてあるので，「明日」が期限です．
したがって，TODOは：
[{{'title': '定例ミーティング用の資料作成', 'description': '今週分の進捗状況と見つかった課題をまとめておく', 'due_date': '明日', 'priority': '中'}}]<|endoftext|>
USER: 「新しいパソコンを買ったので、こちらで以下のものについてはセットアップしておきます：
- Pythonの環境構築
- VSCodeのインストール
- GitHubアカウントの連携」
ASSISTANT: メッセージの内容から，USERが行うべきことは，「新しいパソコンのセットアップ」です．
具体的には「Pythonの環境構築」，「VSCodeのインストール」，「GitHubアカウントの連携」の3つを行います．
また，特定の期限は示されていません．
したがって，TODOは：
[{{'title': 'PCのソフトウェアセットアップ', 'description': '新しいパソコンのセットアップをしておく。やるべきことはpythonの環境構築とVSCodeのインストール、加えてgithubアカウントも連携させておく', 'due_date': '', 'priority': '中'}}]<|endoftext|>
USER: 「@山田さん　先週のミーティングの議事録の提出が確認できていないのですが，どうなっているでしょうか？」
ASSISTANT: メッセージの内容から，ミーティングの議事録の提出を行うべき人は「山田さん」です．
そのため，USERの行うべきことはありません．
したがって，TODOは：
[]<|endoftext|>
USER: 「お疲れ様です！新しいクライアントの提案書の作成をすることになっているのですが，明後日までに完成させるのでチェックをお願いします。」
ASSISTANT: メッセージの内容から，USERが行うべきことは，「新しいクライアントの提案書の作成」です．
また，期限は「明後日」であることが分かります．
したがって，TODOは：
[{{'title': '新規クライアントの提案書作成', 'description': '新規クライアントへの提案書作成', 'due_date': '明後日', 'priority': '高'}}]<|endoftext|>
USER: 「<@U04C2SYER3R> 明日のサークルのミーティングの予定ってどんな感じだったっけ？」
ASSISTANT: メッセージの内容から，<@U04C2SYER3R>に確認を取っていることが分かります．
したがって，USERの行うべきことはありません．
したがって，TODOは：
[]<|endoftext|>
USER: 「ミーティン グのために、全学棟の203教室をお願いして押さえておきます\n一週間前までに予約しておかないといけないので、明後日までに必ず 対応しておきます！」
ASSISTANT: メッセージの内容から，USERが行うべきことは，「全学棟の203教室の予約」です．
また，期限は「明後日」であることが分かります．
したがって，TODOは：
[{{'title': '全学棟の203教室の予約', 'description': 'ミーティングのために全学棟の203教室を予約しておく', 'due_date': '明後日', 'priority': '中'}}]<|endoftext|>
USER: 「{CHAT_REPLACEMENT_KEY}」
ASSISTANT: メッセージの内容から"""

model = AutoModelForCausalLM.from_pretrained("cyberagent/calm2-7b-chat", device_map="auto", torch_dtype="auto")
tokenizer = AutoTokenizer.from_pretrained("cyberagent/calm2-7b-chat")

def generate(text: str) -> tuple[list[dict], bool]:
    global model, tokenizer

    prompt = todo_extraction_promt_templete.replace(CHAT_REPLACEMENT_KEY, text)

    token_ids = tokenizer.encode(prompt, return_tensors="pt")
    streamer = TextStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
    output_ids = model.generate(
        input_ids=token_ids.to(model.device),
        max_new_tokens=2048,
        do_sample=True,
        temperature=0.3,
        streamer=streamer,
    )
    try:
        outputs = ast.literal_eval(tokenizer.decode(output_ids[0], skip_special_tokens=True).split('ASSISTANT: ')[-1].split('：')[-1].strip())
    except:
        return [], False
    return outputs, True

def get_due_data(text: str) -> str:
    deadline_pattern = re.compile(r'(20\d{2})/(\d{1,2})/(\d{1,2})')
    match = deadline_pattern.search(text)
    if match:
        year, month, day = match.groups()
        return f'{year}-{month}-{day}T00:00:00.000000000Z'
    elif '今日' == text:
        date = datetime.datetime.now(pytz.timezone('Asia/Tokyo'))
        return f'{date.year}-{date.month}-{date.day}T00:00:00.000000000Z'
    elif '明日' == text:
        date = datetime.datetime.now(pytz.timezone('Asia/Tokyo'))
        date += datetime.timedelta(days=1)
        return f'{date.year}-{date.month}-{date.day}T00:00:00.000000000Z'
    elif '明後日' == text:
        date = datetime.datetime.now(pytz.timezone('Asia/Tokyo'))
        date += datetime.timedelta(days=2)
        return f'{date.year}-{date.month}-{date.day}T00:00:00.000000000Z'
    elif '来週' in text:
        date = datetime.datetime.now(pytz.timezone('Asia/Tokyo'))
        date += datetime.timedelta(days=7)
        return f'{date.year}-{date.month}-{date.day}T00:00:00.000000000Z'
    elif '再来週' in text:
        date = datetime.datetime.now(pytz.timezone('Asia/Tokyo'))
        date += datetime.timedelta(days=14)
        return f'{date.year}-{date.month}-{date.day}T00:00:00.000000000Z'
    else:
        return ''


def arange_json(json: list[dict], user_id: int) -> list[dict]:
    response_json = []
    for data in json:
        res = {}
        res['title'] = data.get('title', '')
        res['content'] = data.get('description', '')
        date = data.get('due_date', '')
        date = get_due_data(date)
        if date:
            res['due_date'] = date
        res['priority'] = data.get('priority', '')
        res['last_modified_by'] = 'AI'
        res['status'] = '未着手'
        res['slack_id'] = user_id
        if res['priority'] not in ['低', '中', '高']:
            res['priority'] = '中'
        response_json.append(res)
    return response_json

def create_tasks(tasks: list[dict]) -> None:
    for task in tasks:
        print(task)
        response = requests.post(DB_ENDPOINT_URL, data=json.dumps(task))
        print(response)

@app.route('/extract', methods = ['POST'])
def extract():
    try:
        data = json.loads(request.data.decode('utf-8'))
        # return data['challenge']
        text = data['event']['text']
        user_id = data['event']['user']
        is_retry = request.headers.get("X-Slack-Retry-Num", None)
        if is_retry:
            return "Don't retry", 200
        print(data)
    except:
        return jsonify({'body': []}), 400

    outputs, succeed = None, False
    retry_count = -1
    while not succeed and retry_count < MAX_RETRY:
        outputs, succeed = generate(text)
        retry_count += 1
    
    if not succeed:
        return jsonify({'body': []}), 200
    
    outputs = arange_json(outputs, user_id)
    create_tasks(outputs)

    print(f"# of requests: {len(outputs)}")

    return jsonify({'body': outputs}), 200

if __name__ == "__main__":
    app.run(debug=True, threaded=True)