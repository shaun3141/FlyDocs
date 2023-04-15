import re

# TODO: Figure out a graceful way to share common text between prompts, or just make top-level vars...

# Get all text files in the current working directory


def Prompt(prompt: str, token_replacement_dict: dict = None):
    prompts = {
        "useful": {
            "prompt": """
Below is a snippet of an internal wiki - Please evaluate if the snippet contains information that could answer a question or otherwise be useful to know. Begin your reply with a `Yes` or `No`

Page: |PAGE_NAME|
Content: 
```
|CHUNK|
```

## Reply
        """,
            "prefix": "",
            "suffix": ""
        },
        "questions": {
            "prompt": """
Below is a snippet of an internal wiki - Please write |NUM_QUESTIONS| questions that someone could ask that this snippet of the internal wiki could answer. Write the question in a way that it is likely to be searched for. If there's any other context to share, put it in an "Other" section. 

Page: |PAGE_NAME|
Content: 
```
|CHUNK|
```

## Questions
""",
            "prefix": "",
            "suffix": ""
        },
    }

    # Ensure prompt is in the keys of prompts
    if prompt not in prompts:
        raise Exception(
            f"Error: Prompt '{prompt}' is not in the prompt template dictionary.")

    # If any token replacements are needed, do them here
    if token_replacement_dict:
        for placeholder, value in token_replacement_dict.items():
            for promptKey, promptOjbj in prompts.items():
                prompts[promptKey]["prompt"] = promptOjbj["prompt"].replace(
                    placeholder, value.strip())

    # See if any tokens are left in the prompt
    tokens = re.findall(r'\|(.+?)\|', prompts[prompt]["prompt"])

    # If there are tokens left, raise an error
    if tokens:
        raise Exception(
            f"Error: Prompt '{prompt}' still has tokens left unreplaced: {tokens}")

    # Strip whitepace from the prompt
    prompts[prompt]["prompt"] = prompts[prompt]["prompt"].strip()

    # Return the prompt
    return prompts[prompt]
