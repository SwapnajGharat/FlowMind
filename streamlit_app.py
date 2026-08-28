"""
streamlit_app.py
Streamlit Frontend for BIS Assistant featuring Voice (Groq Whisper),
RAG Chat, MSME Self-Audit Calculators, and auto-healing state management.
"""

import streamlit as st
from app_features import EnhancedBISAssistant

st.set_page_config(page_title="BIS Compliance Assistant", layout="wide")
st.title("Bureau of Indian Standards (BIS) AI Assistant")

# Auto-heal session state if new methods are added to the backend class
if "bot" not in st.session_state or not hasattr(st.session_state.bot, "transcribe_audio"):
    st.session_state.bot = EnhancedBISAssistant()

if "messages" not in st.session_state:
    st.session_state.messages = []

if "chat_history_archive" not in st.session_state:
    st.session_state.chat_history_archive = []

def start_new_chat():
    if st.session_state.messages:
        st.session_state.chat_history_archive.append(list(st.session_state.messages))
        st.session_state.messages = []
        st.session_state.bot.chat_history = []

# Sidebar Controls
with st.sidebar:
    st.header("Session Management")
    if st.button("➕ New Chat", use_container_width=True, type="primary", key="btn_new_chat"):
        start_new_chat()
        st.rerun()

    st.divider()
    st.header("Saved Chat History")
    if not st.session_state.chat_history_archive:
        st.info("No past chat sessions archived yet.")
    else:
        for idx, past_chat in enumerate(reversed(st.session_state.chat_history_archive)):
            session_num = len(st.session_state.chat_history_archive) - idx
            first_user_msg = next((msg["content"] for msg in past_chat if msg["role"] == "user"), "Empty Session")
            title_snippet = (first_user_msg[:25] + "..") if len(first_user_msg) > 25 else first_user_msg
            
            with st.expander(f"Chat #{session_num}: {title_snippet}"):
                for msg in past_chat:
                    role_icon = "👤" if msg["role"] == "user" else "🤖"
                    st.write(f"**{role_icon} {msg['role'].capitalize()}:** {msg['content']}")

    st.divider()
    if st.button("Clear All History", key="btn_clear_history"):
        st.session_state.messages = []
        st.session_state.chat_history_archive = []
        st.session_state.bot.chat_history = []
        if "audit_data" in st.session_state:
            del st.session_state["audit_data"]
        st.rerun()

# Application Navigation Tabs
tab_chat, tab_voice, tab_audit, tab_product, tab_labs = st.tabs([
    "Chat & Query", 
    "🎙️ Voice Input", 
    "📋 MSME Audit Checklist", 
    "Product Lookup", 
    "Testing Labs"
])

# Tab 1: Text Chat
with tab_chat:
    st.subheader("Active Conversation")
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    if prompt := st.chat_input("Ask a question about BIS standards or compliance..."):
        cleaned_prompt = prompt.strip().strip('"').strip("'")
        with st.chat_message("user"):
            st.markdown(cleaned_prompt)
        st.session_state.messages.append({"role": "user", "content": cleaned_prompt})

        with st.chat_message("assistant"):
            with st.spinner("Searching standards & generating answer..."):
                response = st.session_state.bot.ask_chat(cleaned_prompt)
                st.markdown(response)
        st.session_state.messages.append({"role": "assistant", "content": response})

# Tab 2: Voice Input (Groq Whisper)
with tab_voice:
    st.subheader("Voice Query via Groq Whisper")
    st.write("Record your question in any regional language or English to query the knowledge base.")
    
    audio_value = st.audio_input("Record audio query", key="voice_audio_recorder")
    if audio_value:
        st.audio(audio_value)
        if st.button("Transcribe & Submit Query", key="btn_transcribe"):
            with st.spinner("Transcribing audio using Groq Whisper..."):
                transcribed_text = st.session_state.bot.transcribe_audio(audio_value.read())
                st.info(f"**Transcribed Query:** '{transcribed_text}'")
                
            with st.spinner("Processing RAG query..."):
                answer = st.session_state.bot.ask_chat(transcribed_text)
                st.markdown("### Answer:")
                st.markdown(answer)

# Tab 3: MSME Compliance Audit Checklist
with tab_audit:
    st.subheader("MSME Compliance Readiness Calculator & Self-Audit")
    st.write("Generate a dynamic audit checklist based on Indian Standards.")
    
    audit_target = st.text_input(
        "Enter Product Name or IS Number (e.g., 'Combination Pliers'):", 
        key="msme_audit_target_input"
    )
    
    if st.button("Generate Audit Checklist", key="btn_generate_audit"):
        if audit_target:
            with st.spinner("Extracting standard requirements..."):
                data = st.session_state.bot.generate_audit_checklist(audit_target)
                st.session_state["audit_data"] = data
        else:
            st.warning("Please enter a valid product name or standard number.")

    if "audit_data" in st.session_state and st.session_state["audit_data"]:
        data = st.session_state["audit_data"]
        
        if "error" in data:
            st.warning(data["error"])
        else:
            st.markdown(f"### Standard: {data.get('standard_no', 'N/A')} - {data.get('product_title', audit_target)}")
            
            st.write("**1. Raw Material Compliance Verification**")
            rm_checks = [
                st.checkbox(item, key=f"chk_rm_{idx}_{hash(item)}") 
                for idx, item in enumerate(data.get("raw_material_checks", []))
            ]
            
            st.write("**2. Mandatory Laboratory Testing Equipment**")
            eq_checks = [
                st.checkbox(item, key=f"chk_eq_{idx}_{hash(item)}") 
                for idx, item in enumerate(data.get("mandatory_lab_equipment", []))
            ]
            
            st.write("**3. Factory Quality Process Audits**")
            fq_checks = [
                st.checkbox(item, key=f"chk_fq_{idx}_{hash(item)}") 
                for idx, item in enumerate(data.get("factory_quality_checks", []))
            ]
            
            total = len(rm_checks) + len(eq_checks) + len(fq_checks)
            completed = sum(rm_checks) + sum(eq_checks) + sum(fq_checks)
            
            if total > 0:
                score = int((completed / total) * 100)
                st.divider()
                st.progress(score / 100)
                st.metric("Compliance Readiness Score", f"{score}%")

# Tab 4: Product Specifications Lookup
with tab_product:
    st.subheader("Retrieve Product Specifications")
    prod_query = st.text_input("Enter Product Name or IS Number:", key="prod_lookup_input")
    if st.button("Search Specification", key="btn_prod_search"):
        if prod_query:
            details = st.session_state.bot.get_product_description(prod_query)
            st.markdown(details)
        else:
            st.warning("Please enter a product name or standard number.")

# Tab 5: Laboratory Directory Search
with tab_labs:
    st.subheader("Locate Recognized Testing Facilities")
    cat_query = st.text_input("Enter Product Category:", key="lab_search_input")
    if st.button("Find Laboratories", key="btn_lab_search"):
        if cat_query:
            labs = st.session_state.bot.locate_testing_labs(cat_query)
            st.table(labs)
        else:
            st.warning("Please enter a product category.")