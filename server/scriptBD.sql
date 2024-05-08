CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Users(
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    user_first_name VARCHAR(50) NOT NULL,
    user_last_name VARCHAR(50) NOT NULL,
    user_cpf VARCHAR(14) NOT NULL,
    user_date_birth VARCHAR(10) NOT NULL,
    user_address JSONB NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    user_password VARCHAR(100) NOT NULL
);