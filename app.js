/**
 * StudioFlow — Photography Studio Client & Workflow Management
 * Core Application Logic, Interactive State Store, Multi-Project Architecture & Notion-Style Project Workspace
 */

// --- Default Pristine Sample Data ---
const DEFAULT_DATA = {
  clients: [
    {
      id: "c1",
      name: "Rahul & Priya Sharma",
      email: "rahul.priya@sharmamail.com",
      phone: "+91 98201 44521",
      location: "Mumbai / Udaipur",
      eventType: "Destination Wedding",
      status: "Active Review",
      initials: "RP"
    },
    {
      id: "c2",
      name: "Ananya & Vikram Malhotra",
      email: "ananya.m@malhotracorp.in",
      phone: "+91 99100 22334",
      location: "Delhi / Jaipur",
      eventType: "Wedding",
      status: "Editing",
      initials: "AV"
    },
    {
      id: "c3",
      name: "Kavya & Rohan Singhania",
      email: "rohan.singhania@singhaniagroup.com",
      phone: "+91 98765 43210",
      location: "Bengaluru",
      eventType: "Wedding",
      status: "Photo Selection",
      initials: "KR"
    },
    {
      id: "c4",
      name: "Dr. Aarav & Meera Patel",
      email: "meerapatel.dr@gmail.com",
      phone: "+91 97234 11223",
      location: "Ahmedabad",
      eventType: "Wedding",
      status: "Shoot Scheduled",
      initials: "AM"
    },
    {
      id: "c5",
      name: "Sneha & Tanmay Kapoor",
      email: "sneha.kapoor@outlook.com",
      phone: "+91 98111 88990",
      location: "South Goa",
      eventType: "Pre-Wedding",
      status: "Approved",
      initials: "ST"
    },
    {
      id: "c6",
      name: "Zoya & Farhan Merchant",
      email: "zoya.farhan@merchanttrade.com",
      phone: "+91 98450 77665",
      location: "Hyderabad",
      eventType: "Family & Maternity",
      status: "Delivered",
      initials: "ZF"
    }
  ],

  projects: [
    {
      id: "p1",
      clientId: "c1",
      clientName: "Rahul & Priya Sharma",
      title: "Royal Udaipur Palace Wedding",
      package: "Imperial Heirlooms (3-Day)",
      eventDate: "2026-10-28",
      price: 350000,
      paid: 280000,
      stage: "Client Review",
      deliveryDeadline: "2026-11-25",
      coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
      notes: [
        {
          id: "pnote_1",
          title: "Bridal Palette & Golden-Hour Lighting Specs",
          body: "Priya requested a warm, golden-hour tone throughout the palace courtyards. Ensure the crimson lehenga embroidery has high dynamic range without clipped highlights. Spread 04 bridal veil details lifted +10%.",
          author: "Artisan Visuals",
          createdAt: "2026-10-02T10:00:00.000Z",
          updatedAt: "2026-10-09T14:30:00.000Z"
        },
        {
          id: "pnote_2",
          title: "Lake Pichola Sunset Boat & Drone Permissions",
          body: "Sunset boat shoot confirmed for Oct 29 at 5:30 PM. Udaivilas palace courtyard management approved handheld gimbal rigs and 50mm/85mm prime lenses for candid portraits.",
          author: "Studio Lead",
          createdAt: "2026-10-04T11:15:00.000Z",
          updatedAt: "2026-10-04T11:15:00.000Z"
        }
      ],
      activity: [
        {
          id: "act_101",
          action: "Spread Revision Added",
          details: "Client requested +10% exposure boost on Spread 04 bridal veil portrait.",
          timestamp: "2026-10-09T16:20:00.000Z",
          formattedTime: "Oct 09, 2026, 04:20 PM"
        },
        {
          id: "act_102",
          action: "Payment Recorded",
          details: "Received milestone installment of ₹1,30,000 via Bank NEFT.",
          timestamp: "2026-10-05T11:00:00.000Z",
          formattedTime: "Oct 05, 2026, 11:00 AM"
        },
        {
          id: "act_103",
          action: "Stage Changed",
          details: "Production stage advanced from 'Album Design' to 'Client Review'.",
          timestamp: "2026-10-01T09:00:00.000Z",
          formattedTime: "Oct 01, 2026, 09:00 AM"
        }
      ],
      selectedPhotoIds: ["gp_101", "gp_102", "gp_103", "gp_104", "gp_105"]
    },
    {
      id: "p2",
      clientId: "c2",
      clientName: "Ananya & Vikram Malhotra",
      title: "Jaipur Heritage Extravaganza",
      package: "Grand Maharaja 4-Day",
      eventDate: "2026-10-15",
      price: 480000,
      paid: 350000,
      stage: "Editing",
      deliveryDeadline: "2026-12-10",
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      notes: [
        {
          id: "pnote_201",
          title: "4K Teaser Soundtrack & Grade Direction",
          body: "Couple requested acoustic Sufi intro transitioning into energetic Punjabi dance beats for the Sangeet montage. Color grade: warm vintage Kodak 2383.",
          author: "Lead Editor",
          createdAt: "2026-10-08T11:00:00.000Z",
          updatedAt: "2026-10-08T11:00:00.000Z"
        }
      ],
      activity: [
        {
          id: "act_201",
          action: "Payment Recorded",
          details: "Received installment of ₹1,50,000 via RTGS.",
          timestamp: "2026-10-06T15:00:00.000Z",
          formattedTime: "Oct 06, 2026, 03:00 PM"
        },
        {
          id: "act_202",
          action: "Stage Changed",
          details: "Production stage moved to 'Editing'.",
          timestamp: "2026-10-03T10:00:00.000Z",
          formattedTime: "Oct 03, 2026, 10:00 AM"
        }
      ],
      selectedPhotoIds: ["gp_201", "gp_202"]
    },
    {
      id: "p3",
      clientId: "c3",
      clientName: "Kavya & Rohan Singhania",
      title: "Bangalore Glass House Soiree",
      package: "Signature Cine-Documentary",
      eventDate: "2026-10-05",
      price: 275000,
      paid: 150000,
      stage: "Photo Selection",
      deliveryDeadline: "2026-12-01",
      coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
      notes: [],
      activity: [
        {
          id: "act_301",
          action: "Task Created",
          details: "Studio task added: 'Send photo selection cloud gallery to Kavya & Rohan'.",
          timestamp: "2026-10-06T14:00:00.000Z",
          formattedTime: "Oct 06, 2026, 02:00 PM"
        }
      ],
      selectedPhotoIds: ["gp_301"]
    },
    {
      id: "p4",
      clientId: "c4",
      clientName: "Dr. Aarav & Meera Patel",
      title: "Ahmedabad Heritage Haveli Wedding",
      package: "Artisanal Heritage Wedding",
      eventDate: "2026-11-12",
      price: 190000,
      paid: 95000,
      stage: "Shoot Scheduled",
      deliveryDeadline: "2027-01-10",
      coverImage: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
      notes: [],
      activity: [],
      selectedPhotoIds: []
    },
    {
      id: "p5",
      clientId: "c5",
      clientName: "Sneha & Tanmay Kapoor",
      title: "South Goa Sunset Romance",
      package: "Editorial Pre-Wedding & Film",
      eventDate: "2026-09-20",
      price: 120000,
      paid: 120000,
      stage: "Approved",
      deliveryDeadline: "2026-11-05",
      coverImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop",
      notes: [],
      activity: [
        {
          id: "act_501",
          action: "Album Approved",
          details: "Client officially approved wedding album layout for print fabrication.",
          timestamp: "2026-10-04T16:00:00.000Z",
          formattedTime: "Oct 04, 2026, 04:00 PM"
        }
      ],
      selectedPhotoIds: ["gp_501", "gp_502", "gp_503", "gp_504"]
    },
    {
      id: "p6",
      clientId: "c6",
      clientName: "Zoya & Farhan Merchant",
      title: "Hyderabad Heirloom Maternity & Portrait",
      package: "Luxe Studio & Garden Heirloom",
      eventDate: "2026-09-02",
      price: 85000,
      paid: 85000,
      stage: "Delivered",
      deliveryDeadline: "2026-10-01",
      coverImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
      notes: [],
      activity: [],
      selectedPhotoIds: []
    },
    {
      id: "p7",
      clientId: "c1",
      clientName: "Rahul & Priya Sharma",
      title: "Alibaug Sunset Pre-Wedding Film",
      package: "Cinematic Drone & Portraiture",
      eventDate: "2026-10-01",
      price: 160000,
      paid: 160000,
      stage: "Delivered",
      deliveryDeadline: "2026-10-20",
      coverImage: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=800&auto=format&fit=crop",
      notes: [],
      activity: [],
      selectedPhotoIds: []
    },
    {
      id: "p8",
      clientId: "c2",
      clientName: "Ananya & Vikram Malhotra",
      title: "Delhi Farmhouse Sangeet & Reception",
      package: "Contemporary Luxe 2-Day",
      eventDate: "2026-09-28",
      price: 240000,
      paid: 180000,
      stage: "Album Design",
      deliveryDeadline: "2026-11-18",
      coverImage: "https://images.unsplash.com/photo-1546804784-896d0dca3805?q=80&w=800&auto=format&fit=crop",
      notes: [],
      activity: [],
      selectedPhotoIds: []
    }
  ],

  tasks: [
    {
      id: "t1",
      projectId: "p1",
      title: "Export Spread 04 color corrections for Rahul & Priya",
      description: "Lift bridal veil highlights by +10% and resharpen gold embroidery pearls.",
      dueDate: "2026-10-12",
      category: "Album Design",
      priority: "High",
      status: "In Progress",
      completed: false
    },
    {
      id: "t2",
      projectId: "p8",
      title: "Color grade Ananya & Vikram Sangeet 4K teaser",
      description: "Apply cinematic Kodak 2383 LUT and match gimbal exposure for night sangeet.",
      dueDate: "2026-10-14",
      category: "Editing",
      priority: "High",
      status: "To Do",
      completed: false
    },
    {
      id: "t3",
      projectId: "p3",
      title: "Send photo selection cloud gallery to Kavya & Rohan",
      description: "Upload 850 RAW proofs to private portal with client watermark.",
      dueDate: "2026-10-16",
      category: "Client Review",
      priority: "Medium",
      status: "To Do",
      completed: false
    },
    {
      id: "t4",
      projectId: "p5",
      title: "Order handcrafted Italian leather covers for Sneha & Tanmay",
      description: "12x36 layflat cover in Tuscan Cognac leather with embossed gold stamp.",
      dueDate: "2026-10-18",
      category: "Printing & Dispatch",
      priority: "Medium",
      status: "Done",
      completed: true
    },
    {
      id: "t5",
      projectId: "p4",
      title: "Pre-shoot lighting & drone recce for Ahmedabad Haveli",
      description: "Check GPS satellite lock inside central courtyard and setup 3-point Godox AD600 rigs.",
      dueDate: "2026-11-08",
      category: "Logistics & Recce",
      priority: "Low",
      status: "To Do",
      completed: false
    }
  ],

  calendarEvents: [
    { id: "e1", title: "Dr. Aarav & Meera - Haveli Shoot", date: "2026-11-12", type: "shoot", location: "Ahmedabad" },
    { id: "e2", title: "Rahul & Priya - Album Signoff Meet", date: "2026-10-15", type: "meeting", location: "Zoom / Studio" },
    { id: "e3", title: "Sneha & Tanmay - Album Print Dispatch", date: "2026-11-05", type: "deadline", location: "Studio Lab" },
    { id: "e4", title: "Ananya & Vikram - Video Feature Cut Delivery", date: "2026-12-10", type: "deadline", location: "Online Portal" }
  ],

  albumSpreads: [
    {
      id: "s1",
      projectId: "p1",
      title: "The Royal Procession & Arrival",
      badge: "Spread 01 of 06",
      leftImg: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop",
      notes: [
        { id: "n1_1", author: "Studio", text: "Opening double spread with panoramic vintage tone and royal gates.", resolved: true, time: "Oct 05, 2026" }
      ]
    },
    {
      id: "s2",
      projectId: "p1",
      title: "Mehendi Hues & Sitar Melodies",
      badge: "Spread 02 of 06",
      leftImg: "https://images.unsplash.com/photo-1546804784-896d0dca3805?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=900&auto=format&fit=crop",
      notes: [
        { id: "n2_1", author: "Rahul & Priya", text: "We love the candid sister laughter in the left frame!", resolved: true, time: "Oct 06, 2026" }
      ]
    },
    {
      id: "s3",
      projectId: "p1",
      title: "The Sacred Varmala & Floral Shower",
      badge: "Spread 03 of 06",
      leftImg: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=900&auto=format&fit=crop",
      notes: [
        { id: "n3_1", author: "Studio", text: "Added warm rose-gold flare to highlight the rose petal showers.", resolved: true, time: "Oct 07, 2026" }
      ]
    },
    {
      id: "s4",
      projectId: "p1",
      title: "Bridal Pheras & Sacred Vows",
      badge: "Spread 04 of 06",
      leftImg: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=900&auto=format&fit=crop",
      notes: [
        { id: "n4_1", author: "Priya (Client)", text: "Could we brighten the right side portrait by +10%? The bridal veil detail is gorgeous.", resolved: false, time: "Oct 09, 2026" },
        { id: "n4_2", author: "Studio Lead", text: "Color correction updated! Highlights lifted and veil embroidery sharpened.", resolved: true, time: "Oct 10, 2026" }
      ]
    },
    {
      id: "s5",
      projectId: "p1",
      title: "Sunset Portraits by Lake Pichola",
      badge: "Spread 05 of 06",
      leftImg: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop",
      notes: [
        { id: "n5_1", author: "Rahul (Client)", text: "Magnificent lighting on the boat portrait.", resolved: true, time: "Oct 08, 2026" }
      ]
    },
    {
      id: "s6",
      projectId: "p1",
      title: "Grand Evening Reception & First Dance",
      badge: "Spread 06 of 06",
      leftImg: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1546804784-896d0dca3805?q=80&w=900&auto=format&fit=crop",
      notes: [
        { id: "n6_1", author: "Studio", text: "Final concluding spread with champagne toast and fireworks.", resolved: true, time: "Oct 09, 2026" }
      ]
    },
    {
      id: "s201",
      projectId: "p2",
      title: "The Amber Fort Sangeet Gala",
      badge: "Spread 01 of 03",
      leftImg: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1546804784-896d0dca3805?q=80&w=900&auto=format&fit=crop",
      notes: [
        { id: "n201_1", author: "Ananya (Client)", text: "Please ensure the royal turquoise lehenga color is vibrant.", resolved: true, time: "Oct 08, 2026" }
      ]
    },
    {
      id: "s202",
      projectId: "p2",
      title: "Royal Baraat & Elephant Courtyard",
      badge: "Spread 02 of 03",
      leftImg: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=900&auto=format&fit=crop",
      notes: []
    },
    {
      id: "s203",
      projectId: "p2",
      title: "Palace Mandap Pheras & Royal Vows",
      badge: "Spread 03 of 03",
      leftImg: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=900&auto=format&fit=crop",
      notes: []
    },
    {
      id: "s501",
      projectId: "p5",
      title: "South Goa Sunset Shoreline Romance",
      badge: "Spread 01 of 03",
      leftImg: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=900&auto=format&fit=crop",
      notes: [
        { id: "n501_1", author: "Tanmay (Client)", text: "Loved the golden reflection on the shoreline.", resolved: true, time: "Oct 03, 2026" }
      ]
    },
    {
      id: "s502",
      projectId: "p5",
      title: "Cabo de Rama Cliffside Portraits",
      badge: "Spread 02 of 03",
      leftImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop",
      notes: []
    },
    {
      id: "s503",
      projectId: "p5",
      title: "Candlelight Beach Dinner & First Dance",
      badge: "Spread 03 of 03",
      leftImg: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=900&auto=format&fit=crop",
      rightImg: "https://images.unsplash.com/photo-1546804784-896d0dca3805?q=80&w=900&auto=format&fit=crop",
      notes: []
    }
  ],

  portalGallery: [
    { id: "gp_101", projectId: "p1", title: "Mehendi Courtyard Candid", tag: "Haldi & Mehendi", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_102", projectId: "p1", title: "Haldi Sunshine Ritual", tag: "Haldi & Mehendi", img: "https://images.unsplash.com/photo-1546804784-896d0dca3805?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_103", projectId: "p1", title: "Royal Baraat Procession", tag: "Pheras", img: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_104", projectId: "p1", title: "Sacred Mandap Pheras", tag: "Pheras", img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_105", projectId: "p1", title: "The Royal Sindoor Moment", tag: "Pheras", img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_106", projectId: "p1", title: "Lakefront Sunset Portrait", tag: "Reception", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_107", projectId: "p1", title: "Champagne Reception Gala", tag: "Reception", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_108", projectId: "p1", title: "First Dance under Chandeliers", tag: "Reception", img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_201", projectId: "p2", title: "Amber Fort Courtyard Sangeet", tag: "Sangeet & Dance", img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_202", projectId: "p2", title: "Royal Baraat Procession", tag: "Procession", img: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_203", projectId: "p2", title: "Palace Mandap Pheras", tag: "Pheras", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_204", projectId: "p2", title: "Grand Heritage Gala", tag: "Reception", img: "https://images.unsplash.com/photo-1546804784-896d0dca3805?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_301", projectId: "p3", title: "Glass House Evening Portraits", tag: "Portraits", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_302", projectId: "p3", title: "Cocktail Party Candid", tag: "Party", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_501", projectId: "p5", title: "Goa Sunset Shoreline", tag: "Beach Portraits", img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_502", projectId: "p5", title: "Cliffside Silhouette", tag: "Sunset", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_503", projectId: "p5", title: "Palm Grove Romance", tag: "Candid", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=700&auto=format&fit=crop" },
    { id: "gp_504", projectId: "p5", title: "Candlelight Beach Dinner", tag: "Evening", img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=700&auto=format&fit=crop" }
  ]
};

// --- App State ---
let appState = {
  activeView: 'dashboard',
  activeProjectId: 'p1', // Selected project for Workspace & Portal
  activeSpreadIndex: 3,  // Spread 4 by default for Rahul & Priya
  currentMonth: new Date(2026, 9, 1), // Oct 2026
  clientFilter: 'all',
  projectFilter: 'all',
  taskFilter: 'all',
  workspaceTaskFilter: 'all',
  portalGalleryFilter: 'all',
  portalGallerySelectedOnly: false,
  clients: [],
  projects: [],
  tasks: [],
  calendarEvents: [],
  albumSpreads: [],
  portalGallery: []
};

// Active pending deletion callbacks
let pendingDeleteAction = null;
let pendingBulkDeleteAction = null;

// ================= PROJECT HELPERS & DATA ARCHITECTURE =================
function getProject(projectId) {
  if (!projectId) return null;
  return appState.projects.find(p => p.id === projectId) || null;
}

function calculateWorkspaceProgress(project) {
  if (!project) return 0;
  const stageIdx = WORKSPACE_STAGES.indexOf(project.stage);
  if (stageIdx < 0) return 0;
  return Math.round((stageIdx / (WORKSPACE_STAGES.length - 1)) * 100);
}

function getProjectSpreads(projectId) {
  if (!projectId) return [];
  return (appState.albumSpreads || []).filter(s => s.projectId === projectId);
}

function addProjectSpread(projectId, spreadData) {
  if (!projectId || !spreadData) return null;
  const newSpread = {
    id: spreadData.id || ("spread_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4)),
    projectId: projectId,
    title: spreadData.title || "Untitled Spread",
    badge: spreadData.badge || `Spread ${getProjectSpreads(projectId).length + 1}`,
    leftImg: spreadData.leftImg || "",
    rightImg: spreadData.rightImg || "",
    notes: Array.isArray(spreadData.notes) ? spreadData.notes : []
  };
  appState.albumSpreads.push(newSpread);
  saveData();
  return newSpread;
}

function getProjectGallery(projectId) {
  if (!projectId) return [];
  return (appState.portalGallery || []).filter(g => g.projectId === projectId);
}

function addProjectGalleryPhoto(projectId, photoData) {
  if (!projectId || !photoData) return null;
  const newPhoto = {
    id: photoData.id || ("photo_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4)),
    projectId: projectId,
    title: photoData.title || "Untitled Photograph",
    tag: photoData.tag || "Highlights",
    img: photoData.img || ""
  };
  appState.portalGallery.push(newPhoto);
  saveData();
  return newPhoto;
}

function getProjectTasks(projectId) {
  if (!projectId) return [];
  return (appState.tasks || []).filter(t => t.projectId === projectId);
}

function getProjectNotes(projectId) {
  const p = getProject(projectId);
  return p && Array.isArray(p.notes) ? p.notes : [];
}

function addProjectNote(projectId, title, body, author) {
  const p = getProject(projectId);
  if (!p) return null;
  if (!Array.isArray(p.notes)) p.notes = [];
  const note = {
    id: "pnote_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    title: title || "Untitled Note",
    body: body || "",
    author: author || "Artisan Visuals",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  p.notes.unshift(note);
  addProjectActivity(projectId, "Note Created", `Project note added: "${note.title}"`);
  saveData();
  return note;
}

function getProjectActivity(projectId) {
  const p = getProject(projectId);
  return p && Array.isArray(p.activity) ? p.activity : [];
}

function addProjectActivity(projectId, action, details) {
  const p = getProject(projectId);
  if (!p) return;
  if (!Array.isArray(p.activity)) p.activity = [];
  const activityItem = {
    id: "act_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    action: action || "Update",
    details: details || "",
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  };
  p.activity.unshift(activityItem);
}

function updateProjectStage(projectId, newStage) {
  const p = getProject(projectId);
  if (!p) return;
  const oldStage = p.stage;
  if (oldStage === newStage) return;

  p.stage = newStage;
  addProjectActivity(projectId, "Stage Changed", `Production stage advanced from "${oldStage}" to "${newStage}"`);
  saveData();
  renderAllViews();
  showToast(`Updated "${p.title}" stage to "${newStage}"`);
}

function openProjectWorkspace(projectId) {
  const p = getProject(projectId);
  if (p) {
    appState.activeProjectId = projectId;
    navigateTo('workspace');
  }
}

function openProjectPortal(projectId) {
  const p = getProject(projectId);
  if (p) {
    appState.activeProjectId = projectId;
    appState.activeSpreadIndex = 0;
    navigateTo('portal');
  }
}

// ================= INITIALIZATION & SAFE MIGRATION =================
function initApp() {
  loadData();
  populateClientSelectOptions();
  populatePaymentProjectSelectOptions();
  populateTaskProjectSelectOptions();
  renderAllViews();

  // Keyboard navigation & Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      closeLightbox();
      pendingDeleteAction = null;
      pendingBulkDeleteAction = null;
    } else if (appState.activeView === 'portal') {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateSpread(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          navigateSpread(1);
        }
      }
    }
  });
}

function migrateData(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error("Invalid stored data structure");
  }

  const clients = Array.isArray(parsed.clients) ? parsed.clients : JSON.parse(JSON.stringify(DEFAULT_DATA.clients));

  // Projects migration
  const projects = Array.isArray(parsed.projects) ? parsed.projects.map(p => {
    return {
      ...p,
      notes: Array.isArray(p.notes) ? p.notes : [],
      activity: Array.isArray(p.activity) ? p.activity : [],
      selectedPhotoIds: Array.isArray(p.selectedPhotoIds) ? p.selectedPhotoIds : []
    };
  }) : JSON.parse(JSON.stringify(DEFAULT_DATA.projects));

  // Album spreads migration — assign projectId: 'p1' to unassigned spreads
  let albumSpreads = Array.isArray(parsed.albumSpreads) ? parsed.albumSpreads : JSON.parse(JSON.stringify(DEFAULT_DATA.albumSpreads));
  albumSpreads = albumSpreads.map(s => {
    const spread = { ...s };
    if (!spread.projectId) {
      spread.projectId = 'p1';
    }
    if (!Array.isArray(spread.notes)) {
      spread.notes = [];
    }
    return spread;
  });

  // Portal gallery migration — assign projectId: 'p1' and valid IDs to unassigned photos
  let portalGallery = Array.isArray(parsed.portalGallery) ? parsed.portalGallery : JSON.parse(JSON.stringify(DEFAULT_DATA.portalGallery));
  portalGallery = portalGallery.map((g, idx) => {
    const item = { ...g };
    if (!item.projectId) {
      item.projectId = 'p1';
    }
    if (!item.id) {
      item.id = `gp_${item.projectId}_${idx + 1}`;
    }
    return item;
  });

  // Tasks migration — preserve existing tasks and map project relationships reliably
  let tasks = Array.isArray(parsed.tasks) ? parsed.tasks : JSON.parse(JSON.stringify(DEFAULT_DATA.tasks));
  tasks = tasks.map(t => {
    const task = { ...t };
    if (task.projectId === undefined) {
      if (task.id === 't1' || (task.title && task.title.includes('Rahul & Priya'))) {
        task.projectId = 'p1';
      } else if (task.id === 't2' || (task.title && task.title.includes('Ananya & Vikram'))) {
        task.projectId = 'p8';
      } else if (task.id === 't3' || (task.title && task.title.includes('Kavya & Rohan'))) {
        task.projectId = 'p3';
      } else if (task.id === 't4' || (task.title && task.title.includes('Sneha & Tanmay'))) {
        task.projectId = 'p5';
      } else if (task.id === 't5' || (task.title && task.title.includes('Ahmedabad Haveli'))) {
        task.projectId = 'p4';
      } else {
        task.projectId = null;
      }
    }
    if (!task.priority) task.priority = 'Medium';
    if (!task.status) task.status = task.completed ? 'Done' : 'To Do';
    if (task.description === undefined) task.description = '';
    return task;
  });

  const calendarEvents = Array.isArray(parsed.calendarEvents) ? parsed.calendarEvents : JSON.parse(JSON.stringify(DEFAULT_DATA.calendarEvents));

  return {
    schemaVersion: 2,
    clients,
    projects,
    tasks,
    calendarEvents,
    albumSpreads,
    portalGallery
  };
}

function loadData() {
  const saved = localStorage.getItem('studioflow_data_v1');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const migrated = migrateData(parsed);
      appState.clients = migrated.clients;
      appState.projects = migrated.projects;
      appState.tasks = migrated.tasks;
      appState.calendarEvents = migrated.calendarEvents;
      appState.albumSpreads = migrated.albumSpreads;
      appState.portalGallery = migrated.portalGallery;

      // Validate activeProjectId
      if (!appState.projects.some(p => p.id === appState.activeProjectId)) {
        appState.activeProjectId = appState.projects[0]?.id || null;
      }
      return;
    } catch (e) {
      console.error("Error migrating stored data, retaining raw storage safely", e);
    }
  }

  // If no saved data, clone default
  const defaultClone = JSON.parse(JSON.stringify(DEFAULT_DATA));
  appState.clients = defaultClone.clients;
  appState.projects = defaultClone.projects;
  appState.tasks = defaultClone.tasks;
  appState.calendarEvents = defaultClone.calendarEvents;
  appState.albumSpreads = defaultClone.albumSpreads;
  appState.portalGallery = defaultClone.portalGallery;
  appState.activeProjectId = appState.projects[0]?.id || 'p1';
  saveData();
}

function saveData() {
  const payload = {
    schemaVersion: 2,
    clients: appState.clients,
    projects: appState.projects,
    tasks: appState.tasks,
    calendarEvents: appState.calendarEvents,
    albumSpreads: appState.albumSpreads,
    portalGallery: appState.portalGallery
  };
  localStorage.setItem('studioflow_data_v1', JSON.stringify(payload));
}

function resetDemoDataPrompt() {
  if (confirm("Reset demo data to initial prototype state? Any newly added clients, payments, tasks, or edits will be restored to defaults.")) {
    localStorage.removeItem('studioflow_data_v1');
    loadData();
    appState.activeProjectId = 'p1';
    appState.activeSpreadIndex = 3;
    populateClientSelectOptions();
    populatePaymentProjectSelectOptions();
    populateTaskProjectSelectOptions();
    renderAllViews();
    showToast("Prototype sample data restored successfully.");
  }
}

// --- Formatters ---
function formatINR(val) {
  if (val === undefined || val === null) return "₹0";
  return "₹" + Number(val).toLocaleString('en-IN');
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return dateStr;
}

function getBadgeClassForStage(stage) {
  switch (stage) {
    case 'Shoot Scheduled': return 'badge-scheduled';
    case 'Photo Selection': return 'badge-selection';
    case 'Editing': return 'badge-editing';
    case 'Album Design': return 'badge-design';
    case 'Client Review': return 'badge-review';
    case 'Revisions': return 'badge-revisions';
    case 'Approved': return 'badge-approved';
    case 'Delivered': return 'badge-delivered';
    default: return 'badge-review';
  }
}

// --- Navigation & View Switching ---
function navigateTo(viewId) {
  appState.activeView = viewId;

  // Update nav buttons
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
  });

  // Toggle screens
  document.querySelectorAll('.screen-view').forEach(sc => {
    sc.classList.toggle('active', sc.id === `view-${viewId}`);
  });

  // Update top toggle buttons
  const isClientView = (viewId === 'portal');
  const btnStudio = document.getElementById('btnModeStudio');
  const btnClient = document.getElementById('btnModeClient');
  if (btnStudio) btnStudio.classList.toggle('active', !isClientView);
  if (btnClient) btnClient.classList.toggle('active', isClientView);

  // Close mobile sidebar if open
  closeMobileSidebar();

  // Re-render specific screen view
  switch (viewId) {
    case 'dashboard': renderDashboard(); break;
    case 'clients': renderClientsTable(); break;
    case 'projects': renderProjectsGrid(); break;
    case 'workspace': renderProjectWorkspace(); break;
    case 'calendar': renderCalendarView(); break;
    case 'payments': renderPaymentsLedger(); break;
    case 'workflow': renderWorkflowBoard(); break;
    case 'portal': renderPortalView(); break;
    case 'tasks': renderTasksList(); break;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileSidebar() {
  const sb = document.getElementById('appSidebar');
  if (sb) sb.classList.toggle('mobile-open');
}

function closeMobileSidebar() {
  const sb = document.getElementById('appSidebar');
  if (sb) sb.classList.remove('mobile-open');
}

function switchAppMode(mode) {
  if (mode === 'client') {
    if (!appState.activeProjectId && appState.projects.length > 0) {
      appState.activeProjectId = appState.projects[0].id;
    }
    navigateTo('portal');
  } else {
    navigateTo('dashboard');
  }
}

function switchPortalTab(tabName) {
  document.querySelectorAll('.portal-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.portal-tab-content').forEach(c => c.style.display = 'none');

  if (tabName === 'album') {
    const tabBtn = document.getElementById('tabBtnAlbum');
    const content = document.getElementById('portalContentAlbum');
    if (tabBtn) tabBtn.classList.add('active');
    if (content) content.style.display = 'block';
    renderPortalSpreadViewer();
  } else if (tabName === 'gallery') {
    const tabBtn = document.getElementById('tabBtnGallery');
    const content = document.getElementById('portalContentGallery');
    if (tabBtn) tabBtn.classList.add('active');
    if (content) content.style.display = 'block';
    renderPortalGallery();
  } else if (tabName === 'deliverables') {
    const tabBtn = document.getElementById('tabBtnDeliverables');
    const content = document.getElementById('portalContentDeliverables');
    if (tabBtn) tabBtn.classList.add('active');
    if (content) content.style.display = 'block';
  }
}

// --- Render All Views ---
function renderAllViews() {
  updateBadgesAndKPIs();
  renderDashboard();
  renderClientsTable();
  renderProjectsGrid();
  renderProjectWorkspace();
  renderCalendarView();
  renderPaymentsLedger();
  renderWorkflowBoard();
  renderPortalView();
  renderTasksList();
}

function updateBadgesAndKPIs() {
  const activeProjects = appState.projects.filter(p => p.stage !== 'Delivered').length;
  const totalBalance = appState.projects.reduce((acc, p) => acc + (p.price - p.paid), 0);
  const awaitingApproval = appState.projects.filter(p => p.stage === 'Client Review' || p.stage === 'Revisions').length;
  const pendingTasks = appState.tasks.filter(t => !t.completed).length;

  const bClients = document.getElementById('badgeClientsCount');
  if (bClients) bClients.textContent = appState.clients.length;

  const bProjects = document.getElementById('badgeProjectsCount');
  if (bProjects) bProjects.textContent = appState.projects.length;

  const bTasks = document.getElementById('badgePendingTasksCount');
  if (bTasks) bTasks.textContent = pendingTasks;

  if (document.getElementById('kpiActiveProjects')) {
    document.getElementById('kpiActiveProjects').textContent = activeProjects;
  }
  if (document.getElementById('kpiOutstandingAmount')) {
    document.getElementById('kpiOutstandingAmount').textContent = formatINR(totalBalance);
  }
  if (document.getElementById('kpiAwaitingApproval')) {
    document.getElementById('kpiAwaitingApproval').textContent = awaitingApproval;
  }
}

// ================= 1. DASHBOARD =================
function renderDashboard() {
  updateBadgesAndKPIs();

  // Recent Projects Table
  const tbody = document.getElementById('tbodyDashboardProjects');
  if (tbody) {
    const recent = appState.projects.slice(0, 5);
    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-muted);">No active projects. Click "New Project" to add.</td></tr>`;
    } else {
      tbody.innerHTML = recent.map(p => {
        const bal = p.price - p.paid;
        return `
          <tr>
            <td>
              <div class="user-cell" style="cursor:pointer;" onclick="openProjectWorkspace('${p.id}')">
                <div class="avatar" style="width:34px; height:34px; font-size:11px;">
                  ${p.clientName.split('&')[0].trim().substring(0,1)}
                </div>
                <div class="user-cell-meta">
                  <div class="user-cell-name">${p.title}</div>
                  <div class="user-cell-sub">${p.clientName}</div>
                </div>
              </div>
            </td>
            <td>${formatDate(p.eventDate)}</td>
            <td><span class="badge ${getBadgeClassForStage(p.stage)}">${p.stage}</span></td>
            <td style="font-weight:600; color: ${bal > 0 ? '#b45309' : '#059669'};">
              ${bal > 0 ? formatINR(bal) : 'Paid'}
            </td>
            <td>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-secondary btn-sm" onclick="openProjectWorkspace('${p.id}')">Workspace</button>
                <button class="btn btn-primary btn-sm" onclick="openProjectPortal('${p.id}')">Portal →</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Dashboard Task widget
  const taskWrap = document.getElementById('dashboardTaskList');
  if (taskWrap) {
    const topTasks = appState.tasks.slice(0, 4);
    if (topTasks.length === 0) {
      taskWrap.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:13px;">No upcoming tasks.</div>`;
    } else {
      taskWrap.innerHTML = topTasks.map(t => {
        const linkedProject = t.projectId ? getProject(t.projectId) : null;
        return `
          <div class="task-item ${t.completed ? 'completed' : ''}">
            <div class="task-left">
              <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTaskComplete('${t.id}')">
              <div class="task-info">
                <div class="task-title">${t.title}</div>
                <div class="task-meta">
                  <span>📅 Due: ${formatDate(t.dueDate)}</span>
                  <span>•</span>
                  <span class="badge badge-design" style="padding: 1px 6px; font-size: 10px;">${t.category}</span>
                  ${linkedProject ? `<span>•</span><span style="font-size:10px; color:var(--accent-bronze); font-weight:600; cursor:pointer;" onclick="openProjectWorkspace('${linkedProject.id}')">${linkedProject.title}</span>` : ''}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Active Spread Revisions Section on Dashboard
  renderDashboardSpreadRevisions();
}

function renderDashboardSpreadRevisions() {
  const container = document.getElementById('dashboardSpreadRevisions');
  if (!container) return;

  const allNotes = [];
  appState.albumSpreads.forEach(s => {
    const project = getProject(s.projectId);
    if (Array.isArray(s.notes)) {
      s.notes.forEach(n => {
        allNotes.push({
          ...n,
          spreadId: s.id,
          spreadTitle: s.title,
          spreadBadge: s.badge,
          projectId: s.projectId,
          projectName: project ? project.title : 'Project',
          clientName: project ? project.clientName : 'Client'
        });
      });
    }
  });

  const unresolved = allNotes.filter(n => !n.resolved);

  if (allNotes.length === 0) {
    container.innerHTML = `
      <div style="background:#faf8f5; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px; text-align:center;">
        <div style="color:var(--text-muted); font-size:13px;">No revision requests recorded across spreads.</div>
      </div>
    `;
    return;
  }

  if (unresolved.length === 0) {
    container.innerHTML = `
      <div style="background:#faf8f5; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px; text-align:center;">
        <div style="color:#059669; font-weight:600; font-size:13px; margin-bottom:4px;">✓ All Album Spread Revisions Resolved (${allNotes.length} notes total)</div>
        <div style="font-size:12px; color:var(--text-muted);">No open client change requests pending action.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${unresolved.map(n => `
        <div style="background:#fff; border:1px solid #ebd9b6; border-left:4px solid var(--accent-bronze); border-radius:var(--radius-md); padding:12px 14px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
              <span class="badge badge-revisions" style="font-size:10px; padding:1px 6px;">${n.spreadTitle}</span>
              <span class="badge badge-design" style="font-size:10px; padding:1px 6px; cursor:pointer;" onclick="openProjectWorkspace('${n.projectId}')">${n.projectName}</span>
              <strong style="font-size:12px; color:var(--text-primary);">${n.author}</strong>
              <span style="font-size:11px; color:var(--text-muted);">${n.time || ''}</span>
            </div>
            <div style="font-size:13px; color:var(--text-secondary);">${n.text}</div>
          </div>
          <div style="display:flex; gap:6px; flex-shrink:0;">
            <button class="btn btn-secondary btn-sm" style="font-size:11px; padding:4px 8px;" onclick="goToSpreadFromStudio('${n.projectId}', '${n.spreadId}')">View Spread</button>
            <button class="btn btn-success btn-sm" style="font-size:11px; padding:4px 8px;" onclick="toggleSpreadNoteResolved('${n.spreadId}', '${n.id}')">✓ Resolve</button>
            <button class="btn btn-secondary btn-sm" style="font-size:11px; padding:4px 8px; color:#b91c1c;" onclick="confirmDeleteSpreadNote('${n.spreadId}', '${n.id}')" title="Delete note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function goToSpreadFromStudio(projectId, spreadId) {
  if (projectId) {
    appState.activeProjectId = projectId;
  }
  const spreads = getProjectSpreads(appState.activeProjectId);
  const idx = spreads.findIndex(s => s.id === spreadId);
  if (idx !== -1) {
    appState.activeSpreadIndex = idx;
  }
  navigateTo('portal');
}

// ================= 2. CLIENTS =================
function renderClientsTable() {
  const tbody = document.getElementById('tbodyClients');
  if (!tbody) return;

  const search = (document.getElementById('clientSearchInput')?.value || '').toLowerCase();

  const filtered = appState.clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search) ||
                          c.location.toLowerCase().includes(search) ||
                          c.email.toLowerCase().includes(search);
    const matchesType = (appState.clientFilter === 'all') || (c.eventType === appState.clientFilter);
    return matchesSearch && matchesType;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">No clients found. Click "Add New Client" to create one.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const clientProjects = appState.projects.filter(p => p.clientId === c.id);
    const projCountText = clientProjects.length === 1 ? '1 Project' : `${clientProjects.length} Projects`;
    
    return `
      <tr>
        <td>
          <div class="user-cell">
            <div class="avatar">${c.initials}</div>
            <div class="user-cell-meta">
              <div class="user-cell-name">${c.name}</div>
              <div class="user-cell-sub">${c.email}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="font-size:12px; color:var(--text-secondary);">${c.phone}</div>
          <div style="font-size:11px; color:var(--text-muted);">${c.email}</div>
        </td>
        <td>${c.location}</td>
        <td><span class="badge badge-scheduled">${c.eventType}</span></td>
        <td>
          <span style="font-weight:600; font-size:12px; color:var(--text-primary);">${projCountText}</span>
        </td>
        <td><span class="badge ${c.status === 'Delivered' ? 'badge-delivered' : 'badge-approved'}">${c.status}</span></td>
        <td>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="btn btn-secondary btn-sm" onclick="openEditClient('${c.id}')" title="Edit Client Details">Edit</button>
            ${clientProjects.length > 0 ? `
              <button class="btn btn-secondary btn-sm" onclick="openProjectWorkspace('${clientProjects[0].id}')">Workspace</button>
            ` : `
              <button class="btn btn-secondary btn-sm" onclick="openModalForClientProject('${c.id}')">+ Project</button>
            `}
            <button class="btn btn-secondary btn-sm" onclick="confirmDeleteClient('${c.id}')" title="Delete Client" style="color:#b91c1c; padding:5px 8px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterClients(type, btn) {
  appState.clientFilter = type;
  document.querySelectorAll('#view-clients .filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderClientsTable();
}

function openClientProject(projectId) {
  openProjectWorkspace(projectId);
}

// ================= 3. PROJECTS =================
function renderProjectsGrid() {
  const container = document.getElementById('projectsGridContainer');
  if (!container) return;

  const search = (document.getElementById('projectSearchInput')?.value || '').toLowerCase();

  const filtered = appState.projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search) ||
                          p.clientName.toLowerCase().includes(search) ||
                          p.package.toLowerCase().includes(search);
    const matchesStage = (appState.projectFilter === 'all') || (p.stage === appState.projectFilter);
    return matchesSearch && matchesStage;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">No photography projects found. Click "Create Project" to add one.</div>`;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const bal = p.price - p.paid;

    return `
      <div class="project-card">
        <div class="project-card-cover" style="cursor:pointer;" onclick="openProjectWorkspace('${p.id}')">
          <img src="${p.coverImage}" alt="${p.title}">
          <span class="badge ${getBadgeClassForStage(p.stage)} project-card-badge">${p.stage}</span>
        </div>
        <div class="project-card-content">
          <div class="project-card-title" style="cursor:pointer;" onclick="openProjectWorkspace('${p.id}')">${p.title}</div>
          <div class="project-card-package">${p.package} • ${p.clientName}</div>

          <div class="project-card-stats">
            <div class="project-stat-item">
              <span class="stat-label">Event Date</span>
              <span class="stat-value">${formatDate(p.eventDate)}</span>
            </div>
            <div class="project-stat-item">
              <span class="stat-label">Delivery Deadline</span>
              <span class="stat-value">${formatDate(p.deliveryDeadline)}</span>
            </div>
            <div class="project-stat-item">
              <span class="stat-label">Total Contract</span>
              <span class="stat-value">${formatINR(p.price)}</span>
            </div>
            <div class="project-stat-item">
              <span class="stat-label">Balance Due</span>
              <span class="stat-value" style="color:${bal > 0 ? '#b45309' : '#059669'};">${bal > 0 ? formatINR(bal) : 'Fully Paid'}</span>
            </div>
          </div>

          <div class="project-card-footer">
            <div style="display:flex; gap:6px;">
              <button class="btn btn-secondary btn-sm" onclick="openProjectWorkspace('${p.id}')" title="Open Project Workspace">
                Workspace
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openProjectEdit('${p.id}')" title="Edit Project">Edit</button>
              <button class="btn btn-secondary btn-sm" onclick="confirmDeleteProject('${p.id}')" title="Delete Project" style="color:#b91c1c; padding:6px 8px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
            <button class="btn btn-primary btn-sm" onclick="openProjectPortal('${p.id}')">
              <span>Portal</span> →
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterProjects(stage, btn) {
  appState.projectFilter = stage;
  document.querySelectorAll('#view-projects .filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProjectsGrid();
}

function quickAdvanceStage(projectId) {
  const stages = [
    'Shoot Scheduled', 'Photo Selection', 'Editing', 'Album Design',
    'Client Review', 'Revisions', 'Approved', 'Delivered'
  ];
  const p = getProject(projectId);
  if (p) {
    const idx = stages.indexOf(p.stage);
    if (idx < stages.length - 1) {
      updateProjectStage(projectId, stages[idx + 1]);
    } else {
      showToast(`Project is already Delivered!`);
    }
  }
}

// ================= NOTION-INSPIRED PROJECT WORKSPACE =================
const WORKSPACE_STAGES = [
  'Shoot Scheduled',
  'Photo Selection',
  'Editing',
  'Album Design',
  'Client Review',
  'Revisions',
  'Approved',
  'Delivered'
];

function renderProjectWorkspace() {
  const container = document.getElementById('projectWorkspaceContainer');
  if (!container) return;

  const project = getProject(appState.activeProjectId);
  if (!project) {
    container.innerHTML = `
      <div style="text-align:center; padding:60px 20px; background:#fff; border:1px solid var(--border-color); border-radius:var(--radius-lg);">
        <div style="font-size:40px; margin-bottom:12px;">📁</div>
        <h3 style="font-family:var(--font-serif); font-size:22px; color:var(--text-primary); margin-bottom:8px;">No Project Selected</h3>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:20px;">Please select an active photography project from your directory.</p>
        <button class="btn btn-primary" onclick="navigateTo('projects')">← Back to Projects</button>
      </div>
    `;
    return;
  }

  const client = appState.clients.find(c => c.id === project.clientId);
  const bal = project.price - project.paid;
  const projectTasks = getProjectTasks(project.id);
  const completedTasks = projectTasks.filter(t => t.completed).length;
  const pendingTasks = projectTasks.length - completedTasks;
  const projectNotes = getProjectNotes(project.id);
  const projectActivity = getProjectActivity(project.id);

  // Filter tasks in workspace
  const filteredTasks = projectTasks.filter(t => {
    if (appState.workspaceTaskFilter === 'all') return true;
    if (appState.workspaceTaskFilter === 'To Do') return !t.completed && t.status !== 'In Progress';
    if (appState.workspaceTaskFilter === 'In Progress') return !t.completed && t.status === 'In Progress';
    if (appState.workspaceTaskFilter === 'Done') return t.completed || t.status === 'Done';
    return true;
  });

  const currentStageIndex = WORKSPACE_STAGES.indexOf(project.stage);

  container.innerHTML = `
    <div class="workspace-view-wrapper">
      
      <!-- Top Breadcrumb Bar -->
      <div class="workspace-breadcrumb-bar">
        <div class="workspace-breadcrumb">
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('projects')">← Back to Projects</button>
          <span class="workspace-breadcrumb-separator">/</span>
          <span class="workspace-breadcrumb-current">${project.title}</span>
        </div>

        <div style="display:flex; gap:8px; align-items:center;">
          <button class="btn btn-secondary btn-sm" onclick="openRecordPaymentForProject('${project.id}')">
            + Record Payment
          </button>
          <button class="btn btn-secondary btn-sm" onclick="openProjectEdit('${project.id}')">
            Edit Project
          </button>
          <button class="btn btn-primary btn-sm" onclick="openProjectPortal('${project.id}')">
            Client Portal →
          </button>
        </div>
      </div>

      <!-- Hero Header & Properties Card -->
      <div class="workspace-hero-card">
        <div class="workspace-hero-top">
          <div class="workspace-title-group">
            <img src="${project.coverImage}" alt="${project.title}" class="workspace-cover-thumb">
            <div>
              <h1 class="workspace-title-main">${project.title}</h1>
              <div class="workspace-subtitle">
                <span><strong>${project.clientName}</strong></span>
                <span>•</span>
                <span>${project.package}</span>
                <span>•</span>
                <span class="badge ${getBadgeClassForStage(project.stage)}">${project.stage}</span>
              </div>
            </div>
          </div>

          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-sm" onclick="openCreateTaskForProject('${project.id}')">+ New Task</button>
            <button class="btn btn-secondary btn-sm" onclick="openCreateNoteModal('${project.id}')">+ Add Note</button>
          </div>
        </div>

        <!-- Notion-Style Properties Strip -->
        <div class="workspace-properties-grid">
          <div class="workspace-property-cell">
            <span class="workspace-prop-label">Event Date</span>
            <span class="workspace-prop-value">📅 ${formatDate(project.eventDate)}</span>
          </div>
          <div class="workspace-property-cell">
            <span class="workspace-prop-label">Delivery Deadline</span>
            <span class="workspace-prop-value">🎯 ${formatDate(project.deliveryDeadline)}</span>
          </div>
          <div class="workspace-property-cell">
            <span class="workspace-prop-label">Financials</span>
            <span class="workspace-prop-value" style="color:${bal > 0 ? '#b45309' : '#059669'};">
              ${formatINR(project.paid)} / ${formatINR(project.price)} (Bal: ${formatINR(bal)})
            </span>
          </div>
          <div class="workspace-property-cell">
            <span class="workspace-prop-label">Task Progress</span>
            <span class="workspace-prop-value">
              ${completedTasks} / ${projectTasks.length} Completed ${projectTasks.length > 0 ? `(${Math.round((completedTasks / projectTasks.length) * 100)}%)` : ''}
            </span>
          </div>
        </div>
      </div>

      <!-- Interactive 8-Stage Progress Tracker -->
      <div class="workspace-stepper-container">
        <div class="workspace-stepper-title-row">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">Production Stage Tracker</span>
            <span class="badge ${getBadgeClassForStage(project.stage)}" style="font-size:11px;">Current: ${project.stage}</span>
          </div>
          <div style="font-size:12px; color:var(--text-secondary);">Click any stage to update</div>
        </div>

        <div class="workspace-stages-track">
          ${WORKSPACE_STAGES.map((s, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = (s === project.stage);
            const isPending = idx > currentStageIndex;

            let stateClass = 'pending';
            if (isCompleted) stateClass = 'completed';
            if (isCurrent) stateClass = 'current';

            return `
              <div class="workspace-stage-node ${stateClass}" onclick="updateProjectStage('${project.id}', '${s}')" title="Set stage to ${s}">
                <div class="workspace-stage-bubble">
                  ${isCompleted ? '✓' : (idx + 1)}
                </div>
                <div class="workspace-stage-name">${s}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Main Workspace 2-Column Grid -->
      <div class="workspace-layout-grid">
        
        <!-- Left / Center Column: Tasks & Notes -->
        <div style="display:flex; flex-direction:column; gap:24px;">
          
          <!-- Section 1: Project Tasks Database -->
          <div class="card" style="margin-bottom:0;">
            <div class="card-header" style="flex-wrap:wrap; gap:12px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="card-title">Project Tasks Database</div>
                <span class="badge badge-scheduled" style="font-size:11px;">${completedTasks}/${projectTasks.length} Done</span>
              </div>

              <div style="display:flex; gap:8px; align-items:center;">
                <div class="filter-pills" style="margin-bottom:0;">
                  <button class="filter-pill ${appState.workspaceTaskFilter === 'all' ? 'active' : ''}" onclick="filterWorkspaceTasks('all', this)">All</button>
                  <button class="filter-pill ${appState.workspaceTaskFilter === 'To Do' ? 'active' : ''}" onclick="filterWorkspaceTasks('To Do', this)">To Do</button>
                  <button class="filter-pill ${appState.workspaceTaskFilter === 'In Progress' ? 'active' : ''}" onclick="filterWorkspaceTasks('In Progress', this)">In Progress</button>
                  <button class="filter-pill ${appState.workspaceTaskFilter === 'Done' ? 'active' : ''}" onclick="filterWorkspaceTasks('Done', this)">Done</button>
                </div>
                <button class="btn btn-primary btn-sm" onclick="openCreateTaskForProject('${project.id}')">+ Add Task</button>
              </div>
            </div>

            <div class="table-responsive">
              ${filteredTasks.length === 0 ? `
                <div style="text-align:center; padding:32px 20px; color:var(--text-muted); font-size:13px;">
                  No tasks matching this filter. Click "+ Add Task" to create one.
                </div>
              ` : `
                <table class="notion-task-table">
                  <thead>
                    <tr>
                      <th style="width:36px;"></th>
                      <th>Task Title & Details</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th style="text-align:right;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredTasks.map(t => {
                      const isOverdue = !t.completed && t.dueDate && (new Date(t.dueDate) < new Date(2026, 9, 10));
                      let priorityClass = 'badge-priority-medium';
                      if (t.priority === 'High') priorityClass = 'badge-priority-high';
                      if (t.priority === 'Low') priorityClass = 'badge-priority-low';

                      return `
                        <tr>
                          <td>
                            <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTaskComplete('${t.id}')">
                          </td>
                          <td>
                            <div class="notion-task-title-cell">
                              <div>
                                <div class="notion-task-title-text" style="${t.completed ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${t.title}</div>
                                ${t.description ? `<div class="notion-task-desc-sub">${t.description}</div>` : ''}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span class="badge badge-scheduled" style="font-size:10px;">${t.category}</span>
                          </td>
                          <td>
                            <span class="badge ${priorityClass}" style="font-size:10px;">${t.priority || 'Medium'}</span>
                          </td>
                          <td>
                            <span class="badge ${t.completed ? 'badge-approved' : (t.status === 'In Progress' ? 'badge-editing' : 'badge-review')}" style="font-size:10px;">
                              ${t.completed ? 'Done' : (t.status || 'To Do')}
                            </span>
                          </td>
                          <td>
                            <div style="font-size:12px; ${isOverdue ? 'color:#b91c1c; font-weight:600;' : ''}">
                              ${formatDate(t.dueDate)}
                              ${isOverdue ? `<span class="badge-overdue">Overdue</span>` : ''}
                            </div>
                          </td>
                          <td style="text-align:right;">
                            <div style="display:inline-flex; gap:6px;">
                              <button class="btn btn-secondary btn-sm" style="font-size:11px; padding:3px 7px;" onclick="openEditTaskModal('${t.id}')">Edit</button>
                              <button class="btn btn-secondary btn-sm" style="font-size:11px; padding:3px 7px; color:#b91c1c;" onclick="confirmDeleteTask('${t.id}')" title="Delete Task">✕</button>
                            </div>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              `}
            </div>
          </div>

          <!-- Section 2: Project Notes & Specifications -->
          <div class="card" style="margin-bottom:0;">
            <div class="card-header">
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="card-title">Project Notes & Specifications</div>
                <span class="badge badge-design" style="font-size:11px;">${projectNotes.length} Document${projectNotes.length === 1 ? '' : 's'}</span>
              </div>
              <button class="btn btn-primary btn-sm" onclick="openCreateNoteModal('${project.id}')">+ New Note</button>
            </div>

            ${projectNotes.length === 0 ? `
              <div style="text-align:center; padding:40px 20px; background:#faf9f6; border:1px dashed var(--border-color); border-radius:var(--radius-md);">
                <div style="font-size:32px; margin-bottom:8px;">📝</div>
                <h4 style="font-size:15px; font-weight:600; color:var(--text-primary); margin-bottom:4px;">No Notes Created Yet</h4>
                <p style="font-size:13px; color:var(--text-secondary); max-width:400px; margin:0 auto 16px;">
                  Add shot lists, couple lighting preferences, vendor details, or creative specs for ${project.title}.
                </p>
                <button class="btn btn-secondary btn-sm" onclick="openCreateNoteModal('${project.id}')">+ Create First Note</button>
              </div>
            ` : `
              <div class="workspace-notes-grid">
                ${projectNotes.map(n => `
                  <div class="workspace-note-card">
                    <div>
                      <div class="workspace-note-header">
                        <h4 class="workspace-note-title">${n.title}</h4>
                        <div style="display:flex; gap:4px;">
                          <button class="btn btn-secondary btn-sm" style="font-size:10px; padding:2px 6px;" onclick="openEditNoteModal('${project.id}', '${n.id}')">Edit</button>
                          <button class="btn btn-secondary btn-sm" style="font-size:10px; padding:2px 6px; color:#b91c1c;" onclick="confirmDeleteProjectNote('${project.id}', '${n.id}')" title="Delete note">✕</button>
                        </div>
                      </div>
                      <div class="workspace-note-body">${n.body}</div>
                    </div>
                    <div class="workspace-note-meta">
                      <span>👤 ${n.author || 'Studio'}</span>
                      <span>📅 ${formatDate(n.updatedAt ? n.updatedAt.split('T')[0] : (n.createdAt ? n.createdAt.split('T')[0] : '2026-10-10'))}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

        </div>

        <!-- Right Side Column: Client Summary & Activity History -->
        <div style="display:flex; flex-direction:column; gap:24px;">
          
          <!-- Client & Package Details Card -->
          <div class="card" style="margin-bottom:0;">
            <div class="card-header">
              <div class="card-title">Client & Package Overview</div>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:12px; font-size:13px;">
              <div>
                <span style="font-size:11px; text-transform:uppercase; font-weight:600; color:var(--text-muted); display:block;">Primary Client</span>
                <strong style="color:var(--text-primary); font-size:14px;">${project.clientName}</strong>
                ${client ? `
                  <div style="color:var(--text-secondary); margin-top:2px;">✉️ ${client.email}</div>
                  <div style="color:var(--text-secondary); margin-top:1px;">📞 ${client.phone}</div>
                  <div style="color:var(--text-secondary); margin-top:1px;">📍 ${client.location}</div>
                ` : ''}
              </div>

              <div style="border-top:1px solid var(--border-light); padding-top:10px;">
                <span style="font-size:11px; text-transform:uppercase; font-weight:600; color:var(--text-muted); display:block;">Package & Coverage</span>
                <strong>${project.package}</strong>
              </div>

              <div style="border-top:1px solid var(--border-light); padding-top:10px;">
                <span style="font-size:11px; text-transform:uppercase; font-weight:600; color:var(--text-muted); display:block;">Contract Ledger</span>
                <div style="display:flex; justify-content:space-between; margin-top:3px;">
                  <span>Agreed Price:</span>
                  <strong>${formatINR(project.price)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; color:#059669;">
                  <span>Paid to Date:</span>
                  <strong>${formatINR(project.paid)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; color:#b45309; font-weight:600;">
                  <span>Outstanding:</span>
                  <span>${formatINR(bal)}</span>
                </div>
              </div>

              <div style="margin-top:4px;">
                <button class="btn btn-secondary btn-sm" style="width:100%; justify-content:center;" onclick="openRecordPaymentForProject('${project.id}')">
                  + Record Payment Installment
                </button>
              </div>
            </div>
          </div>

          <!-- Recent Project Activity Feed -->
          <div class="card" style="margin-bottom:0;">
            <div class="card-header">
              <div class="card-title">Recent Project Activity</div>
            </div>

            ${projectActivity.length === 0 ? `
              <div style="text-align:center; padding:24px 10px; color:var(--text-muted); font-size:12.5px;">
                No activity recorded yet for this project.
              </div>
            ` : `
              <div class="workspace-activity-timeline">
                ${projectActivity.slice(0, 8).map(act => `
                  <div class="workspace-activity-row">
                    <div class="workspace-activity-dot">⚡</div>
                    <div class="workspace-activity-content">
                      <div class="workspace-activity-action">${act.action}</div>
                      <div class="workspace-activity-details">${act.details}</div>
                      <div class="workspace-activity-time">${act.formattedTime || formatDate(act.timestamp ? act.timestamp.split('T')[0] : '')}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

        </div>

      </div>

    </div>
  `;
}

function filterWorkspaceTasks(status, btn) {
  appState.workspaceTaskFilter = status;
  renderProjectWorkspace();
}

// ================= WORKSPACE TASK & NOTE MODAL HANDLERS =================
function openCreateTaskForProject(projectId) {
  const form = document.getElementById('formNewTask');
  if (form && typeof form.reset === 'function') form.reset();

  const titleHeading = document.getElementById('modalTaskHeading');
  if (titleHeading) titleHeading.textContent = "Create Studio Task";

  const btnText = document.getElementById('btnSaveTaskText');
  if (btnText) btnText.textContent = "Add Task";

  const inputId = document.getElementById('inputTaskId');
  if (inputId) inputId.value = "";

  const selProj = document.getElementById('selectTaskProject');
  if (selProj) {
    populateTaskProjectSelectOptions();
    selProj.value = projectId || "";
  }

  const inputDue = document.getElementById('inputTaskDueDate');
  if (inputDue) inputDue.value = "2026-10-20";

  openModal('modalNewTask');
}

function openEditTaskModal(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;

  const titleHeading = document.getElementById('modalTaskHeading');
  if (titleHeading) titleHeading.textContent = `Edit Task: ${task.title}`;

  const btnText = document.getElementById('btnSaveTaskText');
  if (btnText) btnText.textContent = "Update Task";

  const inputId = document.getElementById('inputTaskId');
  if (inputId) inputId.value = task.id;

  const inputTitle = document.getElementById('inputTaskTitle');
  if (inputTitle) inputTitle.value = task.title;

  const inputDesc = document.getElementById('inputTaskDescription');
  if (inputDesc) inputDesc.value = task.description || "";

  const selProj = document.getElementById('selectTaskProject');
  if (selProj) {
    populateTaskProjectSelectOptions();
    selProj.value = task.projectId || "";
  }

  const inputDue = document.getElementById('inputTaskDueDate');
  if (inputDue) inputDue.value = task.dueDate || "";

  const selCat = document.getElementById('selectTaskCategory');
  if (selCat) selCat.value = task.category || "Editing";

  const selPri = document.getElementById('selectTaskPriority');
  if (selPri) selPri.value = task.priority || "Medium";

  const selStat = document.getElementById('selectTaskStatus');
  if (selStat) selStat.value = task.status || (task.completed ? "Done" : "To Do");

  openModal('modalNewTask');
}

function openCreateNoteModal(projectId) {
  const form = document.getElementById('formProjectNote');
  if (form && typeof form.reset === 'function') form.reset();

  const titleHeading = document.getElementById('modalNoteHeading');
  if (titleHeading) titleHeading.textContent = "Add Project Note";

  const btnText = document.getElementById('btnSaveNoteText');
  if (btnText) btnText.textContent = "Save Note";

  const inputId = document.getElementById('inputNoteId');
  if (inputId) inputId.value = "";

  const inputProjId = document.getElementById('inputNoteProjectId');
  if (inputProjId) inputProjId.value = projectId || appState.activeProjectId || "";

  const inputAuthor = document.getElementById('inputNoteAuthor');
  if (inputAuthor) inputAuthor.value = "Artisan Visuals";

  openModal('modalProjectNote');
}

function openEditNoteModal(projectId, noteId) {
  const p = getProject(projectId);
  if (!p || !Array.isArray(p.notes)) return;

  const note = p.notes.find(n => n.id === noteId);
  if (!note) return;

  const titleHeading = document.getElementById('modalNoteHeading');
  if (titleHeading) titleHeading.textContent = `Edit Note: ${note.title}`;

  const btnText = document.getElementById('btnSaveNoteText');
  if (btnText) btnText.textContent = "Update Note";

  const inputId = document.getElementById('inputNoteId');
  if (inputId) inputId.value = note.id;

  const inputProjId = document.getElementById('inputNoteProjectId');
  if (inputProjId) inputProjId.value = projectId;

  const inputTitle = document.getElementById('inputNoteTitle');
  if (inputTitle) inputTitle.value = note.title;

  const inputBody = document.getElementById('inputNoteBody');
  if (inputBody) inputBody.value = note.body;

  const inputAuthor = document.getElementById('inputNoteAuthor');
  if (inputAuthor) inputAuthor.value = note.author || "Artisan Visuals";

  openModal('modalProjectNote');
}

function handleSaveProjectNote(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const form = (e && e.target) || {};
  const noteId = (form.noteId ? form.noteId.value : (document.getElementById('inputNoteId')?.value || ''));
  const projectId = (form.projectId ? form.projectId.value : (document.getElementById('inputNoteProjectId')?.value || ''));
  const title = (form.title ? form.title.value : (document.getElementById('inputNoteTitle')?.value || '')).trim();
  const body = (form.body ? form.body.value : (document.getElementById('inputNoteBody')?.value || '')).trim();
  const author = ((form.author ? form.author.value : (document.getElementById('inputNoteAuthor')?.value || ''))).trim() || "Artisan Visuals";

  if (!title || !body) {
    showToast("Please provide a note title and content.");
    return;
  }

  const p = getProject(projectId);
  if (!p) {
    showToast("Project not found.");
    return;
  }

  if (!Array.isArray(p.notes)) p.notes = [];

  if (noteId) {
    // Edit existing note
    const note = p.notes.find(n => n.id === noteId);
    if (note) {
      note.title = title;
      note.body = body;
      note.author = author;
      note.updatedAt = new Date().toISOString();
      addProjectActivity(projectId, "Note Edited", `Updated note: "${title}"`);
      showToast(`Note "${title}" updated.`);
    }
  } else {
    // Create new note
    const newNote = {
      id: "pnote_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      title: title,
      body: body,
      author: author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    p.notes.unshift(newNote);
    addProjectActivity(projectId, "Note Created", `Added note: "${title}"`);
    showToast(`Note "${title}" created.`);
  }

  saveData();
  closeModal('modalProjectNote');
  if (form && typeof form.reset === 'function') form.reset();
  renderProjectWorkspace();
}

function confirmDeleteProjectNote(projectId, noteId) {
  const p = getProject(projectId);
  if (!p || !Array.isArray(p.notes)) return;

  const note = p.notes.find(n => n.id === noteId);
  if (!note) return;

  showDeleteConfirmation({
    title: "Delete Project Note",
    heading: `Delete "${note.title}"?`,
    message: `Are you sure you want to remove this project note? This action cannot be undone.`,
    warning: null,
    onConfirm: () => {
      p.notes = p.notes.filter(n => n.id !== noteId);
      addProjectActivity(projectId, "Note Deleted", `Removed note: "${note.title}"`);
      saveData();
      renderProjectWorkspace();
      showToast("Project note deleted.");
    }
  });
}

// ================= 4. PRODUCTION WORKFLOW (KANBAN) =================
function renderWorkflowBoard() {
  const container = document.getElementById('kanbanBoardContainer');
  if (!container) return;

  container.innerHTML = WORKSPACE_STAGES.map(stage => {
    const stageProjects = appState.projects.filter(p => p.stage === stage);

    return `
      <div class="kanban-column">
        <div class="kanban-column-header">
          <span>${stage}</span>
          <span class="kanban-column-count">${stageProjects.length}</span>
        </div>
        <div class="kanban-column-body">
          ${stageProjects.map(p => `
            <div class="kanban-card" onclick="openProjectWorkspace('${p.id}')">
              <div class="kanban-card-title">${p.title}</div>
              <div class="kanban-card-sub">${p.clientName}</div>
              
              <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
                📅 Target: ${formatDate(p.deliveryDeadline)}
              </div>

              <div class="kanban-card-footer" onclick="event.stopPropagation()">
                <span>Stage:</span>
                <select class="kanban-stage-selector" onchange="changeProjectStageFromSelect('${p.id}', this.value)">
                  ${WORKSPACE_STAGES.map(s => `
                    <option value="${s}" ${s === p.stage ? 'selected' : ''}>${s}</option>
                  `).join('')}
                </select>
              </div>
            </div>
          `).join('')}
          ${stageProjects.length === 0 ? `<div style="font-size:11px; color:var(--text-muted); text-align:center; padding:16px;">No projects in this stage</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function changeProjectStageFromSelect(projectId, newStage) {
  updateProjectStage(projectId, newStage);
}

// ================= 5. CALENDAR =================
function renderCalendarView() {
  const monthTitle = document.getElementById('calMonthTitle');
  const grid = document.getElementById('calendarDaysGrid');
  const list = document.getElementById('calendarEventsList');
  if (!grid || !monthTitle) return;

  const currentYear = appState.currentMonth.getFullYear();
  const currentMonth = appState.currentMonth.getMonth();

  monthTitle.textContent = appState.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Day headers
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let html = dayNames.map(d => `<div class="cal-header-day">${d}</div>`).join('');

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<div class="cal-day-cell other-month"><span class="cal-day-num">${prevMonthDays - i}</span></div>`;
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = appState.calendarEvents.filter(e => e.date === dateKey);

    // Project event dates
    const projectShoots = appState.projects.filter(p => p.eventDate === dateKey);

    html += `
      <div class="cal-day-cell ${day === 10 && currentMonth === 9 ? 'today' : ''}">
        <span class="cal-day-num">${day}</span>
        ${projectShoots.map(p => `
          <div class="cal-event-pill event-shoot" title="Shoot: ${p.title}" onclick="openProjectWorkspace('${p.id}')">
            📸 ${p.clientName.split('&')[0].trim()} Shoot
          </div>
        `).join('')}
        ${dayEvents.map(e => `
          <div class="cal-event-pill event-${e.type}" title="${e.title} (Click to remove)" onclick="confirmDeleteEvent('${e.id}')">
            ${e.type === 'meeting' ? '☕' : '📦'} ${e.title}
          </div>
        `).join('')}
      </div>
    `;
  }

  grid.innerHTML = html;

  // Chronological list
  if (list) {
    if (appState.calendarEvents.length === 0) {
      list.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:13px;">No schedule events. Click "+ Add Schedule Event" to add.</div>`;
    } else {
      const sorted = [...appState.calendarEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
      list.innerHTML = sorted.map(e => `
        <div class="task-item">
          <div class="task-left">
            <span style="font-size: 18px;">${e.type === 'shoot' ? '📸' : (e.type === 'meeting' ? '☕' : '📦')}</span>
            <div class="task-info">
              <div class="task-title">${e.title}</div>
              <div class="task-meta">
                <span>📅 ${formatDate(e.date)}</span>
                <span>•</span>
                <span>📍 ${e.location || 'Studio'}</span>
              </div>
            </div>
          </div>
          <div>
            <button class="btn btn-secondary btn-sm" onclick="confirmDeleteEvent('${e.id}')" title="Remove event" style="color:#b91c1c; padding:4px 8px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        </div>
      `).join('');
    }
  }
}

function changeCalendarMonth(delta) {
  appState.currentMonth = new Date(appState.currentMonth.getFullYear(), appState.currentMonth.getMonth() + delta, 1);
  renderCalendarView();
}

// ================= 6. PAYMENTS & FINANCIALS =================
function renderPaymentsLedger() {
  const tbody = document.getElementById('tbodyPayments');
  if (!tbody) return;

  const totalContract = appState.projects.reduce((sum, p) => sum + p.price, 0);
  const totalPaid = appState.projects.reduce((sum, p) => sum + p.paid, 0);
  const totalOutstanding = totalContract - totalPaid;

  const finContract = document.getElementById('finTotalContract');
  if (finContract) finContract.textContent = formatINR(totalContract);

  const finPaid = document.getElementById('finTotalCollected');
  if (finPaid) finPaid.textContent = formatINR(totalPaid);

  const finBal = document.getElementById('finTotalOutstanding');
  if (finBal) finBal.textContent = formatINR(totalOutstanding);

  const percentCollected = Math.round((totalPaid / (totalContract || 1)) * 100);
  const bar = document.getElementById('finCollectedBar');
  if (bar) bar.style.width = `${percentCollected}%`;

  if (appState.projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">No projects recorded in ledger.</td></tr>`;
    return;
  }

  tbody.innerHTML = appState.projects.map(p => {
    const bal = p.price - p.paid;
    let badgeClass = 'badge-paid';
    let badgeText = 'Paid in Full';

    if (bal > 0 && p.paid > 0) {
      badgeClass = 'badge-partial';
      badgeText = 'Partial Payment';
    } else if (bal === p.price) {
      badgeClass = 'badge-unpaid';
      badgeText = 'Unpaid Retainer';
    }

    return `
      <tr>
        <td>
          <div class="user-cell" style="cursor:pointer;" onclick="openProjectWorkspace('${p.id}')">
            <div class="avatar" style="width:34px; height:34px; font-size:11px;">
              ${p.clientName.substring(0, 2).toUpperCase()}
            </div>
            <div class="user-cell-meta">
              <div class="user-cell-name">${p.title}</div>
              <div class="user-cell-sub">${p.clientName}</div>
            </div>
          </div>
        </td>
        <td style="font-weight:600;">${formatINR(p.price)}</td>
        <td style="color:#059669; font-weight:600;">${formatINR(p.paid)}</td>
        <td style="color:#b45309; font-weight:600;">${bal > 0 ? formatINR(bal) : '₹0'}</td>
        <td><span class="badge ${badgeClass}">${badgeText}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="openRecordPaymentForProject('${p.id}')">
            + Record Payment
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openRecordPaymentForProject(projectId) {
  openModal('modalRecordPayment');
  const sel = document.getElementById('selectPaymentProject');
  if (sel) {
    sel.value = projectId;
    updatePaymentFormHint();
  }
}

function updatePaymentFormHint() {
  const sel = document.getElementById('selectPaymentProject');
  const hint = document.getElementById('paymentBalanceHint');
  const amountInput = document.getElementById('inputPaymentAmount');
  if (!sel || !hint) return;

  const p = getProject(sel.value);
  if (p) {
    const bal = p.price - p.paid;
    hint.innerHTML = `Project: <strong>${p.title}</strong> • Total: ${formatINR(p.price)} • Paid: ${formatINR(p.paid)} • <strong>Outstanding: ${formatINR(bal)}</strong>`;
    if (amountInput) {
      amountInput.max = bal > 0 ? bal : 0;
      amountInput.placeholder = bal > 0 ? `Max: ₹${bal}` : 'Fully Paid';
    }
  } else {
    hint.innerHTML = `Please select an active project.`;
  }
}

// ================= 7. CLIENT PORTAL & MULTI-PROJECT ALBUM VIEWER =================
function renderPortalView() {
  let project = getProject(appState.activeProjectId);
  if (!project && appState.projects.length > 0) {
    project = appState.projects[0];
    appState.activeProjectId = project.id;
  }

  if (!project) {
    renderEmptyPortal();
    return;
  }

  const client = appState.clients.find(c => c.id === project.clientId);

  // Update mode button in top demo bar
  const clientBtn = document.getElementById('btnModeClient');
  if (clientBtn) {
    clientBtn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      Client View: ${project.clientName}
    `;
  }

  // Update Hero Banner
  const tagEl = document.getElementById('portalCoupleTag');
  if (tagEl) {
    const loc = client ? client.location : 'Studio Client';
    tagEl.textContent = `${project.package} • ${loc} • ${formatDate(project.eventDate)}`;
  }

  const titleEl = document.getElementById('portalCoupleTitle');
  if (titleEl) titleEl.textContent = project.clientName;

  const subEl = document.getElementById('portalCoupleSub');
  if (subEl) {
    subEl.textContent = `FrameHouse Studio • Private Client Album Approval Portal (${project.title})`;
  }

  // Multi-project switcher for client
  const switcherBar = document.getElementById('portalProjectSwitcherBar');
  if (switcherBar) {
    const clientProjects = appState.projects.filter(p => p.clientId === project.clientId);
    if (clientProjects.length > 1) {
      switcherBar.style.display = 'flex';
      switcherBar.innerHTML = `
        <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(0,0,0,0.3); backdrop-filter:blur(6px); padding:5px 14px; border-radius:20px; border:1px solid rgba(255,255,255,0.25); font-size:12px; color:#fff;">
          <span style="opacity:0.9;">Viewing Booking:</span>
          <select style="background:transparent; color:#fff; border:none; font-size:12px; font-weight:600; cursor:pointer; outline:none;" onchange="openProjectPortal(this.value)">
            ${clientProjects.map(cp => `
              <option value="${cp.id}" ${cp.id === project.id ? 'selected' : ''} style="color:#111;">
                ${cp.title} (${cp.package})
              </option>
            `).join('')}
          </select>
        </div>
      `;
    } else {
      switcherBar.style.display = 'none';
      switcherBar.innerHTML = '';
    }
  }

  // Update Deliverables Package Title
  const delivPkgTitle = document.getElementById('portalDeliverablesPackageTitle');
  if (delivPkgTitle) delivPkgTitle.textContent = `${project.package} Inclusions`;

  // Update Approval modal text
  const modalApproveText = document.getElementById('modalApproveAlbumText');
  if (modalApproveText) {
    modalApproveText.innerHTML = `You are authorizing final archival approval for <strong>${project.clientName} — ${project.title}</strong> (${project.package}). This will officially lock the spread layout and commission our master print binders to commence handcrafted layflat fabrication.`;
  }

  updatePortalProgressStepper(project);
  renderPortalSpreadViewer(project);
  renderPortalGallery(project);
  renderPortalDeliverables(project);
}

function renderEmptyPortal() {
  const tagEl = document.getElementById('portalCoupleTag');
  if (tagEl) tagEl.textContent = "No Active Projects";

  const titleEl = document.getElementById('portalCoupleTitle');
  if (titleEl) titleEl.textContent = "Client Approval Portal";

  const subEl = document.getElementById('portalCoupleSub');
  if (subEl) subEl.textContent = "No project selected or project could not be located. Please select a project from Studio Management.";

  const stepper = document.getElementById('portalStepper');
  if (stepper) stepper.innerHTML = `<div style="color:var(--text-muted); font-size:13px; padding:8px 0;">No active project loaded</div>`;

  const viewer = document.getElementById('albumSpreadViewer');
  if (viewer) {
    viewer.innerHTML = `
      <div style="grid-column: 1/-1; padding: 60px 24px; text-align: center; background: #fff; border: 1px solid var(--border-color); border-radius: 8px; width: 100%;">
        <div style="font-size: 36px; margin-bottom: 12px;">📖</div>
        <h3 style="font-family: var(--font-serif); font-size: 22px; color: var(--text-primary); margin-bottom: 8px;">No Project Selected</h3>
        <p style="font-size: 13px; color: var(--text-secondary); max-width: 440px; margin: 0 auto;">Please open a project from the Studio Management workspace to launch its dedicated client approval portal.</p>
      </div>
    `;
  }

  const strip = document.getElementById('spreadThumbsStrip');
  if (strip) strip.innerHTML = '';

  const feed = document.getElementById('spreadCommentsFeed');
  if (feed) feed.innerHTML = '';
}

function updatePortalProgressStepper(project) {
  if (!project) return;
  const stage = project.stage;
  const isApproved = (stage === 'Approved' || stage === 'Delivered');
  const isRevisions = (stage === 'Revisions' || stage === 'Client Review');
  const isEditing = (stage === 'Editing' || stage === 'Photo Selection' || stage === 'Album Design');

  const stepper = document.getElementById('portalStepper');
  if (stepper) {
    stepper.innerHTML = `
      <div class="step-node completed">
        <div class="step-num">✓</div>
        <span>Booking</span>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${stage === 'Shoot Scheduled' ? 'active' : 'completed'}">
        <div class="step-num">${stage === 'Shoot Scheduled' ? '2' : '✓'}</div>
        <span>Photoshoot</span>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${isEditing ? 'active' : (stage === 'Shoot Scheduled' ? '' : 'completed')}">
        <div class="step-num">${stage === 'Shoot Scheduled' ? '3' : (isEditing ? '3' : '✓')}</div>
        <span>Editing & Curation</span>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${isApproved ? 'completed' : (isRevisions ? 'active' : '')}">
        <div class="step-num">${isApproved ? '✓' : '4'}</div>
        <span>Album Review</span>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${isApproved ? 'active' : ''}">
        <div class="step-num">${stage === 'Delivered' ? '✓' : (isApproved ? '5' : '5')}</div>
        <span>${stage === 'Delivered' ? 'Delivered & Archived' : 'Fine-Art Print & Bind'}</span>
      </div>
    `;
  }
}

function renderPortalSpreadViewer(project) {
  if (!project) {
    project = getProject(appState.activeProjectId) || appState.projects[0];
  }
  if (!project) {
    renderEmptyPortal();
    return;
  }

  const spreads = getProjectSpreads(project.id);
  const isApproved = (project.stage === 'Approved' || project.stage === 'Delivered');

  // Header badges & text
  const bBadge = document.getElementById('portalSpreadBadge');
  const bTitle = document.getElementById('portalSpreadTitle');
  const notesCountText = document.getElementById('activeSpreadNotesCount');
  const spreadBadge = document.getElementById('portalSpreadStatusBadge');
  const badgeDeliv = document.getElementById('badgeDeliverableAlbum');
  const approvalSummary = document.getElementById('albumApprovalStatusSummary');
  const viewer = document.getElementById('albumSpreadViewer');
  const strip = document.getElementById('spreadThumbsStrip');
  const feed = document.getElementById('spreadCommentsFeed');
  const topApproveBtn = document.getElementById('btnTopApproveAlbum');

  if (badgeDeliv) {
    if (isApproved) {
      badgeDeliv.className = 'badge badge-approved';
      badgeDeliv.textContent = 'Approved for Fine-Art Print';
    } else {
      badgeDeliv.className = 'badge badge-review';
      badgeDeliv.textContent = 'Awaiting Client Approval';
    }
  }

  // Handle projects with 0 spreads
  if (spreads.length === 0) {
    if (bBadge) bBadge.textContent = "0 Spreads";
    if (bTitle) bTitle.textContent = "Album Layout in Production";
    if (notesCountText) notesCountText.textContent = "0 Revision Notes";
    if (spreadBadge) {
      spreadBadge.className = `badge ${getBadgeClassForStage(project.stage)}`;
      spreadBadge.textContent = `Design Stage: ${project.stage}`;
    }
    if (topApproveBtn) {
      topApproveBtn.style.display = 'none';
    }
    if (approvalSummary) {
      approvalSummary.innerHTML = `Album layout for <strong>${project.title}</strong> is currently being color-graded and curated by our studio designers. Spreads will appear here for your review as soon as the initial design pass is complete.`;
    }
    if (viewer) {
      viewer.innerHTML = `
        <div style="grid-column: 1/-1; padding: 70px 24px; text-align: center; background: #fff; border: 1px solid var(--border-color); border-radius: 8px; width: 100%;">
          <div style="font-size: 40px; margin-bottom: 14px;">📖</div>
          <h3 style="font-family: var(--font-serif); font-size: 24px; color: var(--text-primary); margin-bottom: 8px;">Album Layout in Design Production</h3>
          <p style="font-size: 13.5px; color: var(--text-secondary); max-width: 520px; margin: 0 auto 20px; line-height: 1.6;">
            Our master album designers are currently curating and color grading the layout for <strong>${project.clientName} — ${project.title}</strong>. As soon as the first draft is ready, all spreads will be published here for your spread-by-spread review and feedback.
          </p>
          <div style="display:inline-flex; align-items:center; gap:8px; background:#faf8f5; border:1px solid var(--border-color); padding:8px 16px; border-radius:var(--radius-full); font-size:12px; color:var(--text-secondary);">
            <span>Current Stage:</span> <strong style="color:var(--accent-bronze);">${project.stage}</strong>
          </div>
        </div>
      `;
    }
    if (strip) strip.innerHTML = '';
    if (feed) feed.innerHTML = `<div style="font-size:12.5px; color:var(--text-muted); padding:16px 0; text-align:center;">No spreads available to comment on yet.</div>`;
    return;
  }

  if (topApproveBtn) {
    topApproveBtn.style.display = 'inline-flex';
    if (isApproved) {
      topApproveBtn.className = 'btn btn-secondary btn-sm';
      topApproveBtn.style.color = '#059669';
      topApproveBtn.style.fontWeight = '600';
      topApproveBtn.innerHTML = `✓ Officially Approved`;
      topApproveBtn.onclick = () => showToast(`This album was already authorized and officially approved on ${project.approvedAt ? formatDate(project.approvedAt.split('T')[0]) : 'file'}.`);
    } else {
      topApproveBtn.className = 'btn btn-primary btn-sm';
      topApproveBtn.style.color = '';
      topApproveBtn.innerHTML = `✓ Approve Album`;
      topApproveBtn.onclick = () => openAlbumApprovalModal();
    }
  }

  // Bounds check active spread index
  if (appState.activeSpreadIndex < 0 || appState.activeSpreadIndex >= spreads.length) {
    appState.activeSpreadIndex = 0;
  }

  const currentSpread = spreads[appState.activeSpreadIndex];
  if (!currentSpread) return;

  if (bBadge) bBadge.textContent = currentSpread.badge || `Spread ${String(appState.activeSpreadIndex + 1).padStart(2, '0')} of ${String(spreads.length).padStart(2, '0')}`;
  if (bTitle) bTitle.textContent = currentSpread.title;

  const currentNotes = Array.isArray(currentSpread.notes) ? currentSpread.notes : [];
  const unresolvedSpreadNotes = currentNotes.filter(n => !n.resolved);

  if (notesCountText) {
    notesCountText.textContent = `${currentNotes.length} Request${currentNotes.length === 1 ? '' : 's'} (${unresolvedSpreadNotes.length} Pending Action)`;
  }

  if (spreadBadge) {
    if (isApproved) {
      spreadBadge.className = 'badge badge-approved';
      spreadBadge.textContent = '✓ Album Approved';
    } else if (unresolvedSpreadNotes.length > 0) {
      spreadBadge.className = 'badge badge-revisions';
      spreadBadge.textContent = `Changes Requested (${unresolvedSpreadNotes.length})`;
    } else {
      spreadBadge.className = 'badge badge-review';
      spreadBadge.textContent = 'Ready for Approval';
    }
  }

  // Render Layflat Spread Pages
  if (viewer) {
    const leftPageNum = appState.activeSpreadIndex * 2 + 1;
    const rightPageNum = appState.activeSpreadIndex * 2 + 2;

    viewer.innerHTML = `
      <div class="spread-page left-page">
        <div class="spread-photo-grid layout-single">
          <div class="album-photo-frame" onclick="openLightbox('${currentSpread.leftImg}', '${currentSpread.title} — Page ${String(leftPageNum).padStart(2, '0')}')" title="Click photograph to view full high-definition">
            <img src="${currentSpread.leftImg}" alt="${currentSpread.title} Left Page">
            <span class="photo-caption-tag">Click to Enlarge</span>
          </div>
        </div>
        <div class="spread-page-number">PAGE ${String(leftPageNum).padStart(2, '0')}</div>
      </div>

      <div class="spread-page right-page">
        <div class="spread-photo-grid layout-single">
          <div class="album-photo-frame" onclick="openLightbox('${currentSpread.rightImg}', '${currentSpread.title} — Page ${String(rightPageNum).padStart(2, '0')}')" title="Click photograph to view full high-definition">
            <img src="${currentSpread.rightImg}" alt="${currentSpread.title} Right Page">
            <span class="photo-caption-tag">Click to Enlarge</span>
          </div>
        </div>
        <div class="spread-page-number">PAGE ${String(rightPageNum).padStart(2, '0')}</div>
      </div>
    `;
  }

  // Render Thumbnails strip
  if (strip) {
    strip.innerHTML = spreads.map((s, idx) => {
      const sNotes = Array.isArray(s.notes) ? s.notes : [];
      const hasUnresolved = sNotes.some(n => !n.resolved);

      return `
        <div class="spread-thumb-item ${idx === appState.activeSpreadIndex ? 'active' : ''}" onclick="selectSpread(${idx})" title="Go to Spread ${idx + 1}: ${s.title}">
          <div class="spread-thumb-preview">
            <img src="${s.leftImg}" alt="Spread ${idx + 1}">
            ${hasUnresolved ? `<span style="position:absolute; top:4px; right:4px; width:7px; height:7px; border-radius:50%; background:#f59e0b; border:1px solid #fff;"></span>` : ''}
          </div>
          <div class="spread-thumb-label">Spread ${String(idx + 1).padStart(2, '0')}</div>
        </div>
      `;
    }).join('');
  }

  // Render Comments & Revisions feed for this spread
  if (feed) {
    if (currentNotes.length === 0) {
      feed.innerHTML = `
        <div style="font-size:12.5px; color:var(--text-muted); padding:16px 8px; text-align:center; background:#faf8f5; border-radius:6px; border:1px dashed var(--border-color);">
          No revision requests on this spread. Click <strong>"Request Revision"</strong> or write instructions below if you'd like any photo replacements or tone tweaks.
        </div>
      `;
    } else {
      feed.innerHTML = currentNotes.map(n => `
        <div class="comment-bubble ${n.author && (n.author.includes('Client') || n.author.includes(project.clientName.split(' ')[0])) ? 'client' : 'studio'}" style="${n.resolved ? 'opacity:0.85; background:#f9fafb;' : ''}">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; gap:8px;">
            <div>
              <div class="comment-author" style="font-weight:600; color:var(--text-primary); font-size:12px;">
                ${n.author}
                <span style="font-weight:normal; font-size:10.5px; color:var(--text-muted); margin-left:6px;">• ${n.time || 'Recently'}</span>
              </div>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <span class="badge ${n.resolved ? 'badge-approved' : 'badge-revisions'}" style="font-size:10px; padding:2px 6px;">
                ${n.resolved ? '✓ Resolved by Studio' : 'Requested'}
              </span>
              <button class="btn btn-secondary btn-sm" style="font-size:10px; padding:2px 6px; color:#b91c1c;" onclick="confirmDeleteSpreadNote('${currentSpread.id}', '${n.id}')" title="Delete this revision note">
                ✕
              </button>
            </div>
          </div>
          <div style="font-size:12.5px; line-height:1.5; color:var(--text-primary); ${n.resolved ? 'color:var(--text-secondary);' : ''}">
            ${n.text}
          </div>
        </div>
      `).join('');
    }
  }

  // Render Archival Approval Card
  if (approvalSummary) {
    if (isApproved) {
      approvalSummary.innerHTML = `✅ <strong>Officially Approved</strong> for ${project.clientName}. Fine-art layflat Fuji Pearl print and leather embossing in production.`;
    } else {
      approvalSummary.innerHTML = `Pending client sign-off (${spreads.length} Spreads total).`;
    }
  }

  const approvalActionArea = document.getElementById('albumApprovalActionArea');
  if (approvalActionArea) {
    if (isApproved) {
      approvalActionArea.innerHTML = `
        <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:12px 16px; text-align:center; color:#065f46; font-weight:600; font-size:13px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          <span>Archival Album Approved for Print</span>
        </div>
      `;
    } else {
      approvalActionArea.innerHTML = `
        <button class="btn btn-success" id="btnPortalApproveCta" style="width: 100%; justify-content: center; padding: 12px; font-weight:600;" onclick="openAlbumApprovalModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
          Approve & Authorize Print
        </button>
      `;
    }
  }
}

function selectSpread(index) {
  const project = getProject(appState.activeProjectId) || appState.projects[0];
  if (!project) return;
  const spreads = getProjectSpreads(project.id);
  if (index >= 0 && index < spreads.length) {
    appState.activeSpreadIndex = index;
    renderPortalSpreadViewer(project);
  }
}

function navigateSpread(delta) {
  const project = getProject(appState.activeProjectId) || appState.projects[0];
  if (!project) return;
  const spreads = getProjectSpreads(project.id);
  if (spreads.length === 0) return;

  let next = appState.activeSpreadIndex + delta;
  if (next < 0) next = spreads.length - 1;
  if (next >= spreads.length) next = 0;
  selectSpread(next);
}

function openSpreadRevisionModal() {
  const project = getProject(appState.activeProjectId) || appState.projects[0];
  if (!project) {
    showToast("No active project loaded.");
    return;
  }
  const spreads = getProjectSpreads(project.id);
  if (spreads.length === 0) {
    showToast("No album spreads available to request revisions on.");
    return;
  }

  const currentSpread = spreads[appState.activeSpreadIndex] || spreads[0];
  const headingEl = document.getElementById('modalRevisionSpreadHeading');
  const badgeEl = document.getElementById('revisionModalSpreadBadge');
  const titleEl = document.getElementById('revisionModalSpreadTitle');
  const inputInstructions = document.getElementById('inputModalRevisionInstructions');
  const inputAuthor = document.getElementById('inputModalRevisionAuthor');

  if (headingEl) headingEl.textContent = `Request Revision: Spread ${String(appState.activeSpreadIndex + 1).padStart(2, '0')}`;
  if (badgeEl) badgeEl.textContent = `Spread ${String(appState.activeSpreadIndex + 1).padStart(2, '0')} of ${String(spreads.length).padStart(2, '0')}`;
  if (titleEl) titleEl.textContent = currentSpread.title;
  if (inputInstructions) inputInstructions.value = '';
  if (inputAuthor) {
    const clientFirstName = project.clientName.split('&')[0].trim();
    inputAuthor.value = `${clientFirstName} (Client)`;
  }

  openModal('modalRequestRevision');
}

function handleSpreadRevisionModalSubmit(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const inputInstructions = document.getElementById('inputModalRevisionInstructions');
  const inputAuthor = document.getElementById('inputModalRevisionAuthor');

  const instructions = (inputInstructions ? inputInstructions.value : '').trim();
  const author = (inputAuthor ? inputAuthor.value : '').trim();

  if (!instructions) {
    showToast("Please provide specific revision instructions.");
    return;
  }

  const project = getProject(appState.activeProjectId) || appState.projects[0];
  if (!project) return;

  const spreads = getProjectSpreads(project.id);
  if (spreads.length === 0) return;

  const currentSpread = spreads[appState.activeSpreadIndex] || spreads[0];
  if (!Array.isArray(currentSpread.notes)) {
    currentSpread.notes = [];
  }

  const newRevision = {
    id: "rev_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    author: author || `${project.clientName.split(' ')[0]} (Client)`,
    text: instructions,
    resolved: false,
    time: "Just now",
    timestamp: new Date().toISOString()
  };

  currentSpread.notes.push(newRevision);

  // Update stage to Revisions if was Client Review or Approved
  if (project.stage !== 'Revisions' && project.stage !== 'Delivered') {
    project.stage = 'Revisions';
  }

  addProjectActivity(project.id, "Spread Revision Added", `Client requested revision on Spread ${appState.activeSpreadIndex + 1} ("${currentSpread.title}"): "${instructions}"`);

  saveData();
  closeModal('modalRequestRevision');
  renderPortalSpreadViewer(project);
  updateBadgesAndKPIs();
  renderDashboard();
  renderProjectWorkspace();
  showToast(`Revision request added for Spread ${appState.activeSpreadIndex + 1} ✓`);
}

function addSpreadComment() {
  const input = document.getElementById('inputSpreadComment');
  const text = input ? input.value.trim() : '';
  if (!text) {
    showToast("Please enter a revision request instruction.");
    return;
  }

  const project = getProject(appState.activeProjectId) || appState.projects[0];
  if (!project) return;

  const spreads = getProjectSpreads(project.id);
  if (spreads.length === 0) {
    showToast("No album spreads available to comment on.");
    return;
  }

  const currentSpread = spreads[appState.activeSpreadIndex] || spreads[0];
  if (!Array.isArray(currentSpread.notes)) {
    currentSpread.notes = [];
  }

  const clientFirstName = project.clientName.split('&')[0].trim();
  const newNote = {
    id: "rev_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    author: `${clientFirstName} (Client)`,
    text: text,
    resolved: false,
    time: "Just now",
    timestamp: new Date().toISOString()
  };

  currentSpread.notes.push(newNote);

  // Update project stage to Revisions if was approved or review
  if (project.stage !== 'Revisions' && project.stage !== 'Delivered') {
    project.stage = 'Revisions';
  }

  addProjectActivity(project.id, "Spread Revision Added", `Revision request posted on Spread ${appState.activeSpreadIndex + 1}: "${text}"`);

  saveData();
  input.value = '';
  renderPortalSpreadViewer(project);
  updateBadgesAndKPIs();
  renderDashboard();
  renderProjectWorkspace();
  showToast(`Revision request added to Spread ${appState.activeSpreadIndex + 1}`);
}

function toggleSpreadNoteResolved(spreadId, noteId) {
  const spread = appState.albumSpreads.find(s => s.id === spreadId);
  if (!spread || !spread.notes) return;

  const note = spread.notes.find(n => n.id === noteId);
  if (note) {
    note.resolved = !note.resolved;
    if (spread.projectId) {
      addProjectActivity(spread.projectId, "Note Status Changed", `Revision note on Spread "${spread.title}" marked as ${note.resolved ? 'resolved' : 'unresolved'}`);
    }
    saveData();
    renderPortalSpreadViewer();
    renderDashboardSpreadRevisions();
    renderProjectWorkspace();
    showToast(note.resolved ? "Revision note marked as resolved ✓" : "Revision note reopened");
  }
}

function confirmDeleteSpreadNote(spreadId, noteId) {
  const spread = appState.albumSpreads.find(s => s.id === spreadId);
  if (!spread || !spread.notes) return;

  const note = spread.notes.find(n => n.id === noteId);
  if (!note) return;

  showDeleteConfirmation({
    title: "Delete Revision Request",
    heading: `Delete Revision Note?`,
    message: `Are you sure you want to remove this revision note by <strong>${note.author}</strong> from Spread "${spread.title}":<br><br><em>"${note.text}"</em>`,
    warning: null,
    onConfirm: () => {
      spread.notes = spread.notes.filter(n => n.id !== noteId);
      if (spread.projectId) {
        addProjectActivity(spread.projectId, "Note Deleted", `Revision note removed from Spread "${spread.title}"`);
      }
      saveData();
      renderPortalSpreadViewer();
      renderDashboardSpreadRevisions();
      renderProjectWorkspace();
      updateBadgesAndKPIs();
      showToast("Revision note deleted.");
    }
  });
}

function openAlbumApprovalModal() {
  const project = getProject(appState.activeProjectId) || appState.projects[0];
  if (!project) return;

  const spreads = getProjectSpreads(project.id);
  const unresolvedRevisions = [];
  spreads.forEach((spread, idx) => {
    if (Array.isArray(spread.notes)) {
      spread.notes.forEach(note => {
        if (!note.resolved) {
          unresolvedRevisions.push({
            spreadIndex: idx + 1,
            spreadTitle: spread.title,
            author: note.author,
            text: note.text
          });
        }
      });
    }
  });

  const modalApproveText = document.getElementById('modalApproveAlbumText');
  if (modalApproveText) {
    modalApproveText.innerHTML = `You are authorizing final archival approval for <strong>${project.clientName} — ${project.title}</strong> (${project.package}). This will officially lock the spread layout and commission our master print binders to commence handcrafted layflat fabrication.`;
  }

  const warningContainer = document.getElementById('modalApproveWarningContainer');
  const confirmBtn = document.getElementById('btnConfirmApproveAlbum');
  const checkboxConfirm = document.getElementById('checkApproveConfirm');

  if (unresolvedRevisions.length > 0) {
    if (warningContainer) {
      warningContainer.style.display = 'block';
      warningContainer.innerHTML = `
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin-bottom: 16px; text-align: left;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #b45309; font-size: 13.5px; margin-bottom: 6px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Unresolved Revision Requests Pending (${unresolvedRevisions.length})</span>
          </div>
          <p style="font-size: 12.5px; color: #78350f; line-height: 1.45; margin-bottom: 8px;">
            This album layout currently has pending revision requests that must be addressed by our studio team before finalizing print production:
          </p>
          <ul style="font-size: 12px; color: #92400e; margin: 0 0 0 18px; padding: 0; line-height: 1.5;">
            ${unresolvedRevisions.map(r => `<li><strong>Spread ${String(r.spreadIndex).padStart(2, '0')} (${r.spreadTitle}):</strong> "${r.text}" <span style="color:#78350f;">— ${r.author}</span></li>`).join('')}
          </ul>
        </div>
      `;
    }
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
      confirmBtn.style.cursor = 'not-allowed';
      confirmBtn.innerHTML = `Cannot Approve (${unresolvedRevisions.length} Revisions Pending)`;
    }
    if (checkboxConfirm) {
      checkboxConfirm.checked = false;
      checkboxConfirm.disabled = true;
    }
  } else {
    if (warningContainer) {
      warningContainer.style.display = 'none';
      warningContainer.innerHTML = '';
    }
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
      confirmBtn.style.cursor = 'pointer';
      confirmBtn.innerHTML = `Authorize & Approve Now`;
    }
    if (checkboxConfirm) {
      checkboxConfirm.checked = true;
      checkboxConfirm.disabled = false;
    }
  }

  openModal('modalApproveAlbum');
}

function confirmAlbumApproval() {
  const project = getProject(appState.activeProjectId) || appState.projects[0];
  if (!project) return;

  const spreads = getProjectSpreads(project.id);
  const hasUnresolved = spreads.some(s => Array.isArray(s.notes) && s.notes.some(n => !n.resolved));
  if (hasUnresolved) {
    showToast("⚠️ Cannot approve album while unresolved revision requests remain pending.");
    return;
  }

  const checkApprove = document.getElementById('checkApproveConfirm');
  if (checkApprove && !checkApprove.checked) {
    showToast("Please confirm the authorization checkbox before submitting.");
    return;
  }

  project.stage = 'Approved';
  project.approvedAt = new Date().toISOString();

  addProjectActivity(project.id, "Album Approved", `Album officially authorized and approved by ${project.clientName} for fine-art layflat print fabrication.`);

  saveData();
  closeModal('modalApproveAlbum');
  renderAllViews();
  showToast(`🎉 Album for "${project.title}" Officially Approved! Production has commenced.`);
}

function renderPortalGallery(project) {
  if (!project) {
    project = getProject(appState.activeProjectId) || appState.projects[0];
  }
  const grid = document.getElementById('portalGalleryGrid');
  if (!grid || !project) return;

  if (!Array.isArray(project.selectedPhotoIds)) {
    project.selectedPhotoIds = [];
  }

  const projectPhotos = getProjectGallery(project.id);
  const selectedCount = project.selectedPhotoIds.filter(id => projectPhotos.some(p => p.id === id)).length;

  // Dynamic filter pills for project's photos
  const tabBtnGallery = document.getElementById('tabBtnGallery');
  if (tabBtnGallery) {
    tabBtnGallery.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      Curated Highlights Gallery (${projectPhotos.length} Photos)
    `;
  }

  const selectedCountText = document.getElementById('portalSelectedCountText');
  if (selectedCountText) {
    selectedCountText.textContent = `${selectedCount} of ${projectPhotos.length} Photos Selected`;
  }

  const btnFilterSelected = document.getElementById('btnFilterSelectedOnly');
  if (btnFilterSelected) {
    if (appState.portalGallerySelectedOnly) {
      btnFilterSelected.className = 'btn btn-primary btn-sm';
      btnFilterSelected.innerHTML = `✓ Showing Selected (${selectedCount})`;
    } else {
      btnFilterSelected.className = 'btn btn-secondary btn-sm';
      btnFilterSelected.innerHTML = `★ View Selected Only`;
    }
  }

  const selectionBadge = document.getElementById('portalSelectionStatusBadge');
  if (selectionBadge) {
    if (selectedCount >= 4) {
      selectionBadge.className = 'badge badge-approved';
      selectionBadge.textContent = 'Selection Target Met ✓';
    } else if (selectedCount > 0) {
      selectionBadge.className = 'badge badge-scheduled';
      selectionBadge.textContent = 'Selection in Progress';
    } else {
      selectionBadge.className = 'badge badge-review';
      selectionBadge.textContent = 'Awaiting Client Picks';
    }
  }

  const filterContainer = document.querySelector('#portalContentGallery .filter-pills') || document.getElementById('portalGalleryFilterPills');
  if (filterContainer) {
    const availableTags = ['all', ...new Set(projectPhotos.map(p => p.tag).filter(Boolean))];
    filterContainer.innerHTML = availableTags.map(tag => `
      <button class="filter-pill ${appState.portalGalleryFilter === tag ? 'active' : ''}" onclick="filterPortalGallery('${tag}', this)">
        ${tag === 'all' ? 'All Highlights' : tag}
      </button>
    `).join('');
  }

  let filtered = projectPhotos.filter(item => {
    return (appState.portalGalleryFilter === 'all') || (item.tag === appState.portalGalleryFilter);
  });

  if (appState.portalGallerySelectedOnly) {
    filtered = filtered.filter(item => project.selectedPhotoIds.includes(item.id));
  }

  if (filtered.length === 0) {
    if (appState.portalGallerySelectedOnly) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; background: #faf8f5; border: 1px solid var(--border-color); border-radius: 8px;">
          <div style="font-size: 32px; margin-bottom: 10px;">⭐</div>
          <h4 style="font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">No Selected Photographs in this Category</h4>
          <p style="font-size: 13px; color: var(--text-secondary); max-width: 460px; margin: 0 auto 16px; line-height:1.5;">
            Click the "+" button on any photograph to select favorites for your wedding album curation.
          </p>
          <button class="btn btn-secondary btn-sm" onclick="toggleFilterSelectedPhotos()">Show All Photographs</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 56px 20px; background: #faf8f5; border: 1px solid var(--border-color); border-radius: 8px;">
        <div style="font-size: 36px; margin-bottom: 12px;">📸</div>
        <h4 style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">No Gallery Photographs Yet</h4>
        <p style="font-size: 13px; color: var(--text-secondary); max-width: 460px; margin: 0 auto; line-height:1.5;">
          Curated highlight photographs for <strong>${project.title}</strong> (${project.clientName}) will appear here once uploaded by our studio team.
        </p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const isSelected = project.selectedPhotoIds.includes(item.id);
    return `
      <div class="gallery-photo-card ${isSelected ? 'selected' : ''}" onclick="openLightbox('${item.img}', '${item.title} — ${item.tag}')" title="Click to enlarge photograph">
        <button class="photo-select-btn" onclick="toggleSelectPhoto('${item.id}', event)" title="${isSelected ? 'Deselect photograph' : 'Select photograph for album curation'}">
          ${isSelected ? '✓' : '+'}
        </button>
        <img src="${item.img}" alt="${item.title}">
        <div class="gallery-overlay">
          <div>
            <span class="gallery-tag">${item.tag}</span>
            <div style="font-size:13px; font-weight:600; margin-top:4px;">${item.title}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleSelectPhoto(photoId, event) {
  if (event && typeof event.stopPropagation === 'function') {
    event.stopPropagation();
  }
  const project = getProject(appState.activeProjectId) || appState.projects[0];
  if (!project) return;

  if (!Array.isArray(project.selectedPhotoIds)) {
    project.selectedPhotoIds = [];
  }

  const idx = project.selectedPhotoIds.indexOf(photoId);
  if (idx >= 0) {
    project.selectedPhotoIds.splice(idx, 1);
    showToast("Photograph deselected");
  } else {
    project.selectedPhotoIds.push(photoId);
    showToast("Photograph added to album selections ✓");
  }

  saveData();
  renderPortalGallery(project);
}

function toggleFilterSelectedPhotos() {
  appState.portalGallerySelectedOnly = !appState.portalGallerySelectedOnly;
  renderPortalGallery();
}

function confirmPhotoSelection() {
  const project = getProject(appState.activeProjectId) || appState.projects[0];
  if (!project) return;

  if (!Array.isArray(project.selectedPhotoIds)) {
    project.selectedPhotoIds = [];
  }

  const count = project.selectedPhotoIds.length;
  if (count === 0) {
    showToast("Please select at least one photograph before submitting.");
    return;
  }

  addProjectActivity(project.id, "Photo Selection Submitted", `Client confirmed selection of ${count} curated photographs for album layout design.`);

  if (project.stage === 'Photo Selection') {
    project.stage = 'Editing';
    addProjectActivity(project.id, "Stage Changed", `Production stage advanced to 'Editing' following client photo selection.`);
  }

  saveData();
  renderAllViews();
  showToast(`🎉 Selection of ${count} photographs submitted successfully to studio!`);
}

function filterPortalGallery(tag, btn) {
  appState.portalGalleryFilter = tag;
  document.querySelectorAll('#portalContentGallery .filter-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderPortalGallery();
}

function renderPortalDeliverables(project) {
  if (!project) return;
  const isApproved = (project.stage === 'Approved' || project.stage === 'Delivered');
  const badgeDelivAlbum = document.getElementById('badgeDeliverableAlbum');
  if (badgeDelivAlbum) {
    badgeDelivAlbum.className = isApproved ? 'badge badge-approved' : 'badge badge-review';
    badgeDelivAlbum.textContent = isApproved ? 'Approved for Fine-Art Print' : 'Awaiting Client Approval';
  }
}

// ================= 8. TASKS =================
function renderTasksList() {
  const container = document.getElementById('mainTaskList');
  if (!container) return;

  const search = (document.getElementById('taskSearchInput')?.value || '').toLowerCase();

  const filtered = appState.tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search) || t.category.toLowerCase().includes(search);
    const matchesFilter = (appState.taskFilter === 'all') || 
                          (appState.taskFilter === 'completed' && t.completed) ||
                          (appState.taskFilter === 'pending' && !t.completed);
    return matchesSearch && matchesFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">No tasks match the filter. Click "Add Task" to create one.</div>`;
    return;
  }

  container.innerHTML = filtered.map(t => {
    const linkedProject = t.projectId ? getProject(t.projectId) : null;
    let priorityClass = 'badge-priority-medium';
    if (t.priority === 'High') priorityClass = 'badge-priority-high';
    if (t.priority === 'Low') priorityClass = 'badge-priority-low';

    return `
      <div class="task-item ${t.completed ? 'completed' : ''}">
        <div class="task-left">
          <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTaskComplete('${t.id}')">
          <div class="task-info">
            <div class="task-title" style="${t.completed ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${t.title}</div>
            <div class="task-meta">
              <span>📅 Due: ${formatDate(t.dueDate)}</span>
              <span>•</span>
              <span class="badge badge-scheduled" style="font-size:10px;">${t.category}</span>
              <span>•</span>
              <span class="badge ${priorityClass}" style="font-size:10px;">${t.priority || 'Medium'}</span>
              ${linkedProject ? `
                <span>•</span>
                <span class="badge badge-design" style="font-size:10px; cursor:pointer;" onclick="openProjectWorkspace('${linkedProject.id}')" title="Open Project Workspace">
                  📁 ${linkedProject.title}
                </span>
              ` : ''}
            </div>
            ${t.description ? `<div style="font-size:11px; color:var(--text-muted); margin-top:3px;">${t.description}</div>` : ''}
          </div>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="btn btn-secondary btn-sm" onclick="openEditTaskModal('${t.id}')" title="Edit Task" style="font-size:11px; padding:3px 7px;">
            Edit
          </button>
          <button class="btn btn-secondary btn-sm" onclick="confirmDeleteTask('${t.id}')" title="Delete Task" style="color:#b91c1c; padding:4px 8px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  updateBadgesAndKPIs();
}

function filterTasks(type, btn) {
  appState.taskFilter = type;
  document.querySelectorAll('#view-tasks .filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTasksList();
}

function toggleTaskComplete(taskId) {
  const t = appState.tasks.find(x => x.id === taskId);
  if (t) {
    t.completed = !t.completed;
    t.status = t.completed ? 'Done' : 'To Do';
    if (t.projectId) {
      addProjectActivity(t.projectId, "Task Updated", `Task "${t.title}" marked as ${t.completed ? 'completed (Done)' : 'pending (To Do)'}`);
    }
    saveData();
    renderTasksList();
    renderProjectWorkspace();
    renderDashboard();
    updateBadgesAndKPIs();
    showToast(t.completed ? "Task marked complete ✓" : "Task reopened");
  }
}

// ================= INDIVIDUAL DELETION MODAL & ACTIONS =================
function showDeleteConfirmation({ title, heading, message, warning, onConfirm }) {
  const titleEl = document.getElementById('deleteModalTitle');
  const headEl = document.getElementById('deleteModalHeading');
  const msgEl = document.getElementById('deleteModalMessage');
  const warnEl = document.getElementById('deleteModalWarning');
  const confirmBtn = document.getElementById('btnConfirmDeleteAction');

  if (titleEl) {
    titleEl.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <span>${title || 'Confirm Deletion'}</span>
    `;
  }
  if (headEl) headEl.textContent = heading || 'Are you sure you want to delete this?';
  if (msgEl) msgEl.innerHTML = message || 'This action cannot be undone.';
  
  if (warnEl) {
    if (warning) {
      warnEl.style.display = 'block';
      warnEl.innerHTML = warning;
    } else {
      warnEl.style.display = 'none';
      warnEl.innerHTML = '';
    }
  }

  pendingDeleteAction = onConfirm;

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (typeof pendingDeleteAction === 'function') {
        pendingDeleteAction();
      }
      pendingDeleteAction = null;
      closeModal('modalConfirmDelete');
    };
  }

  openModal('modalConfirmDelete');
}

// 1. Delete Client
function confirmDeleteClient(clientId) {
  const client = appState.clients.find(c => c.id === clientId);
  if (!client) {
    showToast("Client record not found.");
    return;
  }

  const linkedProjects = appState.projects.filter(p => p.clientId === clientId);
  let warningText = null;
  const messageText = `You are about to permanently remove <strong>${client.name}</strong> (${client.eventType}, ${client.location}) from your client directory.`;

  if (linkedProjects.length > 0) {
    const projectNames = linkedProjects.map(p => `"${p.title}"`).join(', ');
    warningText = `⚠️ <strong>Associated Data Warning:</strong> This client is currently linked to <strong>${linkedProjects.length} active project(s)</strong>: ${projectNames}. Deleting this client will also delete all associated projects, albums, gallery photos, and tasks.`;
  }

  showDeleteConfirmation({
    title: "Delete Client",
    heading: `Delete "${client.name}"?`,
    message: messageText,
    warning: warningText,
    onConfirm: () => {
      appState.clients = appState.clients.filter(c => c.id !== clientId);
      
      if (linkedProjects.length > 0) {
        const linkedProjectIds = new Set(linkedProjects.map(p => p.id));
        appState.projects = appState.projects.filter(p => !linkedProjectIds.has(p.id));
        appState.albumSpreads = appState.albumSpreads.filter(s => !linkedProjectIds.has(s.projectId));
        appState.portalGallery = appState.portalGallery.filter(g => !linkedProjectIds.has(g.projectId));
        appState.tasks = appState.tasks.filter(t => !linkedProjectIds.has(t.projectId));

        if (linkedProjectIds.has(appState.activeProjectId)) {
          appState.activeProjectId = appState.projects[0]?.id || null;
        }
      }

      saveData();
      populateClientSelectOptions();
      populatePaymentProjectSelectOptions();
      populateTaskProjectSelectOptions();
      renderAllViews();
      showToast(`Client "${client.name}" ${linkedProjects.length > 0 ? 'and associated projects ' : ''}deleted successfully.`);
    }
  });
}

// 2. Delete Project
function confirmDeleteProject(projectId) {
  const project = getProject(projectId);
  if (!project) {
    showToast("Project record not found.");
    return;
  }

  const messageText = `You are about to permanently delete project <strong>${project.title}</strong> for client <strong>${project.clientName}</strong>.`;
  const warningText = `⚠️ <strong>Financial & Production Data:</strong> Contract Value: ${formatINR(project.price)}, Paid to Date: ${formatINR(project.paid)}, Stage: "${project.stage}". All project album spreads, gallery photos, and associated tasks will be removed.`;

  showDeleteConfirmation({
    title: "Delete Photography Project",
    heading: `Delete "${project.title}"?`,
    message: messageText,
    warning: warningText,
    onConfirm: () => {
      appState.projects = appState.projects.filter(p => p.id !== projectId);
      appState.albumSpreads = appState.albumSpreads.filter(s => s.projectId !== projectId);
      appState.portalGallery = appState.portalGallery.filter(g => g.projectId !== projectId);
      appState.tasks = appState.tasks.filter(t => t.projectId !== projectId);

      if (appState.activeProjectId === projectId) {
        appState.activeProjectId = appState.projects[0]?.id || null;
      }

      closeModal('modalNewProject');
      saveData();
      populatePaymentProjectSelectOptions();
      populateTaskProjectSelectOptions();
      renderAllViews();
      if (appState.activeView === 'workspace') {
        navigateTo('projects');
      }
      showToast(`Project "${project.title}" deleted.`);
    }
  });
}

function handleDeleteProjectFromModal() {
  const inputId = document.getElementById('inputProjectId');
  if (inputId && inputId.value) {
    confirmDeleteProject(inputId.value);
  }
}

// 3. Delete Task
function confirmDeleteTask(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) {
    showToast("Task not found.");
    return;
  }

  showDeleteConfirmation({
    title: "Delete Studio Task",
    heading: `Delete Task?`,
    message: `Are you sure you want to remove the task: <strong>"${task.title}"</strong> (Due: ${formatDate(task.dueDate)})?`,
    warning: null,
    onConfirm: () => {
      appState.tasks = appState.tasks.filter(t => t.id !== taskId);
      if (task.projectId) {
        addProjectActivity(task.projectId, "Task Deleted", `Task removed: "${task.title}"`);
      }
      saveData();
      renderTasksList();
      renderProjectWorkspace();
      renderDashboard();
      updateBadgesAndKPIs();
      showToast("Task deleted.");
    }
  });
}

// 4. Delete Calendar Event
function confirmDeleteEvent(eventId) {
  const event = appState.calendarEvents.find(e => e.id === eventId);
  if (!event) {
    showToast("Event not found.");
    return;
  }

  showDeleteConfirmation({
    title: "Delete Schedule Event",
    heading: `Delete "${event.title}"?`,
    message: `Are you sure you want to remove this ${event.type} event scheduled for <strong>${formatDate(event.date)}</strong>?`,
    warning: null,
    onConfirm: () => {
      appState.calendarEvents = appState.calendarEvents.filter(e => e.id !== eventId);
      saveData();
      renderCalendarView();
      showToast(`Event "${event.title}" removed from schedule.`);
    }
  });
}

// ================= BULK DELETION (DELETE ALL) MANAGEMENT =================
function promptBulkDelete(category) {
  const inputConfirm = document.getElementById('inputBulkDeleteConfirm');
  const confirmBtn = document.getElementById('btnConfirmBulkDeleteAction');
  const titleEl = document.getElementById('bulkDeleteModalTitle');
  const headEl = document.getElementById('bulkDeleteHeading');
  const msgEl = document.getElementById('bulkDeleteMessage');
  const warnEl = document.getElementById('bulkDeleteWarning');

  if (inputConfirm) inputConfirm.value = '';
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = '0.4';
    confirmBtn.style.cursor = 'not-allowed';
  }

  let count = 0;
  let title = '';
  let heading = '';
  let message = '';
  let warning = null;
  let actionFn = null;

  switch (category) {
    case 'clients':
      count = appState.clients.length;
      if (count === 0) {
        showToast("No clients to delete in directory.");
        return;
      }
      title = "Delete All Clients";
      heading = `Permanently delete all ${count} clients?`;
      message = `You are about to delete all <strong>${count} client records</strong> from the directory.`;
      warning = `⚠️ <strong>Cascade Warning:</strong> Deleting all clients will also permanently delete all <strong>${appState.projects.length} associated projects</strong>, albums, gallery photos, and project tasks.`;
      actionFn = () => {
        appState.clients = [];
        appState.projects = [];
        appState.albumSpreads = [];
        appState.portalGallery = [];
        appState.tasks = appState.tasks.filter(t => !t.projectId);
        appState.activeProjectId = null;
        saveData();
        populateClientSelectOptions();
        populatePaymentProjectSelectOptions();
        populateTaskProjectSelectOptions();
        renderAllViews();
        showToast(`All ${count} clients and associated projects have been deleted.`);
      };
      break;

    case 'projects':
      count = appState.projects.length;
      if (count === 0) {
        showToast("No photography projects to delete.");
        return;
      }
      title = "Delete All Projects";
      heading = `Permanently delete all ${count} projects?`;
      message = `You are about to delete all <strong>${count} photography projects</strong> across all production stages.`;
      warning = `⚠️ <strong>Financial & Data Notice:</strong> All contract balances, albums, and project photos will be cleared. Client contact records will remain intact.`;
      actionFn = () => {
        appState.projects = [];
        appState.albumSpreads = [];
        appState.portalGallery = [];
        appState.tasks = appState.tasks.filter(t => !t.projectId);
        appState.activeProjectId = null;
        saveData();
        populatePaymentProjectSelectOptions();
        populateTaskProjectSelectOptions();
        renderAllViews();
        showToast(`All ${count} photography projects have been deleted.`);
      };
      break;

    case 'tasks':
      count = appState.tasks.length;
      if (count === 0) {
        showToast("No tasks to delete.");
        return;
      }
      title = "Delete All Tasks";
      heading = `Permanently delete all ${count} tasks?`;
      message = `You are about to delete all <strong>${count} studio tasks</strong> across all categories.`;
      actionFn = () => {
        appState.tasks = [];
        saveData();
        renderTasksList();
        renderProjectWorkspace();
        renderDashboard();
        updateBadgesAndKPIs();
        showToast(`All ${count} studio tasks have been deleted.`);
      };
      break;

    case 'calendar':
      count = appState.calendarEvents.length;
      if (count === 0) {
        showToast("No schedule events to delete.");
        return;
      }
      title = "Delete All Schedule Events";
      heading = `Permanently delete all ${count} calendar events?`;
      message = `You are about to delete all <strong>${count} calendar events</strong> and shoot appointments.`;
      actionFn = () => {
        appState.calendarEvents = [];
        saveData();
        renderCalendarView();
        showToast(`All ${count} schedule events have been deleted.`);
      };
      break;

    case 'revisions':
      let totalNotes = appState.albumSpreads.reduce((sum, s) => sum + (Array.isArray(s.notes) ? s.notes.length : 0), 0);
      count = totalNotes;
      if (count === 0) {
        showToast("No album revision requests to delete.");
        return;
      }
      title = "Delete All Revision Requests";
      heading = `Permanently delete all ${count} revision notes?`;
      message = `You are about to delete all <strong>${count} revision requests</strong> across all album spreads.`;
      actionFn = () => {
        appState.albumSpreads.forEach(s => {
          s.notes = [];
        });
        saveData();
        renderPortalSpreadViewer();
        renderDashboardSpreadRevisions();
        renderProjectWorkspace();
        updateBadgesAndKPIs();
        showToast(`All ${count} album revision requests have been deleted.`);
      };
      break;

    default:
      return;
  }

  if (titleEl) titleEl.textContent = title;
  if (headEl) headEl.textContent = heading;
  if (msgEl) msgEl.innerHTML = message;
  
  if (warnEl) {
    if (warning) {
      warnEl.style.display = 'block';
      warnEl.innerHTML = warning;
    } else {
      warnEl.style.display = 'none';
      warnEl.innerHTML = '';
    }
  }

  pendingBulkDeleteAction = actionFn;

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (typeof pendingBulkDeleteAction === 'function') {
        pendingBulkDeleteAction();
      }
      pendingBulkDeleteAction = null;
      closeModal('modalBulkDelete');
    };
  }

  openModal('modalBulkDelete');
}

function handleBulkDeleteInput(val) {
  const confirmBtn = document.getElementById('btnConfirmBulkDeleteAction');
  if (!confirmBtn) return;

  const isMatch = (val.trim().toUpperCase() === 'DELETE ALL');
  confirmBtn.disabled = !isMatch;
  confirmBtn.style.opacity = isMatch ? '1' : '0.4';
  confirmBtn.style.cursor = isMatch ? 'pointer' : 'not-allowed';
}

// ================= FORM HANDLERS & MODALS =================
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('active');
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('active');
}

function openCreateProjectModal() {
  const form = document.getElementById('formNewProject');
  if (form && typeof form.reset === 'function') form.reset();
  const inputId = document.getElementById('inputProjectId');
  if (inputId) inputId.value = "";
  const titleElem = document.getElementById('modalProjectTitle');
  if (titleElem) titleElem.textContent = "Create Photography Project";
  const delBtn = document.getElementById('btnDeleteProjectFromModal');
  if (delBtn) delBtn.style.display = 'none';
  openModal('modalNewProject');
}

// Populate Dropdowns
function populateClientSelectOptions() {
  const sel = document.getElementById('selectProjectClient');
  if (sel) {
    if (appState.clients.length === 0) {
      sel.innerHTML = `<option value="">No clients available. Please add a client first.</option>`;
    } else {
      sel.innerHTML = appState.clients.map(c => `
        <option value="${c.id}">${c.name} (${c.eventType})</option>
      `).join('');
    }
  }
}

function populatePaymentProjectSelectOptions() {
  const sel = document.getElementById('selectPaymentProject');
  if (sel) {
    if (appState.projects.length === 0) {
      sel.innerHTML = `<option value="">No projects available.</option>`;
    } else {
      sel.innerHTML = appState.projects.map(p => `
        <option value="${p.id}">${p.title} — ${p.clientName} (Bal: ${formatINR(p.price - p.paid)})</option>
      `).join('');
    }
    updatePaymentFormHint();
  }
}

function populateTaskProjectSelectOptions() {
  const sel = document.getElementById('selectTaskProject');
  if (sel) {
    sel.innerHTML = `<option value="">General Studio Task (No Project)</option>` +
      appState.projects.map(p => `
        <option value="${p.id}">${p.title} — ${p.clientName}</option>
      `).join('');
  }
}

function openCreateClientModal() {
  const form = document.getElementById('formNewClient');
  if (form && typeof form.reset === 'function') form.reset();
  const inputId = document.getElementById('inputClientId');
  if (inputId) inputId.value = '';
  const titleEl = document.getElementById('modalClientTitle');
  if (titleEl) titleEl.textContent = "Add New Client";
  openModal('modalNewClient');
}

function openEditClient(clientId) {
  const c = appState.clients.find(item => item.id === clientId);
  if (!c) return;

  const inputId = document.getElementById('inputClientId');
  const inputName = document.getElementById('inputClientName');
  const inputEmail = document.getElementById('inputClientEmail');
  const inputPhone = document.getElementById('inputClientPhone');
  const selectType = document.getElementById('selectClientEventType');
  const inputLoc = document.getElementById('inputClientLocation');
  const titleEl = document.getElementById('modalClientTitle');

  if (inputId) inputId.value = c.id;
  if (inputName) inputName.value = c.name;
  if (inputEmail) inputEmail.value = c.email;
  if (inputPhone) inputPhone.value = c.phone;
  if (selectType) selectType.value = c.eventType;
  if (inputLoc) inputLoc.value = c.location;
  if (titleEl) titleEl.textContent = `Edit Client: ${c.name}`;

  openModal('modalNewClient');
}

// Client Creation & Edit
function handleSaveClient(e) {
  e.preventDefault();
  const form = e.target;
  const clientId = (form.clientId ? form.clientId.value : (document.getElementById('inputClientId')?.value || '')).trim();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const eventType = form.eventType.value;
  const location = form.location.value.trim();

  if (!name || !email || !phone) {
    showToast("Please complete all required client fields.");
    return;
  }

  const initials = name.replace(/&/g, '').trim().split(/\s+/).filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'CL';

  if (clientId) {
    // Edit existing client
    const existing = appState.clients.find(c => c.id === clientId);
    if (existing) {
      existing.name = name;
      existing.email = email;
      existing.phone = phone;
      existing.eventType = eventType;
      existing.location = location;
      existing.initials = initials;

      // Sync linked projects
      appState.projects.forEach(p => {
        if (p.clientId === clientId) {
          p.clientName = name;
        }
      });

      showToast(`Client profile for "${name}" updated.`);
    }
  } else {
    // New client
    const newClient = {
      id: "c_" + Date.now(),
      name: name,
      email: email,
      phone: phone,
      location: location,
      eventType: eventType,
      status: "Active",
      initials: initials
    };
    appState.clients.unshift(newClient);
    showToast(`Client "${name}" added successfully.`);
  }

  saveData();
  populateClientSelectOptions();
  closeModal('modalNewClient');
  if (form && typeof form.reset === 'function') form.reset();
  renderAllViews();
}

function openModalForClientProject(clientId) {
  openCreateProjectModal();
  const sel = document.getElementById('selectProjectClient');
  if (sel) sel.value = clientId;
}

// Project Creation & Edit
function handleSaveProject(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.projectId.value;
  const clientId = form.clientId.value;
  const client = appState.clients.find(c => c.id === clientId);
  const clientName = client ? client.name : "Client";

  const title = form.title.value.trim();
  const pkg = form.package.value.trim();
  const eventDate = form.eventDate.value;
  const price = Number(form.price.value);
  const paid = Number(form.paid.value);
  const stage = form.stage.value;
  const deliveryDeadline = form.deliveryDeadline.value;

  if (price < 0 || paid < 0) {
    showToast("Price and paid amount cannot be negative.");
    return;
  }

  if (paid > price) {
    showToast("Paid amount cannot exceed total project price.");
    return;
  }

  if (id) {
    // Edit existing
    const existing = getProject(id);
    if (existing) {
      existing.clientId = clientId;
      existing.clientName = clientName;
      existing.title = title;
      existing.package = pkg;
      existing.eventDate = eventDate;
      existing.price = price;
      existing.paid = paid;
      existing.stage = stage;
      existing.deliveryDeadline = deliveryDeadline;
      addProjectActivity(id, "Project Edited", `Project details updated (Package: ${pkg}, Stage: ${stage})`);
      showToast(`Project "${title}" updated.`);
    }
  } else {
    // New project
    const newId = "p_" + Date.now();
    const newProj = {
      id: newId,
      clientId: clientId,
      clientName: clientName,
      title: title,
      package: pkg,
      eventDate: eventDate,
      price: price,
      paid: paid,
      stage: stage,
      deliveryDeadline: deliveryDeadline,
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      notes: [],
      activity: [
        {
          id: "act_" + Date.now(),
          action: "Project Created",
          details: `Project "${title}" created for ${clientName}`,
          timestamp: new Date().toISOString(),
          formattedTime: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    appState.projects.unshift(newProj);
    appState.activeProjectId = newId;
    showToast(`Project "${title}" created.`);
  }

  saveData();
  populatePaymentProjectSelectOptions();
  populateTaskProjectSelectOptions();
  closeModal('modalNewProject');
  if (form && typeof form.reset === 'function') form.reset();
  renderAllViews();
}

function openProjectEdit(projectId) {
  const p = getProject(projectId);
  if (!p) return;

  document.getElementById('modalProjectTitle').textContent = `Edit: ${p.title}`;
  document.getElementById('inputProjectId').value = p.id;
  document.getElementById('selectProjectClient').value = p.clientId;
  document.getElementById('inputProjectTitle').value = p.title;
  document.getElementById('inputProjectPackage').value = p.package;
  document.getElementById('inputProjectDate').value = p.eventDate;
  document.getElementById('inputProjectPrice').value = p.price;
  document.getElementById('inputProjectPaid').value = p.paid;
  document.getElementById('selectProjectStage').value = p.stage;
  document.getElementById('inputProjectDeadline').value = p.deliveryDeadline;

  const delBtn = document.getElementById('btnDeleteProjectFromModal');
  if (delBtn) delBtn.style.display = 'inline-flex';

  openModal('modalNewProject');
}

// Payment Recording
function handleRecordPayment(e) {
  e.preventDefault();
  const form = e.target;
  const projectId = form.projectId.value;
  const amount = Number(form.amount.value);
  const method = form.method.value || "Bank NEFT";

  const p = getProject(projectId);
  if (!p) {
    showToast("Selected project not found.");
    return;
  }

  const remainingBalance = p.price - p.paid;
  if (remainingBalance <= 0) {
    showToast(`Project "${p.title}" is already fully paid.`);
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    showToast("Please enter a valid payment amount greater than ₹0.");
    return;
  }

  if (amount > remainingBalance) {
    showToast(`Payment amount (${formatINR(amount)}) cannot exceed remaining balance (${formatINR(remainingBalance)}).`);
    return;
  }

  p.paid += amount;
  addProjectActivity(projectId, "Payment Recorded", `Received payment installment of ${formatINR(amount)} via ${method}`);
  saveData();
  closeModal('modalRecordPayment');
  if (form && typeof form.reset === 'function') form.reset();
  populatePaymentProjectSelectOptions();
  renderAllViews();
  showToast(`Recorded payment of ${formatINR(amount)} via ${method} for "${p.title}"`);
}

// Calendar Event
function handleSaveEvent(e) {
  e.preventDefault();
  const form = e.target;
  const title = form.title.value.trim();
  const type = form.type.value;
  const date = form.date.value;
  const location = form.location.value.trim();

  if (!title || !date) {
    showToast("Please enter an event title and date.");
    return;
  }

  appState.calendarEvents.push({
    id: "e_" + Date.now(),
    title: title,
    type: type,
    date: date,
    location: location
  });

  saveData();
  closeModal('modalNewEvent');
  if (form && typeof form.reset === 'function') form.reset();
  renderCalendarView();
  showToast(`Event added to schedule: "${title}"`);
}

// Task Creation / Editing
function handleSaveTask(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const form = (e && e.target) || {};
  const taskId = form.taskId ? form.taskId.value : (document.getElementById('inputTaskId')?.value || '');
  const title = (form.title ? form.title.value : (document.getElementById('inputTaskTitle')?.value || '')).trim();
  const description = (form.description ? form.description.value : (document.getElementById('inputTaskDescription')?.value || '')).trim();
  const dueDate = form.dueDate ? form.dueDate.value : (document.getElementById('inputTaskDueDate')?.value || '');
  const category = form.category ? form.category.value : (document.getElementById('selectTaskCategory')?.value || 'Editing');
  const priority = form.priority ? form.priority.value : (document.getElementById('selectTaskPriority')?.value || 'Medium');
  const status = form.status ? form.status.value : (document.getElementById('selectTaskStatus')?.value || 'To Do');
  const projectId = form.projectId ? (form.projectId.value || null) : (document.getElementById('selectTaskProject')?.value || null);

  if (!title || !dueDate) {
    showToast("Please provide task title and due date.");
    return;
  }

  const isCompleted = (status === 'Done');

  if (taskId) {
    // Edit existing task
    const task = appState.tasks.find(t => t.id === taskId);
    if (task) {
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      task.category = category;
      task.priority = priority;
      task.status = status;
      task.completed = isCompleted;
      task.projectId = projectId;

      if (projectId) {
        addProjectActivity(projectId, "Task Updated", `Task updated: "${title}" (Status: ${status})`);
      }
      showToast(`Task "${title}" updated.`);
    }
  } else {
    // Create new task
    const newTask = {
      id: "t_" + Date.now(),
      projectId: projectId,
      title: title,
      description: description,
      dueDate: dueDate,
      category: category,
      priority: priority,
      status: status,
      completed: isCompleted
    };

    appState.tasks.unshift(newTask);

    if (projectId) {
      addProjectActivity(projectId, "Task Created", `Studio task added: "${title}" (Due: ${formatDate(dueDate)})`);
    }
    showToast(`Task added: "${title}"`);
  }

  saveData();
  closeModal('modalNewTask');
  if (form && typeof form.reset === 'function') form.reset();
  renderTasksList();
  renderProjectWorkspace();
  renderDashboard();
  updateBadgesAndKPIs();
}

// Lightbox
function openLightbox(imgSrc, caption) {
  const box = document.getElementById('photoLightbox');
  const img = document.getElementById('lightboxImage');
  const cap = document.getElementById('lightboxCaption');
  if (box && img) {
    img.src = imgSrc;
    if (cap) cap.textContent = caption || '';
    box.classList.add('active');
  }
}

function closeLightbox() {
  const box = document.getElementById('photoLightbox');
  if (box) box.classList.remove('active');
}

// Toast System
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#af7f34" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${msg}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => {
      if (toast && typeof toast.remove === 'function') {
        toast.remove();
      } else if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, 3200);
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
