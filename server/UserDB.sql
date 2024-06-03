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

CREATE TABLE Terms (
    terms_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    terms_title VARCHAR(255),
    terms_content VARCHAR(10000),
    terms_mandatory BOOLEAN NOT NULL
);

CREATE TABLE UserTerms (
    user_term_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    terms_id UUID NOT NULL,
    accepted BOOLEAN NOT NULL,
    accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (terms_id) REFERENCES Terms(terms_id) ON DELETE CASCADE,
    UNIQUE (user_id, terms_id)
);