CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Users(
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    user_first_name VARCHAR(800) NOT NULL,
    user_last_name VARCHAR(800) NOT NULL,
    user_cpf VARCHAR(800) NOT NULL,
    user_date_birth VARCHAR(800) NOT NULL,
    user_address VARCHAR(800) NOT NULL,
    user_email VARCHAR(800) NOT NULL,
    user_password VARCHAR(800) NOT NULL
);