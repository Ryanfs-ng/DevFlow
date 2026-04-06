-- Senha: admin123 (BCrypt verificado com Spring-compatible hash)
-- ON DUPLICATE KEY atualiza a senha se o e-mail já existir (ex.: hash antigo inválido).
INSERT INTO users (id, name, email, password, avatar, initials, role, color)
VALUES (
    UUID_TO_BIN(UUID()),
    'Admin',
    'admin@devflow.com',
    '$2b$10$u0kOKEfNux5E2h1M2L.39.D0mwc.AV3/0ISi95GHFOZx3TS1PlLBC',
    NULL,
    'AD',
    'ADMIN',
    '#6366f1'
)
ON DUPLICATE KEY UPDATE
    password = VALUES(password),
    name = VALUES(name),
    initials = VALUES(initials),
    role = VALUES(role),
    color = VALUES(color);
