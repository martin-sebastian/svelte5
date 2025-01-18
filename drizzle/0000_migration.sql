ALTER TABLE "vehicle" 
ALTER COLUMN "updated" TYPE timestamp without time zone 
USING updated::timestamp without time zone; 