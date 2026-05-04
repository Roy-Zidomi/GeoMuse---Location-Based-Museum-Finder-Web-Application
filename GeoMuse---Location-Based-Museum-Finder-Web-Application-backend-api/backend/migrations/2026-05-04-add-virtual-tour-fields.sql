-- Tambahkan kolom virtual tour dan live cam
ALTER TABLE museum
  ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT,
  ADD COLUMN IF NOT EXISTS live_cam_url TEXT;
