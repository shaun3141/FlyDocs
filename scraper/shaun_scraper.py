import dotenv
import openai
import pinecone
import prompt as PromptEngine
import llm
import uuid
import datetime
import yaml
import json
import re
import os


from langchain.agents.agent_toolkits.openapi.spec import reduce_openapi_spec


def get_token_usage(response):
    return response["raw"]["usage"]["total_tokens"]


NUM_QUESTIONS_TO_GENERATE = 5
TOKENS_SPENT = 0
CONTEXT = {
    "pages_indexed": [],
    "preprocessed_chunks": [],
    "processed_chunks": [],
}


def get_pinecone_connection():
    # Initialize connection to pinecone
    pinecone.init(
        api_key=dotenv.get_key(".env", 'PINECONE_API_KEY'),
        environment=dotenv.get_key(".env", 'PINECONE_ENVIRONMENT'),
    )
    pinecone_index = pinecone.Index(dotenv.get_key(
        ".env", 'PINECONE_INDEX_NAME'))
    # metadata_config = {
    #     "indexed": ["type", "category"]
    # }

    # check if 'openai' index already exists (only create index if not)
    if dotenv.get_key(".env", 'PINECONE_INDEX_NAME') not in pinecone.list_indexes():
        pinecone.create_index(
            name=dotenv.get_key(".env", 'PINECONE_INDEX_NAME'),
            dimension=1536,  # OpenAI Embedding dimension
            # metadata_config=metadata_config,
        )

    # Connect to index
    index = pinecone.Index(dotenv.get_key(".env", 'PINECONE_INDEX_NAME'))

    return index


index = get_pinecone_connection()
print("Connected to Pinecone index")


# Get a page and content
def process_oas(oasDefinition):
    num_tokens = 0
    preprocessed_chunks = []
    processed_chunks = []

    api_spec = reduce_openapi_spec(oasDefinition)

    BASE_URL = oasDefinition["servers"][0]["url"]

    for endpoint in api_spec.endpoints:
        [endpoint_name, endpoint_description, endpoint_details] = endpoint
        url = f"{endpoint_name.split(' ')[0]} {BASE_URL + endpoint_name.split(' ')[1]}"
        print(endpoint_name)

    print(preprocessed_chunks[10])
    # Use ChatGPT to process Chunks
    for i, chunk in enumerate(preprocessed_chunks):

        # Generate a Chunk UUID
        chunk_id = str(uuid.uuid4())

        # # Generate questions that are relevant to the chunk
        # questions_prompt = PromptEngine.Prompt("questions", {
        #     "|PAGE_NAME|": endpoint_name,
        #     "|CHUNK|": chunk,
        #     "|NUM_QUESTIONS|": str(NUM_QUESTIONS_TO_GENERATE),
        # })

        # questions_res = chatgpt.get_response(
        #     questions_prompt["prompt"], n_replies=1)
        # num_tokens += get_token_usage(questions_res)

        # # The question response asks ChatGPT to stuff any other context behind "## Other"
        # questions_raw = questions_res["first"].split("## Other")[0].strip()
        # questions = questions_raw.split("\n")
        # # Given a string like 2. What is the purpose of this page?, we want to remove the number
        # questions = [re.sub(r'^\d+\.\s+', '', question).strip()
        #              for question in questions]
        # # Generate embeddings for the questions

        # question_embeddings = [e["embedding"] for e in openai.Embedding.create(
        #     input=questions, model="text-embedding-ada-002")["data"]]
        # chunk_embedding = openai.Embedding.create(
        #     input=chunk, model="text-embedding-ada-002")["data"][0]["embedding"]
        # page_embedding = openai.Embedding.create(
        #     input=markdown_content, model="text-embedding-ada-002")["data"][0]["embedding"]

        # Add embeddings to Pinecone
        # pinecone_questions_to_upsert = []
        # for i, question in enumerate(questions):
        #     pinecone_questions_to_upsert.append(
        #         (
        #             f"{chunk_id}-question{i}",
        #             question_embeddings[i],
        #             {
        #                 "type": "question",
        #                 "category": "general",
        #                 "page_id": page_id,
        #                 "chunk_id": chunk_id,
        #                 "original": question,
        #             }
        #         )
        #     )

        # # Add the chunk embedding
        # pinecone_chunk_to_upsert = [(
        #     chunk_id,
        #     chunk_embedding,
        #     {
        #         "type": "chunk",
        #         "category": "general",
        #         "page_id": page_id,
        #         "chunk_id": chunk_id,
        #         "original": chunk,
        #     }
        # )]

        # index.upsert(vectors=pinecone_questions_to_upsert,
        #              namespace="questions")
        # index.upsert(vectors=pinecone_chunk_to_upsert, namespace="chunks")

        # # Add the chunk data for context
        # processed_chunks.append({
        #     "id": chunk_id,
        #     "chunk": chunk,
        #     "processed_at": str(datetime.datetime.now()),
        #     "questions": questions,
        # })

        # print(f"Processing Chunk {i}")
        # print(chunk)
        # print("")
        # print("")


# Read in the OAS file
DOCS_FILE = "intercom"

with open("docs/intercom_oas_only.json") as f:
    docs_json = json.load(f)

# Process the OAS
oas_response = process_oas(docs_json)

# Save the context
with open(".json", "w") as f:
    json.dump(CONTEXT, f)

print("Finished | Total Tokens Spent: " + str(TOKENS_SPENT))
