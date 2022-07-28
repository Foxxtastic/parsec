--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4
-- Dumped by pg_dump version 13.4

-- Started on 2022-07-28 12:47:08

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 201 (class 1259 OID 21758)
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    uploaded date NOT NULL,
    file bytea NOT NULL,
    file_name text NOT NULL
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 21756)
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.documents_id_seq OWNER TO postgres;

--
-- TOC entry 3011 (class 0 OID 0)
-- Dependencies: 200
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- TOC entry 205 (class 1259 OID 21787)
-- Name: key_words; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.key_words (
    id integer NOT NULL,
    key_word text NOT NULL
);


ALTER TABLE public.key_words OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 21785)
-- Name: key_words_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.key_words_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.key_words_id_seq OWNER TO postgres;

--
-- TOC entry 3012 (class 0 OID 0)
-- Dependencies: 204
-- Name: key_words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.key_words_id_seq OWNED BY public.key_words.id;


--
-- TOC entry 203 (class 1259 OID 21769)
-- Name: stop_words; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stop_words (
    id integer NOT NULL,
    stop_word text NOT NULL
);


ALTER TABLE public.stop_words OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 21767)
-- Name: stop_words_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stop_words_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stop_words_id_seq OWNER TO postgres;

--
-- TOC entry 3013 (class 0 OID 0)
-- Dependencies: 202
-- Name: stop_words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stop_words_id_seq OWNED BY public.stop_words.id;


--
-- TOC entry 2865 (class 2604 OID 21761)
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- TOC entry 2867 (class 2604 OID 21790)
-- Name: key_words id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.key_words ALTER COLUMN id SET DEFAULT nextval('public.key_words_id_seq'::regclass);


--
-- TOC entry 2866 (class 2604 OID 21772)
-- Name: stop_words id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stop_words ALTER COLUMN id SET DEFAULT nextval('public.stop_words_id_seq'::regclass);


--
-- TOC entry 2869 (class 2606 OID 21766)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- TOC entry 2875 (class 2606 OID 21792)
-- Name: key_words key_words_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.key_words
    ADD CONSTRAINT key_words_pkey PRIMARY KEY (id);


--
-- TOC entry 2871 (class 2606 OID 21864)
-- Name: stop_words stop_word_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stop_words
    ADD CONSTRAINT stop_word_unique UNIQUE (stop_word);


--
-- TOC entry 2873 (class 2606 OID 21774)
-- Name: stop_words stop_words_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stop_words
    ADD CONSTRAINT stop_words_pkey PRIMARY KEY (id);


-- Completed on 2022-07-28 12:47:08

--
-- PostgreSQL database dump complete
--

