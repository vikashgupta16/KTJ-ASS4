// Demo data for development and testing when API keys are not available
export const demoArticles = [
  {
    title: "Artificial Intelligence Breakthrough in Medical Diagnosis",
    description: "Researchers have developed a new AI system that can diagnose rare diseases with 95% accuracy, potentially revolutionizing healthcare.",
    url: "https://example.com/ai-medical-breakthrough",
    urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
    publishedAt: "2024-12-23T10:00:00Z",
    source: { name: "Tech Health News" },
    author: "Dr. Sarah Johnson",
    content: "A groundbreaking study has shown that artificial intelligence can significantly improve medical diagnosis accuracy. The new system uses advanced machine learning algorithms to analyze patient data and medical imaging..."
  },
  {
    title: "Climate Change: Record High Temperatures Recorded Globally",
    description: "Scientists report unprecedented global temperature readings as climate change effects become more visible worldwide.",
    url: "https://example.com/climate-temperatures",
    urlToImage: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=200&fit=crop",
    publishedAt: "2024-12-23T08:30:00Z",
    source: { name: "Environmental Times" },
    author: "Michael Chen",
    content: "New data from weather stations around the world show that 2024 is on track to be the hottest year on record. The implications for global climate patterns are significant..."
  },
  {
    title: "SpaceX Successfully Launches New Satellite Constellation",
    description: "The latest mission adds 60 more satellites to the growing network, improving global internet coverage.",
    url: "https://example.com/spacex-satellites",
    urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&h=200&fit=crop",
    publishedAt: "2024-12-23T06:45:00Z",
    source: { name: "Space News Daily" },
    author: "Lisa Rodriguez",
    content: "SpaceX has successfully deployed another batch of satellites as part of their ambitious plan to provide global internet coverage. The mission was completed without any technical issues..."
  },
  {
    title: "Quantum Computing Milestone Achieved by Tech Giants",
    description: "Major breakthrough in quantum computing promises to solve complex problems that are impossible for traditional computers.",
    url: "https://example.com/quantum-computing",
    urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop",
    publishedAt: "2024-12-22T16:20:00Z",
    source: { name: "Quantum Tech Review" },
    author: "Dr. Alex Kim",
    content: "Researchers have achieved a significant milestone in quantum computing, demonstrating quantum advantage in solving real-world optimization problems..."
  },
  {
    title: "Renewable Energy Reaches New Global Capacity Record",
    description: "Solar and wind power installations continue to grow exponentially, marking a significant shift in global energy production.",
    url: "https://example.com/renewable-energy-record",
    urlToImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop",
    publishedAt: "2024-12-22T14:15:00Z",
    source: { name: "Green Energy Today" },
    author: "Emma Watson",
    content: "The global renewable energy capacity has reached unprecedented levels, with solar and wind power leading the charge toward a sustainable future..."
  },
  {
    title: "Cryptocurrency Market Shows Signs of Recovery",
    description: "Bitcoin and major altcoins experience significant gains as institutional adoption continues to grow.",
    url: "https://example.com/crypto-recovery",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
    publishedAt: "2024-12-22T12:00:00Z",
    source: { name: "Crypto Finance Weekly" },
    author: "Robert Smith",
    content: "The cryptocurrency market is showing strong signs of recovery after a challenging period, with major institutions increasing their digital asset holdings..."
  }
];

// Demo articles by category
export const demoArticlesByCategory = {
  general: demoArticles,
  business: [
    {
      title: "Global Stock Markets Reach All-Time Highs",
      description: "Major indices around the world continue their upward trajectory as investor confidence grows.",
      url: "https://example.com/stock-markets-high",
      urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
      publishedAt: "2024-12-23T09:30:00Z",
      source: { name: "Financial Times" },
      author: "John Williams",
      content: "Global stock markets are experiencing unprecedented growth as economic indicators point to sustained recovery..."
    },
    {
      title: "Tech Startup Raises $100M in Series B Funding",
      description: "Innovative AI company secures major funding round to expand operations globally.",
      url: "https://example.com/startup-funding",
      urlToImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop",
      publishedAt: "2024-12-23T07:15:00Z",
      source: { name: "Startup Weekly" },
      author: "Sarah Martinez",
      content: "A promising AI startup has successfully closed a $100 million Series B funding round, marking one of the largest tech investments this quarter..."
    }
  ],
  technology: [
    {
      title: "Apple Announces Revolutionary New iPhone Features",
      description: "The latest iPhone model includes groundbreaking camera technology and extended battery life.",
      url: "https://example.com/new-iphone-features",
      urlToImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=200&fit=crop",
      publishedAt: "2024-12-23T11:00:00Z",
      source: { name: "Tech Insider" },
      author: "Mark Thompson",
      content: "Apple's latest iPhone announcement has created significant buzz in the tech community with its innovative features..."
    },
    {
      title: "5G Network Expansion Reaches Rural Areas",
      description: "Telecommunications companies accelerate 5G deployment to bridge the digital divide.",
      url: "https://example.com/5g-rural-expansion",
      urlToImage: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop",
      publishedAt: "2024-12-22T15:45:00Z",
      source: { name: "Telecom News" },
      author: "Jennifer Lee",
      content: "Major telecommunications providers are working together to bring high-speed 5G connectivity to underserved rural communities..."
    }
  ],
  sports: [
    {
      title: "World Cup Qualifiers: Exciting Matches This Weekend",
      description: "National teams compete for remaining spots in the upcoming World Cup tournament.",
      url: "https://example.com/world-cup-qualifiers",
      urlToImage: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=200&fit=crop",
      publishedAt: "2024-12-23T12:30:00Z",
      source: { name: "Sports Central" },
      author: "Carlos Rodriguez",
      content: "The World Cup qualifiers continue this weekend with several crucial matches that will determine the final tournament lineup..."
    }
  ],
  health: [
    {
      title: "New Vaccine Shows Promise in Clinical Trials",
      description: "Researchers report positive results from Phase 3 trials of a next-generation vaccine.",
      url: "https://example.com/new-vaccine-trials",
      urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
      publishedAt: "2024-12-23T13:20:00Z",
      source: { name: "Medical Journal Daily" },
      author: "Dr. Patricia Brown",
      content: "A new vaccine candidate has shown excellent safety and efficacy profiles in large-scale clinical trials..."
    }
  ]
};

export const getDemoArticles = (category = 'general') => {
  return {
    articles: demoArticlesByCategory[category] || demoArticlesByCategory.general,
    totalResults: demoArticlesByCategory[category]?.length || demoArticlesByCategory.general.length
  };
};

export const searchDemoArticles = (query) => {
  const allArticles = Object.values(demoArticlesByCategory).flat();
  const filteredArticles = allArticles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.description.toLowerCase().includes(query.toLowerCase())
  );
  
  return {
    articles: filteredArticles,
    totalResults: filteredArticles.length
  };
};
