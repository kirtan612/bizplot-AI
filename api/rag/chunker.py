"""
BizPilot AI - Structural & Heading-Aware Document Chunker.
Splits text into chunks preserving page numbers, section headers, tables, and provenance metadata.
"""

import re
import hashlib
from uuid import UUID
from typing import List, Dict, Any, Optional


class DocumentChunkDTO:
    def __init__(
        self,
        company_id: UUID,
        content: str,
        chunk_index: int,
        document_id: Optional[UUID] = None,
        knowledge_id: Optional[UUID] = None,
        ingestion_id: Optional[str] = None,
        page_number: Optional[int] = None,
        section_title: Optional[str] = None,
        access_classification: str = "INTERNAL"
    ):
        self.company_id = company_id
        self.content = content
        self.chunk_index = chunk_index
        self.document_id = document_id
        self.knowledge_id = knowledge_id
        self.ingestion_id = ingestion_id
        self.page_number = page_number
        self.section_title = section_title
        self.access_classification = access_classification
        self.content_hash = hashlib.sha256(content.strip().encode("utf-8")).hexdigest()


def chunk_document_text(
    content_text: str,
    company_id: UUID,
    document_id: Optional[UUID] = None,
    knowledge_id: Optional[UUID] = None,
    ingestion_id: Optional[str] = None,
    access_classification: str = "INTERNAL",
    chunk_size: int = 500,
    chunk_overlap: int = 50
) -> List[DocumentChunkDTO]:
    """
    Chunks document text into structured segments preserving page markers and section titles.
    """
    if not content_text or not content_text.strip():
        return []

    lines = content_text.splitlines()
    chunks: List[DocumentChunkDTO] = []
    
    current_page = 1
    current_section = "General Overview"
    current_buffer: List[str] = []
    current_length = 0
    chunk_index = 0

    page_pattern = re.compile(r"(?:---|\b)Page\s+(\d+)(?:---||\b)", re.IGNORECASE)
    section_pattern = re.compile(r"^(#{1,4}\s+|SECTION\s+\d+:?|CHAPTER\s+\d+:?|[A-Z0-9\s]{4,30}:)", re.IGNORECASE)

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Check for page markers
        page_match = page_pattern.search(stripped)
        if page_match:
            try:
                current_page = int(page_match.group(1))
            except ValueError:
                pass

        # Check for section headers
        if section_pattern.match(stripped):
            current_section = stripped.lstrip("#").strip()

        # Add line to buffer
        current_buffer.append(line)
        current_length += len(line) + 1

        # Emit chunk if size threshold reached
        if current_length >= chunk_size:
            chunk_text = "\n".join(current_buffer).strip()
            if chunk_text:
                chunks.append(DocumentChunkDTO(
                    company_id=company_id,
                    content=chunk_text,
                    chunk_index=chunk_index,
                    document_id=document_id,
                    knowledge_id=knowledge_id,
                    ingestion_id=ingestion_id,
                    page_number=current_page,
                    section_title=current_section,
                    access_classification=access_classification
                ))
                chunk_index += 1

            # Handle overlap
            overlap_words = []
            overlap_len = 0
            for prev_line in reversed(current_buffer):
                if overlap_len + len(prev_line) <= chunk_overlap:
                    overlap_words.insert(0, prev_line)
                    overlap_len += len(prev_line)
                else:
                    break

            current_buffer = overlap_words
            current_length = sum(len(l) + 1 for l in current_buffer)

    # Emit final buffer
    if current_buffer:
        chunk_text = "\n".join(current_buffer).strip()
        if chunk_text:
            chunks.append(DocumentChunkDTO(
                company_id=company_id,
                content=chunk_text,
                chunk_index=chunk_index,
                document_id=document_id,
                knowledge_id=knowledge_id,
                ingestion_id=ingestion_id,
                page_number=current_page,
                section_title=current_section,
                access_classification=access_classification
            ))

    return chunks
