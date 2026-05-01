require("dotenv").config();
require("../dbConnect");

const Models = require("../models");

const spaces = [
  {
    id: 1,
    name: "Blacktown Leisure Centre Stanhope",
    type: "Leisure Centre",
    council: "Blacktown City Council",
    image_url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/59/59/8a/the-front-entry.jpg",
    about: "Large aquatic and fitness centre with indoor and outdoor pools, gym, and program rooms.",
    autism_friendly_features: [
      "Off-peak quieter hours",
      "Structured swimming lessons",
      "Family change rooms"
    ],
    cost: "Paid",
    tags: ["swimming", "movement", "indoor", "fitness"],
    age_suitability: "All ages",
    accessibility_features: [
      "Wheelchair access",
      "Accessible parking",
      "Aquatic wheelchair",
      "Accessible change rooms"
    ],
    address: "",
    noise_level: "Moderate",
    quiet_hours: "Off-peak hours",
    verified: true,
    author_type: "developer"
  },
  {
    id: 2,
    name: "Mount Druitt Swimming Centre",
    type: "Swimming",
    council: "Blacktown City Council",
    image_url: "https://www.blacktownaquaticandsports.com.au/files/assets/keyvenues/v/1/venues/mount-druitt-swimming-centre/mdsc-pool.jpg",
    about: "Outdoor seasonal swimming complex with lap pool and leisure pool.",
    autism_friendly_features: [
      "Open outdoor space reduces echo and sensory overload"
    ],
    cost: "Low-cost",
    tags: ["swimming", "outdoor", "movement"],
    age_suitability: "All ages",
    accessibility_features: [
      "Ramp access",
      "Accessible amenities"
    ],
    address: "",
    noise_level: "Moderate",
    quiet_hours: "",
    verified: true,
    author_type: "developer"
  },
  {
    id: 3,
    name: "Camden War Memorial Pool",
    type: "Swimming",
    council: "Camden Council",
    image_url: "https://i0.wp.com/camdenpool.com.au/wp-content/uploads/2024/08/caamden-mta-pool2.jpg.jpg",
    about: "Outdoor aquatic centre with 50m pool and leisure facilities.",
    autism_friendly_features: [
      "Quieter weekday periods",
      "Structured swimming programs"
    ],
    cost: "Low-cost",
    tags: ["swimming", "outdoor", "movement"],
    age_suitability: "All ages",
    accessibility_features: [
      "Accessible entry",
      "Accessible amenities",
      "Accessible parking"
    ],
    address: "",
    noise_level: "Moderate",
    quiet_hours: "Quieter weekday periods",
    verified: true,
    author_type: "developer"
  },
  {
    id: 4,
    name: "Macquarie Fields Leisure Centre",
    type: "Leisure Centre",
    council: "Campbelltown City Council",
    image_url: "https://www.campbelltown.nsw.gov.au/files/sharedassets/public/v/1/services-and-facilities/aquatics-fitness-and-indoor-sports/images/ccc_mac-fields-leisure_photo-gallery_03.jpeg",
    about: "Indoor leisure centre with pools, gym, and group fitness spaces.",
    autism_friendly_features: [
      "Heated indoor pool with consistent environment",
      "Quieter midweek sessions"
    ],
    cost: "Paid",
    tags: ["swimming", "movement", "indoor"],
    age_suitability: "All ages",
    accessibility_features: [
      "Wheelchair accessible",
      "Pool hoist",
      "Accessible change rooms"
    ],
    address: "",
    noise_level: "Moderate",
    quiet_hours: "Quieter midweek sessions",
    verified: true,
    author_type: "developer"
  },
  {
    id: 5,
    name: "Ian Thorpe Aquatic Centre",
    type: "Swimming",
    council: "City of Sydney Council",
    image_url: "https://i0.wp.com/steensenvarming.com/wp-content/uploads/2023/01/Ian-Thorpe-Aquatic-Centre-1.jpg",
    about: "Award-winning indoor aquatic centre with heated pools and fitness facilities.",
    autism_friendly_features: [
      "Design reduces glare",
      "Structured sessions",
      "Quieter weekday access"
    ],
    cost: "Paid",
    tags: ["swimming", "indoor", "movement", "fitness"],
    age_suitability: "All ages",
    accessibility_features: [
      "Wheelchair access",
      "Accessible lifts",
      "Aquatic wheelchair"
    ],
    address: "",
    noise_level: "Moderate",
    quiet_hours: "Quieter weekday access",
    verified: true,
    author_type: "developer"
  },
  {
    id: 6,
    name: "Fairfield Leisure Centre",
    type: "Leisure Centre",
    council: "Fairfield City Council",
    image_url: "https://www.fairfieldcityleisurecentres.com.au/wp-content/uploads/2025/12/home_featured-image.jpg",
    about: "Aquatic and recreation centre with indoor pools and gym.",
    autism_friendly_features: [
      "Family-friendly environment",
      "Quieter daytime access"
    ],
    cost: "Paid",
    tags: ["swimming", "indoor", "movement"],
    age_suitability: "All ages",
    accessibility_features: [
      "Wheelchair access",
      "Accessible parking"
    ],
    address: "",
    noise_level: "Moderate",
    quiet_hours: "Quieter daytime access",
    verified: true,
    author_type: "developer"
  },
  {
    id: 7,
    name: "Whitlam Leisure Centre Liverpool",
    type: "Leisure Centre",
    council: "Liverpool City Council",
    image_url: "https://www.whitlamleisurecentre.com.au/getmedia/ea354230-9783-4ee1-8fb7-22ff35c274a1/Banner-template-(95).png",
    about: "Indoor aquatic and fitness facility with lap and leisure pools.",
    autism_friendly_features: [
      "Controlled indoor environment",
      "Structured programs"
    ],
    cost: "Paid",
    tags: ["swimming", "indoor", "movement"],
    age_suitability: "All ages",
    accessibility_features: [
      "Wheelchair access",
      "Pool hoist",
      "Accessible amenities"
    ],
    address: "",
    noise_level: "Moderate",
    quiet_hours: "",
    verified: true,
    author_type: "developer"
  },
  {
    id: 8,
    name: "Blacktown City Library",
    type: "Library",
    council: "Blacktown City Council",
    image_url: "https://www.blacktown.nsw.gov.au/files/assets/public/v/1/services/blacktown_screen_-res-70_340px.jpg",
    about: "Main public library with study spaces, children's area, and community programs.",
    autism_friendly_features: [
      "Quiet study areas",
      "Structured children's storytime sessions"
    ],
    cost: "Free",
    tags: ["quiet", "reading", "indoor", "community"],
    age_suitability: "All ages",
    accessibility_features: [
      "Wheelchair access",
      "Accessible desks",
      "Accessible toilets"
    ],
    address: "",
    noise_level: "Very Quiet",
    quiet_hours: "",
    verified: true,
    author_type: "developer"
  },
  {
    id: 9,
    name: "Camden Library",
    type: "Library",
    council: "Camden Council",
    image_url: "https://camdenhistorynotes.com/wp-content/uploads/2023/08/camden-museum-library-2023-mgnsw-lowres.jpg",
    about: "Community library with children's programs and quiet reading zones.",
    autism_friendly_features: [
      "Calm indoor environment",
      "Designated quiet spaces"
    ],
    cost: "Free",
    tags: ["quiet", "reading", "indoor"],
    age_suitability: "All ages",
    accessibility_features: [
      "Wheelchair access",
      "Accessible facilities"
    ],
    address: "",
    noise_level: "Very Quiet",
    quiet_hours: "",
    verified: true,
    author_type: "developer"
  },
  {
    id: 10,
    name: "Campbelltown Library",
    type: "Library",
    council: "Campbelltown City Council",
    image_url: "https://www.campbelltown.sa.gov.au/__data/assets/image/0013/241321/varieties/banner.jpg",
    about: "Large public library with study rooms, youth space, and children's programs.",
    autism_friendly_features: [
      "Quiet rooms available",
      "Structured programs"
    ],
    cost: "Free",
    tags: ["quiet", "reading", "indoor", "community"],
    age_suitability: "All ages",
    accessibility_features: [
      "Wheelchair access",
      "Lift access"
    ],
    address: "",
    noise_level: "Very Quiet",
    quiet_hours: "",
    verified: true,
    author_type: "developer"
  },
  {
    id: 11,
    name: "Bankstown Library and Knowledge Centre",
    type: "Library",
    council: "Canterbury-Bankstown Council",
    image_url: "https://www.planning.nsw.gov.au/sites/default/files/2023-11/bankstown-library-and-knowledge-centre-5-900x600.jpg",
    about: "Modern multi-level library with children's zone and quiet study areas.",
    autism_friendly_features: [
      "Designated quiet floors",
      "Structured children's sessions"
    ],
    cost: "Free",
    tags: ["quiet", "reading", "indoor"],
    age_suitability: "All ages",
    accessibility_features: [
      "Wheelchair access",
      "Lifts",
      "Accessible amenities"
    ],
    address: "",
    noise_level: "Very Quiet",
    quiet_hours: "",
    verified: true,
    author_type: "developer"
  },
  {
    id: 12,
    name: "Customs House Library",
    type: "Library",
    council: "City of Sydney Council",
    image_url: "https://www.cityofsydney.nsw.gov.au/-/media/corporate/images/places-and-spaces/libraries/customs-house-library/parent-library-page/customshouselibrary-highres-7340-op.jpg",
    about: "City library with harbour views, reading areas, and study spaces.",
    autism_friendly_features: [
      "Quiet reading environment",
      "Structured programming"
    ],
    cost: "Free",
    tags: ["quiet", "reading", "indoor"],
    age_suitability: "All ages",
    accessibility_features: [
      "Lift access",
      "Wheelchair accessible"
    ],
    address: "",
    noise_level: "Very Quiet",
    quiet_hours: "",
    verified: true,
    author_type: "developer"
  },
  {
    id: 13,
    name: "Fairfield City Open Libraries",
    type: "Library",
    council: "Fairfield City Council",
    image_url: "https://henrico.gov/assets/FAL-01-Exterior-Front_Out.jpg",
    about: "Public library network offering study areas and children's programs.",
    autism_friendly_features: [
      "Quiet indoor setting",
      "Routine-based activities"
    ],
    cost: "Free",
    tags: ["quiet", "reading", "indoor"],
    age_suitability: "All ages",
    accessibility_features: [
      "Wheelchair access",
      "Accessible amenities"
    ],
    address: "",
    noise_level: "Very Quiet",
    quiet_hours: "",
    verified: true,
    author_type: "developer"
  },
  {
    id: 14,
    name: "Liverpool City Library",
    type: "Library",
    council: "Liverpool City Council",
    image_url: "https://www.liverpool.nsw.gov.au/__data/assets/image/0007/258541/Yellamundie-576x324.png",
    about: "Major regional library with study rooms, children's area, and events.",
    autism_friendly_features: [
      "Quiet study zones",
      "Structured children's programming"
    ],
    cost: "Free",
    tags: ["quiet", "reading", "indoor", "community"],
    age_suitability: "All ages",
    accessibility_features: [
      "Wheelchair access",
      "Lifts",
      "Accessible toilets"
    ],
    address: "",
    noise_level: "Very Quiet",
    quiet_hours: "",
    verified: true,
    author_type: "developer"
  }
];

async function seedSpaces() {
  try {
    await Models.Space.deleteMany({});
    await Models.Space.insertMany(spaces);
    console.log("Spaces seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding spaces:", error.message);
    process.exit(1);
  }
}

seedSpaces();