--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (PGlite 0.2.0)
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = off;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET escape_string_warning = off;
SET row_security = off;

--
-- Name: meta; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA meta;


ALTER SCHEMA meta OWNER TO postgres;

--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: embeddings; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.embeddings (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    embedding public.vector(384) NOT NULL
);


ALTER TABLE meta.embeddings OWNER TO postgres;

--
-- Name: embeddings_id_seq; Type: SEQUENCE; Schema: meta; Owner: postgres
--

ALTER TABLE meta.embeddings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME meta.embeddings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: migrations; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.migrations (
    version text NOT NULL,
    name text,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE meta.migrations OWNER TO postgres;

--
-- Name: child_households; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.child_households (
    child_id bigint NOT NULL,
    household_id bigint NOT NULL
);


ALTER TABLE public.child_households OWNER TO postgres;

--
-- Name: children; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.children (
    id bigint NOT NULL,
    parent_id bigint,
    name text NOT NULL,
    birthdate date NOT NULL,
    interests text,
    dislikes text
);


ALTER TABLE public.children OWNER TO postgres;

--
-- Name: children_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.children ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.children_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: households; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.households (
    id bigint NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.households OWNER TO postgres;

--
-- Name: households_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.households ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.households_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: parent_households; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parent_households (
    parent_id bigint NOT NULL,
    household_id bigint NOT NULL
);


ALTER TABLE public.parent_households OWNER TO postgres;

--
-- Name: parents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parents (
    id bigint NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    supabase_user_id text
);


ALTER TABLE public.parents OWNER TO postgres;

--
-- Name: parents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.parents ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.parents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    story_id bigint,
    parent_id bigint,
    star_rating integer NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT reviews_star_rating_check CHECK (((star_rating >= 1) AND (star_rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.reviews ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: stories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stories (
    id bigint NOT NULL,
    parent_id bigint,
    prompt text NOT NULL,
    theme text,
    reading_time_minutes integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    related_story_id bigint,
    title text NOT NULL,
    is_public boolean DEFAULT false
);


ALTER TABLE public.stories OWNER TO postgres;

--
-- Name: stories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.stories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.stories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: story_households; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.story_households (
    story_id bigint NOT NULL,
    household_id bigint NOT NULL
);


ALTER TABLE public.story_households OWNER TO postgres;

--
-- Name: story_versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.story_versions (
    id bigint NOT NULL,
    story_id bigint,
    version_number integer NOT NULL,
    markdown_content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.story_versions OWNER TO postgres;

--
-- Name: story_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.story_versions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.story_versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: embeddings; Type: TABLE DATA; Schema: meta; Owner: postgres
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: meta; Owner: postgres
--

INSERT INTO meta.migrations VALUES ('202407160001', 'embeddings', '2025-01-02 17:31:08.688+00');


--
-- Data for Name: child_households; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: children; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: households; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: parent_households; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: parents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: stories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: story_households; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: story_versions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: embeddings_id_seq; Type: SEQUENCE SET; Schema: meta; Owner: postgres
--

SELECT pg_catalog.setval('meta.embeddings_id_seq', 1, false);


--
-- Name: children_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.children_id_seq', 1, false);


--
-- Name: households_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.households_id_seq', 1, false);


--
-- Name: parents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parents_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: stories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stories_id_seq', 1, false);


--
-- Name: story_versions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.story_versions_id_seq', 1, false);


--
-- Name: embeddings embeddings_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.embeddings
    ADD CONSTRAINT embeddings_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: child_households child_households_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.child_households
    ADD CONSTRAINT child_households_pkey PRIMARY KEY (child_id, household_id);


--
-- Name: children children_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_pkey PRIMARY KEY (id);


--
-- Name: households households_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_pkey PRIMARY KEY (id);


--
-- Name: parent_households parent_households_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_households
    ADD CONSTRAINT parent_households_pkey PRIMARY KEY (parent_id, household_id);


--
-- Name: parents parents_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_email_key UNIQUE (email);


--
-- Name: parents parents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_pkey PRIMARY KEY (id);


--
-- Name: parents parents_supabase_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_supabase_user_id_key UNIQUE (supabase_user_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: story_households story_households_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.story_households
    ADD CONSTRAINT story_households_pkey PRIMARY KEY (story_id, household_id);


--
-- Name: story_versions story_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.story_versions
    ADD CONSTRAINT story_versions_pkey PRIMARY KEY (id);


--
-- Name: child_households child_households_child_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.child_households
    ADD CONSTRAINT child_households_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id) ON DELETE CASCADE;


--
-- Name: child_households child_households_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.child_households
    ADD CONSTRAINT child_households_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(id) ON DELETE CASCADE;


--
-- Name: children children_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.parents(id) ON DELETE CASCADE;


--
-- Name: parent_households parent_households_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_households
    ADD CONSTRAINT parent_households_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(id) ON DELETE CASCADE;


--
-- Name: parent_households parent_households_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_households
    ADD CONSTRAINT parent_households_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.parents(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.parents(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: stories stories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.parents(id) ON DELETE CASCADE;


--
-- Name: stories stories_related_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_related_story_id_fkey FOREIGN KEY (related_story_id) REFERENCES public.stories(id);


--
-- Name: story_households story_households_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.story_households
    ADD CONSTRAINT story_households_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(id) ON DELETE CASCADE;


--
-- Name: story_households story_households_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.story_households
    ADD CONSTRAINT story_households_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: story_versions story_versions_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.story_versions
    ADD CONSTRAINT story_versions_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

