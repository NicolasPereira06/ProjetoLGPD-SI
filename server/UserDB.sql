CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Users(
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    user_first_name VARCHAR(10000) NOT NULL,
    user_last_name VARCHAR(10000) NOT NULL,
    user_cpf VARCHAR(10000) NOT NULL,
    user_date_birth VARCHAR(10000) NOT NULL,
    user_cellphone VARCHAR(10000) NOT NULL,
    user_address VARCHAR(10000) NOT NULL,
    user_email VARCHAR(10000) NOT NULL,
    user_password VARCHAR(100) NOT NULL
);

CREATE TABLE Admin(
    admin_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    admin_email VARCHAR(100) NOT NULL,
    admin_password VARCHAR(100) NOT NULL
);

CREATE TABLE term (
    term_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    term_title VARCHAR(255),
    term_content VARCHAR(10000)
);

CREATE TABLE user_term (
    user_term_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    accepted BOOLEAN NOT NULL CHECK (accepted = true),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL,
    term_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES term(term_id) ON DELETE CASCADE,
    UNIQUE (user_id, term_id)
);

CREATE TABLE optional (
    optional_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    optional_title VARCHAR(255) NOT NULL,
    optional_content TEXT NOT NULL,
    term_id UUID NOT NULL,
    FOREIGN KEY (term_id) REFERENCES term(term_id) ON DELETE CASCADE
);

CREATE TABLE user_optional (
    user_optional_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    accepted BOOLEAN NOT NULL,
    user_id UUID NOT NULL,
    optional_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (optional_id) REFERENCES optional(optional_id) ON DELETE CASCADE,
    UNIQUE (user_id, optional_id)
);

CREATE TABLE user_optional_history (
    user_optional_history_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    accepted BOOLEAN NOT NULL,
    user_id UUID NOT NULL,
    optional_id UUID NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (optional_id) REFERENCES optional(optional_id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION user_optional_changes() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_optional_history (user_id, optional_id, accepted, timestamp)
    VALUES (NEW.user_id, NEW.optional_id, NEW.accepted, CURRENT_TIMESTAMP);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_user_optional_changes
AFTER INSERT OR UPDATE ON user_optional
FOR EACH ROW
EXECUTE PROCEDURE user_optional_changes();


CREATE VIEW DecryptedUsers AS
SELECT
    user_id,
    user_first_name,
    user_last_name,
    user_cpf,
    user_date_birth,
    user_cellphone,
    user_address::jsonb AS user_address,
    user_email,
    user_password
FROM
    Users;