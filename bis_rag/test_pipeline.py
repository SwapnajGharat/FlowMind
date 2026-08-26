"""
test_pipeline.py
Two layers of testing:

1. Retrieval-only tests (no API key needed) - checks whether the vector
   search actually pulls back the RIGHT source document for a query.
   This is the most important thing to get right before you even touch
   an LLM, since a RAG system is only as good as its retrieval.

2. Full pipeline tests (needs a configured LLM API key) -
   checks the generated answer quality and citation correctness.

Run:  python test_pipeline.py
"""

import os

from rag_pipeline import Retriever, BISRagPipeline

# Each test case: (query, expected_doc_id_substring)
# expected_doc_id_substring should appear in the metadata "doc_id" of at
# least one of the top-k retrieved chunks if retrieval is working correctly.
RETRIEVAL_TEST_CASES = [
    ("What standard applies to electric kettles?", "IS_16046"),
    ("How do I get ISI certification for my product?", "ISI_CERT_PROCESS"),
    ("How can I check if my gold jewellery hallmark is genuine?", "HALLMARK_SCHEME"),
    ("What is the process to register electronics under CRS?", "CRS_SCHEME"),
    ("Where can I find a lab to test my product?", "LAB_RECOGNITION"),
    ("I bought a defective ISI marked product, how do I complain?", "CONSUMER_COMPLAINT"),
    ("Can my school start a BIS standards club?", "STANDARDS_CLUB"),
    ("What voltage does IS 302 general safety cover?", "IS_302"),
]


def run_retrieval_tests():
    print("=" * 70)
    print("RETRIEVAL TESTS (embedding + vector search quality)")
    print("=" * 70)

    retriever = Retriever()
    passed = 0

    for query, expected_substr in RETRIEVAL_TEST_CASES:
        chunks = retriever.retrieve(query, top_k=3)
        retrieved_ids = [c["metadata"]["doc_id"] for c in chunks]
        hit = any(expected_substr in doc_id for doc_id in retrieved_ids)

        status = "PASS" if hit else "FAIL"
        if hit:
            passed += 1

        print(f"\n[{status}] Query: {query}")
        print(f"        Expected doc containing: '{expected_substr}'")
        print(f"        Retrieved (top-3): {retrieved_ids}")
        print(f"        Top match distance: {chunks[0]['distance']:.3f} (lower = better)")

    print("\n" + "-" * 70)
    print(f"Retrieval accuracy: {passed}/{len(RETRIEVAL_TEST_CASES)} "
          f"({100 * passed / len(RETRIEVAL_TEST_CASES):.0f}%)")
    print("-" * 70)


def run_full_pipeline_tests(backend="gemini"):
    print("\n" + "=" * 70)
    print(f"FULL PIPELINE TESTS (retrieval + generation, backend={backend})")
    print("=" * 70)

    try:
        pipeline = BISRagPipeline(backend=backend)
    except Exception as e:
        print(f"\nSkipping full pipeline tests - could not initialize backend: {e}")
        print("(Set GEMINI_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY in your .env to enable this.)")
        return

    sample_queries = [
        "What standard applies to electric kettles and what does it cover?",
        "I want to sell LED lights in India, do I need BIS registration?",  # not in KB - tests guardrail
        "How do I verify my hallmarked jewellery is genuine?",
    ]

    for query in sample_queries:
        print(f"\nQuery: {query}")
        result = pipeline.answer(query)
        print(f"Answer:\n{result['answer']}")
        print(f"\nCited sources: {[s['standard_no'] for s in result['sources']]}")
        print("-" * 70)


if __name__ == "__main__":
    run_retrieval_tests()
    run_full_pipeline_tests(backend=os.environ.get("LLM_BACKEND", "gemini"))
