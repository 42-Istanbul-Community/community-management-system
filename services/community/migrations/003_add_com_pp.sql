ALTER TABLE communities ADD COLUMN picture VARCHAR(255) DEFAULT NULL;
ALTER TABLE communities ADD COLUMN background_picture VARCHAR(255) DEFAULT NULL;

ALTER TABLE community_create_requests ADD COLUMN picture VARCHAR(255) DEFAULT NULL;
ALTER TABLE community_create_requests ADD COLUMN background_picture VARCHAR(255) DEFAULT NULL;