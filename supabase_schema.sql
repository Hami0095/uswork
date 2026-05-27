-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Profile
CREATE TABLE IF NOT EXISTS public."Profile" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    niche TEXT NOT NULL,
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    skills TEXT[] DEFAULT '{}',
    "connectsBalance" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION,
    "activeContracts" INTEGER NOT NULL DEFAULT 0,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    availability TEXT NOT NULL DEFAULT 'Available',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Client
CREATE TABLE IF NOT EXISTS public."Client" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company TEXT,
    country TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Proposal
CREATE TABLE IF NOT EXISTS public."Proposal" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "jobTitle" TEXT NOT NULL,
    "proposalText" TEXT NOT NULL,
    "connectsSpent" INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Applied',
    "appliedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "profileId" UUID NOT NULL REFERENCES public."Profile"(id) ON DELETE CASCADE,
    "clientId" UUID REFERENCES public."Client"(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: ConnectsLog
CREATE TABLE IF NOT EXISTS public."ConnectsLog" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "profileId" UUID NOT NULL REFERENCES public."Profile"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Template
CREATE TABLE IF NOT EXISTS public."Template" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: ActivityLog
CREATE TABLE IF NOT EXISTS public."ActivityLog" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    description TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create triggers to automatically update "updatedAt"
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON public."Profile" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_updated_at BEFORE UPDATE ON public."Client" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposal_updated_at BEFORE UPDATE ON public."Proposal" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connectslog_updated_at BEFORE UPDATE ON public."ConnectsLog" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_template_updated_at BEFORE UPDATE ON public."Template" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
