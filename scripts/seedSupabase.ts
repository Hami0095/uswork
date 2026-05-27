import { createClient } from '@supabase/supabase-js'

// You must run this script with env vars loaded, e.g., using dotenv
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Or service_role key for admin bypass

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('🌱 Seeding Supabase database...')

  // Clear existing data (Note: If RLS is enabled, you might need a service_role key to delete, or disable RLS temporarily)
  await supabase.from('ActivityLog').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('ConnectsLog').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('Proposal').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('Client').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('Template').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('Profile').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // --- PROFILES ---
  const profilesData = [
    {
      name: 'Alex Carter',
      niche: 'Full Stack Development',
      hourlyRate: 65,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js'],
      connectsBalance: 38,
      successRate: 94,
      activeContracts: 2,
      totalEarnings: 18420,
      availability: 'Busy',
    },
    {
      name: 'Sarah Mitchell',
      niche: 'UI/UX Design',
      hourlyRate: 55,
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing'],
      connectsBalance: 72,
      successRate: 89,
      activeContracts: 1,
      totalEarnings: 11250,
      availability: 'Available',
    },
    {
      name: 'James Nguyen',
      niche: 'Python & AI/ML',
      hourlyRate: 85,
      skills: ['Python', 'TensorFlow', 'PyTorch', 'FastAPI', 'Data Science'],
      connectsBalance: 14,
      successRate: 97,
      activeContracts: 3,
      totalEarnings: 31700,
      availability: 'Busy',
    },
    {
      name: 'Emily Rodriguez',
      niche: 'Content Writing & SEO',
      hourlyRate: 35,
      skills: ['SEO', 'Copywriting', 'WordPress', 'Content Strategy', 'Blogging'],
      connectsBalance: 55,
      successRate: 82,
      activeContracts: 0,
      totalEarnings: 7800,
      availability: 'Available',
    },
    {
      name: 'David Kim',
      niche: 'DevOps & Cloud',
      hourlyRate: 90,
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
      connectsBalance: 28,
      successRate: 91,
      activeContracts: 1,
      totalEarnings: 22500,
      availability: 'Available',
    },
  ]

  const { data: profiles, error: pErr } = await supabase.from('Profile').insert(profilesData).select()
  if (pErr) throw pErr

  // --- CLIENTS ---
  const clientsData = [
    { name: 'Marcus Howell', company: 'TechFlow Inc', country: 'United States' },
    { name: 'Priya Sharma', company: 'DesignBridge', country: 'India' },
    { name: 'Robert Tanaka', company: 'Nexus AI Labs', country: 'Japan' },
    { name: 'Sophie Laurent', company: 'ContentCraft EU', country: 'France' },
    { name: 'Ahmed Al-Rashid', company: 'CloudScale', country: 'UAE' },
    { name: 'Jessica Park', company: 'StartupHub', country: 'South Korea' },
  ]

  const { data: clients, error: cErr } = await supabase.from('Client').insert(clientsData).select()
  if (cErr) throw cErr

  // --- PROPOSALS ---
  const now = new Date()
  const proposalsDef = [
    { profileIdx: 0, clientIdx: 0, jobTitle: 'Build a SaaS Dashboard with React & Node.js', connectsSpent: 6, status: 'Hired', appliedDaysAgo: 30 },
    { profileIdx: 0, clientIdx: 5, jobTitle: 'E-commerce Platform with Next.js', connectsSpent: 6, status: 'Interview', appliedDaysAgo: 5 },
    { profileIdx: 0, clientIdx: null, jobTitle: 'Fix React performance issues in existing app', connectsSpent: 4, status: 'Applied', appliedDaysAgo: 2 },
    { profileIdx: 1, clientIdx: 1, jobTitle: 'UI Design for mobile banking app', connectsSpent: 6, status: 'Hired', appliedDaysAgo: 25 },
    { profileIdx: 2, clientIdx: 2, jobTitle: 'ML model for customer churn prediction', connectsSpent: 8, status: 'Hired', appliedDaysAgo: 45 },
  ]

  const proposalsData = proposalsDef.map(p => ({
    jobTitle: p.jobTitle,
    proposalText: `I am highly experienced in this area and would love to help with your project.`,
    connectsSpent: p.connectsSpent,
    status: p.status,
    appliedAt: new Date(now.getTime() - p.appliedDaysAgo * 24 * 60 * 60 * 1000).toISOString(),
    profileId: profiles![p.profileIdx].id,
    clientId: p.clientIdx !== null ? clients![p.clientIdx].id : null,
  }))

  const { error: propErr } = await supabase.from('Proposal').insert(proposalsData)
  if (propErr) throw propErr

  // --- TEMPLATES ---
  const templatesData = [
    {
      title: 'Full Stack Developer - General',
      category: 'Development',
      content: `Hi [Client Name],\n\nI noticed you're looking for a Full Stack Developer and I believe I'd be a great fit...`,
      isFavorite: true,
    },
    {
      title: 'UI/UX Designer - Figma Specialist',
      category: 'Design',
      content: `Hello [Client Name],\n\nYour project caught my attention — designing intuitive, user-centered interfaces...`,
      isFavorite: true,
    },
  ]
  
  const { error: tErr } = await supabase.from('Template').insert(templatesData)
  if (tErr) throw tErr

  // --- ACTIVITY LOGS ---
  const activitiesData = [
    { action: 'PROPOSAL_SUBMITTED', description: 'Alex Carter submitted proposal for "Build a SaaS Dashboard"', createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    { action: 'PROPOSAL_HIRED', description: 'Alex Carter was hired for "Build a SaaS Dashboard"', createdAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString() },
  ]

  const { error: aErr } = await supabase.from('ActivityLog').insert(activitiesData)
  if (aErr) throw aErr

  console.log('✅ Supabase Database seeded successfully!')
}

main().catch(console.error)
