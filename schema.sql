CREATE table ws 
(
    id bigint NOT NULL,
    name text NOT NULL,
    constraint ws_pkey PRIMARY KEY (id)
);
ALTER TABLE ws ADD CONSTRAINT ws_name_u UNIQUE (name);
CREATE SEQUENCE seq_ws_id;

CREATE TABLE col
(
    id bigint NOT NULL,
    wsid bigint NOT NULL,
    name text NOT NULL,
    control smallint NOT NULL,
    CONSTRAINT col_pkey PRIMARY KEY (id),
    CONSTRAINT col_wsid_fk FOREIGN KEY (wsid)
        REFERENCES ws(id)
);
ALTER TABLE col ADD CONSTRAINT col_name_u UNIQUE (wsid, name)
CREATE INDEX fki_col_wsid_fk
    ON col (wsid);
CREATE SEQUENCE seq_col_id;

CREATE TABLE colchoice
(
    id bigint NOT NULL,
    colid bigint NOT NULL,
    value text NOT NULL,
    color text NOT NULL,
    CONSTRAINT colchoice_pkey PRIMARY KEY (id),
    CONSTRAINT colchoice_colid_fk FOREIGN KEY (colid)
        REFERENCES col (id)
);
ALTER TABLE colchoice ADD CONSTRAINT colchoice_value_color_u UNIQUE (colid, value, color);
CREATE INDEX fki_colchoice_colid_fk
    ON colchoice (colid);
CREATE SEQUENCE seq_colchoice_id;

CREATE TABLE rec
(
    id bigint NOT NULL,
    cid bigint NOT NULL,
    version integer NOT NULL, 
    versiondate timestamp with time zone NOT NULL,
    archived boolean NOT NULL,
    wsid bigint NOT NULL,
    title text,
    CONSTRAINT rec_pkey PRIMARY KEY (id),
    CONSTRAINT rec_wsid_fk FOREIGN KEY (wsid)
        REFERENCES ws(id)
);
ALTER TABLE rec ADD CONSTRAINT rec_cid_version_u UNIQUE (cid, version);
CREATE INDEX fki_rec_wsid_fk
    ON rec (wsid);
CREATE INDEX i_rec_title
    ON rec (wsid, title);
CREATE INDEX i_rec_cid_version
    ON rec (cid, version);
CREATE SEQUENCE seq_rec_id;
CREATE SEQUENCE seq_rec_cid;

CREATE TABLE reccol
(
    id bigint NOT NULL,
    recid bigint NOT NULL,
    colid bigint NOT NULL,
    value text,
    CONSTRAINT reccol_pkey PRIMARY KEY (id),
    CONSTRAINT reccol_recid_fk FOREIGN KEY (recid)
        REFERENCES rec (id),
    CONSTRAINT reccol_colid_fk FOREIGN KEY (colid)
        REFERENCES col (id)
);
ALTER TABLE reccol ADD CONSTRAINT reccol_recid_colid_u UNIQUE (recid, colid);
CREATE INDEX fki_reccol_recid_fk
    ON reccol (recid);
CREATE INDEX fki_reccol_colid_fk
    ON reccol (colid);
CREATE INDEX i_reccol_colid_value
    ON reccol (colid, value);
CREATE SEQUENCE seq_reccol_id;