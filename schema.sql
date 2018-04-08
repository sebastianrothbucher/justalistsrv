CREATE table ws 
(
    id bigint NOT NULL,
    name text NOT NULL,
    constraint ws_pkey PRIMARY KEY (id)
);
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
CREATE INDEX fki_colchoice_colid_fk
    ON colchoice (colid);
CREATE SEQUENCE seq_colchoice_id;

CREATE TABLE rec
(
    id bigint NOT NULL,
    wsid bigint NOT NULL,
    title text,
    CONSTRAINT rec_pkey PRIMARY KEY (id),
    CONSTRAINT rec_wsid_fk FOREIGN KEY (wsid)
        REFERENCES ws(id)
);
CREATE INDEX fki_rec_wsid_fk
    ON rec (wsid);
CREATE SEQUENCE seq_rec_id;

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
CREATE INDEX fki_reccol_recid_fk
    ON reccol (recid);
CREATE INDEX fki_reccol_colid_fk
    ON reccol (colid);
CREATE SEQUENCE seq_reccol_id;