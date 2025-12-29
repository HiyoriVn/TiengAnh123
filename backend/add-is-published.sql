-- Add isPublished column to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Set existing courses to published (hoặc false nếu muốn admin duyệt lại)
UPDATE courses SET is_published = true WHERE status = 'PUBLISHED';

-- Add isPublished column to lessons table  
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Set existing lessons to published based on approval_status
UPDATE lessons SET is_published = true WHERE approval_status = 'APPROVED';
