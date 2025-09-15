CREATE TABLE chat_rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    max_users INTEGER DEFAULT 100,
    is_public BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_rooms_province_city ON chat_rooms(province, city);
CREATE INDEX idx_chat_rooms_public ON chat_rooms(is_public);
