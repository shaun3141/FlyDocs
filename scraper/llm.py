import openai
import tiktoken
import requests

ALLOWED_COMPANIES = ["Anthropic", "OpenAI"]
ALLOWED_MODELS = ["davinci", "gpt-3.5-turbo", "claude_v1"]


class LanguageModel:
    model: str = None
    company: str = None

    def __init__(self, api_key=None, company: str = "OpenAI", model: str = "gpt-3.5-turbo"):
        if company not in ALLOWED_COMPANIES:
            raise Exception(f"Company {company} not supported")
        if model not in ALLOWED_MODELS:
            raise Exception(f"Model {model} not supported")
        if api_key is None:
            raise Exception("api_key must be provided")

        self.company = company
        self.model = model
        self.api_key = api_key

        if self.company == "OpenAI":
            openai.api_key = api_key

    def get_response(self, message=None, messages=None, n_replies=1):
        # Validate that message OR messages is set, but not both
        if message is None and messages is None:
            raise Exception("Either message or messages must be set")
        if message is not None and messages is not None:
            raise Exception("Only one of message or messages can be set")

        # GPT3
        if self.model == "davinci":
            if message == None:
                raise Exception(
                    "`message` must be set when using davinci model")

            response = openai.Completion.create(
                engine=self.model,
                prompt=message,
                temperature=1,
                n=n_replies,
            )
            return {
                "raw": response,
                "first": response["choices"][0]["text"].strip(),
                "all": [choice["text"].strip() for choice in response["choices"]]
            }

        # ChatGPT
        elif self.model == "gpt-3.5-turbo":
            if message is not None:
                messages = [{"role": "user", "content": message}]
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=messages,
                n=n_replies
            )
            return {
                "raw": response,
                "first": response["choices"][0]["message"]["content"].strip(),
                "all": [choice["message"]["content"].strip() for choice in response["choices"]]
            }

        # Claude
        elif self.model == "claude_v1":
            if message is not None:
                messages = [{"role": "user", "content": message}]

            # Convert messages to Claude format
            claude_str = ""
            for message in messages:
                if message["role"] == "user":
                    claude_str += f"\n\nHuman: {message['content']}"
                elif message["role"] == "assistant":
                    claude_str += f"\n\nAssistant: {message['content']}"

            response = requests.post(
                "https://api.anthropic.com/v1/complete",
                json={
                    "model": "claude-v1",
                    "prompt": claude_str,
                    "max_tokens_to_sample": 1000,
                    "stop_sequences": ["\n\nHuman:"],

                },
                headers={
                    "X-API-Key": self.api_key
                }
            )

            return {
                "raw": response.json()["completion"],
                "first": response.json()["completion"].strip(),
                "all": [response.json()["completion"].strip()]
            }

        else:
            raise Exception(f"Model {self.model} not supported")

    def count_tokens(self, message):
        # Non-OpenAI
        if self.model != "OpenAI":
            # Take # of words over 75% to account for punctuation
            return len(message.split(" ")) / .75
        # OpenAI
        token_encoding = tiktoken.encoding_for_model(self.model)
        return len(token_encoding.encode(message))
