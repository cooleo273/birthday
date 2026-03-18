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

-- Compliments Table
CREATE TABLE compliments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  compliment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
