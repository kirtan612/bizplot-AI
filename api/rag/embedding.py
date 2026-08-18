"""
BizPilot AI - EmbeddingProvider Abstraction & Dense Semantic Vector Engine.
Generates normalized 384-dimensional dense semantic vectors for RAG document retrieval.
"""

import math
import hashlib
from typing import List, Union


class EmbeddingProvider:
    """Provider-agnostic Embedding Interface."""
    
    def embed_text(self, text: str) -> List[float]:
        raise NotImplementedError

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        raise NotImplementedError


class DenseEmbeddingEngine(EmbeddingProvider):
    """
    384-Dimensional Dense Vector Engine.
    Generates normalized L2-embedding vectors via character n-grams and hashing.
    """

    def __init__(self, vector_dim: int = 384):
        self.vector_dim = vector_dim

    def _compute_vector(self, text: str) -> List[float]:
        if not text or not text.strip():
            return [0.0] * self.vector_dim

        vec = [0.0] * self.vector_dim
        words = text.lower().split()

        # Word & N-gram hashing
        for word in words:
            # Word hash
            h_word = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
            idx_word = h_word % self.vector_dim
            vec[idx_word] += 1.0

            # Character 3-gram hashes
            if len(word) >= 3:
                for i in range(len(word) - 2):
                    ngram = word[i:i+3]
                    h_ngram = int(hashlib.sha256(ngram.encode("utf-8")).hexdigest(), 16)
                    idx_ngram = h_ngram % self.vector_dim
                    vec[idx_ngram] += 0.5

        # L2 Normalization
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0.0:
            vec = [round(x / norm, 6) for x in vec]

        return vec

    def embed_text(self, text: str) -> List[float]:
        return self._compute_vector(text)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [self._compute_vector(t) for t in texts]


def compute_cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Computes cosine similarity between two float vectors."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return round(dot_product / (norm_a * norm_b), 4)
