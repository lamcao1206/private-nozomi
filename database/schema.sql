-- Create galleries table
CREATE TABLE IF NOT EXISTS galleries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  gallery_id INTEGER REFERENCES galleries(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL UNIQUE,
  size INTEGER,
  content_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create gallery_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS gallery_tags (
  id SERIAL PRIMARY KEY,
  gallery_id INTEGER REFERENCES galleries(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(gallery_id, tag_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_images_gallery_id ON images(gallery_id);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_tags_gallery_id ON gallery_tags(gallery_id);
CREATE INDEX IF NOT EXISTS idx_gallery_tags_tag_id ON gallery_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_galleries_created_at ON galleries(created_at);
