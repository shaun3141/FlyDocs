from flask import Flask, request, jsonify
import tiktoken
import dotenv
import yaml
import os

os.environ["OPENAI_API_KEY"] = dotenv.get_key(".env", 'OPENAI_API_KEY')

from langchain.agents.agent_toolkits.openapi.spec import reduce_openapi_spec
from langchain.requests import RequestsWrapper
from langchain.llms.openai import OpenAI
from langchain.agents.agent_toolkits.openapi import planner


app = Flask(__name__)

llm = OpenAI(temperature=0.0, model_name="gpt-4")

with open("docs/openapi.yaml") as f:
    raw_docs_api_spec = yaml.load(f, Loader=yaml.Loader)
docs_api_spec = reduce_openapi_spec(raw_docs_api_spec)

requests_wrapper = RequestsWrapper(headers={
    'Authorization': f'Bearer dG9rOjk0ZjAwOGVhX2I4MDdfNDZiY185ODU1X2M4ZWJkMjhlZGJmYToxOjA='
})

enc = tiktoken.encoding_for_model('text-davinci-003')
def count_tokens(s): return len(enc.encode(s))


@app.route('/')
def index():
    return 'Hello from Flask!'

@app.route('/run')
def run():
    return 'Hello from Run!'


@app.route('/run_command', methods=['POST'])
def run_command():
    user_query = request.json.get('command')
    if user_query is None:
        return jsonify({'error': 'No command provided'}), 400

    docs_agent = planner.create_openapi_agent(
        docs_api_spec, requests_wrapper, llm)
    result = docs_agent.run(user_query)

    return jsonify({'result': result})


app.run(host='0.0.0.0', port=8000)
