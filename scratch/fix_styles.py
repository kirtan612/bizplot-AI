import glob
import re

for filepath in glob.glob('frontend/src/**/*.tsx', recursive=True) + glob.glob('frontend/src/**/*.ts', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    # Replace justify: '...' with justifyContent: '...'
    new_content = re.sub(r'\bjustify\s*:', 'justifyContent:', new_content)
    # Replace pb: 12 inside style={{ ... }}
    new_content = re.sub(r'\bpb\s*:', 'paddingBottom:', new_content)
    new_content = re.sub(r'\bpt\s*:', 'paddingTop:', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Fixed:", filepath)
