from collections import Counter
import os
import re
import spacy
import huspacy
from spacy.matcher import Matcher
from spacy.symbols import ORTH


@spacy.Language.component("segm")
def set_custom_segmentation(doc):
    new_line_chars = ['\n', '\r\n', '\r']
    for token in doc[:-1]:
        if token.text in new_line_chars:
            doc[token.i+1].is_sent_start = True
    return doc


def get_sentences(raw_text: str):
    text = os.linesep.join([s for s in raw_text.splitlines() if s])
    text = re.sub(' +', ' ', text)  # sok space egymás után kivéve.
    nlp = huspacy.load()
    nlp.add_pipe('segm', first=True)
    # külföldi rövidítés esetére részmegoldás:
    nlp.tokenizer.add_special_case('.,', [{ORTH: '.,'}])
    nlp.tokenizer.add_special_case('.;', [{ORTH: '.;'}])
    nlp.tokenizer.add_special_case('...', [{ORTH: '...'}])
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents]
    sentences = [x for x in sentences if x != '']
    return(sentences)


def get_most_common_words(raw_text: str):
    def exclude_not_wanted(token):
        return not token.is_stop and not token.is_punct and not token.is_digit

    nlp = huspacy.load()
    doc = nlp(raw_text)
    words = [token.text for token in doc if exclude_not_wanted(token)]
    nouns = [token.text for token in doc if exclude_not_wanted(
        token) and token.pos_ == "NOUN"]
    verbs = [token.text for token in doc if exclude_not_wanted(
        token) and token.pos_ == "VERB"]
    word_freq = Counter(words)
    common_words = word_freq.most_common(5)
    noun_freq = Counter(nouns)
    common_nouns = noun_freq.most_common(5)
    verb_freq = Counter(verbs)
    common_verbs = verb_freq.most_common(5)
    fields = ['text', 'count']
    return {'words': [dict(zip(fields, d)) for d in common_words],
            'nouns': [dict(zip(fields, d)) for d in common_nouns],
            'verbs': [dict(zip(fields, d)) for d in common_verbs]}


def find_keywords(raw_text: str, keywords: list[str]):
    nlp = huspacy.load()
    m_tool = Matcher(nlp.vocab)
    sentence = nlp(raw_text)
    pattern = []
    for word in keywords:
        if len(word.split()) == 1:
            pattern.append([{'LOWER': word}])
        else:
            p = []
            words = [token.text for token in nlp(word)]
            for w in words:
                p.append({'LOWER': w})

            pattern.append(p)
            p = []

            for w in words:
                p.append({'LOWER': w})
                p.append({'IS_PUNCT': True})

            # utolsó elemhez nem kell IS_PUNCT, gyorsabb, mint a ciklusban ellenőrizni:
            p = p[:-1]
            pattern.append(p)

    m_tool.add('matcher', pattern)

    phrase_matches = m_tool(sentence)
    result = []
    for match_id, start, end in phrase_matches:
        span = sentence[start:end]
        result.append({'start': start, 'end': end, 'phrase': span.text})

    return(result)
