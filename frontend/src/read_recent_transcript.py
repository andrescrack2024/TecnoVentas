import json
import os

log_path = 'C:/Users/Sharli/.gemini/antigravity/brain/2ba6de52-4fc8-41b7-9a17-2e7323149b72/.system_generated/logs/transcript.jsonl'
if os.path.exists(log_path):
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                step = data.get('step_index')
                if step and 1030 <= step <= 1045:
                    source = data.get('source')
                    type_ = data.get('type')
                    content = data.get('content')
                    print(f"[{source}] Step {step} ({type_}): {content[:400] if content else 'No content'}")
                    if 'tool_calls' in data:
                        for tc in data['tool_calls']:
                            print(f"  Tool Call: {tc.get('name')} with args: {str(tc.get('arguments'))[:200]}")
            except Exception as e:
                pass
else:
    print("Log path not found")
