# Shared Human Concept Parser (Python)
# Handles all file-based concepts: reflex, habit, instinct, hindsight, peripheral

import os
import re


CONCEPT_TYPES = ['reflex', 'habit', 'instinct', 'hindsight', 'peripheral']


def parse_concept_file(content, concept_type=None):
    """Parse a concept file into a list of concept objects."""
    lines = content.split('\n')
    concepts = []
    current = None
    current_key = None

    for raw_line in lines:
        line = raw_line.rstrip()
        if not line.strip() or line.strip().startswith('#'):
            continue

        trimmed = line.strip()

        # New concept block
        is_new = False
        for ct in CONCEPT_TYPES:
            if trimmed.startswith(ct + ' '):
                if current:
                    concepts.append(current)
                current = {'type': ct, 'name': trimmed[len(ct)+1:].strip(), 'rules': {}}
                current_key = None
                is_new = True
                break
        if is_new:
            continue

        # Key-value pair (indented)
        if current and re.match(r'^\s+\w+:', raw_line):
            colon_idx = trimmed.index(':')
            key = trimmed[:colon_idx].strip()
            value = trimmed[colon_idx + 1:].strip()
            current['rules'][key] = value
            current_key = key
            continue

        # Continuation
        if current and current_key and raw_line.startswith(' ') and ':' not in trimmed:
            current['rules'][current_key] += ' ' + trimmed
            continue

    if current:
        concepts.append(current)

    return concepts


def load_concepts(directory, concept_type):
    """Load concepts of a specific type from a directory."""
    concepts = []

    # Global
    global_path = os.path.expanduser(f'~/.{concept_type}')
    if os.path.exists(global_path):
        with open(global_path) as f:
            concepts.extend(parse_concept_file(f.read(), concept_type))

    # Project-level
    project_path = os.path.join(directory, f'.{concept_type}')
    if os.path.exists(project_path):
        with open(project_path) as f:
            concepts.extend(parse_concept_file(f.read(), concept_type))

    # Directory
    concept_dir = os.path.join(directory, f'.{concept_type}.d')
    if os.path.isdir(concept_dir):
        for f in sorted(os.listdir(concept_dir)):
            if f.endswith(f'.{concept_type}'):
                with open(os.path.join(concept_dir, f)) as fh:
                    concepts.extend(parse_concept_file(fh.read(), concept_type))

    return concepts


def load_all_concepts(directory):
    """Load all concept types from a directory."""
    all_concepts = {}
    for ct in CONCEPT_TYPES:
        all_concepts[ct] = load_concepts(directory, ct)
    return all_concepts
