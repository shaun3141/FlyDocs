import dotenv
import yaml
import os
from langchain.agents.agent_toolkits.openapi.spec import reduce_openapi_spec
from langchain.requests import RequestsWrapper
from langchain.llms.openai import OpenAI
from langchain.agents.agent_toolkits.openapi import planner
os.environ["OPENAI_API_KEY"] = dotenv.get_key(".env", 'OPENAI_API_KEY')


llm = OpenAI(temperature=0.0,model_name="gpt-4")

with open("docs/openapi.yaml") as f:
    raw_docs_api_spec = yaml.load(f, Loader=yaml.Loader)
docs_api_spec = reduce_openapi_spec(raw_docs_api_spec)

requests_wrapper = RequestsWrapper(headers={
    'Authorization': f'Bearer dG9rOjk0ZjAwOGVhX2I4MDdfNDZiY185ODU1X2M4ZWJkMjhlZGJmYToxOjA='
})

import tiktoken
enc = tiktoken.encoding_for_model('text-davinci-003')
def count_tokens(s): return len(enc.encode(s))
print(count_tokens(yaml.dump(docs_api_spec)))

docs_agent = planner.create_openapi_agent(docs_api_spec, requests_wrapper, llm)
user_query = "Find admins"
docs_agent.run(user_query)

