-- =============================================================================
-- Seed: Industry Events
-- Purpose: Populate the industry_events table with 50 major AI conferences
-- Real-world scenarios: Founders discovering events to attend, networking,
--                       learning about AI trends, and startup visibility
-- =============================================================================

-- Clear existing data (for idempotency)
truncate table public.industry_events restart identity cascade;

-- =============================================================================
-- TIER 1: Premier Research Conferences (Events 1-10)
-- =============================================================================

insert into public.industry_events (
    id, name, full_name, slug, description,
    categories, topics, audience_types,
    event_date, end_date, dates_confirmed, typical_month,
    location_city, location_country, venue, format,
    ticket_cost_tier, ticket_cost_min, ticket_cost_max,
    startup_relevance, expected_attendance,
    website_url, twitter_handle,
    notable_speakers, tags
) values

-- 1. NeurIPS
(
    'a0000001-0001-0001-0001-000000000001'::uuid,
    'NeurIPS',
    'Conference on Neural Information Processing Systems',
    'neurips',
    'The world''s largest and most prestigious machine learning research conference. Covers the broadest range of ML research including deep learning, reinforcement learning, optimization, and neuroscience-inspired AI.',
    array['research']::event_category[],
    array['Deep Learning', 'Reinforcement Learning', 'Optimization', 'Computer Vision', 'NLP', 'AI Safety'],
    array['Researchers', 'PhD Students', 'Research Labs'],
    '2026-12-07', '2026-12-12', false, 'December',
    'Sydney', 'Australia', 'International Convention Centre Sydney', 'hybrid',
    '$$$', 800.00, 1500.00,
    3, 15000,
    'https://neurips.cc', '@NeurIPSConf',
    array['Geoffrey Hinton', 'Yann LeCun', 'Yoshua Bengio', 'Demis Hassabis'],
    array['ML', 'Research', 'Academic', 'Top-Tier']
),

-- 2. ICML
(
    'a0000001-0001-0001-0001-000000000002'::uuid,
    'ICML',
    'International Conference on Machine Learning',
    'icml',
    'One of the top-tier venues for machine learning research. Strong focus on theoretical foundations and algorithmic advances in ML.',
    array['research']::event_category[],
    array['Machine Learning Theory', 'Deep Learning', 'Optimization', 'Fairness', 'Reinforcement Learning'],
    array['Researchers', 'Academics', 'Industry Research Labs'],
    '2026-07-06', '2026-07-11', true, 'July',
    'Seoul', 'South Korea', 'COEX Convention Center', 'in_person',
    '$$$', 700.00, 1200.00,
    3, 12000,
    'https://icml.cc', '@icaborML',
    array['Yoshua Bengio', 'Fei-Fei Li', 'Demis Hassabis', 'Dario Amodei'],
    array['ML', 'Research', 'Academic', 'Top-Tier']
),

-- 3. CVPR
(
    'a0000001-0001-0001-0001-000000000003'::uuid,
    'CVPR',
    'IEEE/CVF Conference on Computer Vision and Pattern Recognition',
    'cvpr',
    'The premier conference for computer vision research. Essential for anyone working in image recognition, video understanding, 3D vision, or generative AI for images.',
    array['research']::event_category[],
    array['Image Recognition', 'Object Detection', '3D Vision', 'Video Understanding', 'Generative Models', 'Vision-Language'],
    array['Researchers', 'Computer Vision Engineers'],
    '2026-06-03', '2026-06-07', true, 'June',
    'Denver', 'USA', 'Denver Convention Center', 'in_person',
    '$$$', 850.00, 1600.00,
    4, 14000,
    'https://cvpr.org', '@CVABORPR',
    array[],
    array['Computer Vision', 'Research', 'Academic', 'Top-Tier']
),

-- 4. AAAI
(
    'a0000001-0001-0001-0001-000000000004'::uuid,
    'AAAI',
    'AAAI Conference on Artificial Intelligence',
    'aaai',
    'One of the oldest and most respected AI research conferences. Slightly higher acceptance rate than NeurIPS/ICML, making it beneficial for early-career researchers.',
    array['research']::event_category[],
    array['Knowledge Representation', 'Planning', 'Machine Learning', 'NLP', 'Robotics', 'AI Ethics'],
    array['Researchers', 'Academics', 'Industry R&D'],
    '2026-01-20', '2026-01-27', true, 'January',
    'Singapore', 'Singapore', 'Marina Bay Sands', 'hybrid',
    '$$', 500.00, 900.00,
    3, 8000,
    'https://aaai.org/conference/aaai/', '@RealAAAI',
    array['Yann LeCun'],
    array['AI', 'Research', 'Academic']
),

-- 5. ICLR
(
    'a0000001-0001-0001-0001-000000000005'::uuid,
    'ICLR',
    'International Conference on Learning Representations',
    'iclr',
    'Focused specifically on representation learning and deep learning. Known for pioneering open peer review. Often where breakthrough architectures are first presented.',
    array['research']::event_category[],
    array['Deep Learning', 'Representation Learning', 'Transformers', 'Foundation Models', 'Self-Supervised Learning'],
    array['Deep Learning Researchers'],
    null, null, false, 'April',
    null, null, null, 'hybrid',
    '$$', 400.00, 800.00,
    4, 6000,
    'https://iclr.cc', null,
    array[],
    array['Deep Learning', 'Research', 'Open Review']
),

-- 6. ACL
(
    'a0000001-0001-0001-0001-000000000006'::uuid,
    'ACL',
    'Annual Meeting of the Association for Computational Linguistics',
    'acl',
    'The flagship conference for natural language processing and computational linguistics. Essential for anyone building LLM-based products.',
    array['research']::event_category[],
    array['Large Language Models', 'Machine Translation', 'Question Answering', 'Dialogue Systems', 'Multilingual NLP'],
    array['NLP Researchers', 'Linguists'],
    '2026-07-02', '2026-07-07', true, 'July',
    'San Diego', 'USA', 'San Diego Convention Center', 'hybrid',
    '$$', 500.00, 1000.00,
    4, 5000,
    'https://www.aclweb.org/', null,
    array[],
    array['NLP', 'LLM', 'Research', 'Academic']
),

-- 7. NAACL
(
    'a0000001-0001-0001-0001-000000000007'::uuid,
    'NAACL',
    'Annual Conference of the North American Chapter of the ACL',
    'naacl',
    'North American chapter of ACL. Strong industry presence and practical NLP applications.',
    array['research']::event_category[],
    array['NLP', 'Machine Translation', 'Sentiment Analysis', 'Information Extraction'],
    array['NLP Researchers'],
    '2026-04-26', '2026-05-01', true, 'April',
    'Barcelona', 'Spain', null, 'hybrid',
    '$$', 400.00, 800.00,
    4, 3000,
    'https://naacl.org/', null,
    array[],
    array['NLP', 'Research']
),

-- 8. IJCAI
(
    'a0000001-0001-0001-0001-000000000008'::uuid,
    'IJCAI',
    'International Joint Conference on Artificial Intelligence',
    'ijcai',
    'Broad coverage of all AI subfields. Strong emphasis on knowledge representation, reasoning, and planning.',
    array['research']::event_category[],
    array['Knowledge Representation', 'Planning', 'Multi-Agent Systems', 'Machine Learning', 'Robotics'],
    array['AI Researchers', 'Multi-disciplinary'],
    '2026-08-15', '2026-08-21', true, 'August',
    'Bremen', 'Germany', null, 'in_person',
    '$$', 500.00, 1000.00,
    3, 5000,
    'https://ijcai.org/', null,
    array[],
    array['AI', 'Research', 'Academic']
),

-- 9. ECCV
(
    'a0000001-0001-0001-0001-000000000009'::uuid,
    'ECCV',
    'European Conference on Computer Vision',
    'eccv',
    'Top-tier European computer vision conference, held biennially. Equal prestige to CVPR and ICCV.',
    array['research']::event_category[],
    array['Computer Vision', 'Image Processing', '3D Reconstruction', 'Video Analysis'],
    array['Computer Vision Researchers'],
    '2026-09-08', '2026-09-13', true, 'September',
    'Malmo', 'Sweden', null, 'in_person',
    '$$$', 700.00, 1200.00,
    4, 6000,
    'https://eccv.ecva.net/', null,
    array[],
    array['Computer Vision', 'Research', 'European']
),

-- 10. EMNLP
(
    'a0000001-0001-0001-0001-000000000010'::uuid,
    'EMNLP',
    'Conference on Empirical Methods in Natural Language Processing',
    'emnlp',
    'Focus on empirical and data-driven approaches to NLP. Strong industry relevance.',
    array['research']::event_category[],
    array['NLP', 'LLM', 'Text Mining', 'Information Retrieval'],
    array['NLP Researchers'],
    null, null, false, 'November',
    null, null, null, 'hybrid',
    '$$', 400.00, 800.00,
    4, 4000,
    'https://2026.emnlp.org/', null,
    array[],
    array['NLP', 'Research', 'Empirical']
);

-- =============================================================================
-- TIER 2: Industry & Enterprise Conferences (Events 11-20)
-- =============================================================================

insert into public.industry_events (
    id, name, full_name, slug, description,
    categories, topics, audience_types,
    event_date, end_date, dates_confirmed, typical_month,
    location_city, location_country, venue, format,
    ticket_cost_tier, ticket_cost_min, ticket_cost_max,
    startup_relevance, expected_attendance,
    website_url, twitter_handle,
    notable_speakers, tags
) values

-- 11. NVIDIA GTC
(
    'a0000001-0001-0001-0001-000000000011'::uuid,
    'NVIDIA GTC',
    'NVIDIA GPU Technology Conference',
    'nvidia-gtc',
    'The year''s defining event for AI and accelerated computing. Jensen Huang''s keynote announces major GPU releases and AI infrastructure advances. Essential for any AI startup building on NVIDIA hardware.',
    array['industry', 'research', 'enterprise']::event_category[],
    array['GPU Architecture', 'CUDA', 'Autonomous Vehicles', 'Healthcare AI', 'Robotics', 'Generative AI', 'LLM Infrastructure'],
    array['Developers', 'Researchers', 'Enterprise', 'Executives'],
    '2026-03-16', '2026-03-19', true, 'March',
    'San Jose', 'USA', 'San Jose Convention Center', 'hybrid',
    '$$', 0.00, 1500.00,
    5, 20000,
    'https://www.nvidia.com/gtc/', '@NVIDIAAIDev',
    array['Jensen Huang'],
    array['GPU', 'Infrastructure', 'NVIDIA', 'Hardware']
),

-- 12. Google Cloud Next
(
    'a0000001-0001-0001-0001-000000000012'::uuid,
    'Google Cloud Next',
    'Google Cloud Next',
    'google-cloud-next',
    'Google Cloud''s flagship conference featuring Gemini AI announcements, cloud infrastructure updates, and enterprise AI capabilities.',
    array['industry', 'enterprise']::event_category[],
    array['Google Cloud', 'Gemini AI', 'Vertex AI', 'BigQuery', 'Kubernetes', 'Enterprise AI'],
    array['Developers', 'Enterprise', 'Cloud Architects'],
    '2026-04-22', '2026-04-24', true, 'April',
    'Las Vegas', 'USA', 'Mandalay Bay Convention Center', 'hybrid',
    '$$', 999.00, 999.00,
    5, 30000,
    'https://cloud.google.com/next', null,
    array['Sundar Pichai'],
    array['Google', 'Cloud', 'Gemini', 'Enterprise']
),

-- 13. Google I/O
(
    'a0000001-0001-0001-0001-000000000013'::uuid,
    'Google I/O',
    'Google I/O Developer Conference',
    'google-io',
    'Google''s annual developer conference. Major AI announcements including Gemini updates, Android AI features, and developer tools.',
    array['industry', 'developer']::event_category[],
    array['Android', 'Gemini', 'Flutter', 'Firebase', 'Developer Tools', 'AI APIs'],
    array['Developers', 'Product Managers'],
    null, null, false, 'May',
    'Mountain View', 'USA', 'Shoreline Amphitheatre', 'hybrid',
    '$$', 0.00, 1000.00,
    5, 7000,
    'https://io.google/', null,
    array['Sundar Pichai', 'Demis Hassabis'],
    array['Google', 'Developer', 'Android', 'Gemini']
),

-- 14. AWS re:Invent
(
    'a0000001-0001-0001-0001-000000000014'::uuid,
    'AWS re:Invent',
    'Amazon Web Services re:Invent',
    'aws-reinvent',
    'AWS''s flagship conference. Major announcements on AI services including Bedrock, SageMaker, and AI infrastructure.',
    array['industry', 'enterprise']::event_category[],
    array['AWS', 'Bedrock', 'SageMaker', 'Lambda', 'Cloud Infrastructure', 'Serverless'],
    array['Cloud Engineers', 'Enterprise', 'Developers'],
    null, null, false, 'December',
    'Las Vegas', 'USA', 'The Venetian', 'in_person',
    '$$$', 1799.00, 2099.00,
    5, 60000,
    'https://reinvent.awsevents.com/', '@AWSreInvent',
    array['Andy Jassy', 'Matt Garman'],
    array['AWS', 'Cloud', 'Enterprise', 'Bedrock']
),

-- 15. Microsoft Build
(
    'a0000001-0001-0001-0001-000000000015'::uuid,
    'Microsoft Build',
    'Microsoft Build Developer Conference',
    'microsoft-build',
    'Microsoft''s annual developer conference. Major Azure AI, Copilot, and OpenAI integration announcements.',
    array['industry', 'developer']::event_category[],
    array['Azure', 'Copilot', 'OpenAI', '.NET', 'GitHub', 'VS Code'],
    array['Developers', 'Enterprise'],
    null, null, false, 'May',
    'Seattle', 'USA', 'Seattle Convention Center', 'hybrid',
    '$$', 0.00, 1500.00,
    5, 25000,
    'https://build.microsoft.com/', null,
    array['Satya Nadella'],
    array['Microsoft', 'Azure', 'Copilot', 'Developer']
),

-- 16. Microsoft Ignite
(
    'a0000001-0001-0001-0001-000000000016'::uuid,
    'Microsoft Ignite',
    'Microsoft Ignite',
    'microsoft-ignite',
    'Microsoft''s enterprise-focused conference. AI-infused workflows and enterprise AI partnerships.',
    array['enterprise']::event_category[],
    array['Azure', 'Microsoft 365', 'Dynamics', 'Security', 'Enterprise AI'],
    array['IT Professionals', 'Enterprise Leaders'],
    null, null, false, 'November',
    'San Francisco', 'USA', 'Moscone Center', 'hybrid',
    '$$$', 1500.00, 2500.00,
    4, 30000,
    'https://ignite.microsoft.com/', null,
    array['Satya Nadella'],
    array['Microsoft', 'Enterprise', 'Azure']
),

-- 17. OpenAI DevDay
(
    'a0000001-0001-0001-0001-000000000017'::uuid,
    'OpenAI DevDay',
    'OpenAI DevDay',
    'openai-devday',
    'OpenAI''s developer conference featuring GPT model updates, API announcements, and developer tools.',
    array['industry', 'developer']::event_category[],
    array['GPT', 'ChatGPT', 'API', 'Assistants', 'Function Calling', 'Fine-tuning'],
    array['Developers', 'AI Builders'],
    null, null, false, 'November',
    'San Francisco', 'USA', null, 'hybrid',
    '$$', 500.00, 1000.00,
    5, 2000,
    'https://openai.com/', null,
    array['Sam Altman'],
    array['OpenAI', 'GPT', 'API', 'Developer']
),

-- 18. Ai4
(
    'a0000001-0001-0001-0001-000000000018'::uuid,
    'Ai4',
    'Ai4 Conference',
    'ai4',
    'North America''s largest AI industry event. Brings together the latest AI applications across industries with dedicated content for business and technical leaders.',
    array['industry', 'enterprise']::event_category[],
    array['Enterprise AI', 'AI Applications', 'AI Strategy', 'Business AI', 'AI Implementation'],
    array['Business Leaders', 'Enterprise', 'Founders'],
    '2026-08-04', '2026-08-06', true, 'August',
    'Las Vegas', 'USA', 'The Venetian', 'in_person',
    '$$$', 1100.00, 5000.00,
    5, 5000,
    'https://ai4.io/', null,
    array['Geoffrey Hinton', 'Fei-Fei Li', 'Andrew Ng'],
    array['Enterprise', 'Business', 'AI Applications']
),

-- 19. AI Summit New York
(
    'a0000001-0001-0001-0001-000000000019'::uuid,
    'AI Summit New York',
    'The AI Summit New York',
    'ai-summit-new-york',
    'For a decade, the trusted platform for enterprise leaders and tech innovators to explore and apply commercial AI. Transformative AI insights, enterprise solutions, and networking.',
    array['enterprise', 'industry']::event_category[],
    array['Enterprise AI', 'Commercial AI', 'AI Strategy', 'AI Implementation'],
    array['Enterprise Leaders', 'C-Suite'],
    '2026-12-09', '2026-12-10', true, 'December',
    'New York', 'USA', 'Javits Center', 'in_person',
    '$$$', 1500.00, 3000.00,
    4, 4000,
    'https://newyork.theaisummit.com/', null,
    array[],
    array['Enterprise', 'Commercial AI', 'NYC']
),

-- 20. AI Summit London
(
    'a0000001-0001-0001-0001-000000000020'::uuid,
    'AI Summit London',
    'The AI Summit London',
    'ai-summit-london',
    'The flagship event of London Tech Week. 300+ speakers, 100+ tech companies. Explores AI''s real-world impact across industries.',
    array['enterprise', 'industry']::event_category[],
    array['Enterprise AI', 'AI Applications', 'AI Ethics', 'AI Implementation'],
    array['Enterprise Leaders', 'Tech Companies'],
    '2026-06-10', '2026-06-11', true, 'June',
    'London', 'UK', 'Tobacco Dock', 'in_person',
    '$$$', 1200.00, 2500.00,
    4, 4500,
    'https://london.theaisummit.com/', null,
    array[],
    array['Enterprise', 'London', 'Tech Week']
);

-- =============================================================================
-- TIER 3: Startup & VC Conferences (Events 21-30)
-- =============================================================================

insert into public.industry_events (
    id, name, full_name, slug, description,
    categories, topics, audience_types,
    event_date, end_date, dates_confirmed, typical_month,
    location_city, location_country, venue, format,
    ticket_cost_tier, ticket_cost_min, ticket_cost_max,
    startup_relevance, expected_attendance,
    website_url, twitter_handle,
    notable_speakers, tags
) values

-- 21. TechCrunch Disrupt
(
    'a0000001-0001-0001-0001-000000000021'::uuid,
    'TechCrunch Disrupt',
    'TechCrunch Disrupt',
    'techcrunch-disrupt',
    'The startup epicenter for tech and VC leaders. Startup Battlefield 200 features 200 early-stage startups, 20 competing for $100,000 prize. Has launched global unicorns.',
    array['startup_vc']::event_category[],
    array['Startups', 'VC', 'Pitch Competitions', 'Fundraising', 'Innovation'],
    array['Founders', 'VCs', 'Operators'],
    '2026-10-13', '2026-10-15', true, 'October',
    'San Francisco', 'USA', 'Moscone West', 'in_person',
    '$$$', 1500.00, 3000.00,
    5, 10000,
    'https://techcrunch.com/events/tc-disrupt-2026/', '@TechCrunch',
    array[],
    array['Startups', 'VC', 'Pitch', 'SF']
),

-- 22. Web Summit (Lisbon)
(
    'a0000001-0001-0001-0001-000000000022'::uuid,
    'Web Summit',
    'Web Summit',
    'web-summit-lisbon',
    'One of the world''s largest tech conferences. 20 content tracks including AI Summit track exploring potential and risks of AI.',
    array['startup_vc', 'industry']::event_category[],
    array['Startups', 'VC', 'AI', 'Tech Trends', 'Innovation'],
    array['Founders', 'VCs', 'Tech Leaders'],
    '2026-11-09', '2026-11-12', true, 'November',
    'Lisbon', 'Portugal', 'Altice Arena', 'in_person',
    '$$$', 1000.00, 3000.00,
    5, 70000,
    'https://websummit.com/', null,
    array[],
    array['Startups', 'Europe', 'Large Scale']
),

-- 23. Web Summit Vancouver (formerly Collision)
(
    'a0000001-0001-0001-0001-000000000023'::uuid,
    'Web Summit Vancouver',
    'Web Summit Vancouver',
    'web-summit-vancouver',
    'North America''s fastest growing tech conference. Topics include AI innovation, AI ethics, startup ecosystem, and scaling for founders and VCs.',
    array['startup_vc']::event_category[],
    array['Startups', 'VC', 'AI Innovation', 'AI Ethics', 'Scaling'],
    array['Founders', 'VCs', 'Tech Leaders'],
    '2026-05-11', '2026-05-14', true, 'May',
    'Vancouver', 'Canada', 'Vancouver Convention Centre', 'in_person',
    '$$', 500.00, 1500.00,
    5, 35000,
    'https://vancouver.websummit.com/', null,
    array[],
    array['Startups', 'North America', 'Collision']
),

-- 24. Y Combinator Demo Day
(
    'a0000001-0001-0001-0001-000000000024'::uuid,
    'Y Combinator Demo Day',
    'Y Combinator Demo Day',
    'yc-demo-day',
    'Bi-annual showcase of YC batch startups. 160+ startups per batch, majority now AI-centric. Where many top AI startups first pitch to investors.',
    array['startup_vc']::event_category[],
    array['YC Startups', 'Seed Stage', 'AI Startups', 'Investor Pitches'],
    array['VCs', 'Angel Investors', 'Media'],
    null, null, false, 'March',
    'San Francisco', 'USA', null, 'in_person',
    'free', 0.00, 0.00,
    5, 2000,
    'https://www.ycombinator.com/', '@ycombinator',
    array[],
    array['YC', 'Startups', 'Demo Day', 'Invite Only']
),

-- 25. Sequoia Capital AI Ascent
(
    'a0000001-0001-0001-0001-000000000025'::uuid,
    'Sequoia AI Ascent',
    'Sequoia Capital AI Ascent',
    'sequoia-ai-ascent',
    'Exclusive gathering of 100+ leading AI founders and researchers. Intimate format with top AI leaders.',
    array['startup_vc']::event_category[],
    array['AI Founders', 'AI Research', 'VC', 'AI Strategy'],
    array['AI Founders', 'Researchers', 'VCs'],
    null, null, false, 'May',
    'San Francisco', 'USA', null, 'in_person',
    'free', 0.00, 0.00,
    5, 150,
    'https://sequoiacap.com/', null,
    array['Sam Altman', 'Jensen Huang', 'Jeff Dean', 'Mike Krieger', 'Bret Taylor'],
    array['VC', 'AI', 'Exclusive', 'Invite Only']
),

-- 26. SXSW
(
    'a0000001-0001-0001-0001-000000000026'::uuid,
    'SXSW',
    'South by Southwest',
    'sxsw',
    'Convergence of tech, film, and music industries. Strong AI track sponsored by IBM. AI sessions voted on by community via PanelPicker.',
    array['startup_vc', 'industry']::event_category[],
    array['Tech', 'Film', 'Music', 'AI', 'Innovation', 'Culture'],
    array['Founders', 'Creatives', 'Tech Leaders'],
    '2026-03-12', '2026-03-18', true, 'March',
    'Austin', 'USA', 'Austin Convention Center', 'in_person',
    '$$$', 1500.00, 2000.00,
    5, 75000,
    'https://www.sxsw.com/', null,
    array[],
    array['Tech', 'Culture', 'Austin', 'Creative']
),

-- 27. CES
(
    'a0000001-0001-0001-0001-000000000027'::uuid,
    'CES',
    'Consumer Electronics Show',
    'ces',
    'The world''s largest consumer technology show. Features consumer AI, smart cars, wearables, and robotics. Jensen Huang delivers major keynote.',
    array['industry', 'trade_show']::event_category[],
    array['Consumer Tech', 'AI', 'Smart Cars', 'Wearables', 'Robotics', 'IoT'],
    array['Tech Companies', 'Media', 'Consumers'],
    '2026-01-06', '2026-01-09', true, 'January',
    'Las Vegas', 'USA', 'Las Vegas Convention Center', 'in_person',
    '$$', 300.00, 500.00,
    4, 100000,
    'https://www.ces.tech/', '@CES',
    array['Jensen Huang', 'Lisa Su'],
    array['Consumer', 'Hardware', 'Trade Show']
),

-- 28. Gartner Data & Analytics Summit
(
    'a0000001-0001-0001-0001-000000000028'::uuid,
    'Gartner Data Summit',
    'Gartner Data & Analytics Summit',
    'gartner-data-summit',
    'Explores how AI, data, and analytics converge to transform business strategies. Premium enterprise event.',
    array['enterprise']::event_category[],
    array['Data Analytics', 'AI Strategy', 'Business Intelligence', 'Data Governance'],
    array['CDOs', 'Data Leaders', 'Enterprise'],
    '2026-03-09', '2026-03-11', true, 'March',
    'Orlando', 'USA', 'Gaylord Palms', 'in_person',
    '$$$$', 4475.00, 5500.00,
    3, 5000,
    'https://www.gartner.com/en/conferences/na/data-analytics-us', null,
    array[],
    array['Gartner', 'Data', 'Analytics', 'Enterprise']
),

-- 29. AI DevSummit
(
    'a0000001-0001-0001-0001-000000000029'::uuid,
    'AI DevSummit',
    'AI DevSummit',
    'ai-devsummit',
    'Leading global conference for AI management & engineering. Tracks covering AI Management, Chatbots, Machine Learning, Open Source AI, Enterprise AI, and Deep Learning.',
    array['developer', 'industry']::event_category[],
    array['AI Engineering', 'Chatbots', 'MLOps', 'Open Source AI', 'Enterprise AI'],
    array['AI Engineers', 'Developers', 'CTOs'],
    '2026-05-27', '2026-05-28', true, 'May',
    'San Francisco', 'USA', 'Hyatt Regency SF', 'in_person',
    '$$', 500.00, 1000.00,
    5, 2000,
    'https://aidevsummit.co/', null,
    array[],
    array['Developer', 'Engineering', 'MLOps']
),

-- 30. Leaders in AI Summit
(
    'a0000001-0001-0001-0001-000000000030'::uuid,
    'Leaders in AI Summit',
    'Leaders in AI Summit',
    'leaders-in-ai-summit',
    'Most exclusive executive networking environment. Attendance limited to C-level and VP-level participants. Focused on strategic AI decision-making.',
    array['enterprise']::event_category[],
    array['AI Strategy', 'Executive AI', 'AI Transformation', 'Leadership'],
    array['C-Level', 'VP-Level Executives'],
    '2026-04-21', '2026-04-22', true, 'April',
    'New York', 'USA', null, 'in_person',
    '$$$$', 3000.00, 5000.00,
    3, 300,
    'https://leadersinai.com/', null,
    array[],
    array['Executive', 'Exclusive', 'Strategy']
);

-- =============================================================================
-- TIER 4: Trade Shows & Expos (Events 31-35)
-- =============================================================================

insert into public.industry_events (
    id, name, full_name, slug, description,
    categories, topics, audience_types,
    event_date, end_date, dates_confirmed, typical_month,
    location_city, location_country, venue, format,
    ticket_cost_tier, ticket_cost_min, ticket_cost_max,
    startup_relevance, expected_attendance,
    website_url, twitter_handle,
    notable_speakers, tags
) values

-- 31. AI & Big Data Expo Global
(
    'a0000001-0001-0001-0001-000000000031'::uuid,
    'AI & Big Data Expo Global',
    'AI & Big Data Expo Global',
    'ai-big-data-expo-global',
    'One of the largest enterprise-focused AI and data technology events. Covers AI, ML, and data analytics with business outcomes focus.',
    array['trade_show']::event_category[],
    array['Enterprise AI', 'Big Data', 'Analytics', 'ML', 'Data Science'],
    array['Enterprise', 'Developers'],
    '2026-02-04', '2026-02-05', true, 'February',
    'London', 'UK', 'Olympia London', 'in_person',
    '$$', 0.00, 500.00,
    4, 8000,
    'https://www.ai-expo.net/global/', null,
    array[],
    array['Expo', 'Enterprise', 'Big Data']
),

-- 32. AI & Big Data Expo North America
(
    'a0000001-0001-0001-0001-000000000032'::uuid,
    'AI & Big Data Expo NA',
    'AI & Big Data Expo North America',
    'ai-big-data-expo-na',
    'Unites enterprise AI, machine learning, and data analytics with focus on business outcomes and technical innovation.',
    array['trade_show']::event_category[],
    array['Enterprise AI', 'Big Data', 'Analytics', 'ML'],
    array['Enterprise', 'Developers'],
    '2026-05-18', '2026-05-19', true, 'May',
    'San Jose', 'USA', 'San Jose McEnery Convention Center', 'in_person',
    '$$', 0.00, 500.00,
    4, 6000,
    'https://www.ai-expo.net/northamerica/', null,
    array[],
    array['Expo', 'Enterprise', 'Silicon Valley']
),

-- 33. Enterprise AI Summit
(
    'a0000001-0001-0001-0001-000000000033'::uuid,
    'Enterprise AI Summit',
    'Enterprise AI Summit',
    'enterprise-ai-summit',
    'Explores implementing AI solutions, EU AI regulation compliance, and transitioning from passive to proactive AI tools.',
    array['enterprise']::event_category[],
    array['Enterprise AI', 'EU AI Act', 'AI Compliance', 'AI Implementation'],
    array['Enterprise Leaders', 'CTOs'],
    '2026-09-28', '2026-09-29', true, 'September',
    'Berlin', 'Germany', 'Maritim proArte Hotel', 'in_person',
    '$$$', 1500.00, 2500.00,
    3, 1000,
    'https://enterprise-ai-summit.com/', null,
    array[],
    array['Enterprise', 'EU', 'Compliance']
),

-- 34. Global AI Show
(
    'a0000001-0001-0001-0001-000000000034'::uuid,
    'Global AI Show',
    'Global AI Show',
    'global-ai-show',
    'Middle East''s premier AI event. Strong government and enterprise focus.',
    array['industry', 'trade_show']::event_category[],
    array['AI', 'Government AI', 'Enterprise AI', 'Middle East Tech'],
    array['Enterprise', 'Government'],
    null, null, false, 'April',
    'Dubai', 'UAE', 'Dubai World Trade Centre', 'in_person',
    '$$', 300.00, 800.00,
    4, 5000,
    'https://www.globalaishow.com/', null,
    array[],
    array['Middle East', 'Government', 'Expo']
),

-- 35. Data & AI Summit (Databricks)
(
    'a0000001-0001-0001-0001-000000000035'::uuid,
    'Databricks Data + AI Summit',
    'Databricks Data + AI Summit',
    'databricks-summit',
    'Databricks'' flagship event. Lakehouse architecture, Spark, MLflow, and enterprise AI.',
    array['industry', 'enterprise']::event_category[],
    array['Databricks', 'Lakehouse', 'Spark', 'MLflow', 'Data Engineering'],
    array['Data Engineers', 'ML Engineers'],
    null, null, false, 'June',
    'San Francisco', 'USA', 'Moscone Center', 'hybrid',
    '$$$', 0.00, 1500.00,
    5, 15000,
    'https://www.databricks.com/dataaisummit', null,
    array[],
    array['Databricks', 'Data', 'MLOps']
);

-- =============================================================================
-- TIER 5: Regional & Specialized Conferences (Events 36-50)
-- =============================================================================

insert into public.industry_events (
    id, name, full_name, slug, description,
    categories, topics, audience_types,
    event_date, end_date, dates_confirmed, typical_month,
    location_city, location_country, venue, format,
    ticket_cost_tier, ticket_cost_min, ticket_cost_max,
    startup_relevance, expected_attendance,
    website_url, twitter_handle,
    notable_speakers, tags
) values

-- 36. WAIC Shanghai
(
    'a0000001-0001-0001-0001-000000000036'::uuid,
    'WAIC',
    'World Artificial Intelligence Conference',
    'waic-shanghai',
    'One of the most influential AI events globally. Where China''s AI roadmap is showcased. Essential for companies looking to understand or enter the Chinese AI ecosystem.',
    array['government_policy', 'industry']::event_category[],
    array['AI Research', 'Robotics', 'Autonomous Driving', 'Smart Manufacturing', 'Digital Healthcare', 'AI Governance'],
    array['Tech Companies', 'Government', 'Researchers'],
    null, null, false, 'July',
    'Shanghai', 'China', 'Shanghai World Expo Exhibition Center', 'in_person',
    '$$', 200.00, 500.00,
    4, 50000,
    'https://www.worldaic.com.cn/en/', null,
    array[],
    array['China', 'Government', 'Policy']
),

-- 37. Cypher
(
    'a0000001-0001-0001-0001-000000000037'::uuid,
    'Cypher',
    'Cypher Conference',
    'cypher',
    'India''s largest and most influential AI and data science conference for enterprises. Brings together CXOs, data leaders, policymakers, and technology providers.',
    array['industry', 'enterprise']::event_category[],
    array['Enterprise AI', 'Data Science', 'AI Policy', 'India Tech'],
    array['CXOs', 'Data Leaders', 'Policy Makers'],
    '2026-10-07', '2026-10-09', true, 'October',
    'Bengaluru', 'India', 'Bangalore International Exhibition Centre', 'in_person',
    '$$', 200.00, 600.00,
    4, 5000,
    'https://cypher.analyticsindiamag.com/', null,
    array[],
    array['India', 'Enterprise', 'Data Science']
),

-- 38. World Economic Forum (Davos)
(
    'a0000001-0001-0001-0001-000000000038'::uuid,
    'World Economic Forum',
    'World Economic Forum Annual Meeting',
    'wef-davos',
    'Where AI''s role in economics and governance is framed at the highest levels. Major AI policy discussions and announcements.',
    array['government_policy']::event_category[],
    array['AI Policy', 'Economics', 'Governance', 'Global Affairs'],
    array['World Leaders', 'CEOs', 'Policy Makers'],
    '2026-01-19', '2026-01-23', true, 'January',
    'Davos', 'Switzerland', 'Congress Centre', 'in_person',
    '$$$$', 0.00, 0.00,
    2, 3000,
    'https://www.weforum.org/', null,
    array[],
    array['Policy', 'Global', 'Invite Only']
),

-- 39. World Government Summit
(
    'a0000001-0001-0001-0001-000000000039'::uuid,
    'World Government Summit',
    'World Government Summit',
    'world-government-summit',
    'Governments, international organizations, thought leaders, and private sector innovators come together. Major AI policy discussions.',
    array['government_policy']::event_category[],
    array['Government AI', 'Policy', 'Smart Cities', 'Digital Transformation'],
    array['Government Leaders', 'Tech CEOs'],
    null, null, false, 'February',
    'Dubai', 'UAE', 'Madinat Jumeirah', 'in_person',
    '$$$$', 0.00, 0.00,
    2, 4000,
    'https://worldgovernmentsummit.org/', null,
    array['Jensen Huang'],
    array['Government', 'Policy', 'UAE']
),

-- 40. RISE Conference
(
    'a0000001-0001-0001-0001-000000000040'::uuid,
    'RISE',
    'RISE Conference',
    'rise-hong-kong',
    'Asia''s largest gathering for startups in AI, robotics, and allied tech. 1,500+ companies. 2026 theme: "Intelligence Everywhere: The AI Economy."',
    array['startup_vc']::event_category[],
    array['Startups', 'AI', 'Robotics', 'Asia Tech'],
    array['Founders', 'VCs', 'Tech Leaders'],
    '2026-06-10', '2026-06-11', true, 'June',
    'Hong Kong', 'Hong Kong', 'Hong Kong Convention Centre', 'in_person',
    '$$', 500.00, 1500.00,
    5, 10000,
    'https://riseconf.com/', null,
    array[],
    array['Asia', 'Startups', 'AI Economy']
),

-- 41. Expand North Star (GITEX)
(
    'a0000001-0001-0001-0001-000000000041'::uuid,
    'Expand North Star',
    'Expand North Star / GITEX Global',
    'gitex-dubai',
    'Well-established tech/startup festival in Dubai. Thousands of founders and 400+ startups. Major AI and emerging tech focus.',
    array['startup_vc', 'trade_show']::event_category[],
    array['Startups', 'AI', 'Emerging Tech', 'Middle East'],
    array['Founders', 'Investors', 'Tech Companies'],
    null, null, false, 'October',
    'Dubai', 'UAE', 'Dubai World Trade Centre', 'in_person',
    '$$', 200.00, 800.00,
    5, 100000,
    'https://www.gitex.com/', null,
    array[],
    array['Middle East', 'Startups', 'Expo']
),

-- 42. VivaTech
(
    'a0000001-0001-0001-0001-000000000042'::uuid,
    'VivaTech',
    'VivaTech',
    'vivatech',
    'Europe''s largest startup and tech event. Strong AI and innovation focus. French President often attends.',
    array['startup_vc']::event_category[],
    array['Startups', 'AI', 'Innovation', 'European Tech'],
    array['Founders', 'VCs', 'Tech Leaders'],
    null, null, false, 'June',
    'Paris', 'France', 'Paris Expo Porte de Versailles', 'in_person',
    '$$', 400.00, 1000.00,
    5, 150000,
    'https://vivatechnology.com/', null,
    array[],
    array['Europe', 'Startups', 'France']
),

-- 43. EmTech
(
    'a0000001-0001-0001-0001-000000000043'::uuid,
    'EmTech',
    'MIT Technology Review EmTech',
    'emtech',
    'MIT Technology Review''s flagship event. Explores emerging technologies including AI, biotech, and climate tech.',
    array['research', 'industry']::event_category[],
    array['Emerging Tech', 'AI', 'Biotech', 'Climate Tech'],
    array['Researchers', 'Tech Leaders'],
    null, null, false, 'September',
    'Cambridge', 'USA', 'MIT Media Lab', 'hybrid',
    '$$$', 1000.00, 1500.00,
    4, 1500,
    'https://events.technologyreview.com/', null,
    array[],
    array['MIT', 'Emerging Tech', 'Research']
),

-- 44. Applied Machine Learning Days (AMLD)
(
    'a0000001-0001-0001-0001-000000000044'::uuid,
    'AMLD',
    'Applied Machine Learning Days',
    'amld',
    'Hosted at EPFL. Focus on practical applications of ML. Strong academic-industry bridge.',
    array['research', 'industry']::event_category[],
    array['Applied ML', 'ML Engineering', 'ML Applications'],
    array['Researchers', 'Practitioners'],
    null, null, false, 'March',
    'Lausanne', 'Switzerland', 'EPFL', 'in_person',
    '$$', 200.00, 500.00,
    4, 3000,
    'https://appliedmldays.org/', null,
    array[],
    array['Switzerland', 'Applied', 'Academic']
),

-- 45. Deep Learning Summit
(
    'a0000001-0001-0001-0001-000000000045'::uuid,
    'Deep Learning Summit',
    'Deep Learning Summit',
    'deep-learning-summit',
    'RE·WORK''s focused deep learning event. Practical applications and cutting-edge research.',
    array['research', 'industry']::event_category[],
    array['Deep Learning', 'Neural Networks', 'AI Applications'],
    array['Researchers', 'Engineers'],
    null, null, false, 'September',
    'San Francisco', 'USA', null, 'in_person',
    '$$', 500.00, 900.00,
    4, 800,
    'https://www.re-work.co/', null,
    array[],
    array['Deep Learning', 'RE-WORK']
),

-- 46. NLP Summit
(
    'a0000001-0001-0001-0001-000000000046'::uuid,
    'NLP Summit',
    'NLP Summit',
    'nlp-summit',
    'Focused on natural language processing applications. Practical workshops and case studies.',
    array['research', 'industry']::event_category[],
    array['NLP', 'LLM', 'Text Analytics', 'Chatbots'],
    array['NLP Practitioners', 'Developers'],
    null, null, false, 'October',
    null, null, null, 'virtual',
    '$', 0.00, 200.00,
    4, 5000,
    'https://www.nlpsummit.org/', null,
    array[],
    array['NLP', 'Virtual', 'Practical']
),

-- 47. MLOps World
(
    'a0000001-0001-0001-0001-000000000047'::uuid,
    'MLOps World',
    'MLOps World',
    'mlops-world',
    'Focused on machine learning operations, deployment, and production ML systems.',
    array['industry', 'developer']::event_category[],
    array['MLOps', 'ML Deployment', 'Production ML', 'DevOps'],
    array['ML Engineers', 'DevOps'],
    null, null, false, 'June',
    'Austin', 'USA', null, 'hybrid',
    '$$', 300.00, 600.00,
    5, 2000,
    'https://mlopsworld.com/', null,
    array[],
    array['MLOps', 'Production', 'Engineering']
),

-- 48. AI World Congress
(
    'a0000001-0001-0001-0001-000000000048'::uuid,
    'AI World Congress',
    'AI World Congress',
    'ai-world-congress',
    'UK-focused AI industry event covering enterprise AI, automation, and digital transformation.',
    array['industry']::event_category[],
    array['Enterprise AI', 'Automation', 'Digital Transformation'],
    array['Enterprise', 'Developers'],
    null, null, false, 'November',
    'London', 'UK', null, 'in_person',
    '$$', 400.00, 800.00,
    4, 2000,
    'https://aiworldcongress.com/', null,
    array[],
    array['UK', 'Enterprise', 'Automation']
),

-- 49. AI for Good Global Summit
(
    'a0000001-0001-0001-0001-000000000049'::uuid,
    'AI for Good',
    'AI for Good Global Summit',
    'ai-for-good',
    'United Nations platform for AI innovation to help achieve the SDGs. Focus on ethical AI and social impact.',
    array['government_policy']::event_category[],
    array['AI Ethics', 'Social Impact', 'SDGs', 'Ethical AI'],
    array['UN', 'NGOs', 'Researchers', 'Policy Makers'],
    null, null, false, 'May',
    'Geneva', 'Switzerland', 'ITU Headquarters', 'hybrid',
    'free', 0.00, 0.00,
    3, 3000,
    'https://aiforgood.itu.int/', null,
    array[],
    array['UN', 'Ethics', 'Social Impact']
),

-- 50. Cisco AI Summit
(
    'a0000001-0001-0001-0001-000000000050'::uuid,
    'Cisco AI Summit',
    'Cisco AI Summit',
    'cisco-ai-summit',
    'Focus on AI infrastructure, networking, and enterprise AI deployment.',
    array['enterprise', 'industry']::event_category[],
    array['AI Infrastructure', 'Networking', 'Enterprise AI'],
    array['Enterprise', 'Infrastructure Leaders'],
    null, null, false, 'September',
    null, null, null, 'in_person',
    '$$', 500.00, 1000.00,
    3, 2000,
    'https://www.cisco.com/', null,
    array['Jensen Huang', 'Sam Altman', 'Fei-Fei Li'],
    array['Cisco', 'Infrastructure', 'Networking']
);

-- =============================================================================
-- Seed: Event Speakers (Verified Appearances)
-- =============================================================================

-- Clear existing speaker data
truncate table public.event_speakers restart identity cascade;

insert into public.event_speakers (
    event_id, speaker_name, speaker_title, speaker_company,
    appearance_year, appearance_type, is_confirmed, source_url
) values

-- Jensen Huang appearances
('a0000001-0001-0001-0001-000000000011'::uuid, 'Jensen Huang', 'CEO & Founder', 'NVIDIA', 2025, 'keynote', true, 'https://www.nvidia.com/gtc/'),
('a0000001-0001-0001-0001-000000000011'::uuid, 'Jensen Huang', 'CEO & Founder', 'NVIDIA', 2024, 'keynote', true, 'https://www.nvidia.com/gtc/'),
('a0000001-0001-0001-0001-000000000027'::uuid, 'Jensen Huang', 'CEO & Founder', 'NVIDIA', 2025, 'keynote', true, 'https://www.ces.tech/'),
('a0000001-0001-0001-0001-000000000039'::uuid, 'Jensen Huang', 'CEO & Founder', 'NVIDIA', 2024, 'keynote', true, 'https://worldgovernmentsummit.org/'),
('a0000001-0001-0001-0001-000000000025'::uuid, 'Jensen Huang', 'CEO & Founder', 'NVIDIA', 2025, 'speaker', true, 'https://sequoiacap.com/'),

-- Sam Altman appearances
('a0000001-0001-0001-0001-000000000025'::uuid, 'Sam Altman', 'CEO', 'OpenAI', 2025, 'speaker', true, 'https://sequoiacap.com/'),
('a0000001-0001-0001-0001-000000000017'::uuid, 'Sam Altman', 'CEO', 'OpenAI', 2024, 'keynote', true, 'https://openai.com/'),
('a0000001-0001-0001-0001-000000000017'::uuid, 'Sam Altman', 'CEO', 'OpenAI', 2023, 'keynote', true, 'https://openai.com/'),

-- Demis Hassabis appearances
('a0000001-0001-0001-0001-000000000013'::uuid, 'Demis Hassabis', 'CEO', 'Google DeepMind', 2025, 'speaker', true, 'https://io.google/'),
('a0000001-0001-0001-0001-000000000002'::uuid, 'Demis Hassabis', 'CEO', 'Google DeepMind', 2026, 'speaker', true, 'https://icml.cc/'),
('a0000001-0001-0001-0001-000000000001'::uuid, 'Demis Hassabis', 'CEO', 'Google DeepMind', 2024, 'speaker', true, 'https://neurips.cc/'),

-- Sundar Pichai appearances
('a0000001-0001-0001-0001-000000000013'::uuid, 'Sundar Pichai', 'CEO', 'Google', 2025, 'keynote', true, 'https://io.google/'),
('a0000001-0001-0001-0001-000000000012'::uuid, 'Sundar Pichai', 'CEO', 'Google', 2025, 'keynote', true, 'https://cloud.google.com/next'),

-- Satya Nadella appearances
('a0000001-0001-0001-0001-000000000015'::uuid, 'Satya Nadella', 'CEO', 'Microsoft', 2025, 'keynote', true, 'https://build.microsoft.com/'),
('a0000001-0001-0001-0001-000000000016'::uuid, 'Satya Nadella', 'CEO', 'Microsoft', 2025, 'keynote', true, 'https://ignite.microsoft.com/'),

-- Dario Amodei appearances
('a0000001-0001-0001-0001-000000000002'::uuid, 'Dario Amodei', 'CEO', 'Anthropic', 2026, 'speaker', true, 'https://icml.cc/'),

-- Fei-Fei Li appearances
('a0000001-0001-0001-0001-000000000002'::uuid, 'Fei-Fei Li', 'Professor & CEO', 'Stanford / World Labs', 2026, 'speaker', true, 'https://icml.cc/'),
('a0000001-0001-0001-0001-000000000018'::uuid, 'Fei-Fei Li', 'Professor & CEO', 'Stanford / World Labs', 2026, 'keynote', true, 'https://ai4.io/'),
('a0000001-0001-0001-0001-000000000018'::uuid, 'Fei-Fei Li', 'Professor & CEO', 'Stanford / World Labs', 2025, 'keynote', true, 'https://ai4.io/'),

-- Andrew Ng appearances
('a0000001-0001-0001-0001-000000000018'::uuid, 'Andrew Ng', 'Founder', 'DeepLearning.AI', 2026, 'keynote', true, 'https://ai4.io/'),

-- Geoffrey Hinton appearances
('a0000001-0001-0001-0001-000000000018'::uuid, 'Geoffrey Hinton', 'Professor (Emeritus)', 'University of Toronto', 2026, 'keynote', true, 'https://ai4.io/'),
('a0000001-0001-0001-0001-000000000018'::uuid, 'Geoffrey Hinton', 'Professor (Emeritus)', 'University of Toronto', 2025, 'keynote', true, 'https://ai4.io/'),

-- Yann LeCun appearances
('a0000001-0001-0001-0001-000000000004'::uuid, 'Yann LeCun', 'VP & Chief AI Scientist', 'Meta', 2024, 'speaker', true, 'https://aaai.org/'),
('a0000001-0001-0001-0001-000000000001'::uuid, 'Yann LeCun', 'VP & Chief AI Scientist', 'Meta', 2024, 'speaker', true, 'https://neurips.cc/'),

-- Lisa Su appearances
('a0000001-0001-0001-0001-000000000027'::uuid, 'Lisa Su', 'CEO', 'AMD', 2025, 'keynote', true, 'https://www.ces.tech/'),

-- Jeff Dean appearances
('a0000001-0001-0001-0001-000000000025'::uuid, 'Jeff Dean', 'Chief Scientist', 'Google', 2025, 'speaker', true, 'https://sequoiacap.com/'),

-- Mike Krieger appearances
('a0000001-0001-0001-0001-000000000025'::uuid, 'Mike Krieger', 'Chief Product Officer', 'Anthropic', 2025, 'speaker', true, 'https://sequoiacap.com/');

-- =============================================================================
-- END OF SEED: Industry Events
-- =============================================================================
