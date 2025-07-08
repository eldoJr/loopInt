-- Team Members Table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    photo_url TEXT,
    is_individual BOOLEAN DEFAULT false,
    company VARCHAR(200),
    source VARCHAR(100),
    position VARCHAR(200),
    position_description TEXT CHECK (char_length(position_description) <= 300),
    
    -- Contact Information
    email VARCHAR(255) UNIQUE,
    phone_numbers JSONB DEFAULT '[]'::jsonb, -- Array of phone numbers
    skype VARCHAR(100),
    linkedin TEXT,
    additional_links JSONB DEFAULT '[]'::jsonb, -- Array of {type, url} objects
    
    -- Address Information
    address_line1 TEXT,
    address_line2 TEXT,
    zip_code VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    
    -- Description and Status
    description TEXT CHECK (char_length(description) <= 999),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    
    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    join_date DATE DEFAULT CURRENT_DATE
);

-- Indexes for better performance
CREATE INDEX idx_team_members_created_by ON team_members(created_by);
CREATE INDEX idx_team_members_status ON team_members(status);
CREATE INDEX idx_team_members_company ON team_members(company);
CREATE INDEX idx_team_members_email ON team_members(email);
CREATE INDEX idx_team_members_name ON team_members(first_name, last_name);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_team_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_team_members_updated_at();

-- Sample data insert
INSERT INTO team_members (
    first_name, last_name, email, position, company, 
    phone_numbers, status, is_individual, created_by
) VALUES (
    'John', 'Doe', 'john.doe@example.com', 'Senior Developer', 'TechCorp',
    '["555-123-4567"]'::jsonb, 'active', false, 
    (SELECT id FROM users LIMIT 1)
);