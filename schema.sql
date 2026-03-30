-- Daily Surprises Table
CREATE TABLE daily_surprises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_number INTEGER UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'letter', 'photo', 'video', 'voice', 'game', 'story', 'compliment', 'question'
  title TEXT NOT NULL,
  content TEXT,
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memories Table
CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  story TEXT,
  image_url TEXT,
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Love Timeline Table
CREATE TABLE timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT, -- Lucide icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reasons Table
CREATE TABLE reasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reason_text TEXT NOT NULL,
  unlock_day INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If you already inserted reasons before adding uniqueness, you may have duplicates.
-- This keeps the newest row per unlock_day and deletes older duplicates.
WITH ranked AS (
  SELECT
    id,
    unlock_day,
    ROW_NUMBER() OVER (PARTITION BY unlock_day ORDER BY created_at DESC, id DESC) AS rn
  FROM reasons
)
DELETE FROM reasons r
USING ranked
WHERE r.id = ranked.id
  AND ranked.rn > 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reasons_unlock_day_unique'
  ) THEN
    ALTER TABLE reasons
      ADD CONSTRAINT reasons_unlock_day_unique UNIQUE (unlock_day);
  END IF;
END$$;

-- Compliments Table
CREATE TABLE compliments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  compliment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Make seeding safe to re-run by preventing exact duplicates.
WITH ranked_compliments AS (
  SELECT
    id,
    compliment_text,
    ROW_NUMBER() OVER (PARTITION BY compliment_text ORDER BY created_at DESC, id DESC) AS rn
  FROM compliments
)
DELETE FROM compliments c
USING ranked_compliments
WHERE c.id = ranked_compliments.id
  AND ranked_compliments.rn > 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'compliments_text_unique'
  ) THEN
    ALTER TABLE compliments
      ADD CONSTRAINT compliments_text_unique UNIQUE (compliment_text);
  END IF;
END$$;

-- Journal Entries Table
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Future Messages Table
CREATE TABLE future_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unlocked BOOLEAN DEFAULT FALSE
);

-- Memory Map Table
CREATE TABLE memory_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Love Coupons
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon redemptions (so you can see when she used it)
CREATE TABLE coupon_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  note TEXT
);

ALTER TABLE coupon_redemptions
  ADD CONSTRAINT coupon_redemptions_one_time UNIQUE (coupon_id);
