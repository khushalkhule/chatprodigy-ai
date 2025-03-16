
-- Users table already exists in schema.sql

-- Chatbots table
CREATE TABLE IF NOT EXISTS chatbots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  welcome_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Chatbot steps table
CREATE TABLE IF NOT EXISTS chatbot_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chatbot_id INT NOT NULL,
  step_order INT NOT NULL,
  message TEXT NOT NULL,
  response_type ENUM('text', 'options', 'email', 'phone', 'number') DEFAULT 'text',
  options JSON,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chatbot_id INT NOT NULL,
  visitor_id VARCHAR(100),
  status ENUM('active', 'completed', 'abandoned') DEFAULT 'active',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

-- Conversation responses table
CREATE TABLE IF NOT EXISTS conversation_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  step_id INT NOT NULL,
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (step_id) REFERENCES chatbot_steps(id)
);
