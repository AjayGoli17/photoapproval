/**
 * StudioFlow — Photography Studio Workflow Management
 * Pure Vanilla JavaScript Application Engine
 * Includes: Photo Selection Gallery + Complete Album Proofing & Approval Workflow
 */

(function() {
  'use strict';

  // =========================================================================
  // 1. Photo Catalog & 20-Spread Album Proof Seed Data
  // =========================================================================

  const GALLERY_PHOTOS = [
    { id: 'WED-001', title: 'Varmala Floral Garland Moment', event: 'Wedding', category: 'Ceremony', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
    { id: 'WED-002', title: 'Priya Bridal Portrait in Gold Lehenga', event: 'Wedding', category: 'Bride', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
    { id: 'WED-003', title: 'Rahul Groom Sherwani Detail', event: 'Wedding', category: 'Groom', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
    { id: 'WED-004', title: 'Mandap Sacred Flame Pheras', event: 'Wedding', category: 'Ceremony', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
    { id: 'WED-005', title: 'Sunset Palace Courtyard Portrait', event: 'Wedding', category: 'Couple', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
    { id: 'WED-006', title: 'Priya & Parents Sindoor Emotion', event: 'Wedding', category: 'Family', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
    { id: 'WED-007', title: 'Candid Joyful Laughter during Kanyadaan', event: 'Wedding', category: 'Candid', image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80' },
    { id: 'WED-008', title: 'Royal Mandap Stage Architecture', event: 'Wedding', category: 'Ceremony', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80' },
    { id: 'WED-009', title: 'Groom Baraat Dancing Procession', event: 'Wedding', category: 'Groom', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' },
    { id: 'WED-010', title: 'Bridal Jewelry & Maang Tikka Close-up', event: 'Wedding', category: 'Bride', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
    { id: 'HAL-001', title: 'Turmeric Yellow Marigold Shower', event: 'Haldi', category: 'Ceremony', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
    { id: 'HAL-002', title: 'Priya Haldi Radiance & Floral Jewelry', event: 'Haldi', category: 'Bride', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
    { id: 'HAL-003', title: 'Friends Drenching Rahul in Rosewater', event: 'Haldi', category: 'Groom', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
    { id: 'MEH-001', title: 'Intricate Henna Pattern on Bridal Palms', event: 'Mehendi', category: 'Bride', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
    { id: 'MEH-002', title: 'Boho Garden Lounging Portrait', event: 'Mehendi', category: 'Couple', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80' },
    { id: 'SAN-001', title: 'Starlight Dance Performance on Stage', event: 'Sangeet', category: 'Couple', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
    { id: 'SAN-002', title: 'Sparklers & Confetti High Note', event: 'Sangeet', category: 'Ceremony', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
    { id: 'REC-001', title: 'Black Tie Tuxedo & Emerald Gown Entry', event: 'Reception', category: 'Couple', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
    { id: 'REC-002', title: 'First Dance under Crystal Chandelier', event: 'Reception', category: 'Couple', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
    { id: 'REC-003', title: 'Guests Dancing on Live Band Beat', event: 'Reception', category: 'Candid', image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80' }
  ];

  // 20 Digital Spreads definition for the Album Proof
  const DEFAULT_ALBUM_SPREADS = [
    {
      id: 'spread-1',
      spreadNumber: 1,
      pageRange: 'Front Cover & Title',
      title: 'Heritage Monogram & Gold Leaf Emboss',
      theme: 'Album Cover',
      leftImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-2',
      spreadNumber: 2,
      pageRange: 'pp. 02-03',
      title: 'Haldi Blessings & Marigold Radiance',
      theme: 'Haldi Ceremony',
      leftImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-3',
      spreadNumber: 3,
      pageRange: 'pp. 04-05',
      title: 'Haldi Rosewater Splash & Laughter',
      theme: 'Haldi Ceremony',
      leftImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80',
      layoutType: 'duo-col',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-4',
      spreadNumber: 4,
      pageRange: 'pp. 06-07',
      title: 'Mehendi Intricate Henna Artistry',
      theme: 'Mehendi Celebration',
      leftImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-5',
      spreadNumber: 5,
      pageRange: 'pp. 08-09',
      title: 'Boho Garden Lounging & Bridesmaids',
      theme: 'Mehendi Celebration',
      leftImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      layoutType: 'duo-col',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-6',
      spreadNumber: 6,
      pageRange: 'pp. 10-11',
      title: 'Sangeet Stage Lighting & Bollywood Entries',
      theme: 'Sangeet Night',
      leftImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-7',
      spreadNumber: 7,
      pageRange: 'pp. 12-13',
      title: 'Starlight Duet Dance & Sparklers',
      theme: 'Sangeet Night',
      leftImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-8',
      spreadNumber: 8,
      pageRange: 'pp. 14-15',
      title: 'Bridal Preparation & Gold Jewelry Fine Detail',
      theme: 'Wedding Day',
      leftImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-9',
      spreadNumber: 9,
      pageRange: 'pp. 16-17',
      title: 'Groom Baraat Royal Procession',
      theme: 'Wedding Day',
      leftImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      layoutType: 'duo-col',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-10',
      spreadNumber: 10,
      pageRange: 'pp. 18-19',
      title: 'Bride Walking the Aisle under Phoolon Ki Chaadar',
      theme: 'Wedding Ceremony',
      leftImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-11',
      spreadNumber: 11,
      pageRange: 'pp. 20-21',
      title: 'The Varmala Exchange under Petal Rain',
      theme: 'Wedding Ceremony',
      leftImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-12',
      spreadNumber: 12,
      pageRange: 'pp. 22-23',
      title: 'Sacred Agni Pheras & Saptapadi Vows',
      theme: 'Wedding Ceremony',
      leftImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-13',
      spreadNumber: 13,
      pageRange: 'pp. 24-25',
      title: 'Sindoor Daan & Mangalsutra Blessing',
      theme: 'Wedding Ceremony',
      leftImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-14',
      spreadNumber: 14,
      pageRange: 'pp. 26-27',
      title: 'Mandap Candid Emotions & Family Tears',
      theme: 'Wedding Ceremony',
      leftImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      layoutType: 'duo-col',
      hasRevisionFlag: true,
      comments: [
        {
          id: 'c-14-1',
          author: 'Rahul Sharma',
          role: 'client',
          timestamp: '2 hours ago',
          text: 'On the right page, could we swap the candid laughing shot with the black and white portrait from the Mandap series?',
          xPercent: 72,
          yPercent: 40,
          resolved: false,
          studioReply: null
        }
      ]
    },
    {
      id: 'spread-15',
      spreadNumber: 15,
      pageRange: 'pp. 28-29',
      title: 'Sunset Palace Courtyard Couple Portraits',
      theme: 'Royal Portraits',
      leftImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-16',
      spreadNumber: 16,
      pageRange: 'pp. 30-31',
      title: 'Vidaai Emotional Departure Blessings',
      theme: 'Vidaai',
      leftImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80',
      layoutType: 'duo-col',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-17',
      spreadNumber: 17,
      pageRange: 'pp. 32-33',
      title: 'Reception Grand Entrance & Black Tie Glamour',
      theme: 'Grand Reception',
      leftImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-18',
      spreadNumber: 18,
      pageRange: 'pp. 34-35',
      title: 'First Dance under Crystal Chandelier',
      theme: 'Grand Reception',
      leftImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-19',
      spreadNumber: 19,
      pageRange: 'pp. 36-37',
      title: 'Champagne Toast & Live Band Revelry',
      theme: 'Grand Reception',
      leftImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      layoutType: 'duo-col',
      hasRevisionFlag: false,
      comments: []
    },
    {
      id: 'spread-20',
      spreadNumber: 20,
      pageRange: 'pp. 38-40 / Back Cover',
      title: 'Closing Signature & Archival Stamp',
      theme: 'Back Cover',
      leftImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      rightImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      layoutType: 'hero-duo',
      hasRevisionFlag: false,
      comments: []
    }
  ];

  // =========================================================================
  // 2. Shared State Management & LocalStorage Persistence
  // =========================================================================

  const STORAGE_KEY = 'studioflow_app_state_v3';

  function generateInitialSelectedIds() {
    const ids = [];
    GALLERY_PHOTOS.slice(0, 20).forEach(p => ids.push(p.id));
    for (let i = 21; i <= 237; i++) {
      ids.push(`WED-EXT-${String(i).padStart(3, '0')}`);
    }
    return ids;
  }

  function getSavedState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read localStorage:', e);
    }
    return null;
  }

  const defaultState = {
    viewMode: 'studio', // 'studio' | 'client'
    clientActiveWorkspace: 'album', // 'gallery' | 'album'
    currentStudioPage: 'dashboard',
    selectedProjectId: 'rahul-priya',
    projectFilter: 'all',
    searchQuery: '',
    clientEventFilter: 'All Photos',
    selectedPhotoIds: generateInitialSelectedIds(),
    minSelections: 220,
    maxSelections: 250,
    selectionSubmitted: true,
    submittedTimestamp: '2 hours ago',
    lightboxIndex: 0,
    
    // Album Proofing Pipeline State
    albumState: {
      version: 'v1', // 'v1' | 'v2' | 'approved'
      status: 'revisions_requested', // 'ready_for_review' | 'revisions_requested' | 'studio_updated' | 'approved'
      currentSpreadIdx: 13, // Start on Spread 14 (Index 13) to highlight the active revision thread
      spreads: DEFAULT_ALBUM_SPREADS,
      approvedAt: null,
      approvedBy: null,
      printLabOrderId: null
    }
  };

  const APP_STATE = Object.assign({}, defaultState, getSavedState() || {});

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(APP_STATE));
    } catch (e) {
      console.warn('Could not save localStorage:', e);
    }
  }

  // =========================================================================
  // 3. Category Requirements Calculation
  // =========================================================================

  const CATEGORY_REQUIREMENTS = {
    'Bride': { target: 20, initial: 18 },
    'Groom': { target: 20, initial: 19 },
    'Couple': { target: 40, initial: 40 },
    'Family': { target: 30, initial: 28 },
    'Ceremony': { target: 50, initial: 48 },
    'Candid': { target: 40, initial: 38 }
  };

  function calculateCategoryCounts() {
    const counts = { 'Bride': 18, 'Groom': 19, 'Couple': 40, 'Family': 28, 'Ceremony': 48, 'Candid': 38 };
    GALLERY_PHOTOS.forEach((photo, idx) => {
      const isInitiallySelected = idx < 20;
      const isCurrentlySelected = APP_STATE.selectedPhotoIds.includes(photo.id);
      if (isCurrentlySelected && !isInitiallySelected) {
        if (counts[photo.category] !== undefined) counts[photo.category]++;
      } else if (!isCurrentlySelected && isInitiallySelected) {
        if (counts[photo.category] !== undefined) counts[photo.category] = Math.max(0, counts[photo.category] - 1);
      }
    });
    return counts;
  }

  // Studio projects list
  const STUDIO_PROJECTS = [
    {
      id: 'rahul-priya',
      clientNames: 'Rahul & Priya',
      clientEmail: 'rahul.sharma@example.com',
      partnerEmail: 'priya.patel@example.com',
      projectName: 'Wedding Collection',
      eventType: 'Wedding Collection',
      eventDate: '18 September 2026',
      location: 'Hyderabad, India',
      projectId: 'FH-2026-0918',
      totalPhotos: 2843,
      selectionLimit: 250,
      isMainDemo: true,
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      photographer: 'FrameHouse Studio (Lead: Kabir Mehta)',
      albumStatus: 'Draft Proof in Client Review',
      deliveryStatus: 'Pending (Target: 15 Oct 2026)',
      events: [
        { id: 'haldi', name: 'Haldi Ceremony', dateTime: '14 Sep 2026 · 4:00 PM', photoCount: 486, cover: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', status: 'Selection Open', featured: false },
        { id: 'mehendi', name: 'Mehendi Celebration', dateTime: '15 Sep 2026 · 6:30 PM', photoCount: 531, cover: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80', status: 'Selection Open', featured: false },
        { id: 'sangeet', name: 'Sangeet & Sangeet Night', dateTime: '16 Sep 2026 · 7:30 PM', photoCount: 612, cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', status: 'Selection Open', featured: false },
        { id: 'wedding', name: 'Wedding Muhurtham', dateTime: '18 Sep 2026 · 8:30 AM', photoCount: 781, cover: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80', status: 'Selection Open', featured: true },
        { id: 'reception', name: 'Grand Reception', dateTime: '19 Sep 2026 · 7:00 PM', photoCount: 433, cover: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80', status: 'Selection Open', featured: false }
      ],
      activity: [
        { text: '<strong>Rahul & Priya</strong> requested 1 layout adjustment on Spread 14', time: '2 hours ago', recent: true },
        { text: '<strong>Studio</strong> published 20-spread digital album proof (Draft v1)', time: '4 hours ago', recent: true },
        { text: 'Rahul & Priya submitted final photo selections (237 photos)', time: 'Yesterday', recent: false }
      ]
    },
    {
      id: 'arjun-sneha',
      clientNames: 'Arjun & Sneha',
      clientEmail: 'arjun.k@example.com',
      projectName: 'Wedding Collection',
      eventType: 'Wedding Collection',
      eventDate: '24 October 2026',
      location: 'Udaipur, Rajasthan',
      projectId: 'FH-2026-1024',
      totalPhotos: 4216,
      selectedPhotos: 320,
      selectionLimit: 320,
      currentStage: 'Album',
      statusText: 'Album review',
      updatedAt: '2 hours ago',
      isMainDemo: false,
      coverImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'meera-karthik',
      clientNames: 'Meera & Karthik',
      clientEmail: 'meera.v@example.com',
      projectName: 'Engagement Session',
      eventType: 'Engagement Session',
      eventDate: '02 November 2026',
      location: 'Bengaluru, India',
      projectId: 'FH-2026-1102',
      totalPhotos: 864,
      selectedPhotos: 80,
      selectionLimit: 80,
      currentStage: 'Editing',
      statusText: 'Editing in progress',
      updatedAt: 'Yesterday',
      isMainDemo: false,
      coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'ananya-rohit',
      clientNames: 'Ananya & Rohit',
      clientEmail: 'ananya.m@example.com',
      projectName: 'Wedding Collection',
      eventType: 'Wedding Collection',
      eventDate: '15 November 2026',
      location: 'Goa, India',
      projectId: 'FH-2026-1115',
      totalPhotos: 3982,
      selectedPhotos: 280,
      selectionLimit: 280,
      currentStage: 'Delivery',
      statusText: 'Packaging Delivery',
      updatedAt: 'Yesterday',
      isMainDemo: false,
      coverImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'vikram-aisha',
      clientNames: 'Vikram & Aisha',
      clientEmail: 'vikram.s@example.com',
      projectName: 'Royal Wedding Collection',
      eventType: 'Wedding Collection',
      eventDate: '05 December 2026',
      location: 'Jaipur, Rajasthan',
      projectId: 'FH-2026-1205',
      totalPhotos: 3120,
      selectedPhotos: 0,
      selectionLimit: 300,
      currentStage: 'Shoot',
      statusText: 'Shoot Completed • Ingesting',
      updatedAt: '3 days ago',
      isMainDemo: false,
      coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const WORKFLOW_STAGES = [
    { key: 'Shoot', label: 'Shoot' },
    { key: 'Selection', label: 'Selection' },
    { key: 'Editing', label: 'Editing' },
    { key: 'Album', label: 'Album' },
    { key: 'Approval', label: 'Approval' },
    { key: 'Delivery', label: 'Delivery' }
  ];

  // =========================================================================
  // 4. DOM Elements
  // =========================================================================

  const studioLayout = document.getElementById('studio-layout');
  const clientLayout = document.getElementById('client-layout');
  const appView = document.getElementById('app-view');
  const breadcrumb = document.getElementById('page-breadcrumb');
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  const globalSearchInput = document.getElementById('global-search-input');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const toastContainer = document.getElementById('toast-container');
  const switchToStudioBtn = document.getElementById('switch-to-studio-btn');
  const switchToClientBtn = document.getElementById('switch-to-client-btn');

  // Modals
  const lightboxModal = document.getElementById('lightbox-modal');
  const reviewSelectionModal = document.getElementById('review-selection-modal');
  const submitConfirmModal = document.getElementById('submit-confirm-modal');
  const submitRevisionModal = document.getElementById('submit-revision-modal');
  const albumApproveModal = document.getElementById('album-approve-modal');
  const studioSelectedModal = document.getElementById('studio-selected-photos-modal');
  const printLabModal = document.getElementById('print-lab-handover-modal');
  const resetDemoModal = document.getElementById('reset-demo-modal');
  const newProjectModal = document.getElementById('new-project-modal');

  // =========================================================================
  // 5. Helpers & Toast Notifications
  // =========================================================================

  function showToast(message, icon = '✓') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 3600);
  }

  function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
  }

  function getStatusClass(stage) {
    switch (stage.toLowerCase()) {
      case 'selection': return 'status-selection';
      case 'editing': return 'status-editing';
      case 'album':
      case 'album review': return 'status-album';
      case 'delivery': return 'status-delivery';
      case 'shoot': return 'status-shoot';
      case 'approval': return 'status-delivery';
      default: return 'status-selection';
    }
  }

  // =========================================================================
  // 6. Mode Switcher (Studio <-> Client Portal)
  // =========================================================================

  function setAppMode(mode) {
    APP_STATE.viewMode = mode;
    saveState();

    if (mode === 'client') {
      document.body.className = 'mode-client';
      studioLayout.style.display = 'none';
      clientLayout.style.display = 'block';
      switchToStudioBtn.classList.remove('active');
      switchToClientBtn.classList.add('active');
      renderClientView();
    } else {
      document.body.className = 'mode-studio';
      studioLayout.style.display = 'flex';
      clientLayout.style.display = 'none';
      switchToStudioBtn.classList.add('active');
      switchToClientBtn.classList.remove('active');

      if (APP_STATE.currentStudioPage === 'projectDetail') {
        renderProjectDetail('rahul-priya');
      } else if (APP_STATE.currentStudioPage === 'projects') {
        renderProjects();
      } else {
        renderDashboard();
      }
    }
  }

  function renderClientView() {
    if (APP_STATE.clientActiveWorkspace === 'album') {
      renderClientAlbumProof();
    } else {
      renderClientPhotoGallery();
    }
  }

  // =========================================================================
  // 7. CLIENT ALBUM PROOF WORKSPACE (Prompt 3 Core Flow)
  // =========================================================================

  function renderClientAlbumProof() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const album = APP_STATE.albumState;
    const currentSpread = album.spreads[album.currentSpreadIdx] || album.spreads[0];
    const flaggedCount = album.spreads.filter(s => s.hasRevisionFlag && s.comments.some(c => !c.resolved)).length;

    let draftBadgeText = 'Draft v1 • In Review';
    let draftBadgeClass = 'draft-v1';
    if (album.status === 'approved') {
      draftBadgeText = 'Final Approved for Print ✓';
      draftBadgeClass = 'draft-approved';
    } else if (album.version === 'v2') {
      draftBadgeText = 'Draft v2 • Studio Revised';
      draftBadgeClass = 'draft-v2';
    } else if (album.status === 'revisions_requested') {
      draftBadgeText = 'Revisions Sent to Studio';
      draftBadgeClass = 'draft-v2';
    }

    let html = `
      <div class="view-enter">
        <!-- Client Top Navbar with Workspace Tabs -->
        <header class="client-navbar">
          <div class="client-brand-group">
            <div class="client-brand-logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3.2"/></svg>
            </div>
            <div>
              <div class="client-brand-title">StudioFlow</div>
              <div class="client-brand-subtext">Rahul & Priya Wedding</div>
            </div>
          </div>

          <!-- Workspace Switcher Tabs -->
          <div class="client-nav-center">
            <button class="client-workspace-tab ${APP_STATE.clientActiveWorkspace === 'gallery' ? 'active' : ''}" id="tab-goto-gallery">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>Photo Gallery (237)</span>
            </button>
            <button class="client-workspace-tab ${APP_STATE.clientActiveWorkspace === 'album' ? 'active' : ''}" id="tab-goto-album">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span>Album Proof (20 Spreads)</span>
            </button>
          </div>

          <div class="client-nav-right">
            <button class="client-switch-studio-btn" id="client-back-to-studio-btn">
              ← Return to Studio View
            </button>
          </div>
        </header>

        <!-- Main Album Proof Container -->
        <main class="client-main-content">
          <!-- Album Header Banner -->
          <div class="album-proof-header">
            <div class="album-proof-title-area">
              <div>
                <h1 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary);">Wedding Album Proof Review</h1>
                <p style="font-size: 0.825rem; color: var(--text-secondary); margin-top: 2px;">
                  12x18 Flushmount Archival Album • 20 Spreads (40 Pages)
                </p>
              </div>
              <span class="album-draft-badge ${draftBadgeClass}">${draftBadgeText}</span>
            </div>

            <div class="album-proof-toolbar">
              ${album.status !== 'approved' ? `
                <button class="btn btn-secondary btn-sm" id="client-send-revisions-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <span>Request Revisions ${flaggedCount > 0 ? `(${flaggedCount})` : ''}</span>
                </button>
                <button class="btn btn-accent btn-sm" id="client-approve-album-btn" style="background-color: #059669; border-color: #059669;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Approve Final Album</span>
                </button>
              ` : `
                <span style="font-size: 0.85rem; font-weight: 600; color: #059669; display: flex; align-items: center; gap: 0.4rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Album Approved & Sent to Print Lab
                </span>
              `}
            </div>
          </div>

          <!-- Panoramic Spread Stage -->
          <div class="album-spread-stage">
            <div class="album-spread-meta-banner">
              <div class="spread-page-number">
                <span>Spread ${currentSpread.spreadNumber} of 20</span>
                <span style="color: var(--text-tertiary);">•</span>
                <span style="font-weight: 500;">${currentSpread.pageRange}</span>
              </div>
              <span class="status-pill status-shoot">${currentSpread.theme}</span>
            </div>

            <!-- Double-Page Spread Canvas -->
            <div class="album-spread-canvas-wrap" id="spread-canvas-wrap">
              <!-- Left Page -->
              <div class="spread-half-page left-page">
                <img class="layout-hero-solo" src="${currentSpread.leftImage}" alt="${currentSpread.title} (Left)">
              </div>

              <!-- Right Page -->
              <div class="spread-half-page right-page">
                <img class="layout-hero-solo" src="${currentSpread.rightImage}" alt="${currentSpread.title} (Right)">
                ${currentSpread.comments.map((c, i) => `
                  <div class="spread-comment-pin ${c.resolved ? 'resolved' : ''}" style="top: ${c.yPercent}%; left: ${c.xPercent}%;" title="Comment by ${c.author}">
                    ${c.resolved ? '✓' : (i + 1)}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Spread Nav Buttons -->
            <div class="spread-nav-row">
              <button class="spread-nav-btn" id="spread-prev-btn" ${album.currentSpreadIdx === 0 ? 'disabled' : ''}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <span>Previous Spread</span>
              </button>

              <span style="font-size: 0.8rem; color: var(--text-tertiary);">
                Use <kbd>←</kbd> <kbd>→</kbd> arrow keys to browse spreads
              </span>

              <button class="spread-nav-btn" id="spread-next-btn" ${album.currentSpreadIdx === album.spreads.length - 1 ? 'disabled' : ''}>
                <span>Next Spread</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>

            <!-- 20-Spread Filmstrip Carousel -->
            <div class="album-filmstrip-bar">
              ${album.spreads.map((spread, idx) => `
                <div class="filmstrip-thumb ${album.currentSpreadIdx === idx ? 'active' : ''}" data-spread-idx="${idx}" title="Spread ${spread.spreadNumber}: ${spread.pageRange}">
                  <img src="${spread.leftImage}" alt="Spread ${spread.spreadNumber}">
                  <span class="filmstrip-badge">${spread.spreadNumber}</span>
                  ${spread.hasRevisionFlag ? `
                    <span class="filmstrip-flag-icon ${spread.comments.every(c => c.resolved) ? 'resolved' : ''}">
                      ${spread.comments.every(c => c.resolved) ? '✓' : '!'}
                    </span>
                  ` : ''}
                </div>
              `).join('')}
            </div>

            <!-- Comments & Revision Discussion Card for Current Spread -->
            <div class="album-comments-card">
              <div class="comments-card-header">
                <div>
                  <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">
                    Spread ${currentSpread.spreadNumber} Discussion & Feedback
                  </h3>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
                    ${currentSpread.title}
                  </p>
                </div>
                <span class="status-pill ${currentSpread.comments.length > 0 ? (currentSpread.comments.every(c => c.resolved) ? 'status-delivery' : 'status-selection') : 'status-shoot'}">
                  ${currentSpread.comments.length} comment${currentSpread.comments.length === 1 ? '' : 's'}
                </span>
              </div>

              <div class="comments-thread-list">
                ${currentSpread.comments.length === 0 ? `
                  <p style="font-size: 0.85rem; color: var(--text-tertiary); font-style: italic;">
                    No comments on this spread. If you'd like a photo swapped or layout adjusted, write a note below.
                  </p>
                ` : currentSpread.comments.map(c => `
                  <div class="comment-bubble">
                    <div class="comment-bubble-header">
                      <div class="comment-author-meta">
                        <span class="comment-avatar">${c.author.substring(0, 2).toUpperCase()}</span>
                        <span>${c.author}</span>
                        <span style="font-size: 0.72rem; color: var(--text-tertiary); font-weight: normal;">• ${c.timestamp}</span>
                      </div>
                      <span class="comment-status-pill ${c.resolved ? 'resolved' : 'needs-revision'}">
                        ${c.resolved ? '✓ Resolved' : 'Needs Revision'}
                      </span>
                    </div>
                    <p class="comment-text">${c.text}</p>
                    ${c.studioReply ? `
                      <div class="comment-bubble is-studio-reply" style="margin-top: 0.5rem;">
                        <div class="comment-author-meta">
                          <span class="comment-avatar" style="background-color: var(--accent-primary);">KM</span>
                          <span style="color: var(--accent-primary);">Kabir Mehta (FrameHouse Studio)</span>
                        </div>
                        <p class="comment-text" style="margin-top: 0.25rem;">${c.studioReply}</p>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>

              <!-- Add Comment Input -->
              ${album.status !== 'approved' ? `
                <div class="add-comment-input-row">
                  <input type="text" id="new-spread-comment-input" placeholder="Add feedback or request a photo swap on Spread ${currentSpread.spreadNumber}...">
                  <button class="btn btn-primary btn-sm" id="post-spread-comment-btn">
                    <span>Add Note</span>
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        </main>
      </div>
    `;

    clientLayout.innerHTML = html;
    attachClientAlbumListeners();
  }

  function attachClientAlbumListeners() {
    const returnStudioBtn = document.getElementById('client-back-to-studio-btn');
    if (returnStudioBtn) returnStudioBtn.addEventListener('click', () => setAppMode('studio'));

    // Workspace tab switchers
    const galleryTab = document.getElementById('tab-goto-gallery');
    if (galleryTab) {
      galleryTab.addEventListener('click', () => {
        APP_STATE.clientActiveWorkspace = 'gallery';
        saveState();
        renderClientView();
      });
    }

    const albumTab = document.getElementById('tab-goto-album');
    if (albumTab) {
      albumTab.addEventListener('click', () => {
        APP_STATE.clientActiveWorkspace = 'album';
        saveState();
        renderClientView();
      });
    }

    // Spread Prev / Next
    const prevBtn = document.getElementById('spread-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (APP_STATE.albumState.currentSpreadIdx > 0) {
          APP_STATE.albumState.currentSpreadIdx--;
          saveState();
          renderClientAlbumProof();
        }
      });
    }

    const nextBtn = document.getElementById('spread-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (APP_STATE.albumState.currentSpreadIdx < APP_STATE.albumState.spreads.length - 1) {
          APP_STATE.albumState.currentSpreadIdx++;
          saveState();
          renderClientAlbumProof();
        }
      });
    }

    // Filmstrip clicks
    document.querySelectorAll('.filmstrip-thumb').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        const sIdx = parseInt(e.currentTarget.getAttribute('data-spread-idx'), 10);
        APP_STATE.albumState.currentSpreadIdx = sIdx;
        saveState();
        renderClientAlbumProof();
      });
    });

    // Add comment on current spread
    const postCommentBtn = document.getElementById('post-spread-comment-btn');
    const commentInput = document.getElementById('new-spread-comment-input');
    if (postCommentBtn && commentInput) {
      const handlePost = () => {
        const text = commentInput.value.trim();
        if (!text) return;

        const currentSpread = APP_STATE.albumState.spreads[APP_STATE.albumState.currentSpreadIdx];
        currentSpread.hasRevisionFlag = true;
        currentSpread.comments.push({
          id: `c-${Date.now()}`,
          author: 'Rahul Sharma',
          role: 'client',
          timestamp: 'Just now',
          text: text,
          xPercent: 50,
          yPercent: 50,
          resolved: false,
          studioReply: null
        });

        saveState();
        showToast('Feedback noted on Spread ' + currentSpread.spreadNumber, '💬');
        renderClientAlbumProof();
      };

      postCommentBtn.addEventListener('click', handlePost);
      commentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handlePost();
      });
    }

    // Send Revisions Modal Trigger
    const sendRevBtn = document.getElementById('client-send-revisions-btn');
    if (sendRevBtn) {
      sendRevBtn.addEventListener('click', openSendRevisionsModal);
    }

    // Approve Album Modal Trigger
    const approveBtn = document.getElementById('client-approve-album-btn');
    if (approveBtn) {
      approveBtn.addEventListener('click', openApproveAlbumModal);
    }
  }

  // =========================================================================
  // 8. Revisions & Approval Modals Handlers
  // =========================================================================

  function openSendRevisionsModal() {
    const flaggedSpreads = APP_STATE.albumState.spreads.filter(s => s.hasRevisionFlag && s.comments.some(c => !c.resolved));
    const countText = document.getElementById('revision-spread-count-text');
    if (countText) countText.textContent = `${flaggedSpreads.length} spread${flaggedSpreads.length === 1 ? '' : 's'}`;

    const summaryList = document.getElementById('revision-summary-list');
    if (summaryList) {
      if (flaggedSpreads.length === 0) {
        summaryList.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-tertiary); font-style: italic;">No specific revision notes entered yet. You can add notes on any spread.</p>`;
      } else {
        summaryList.innerHTML = flaggedSpreads.map(s => `
          <div style="font-size: 0.8rem; margin-bottom: 0.5rem;">
            <strong>Spread ${s.spreadNumber} (${s.pageRange}):</strong>
            <ul style="margin-left: 1.25rem; color: var(--text-secondary); margin-top: 2px;">
              ${s.comments.filter(c => !c.resolved).map(c => `<li>${c.text}</li>`).join('')}
            </ul>
          </div>
        `).join('');
      }
    }

    if (submitRevisionModal) submitRevisionModal.classList.add('is-active');
  }

  function submitRevisionsToStudio() {
    APP_STATE.albumState.status = 'revisions_requested';
    
    // Add to studio activity log
    const rp = STUDIO_PROJECTS.find(p => p.id === 'rahul-priya');
    if (rp) {
      rp.statusText = 'Revision requested';
      rp.albumStatus = 'Client Revisions in Review';
      rp.activity.unshift({
        text: '<strong>Rahul & Priya</strong> submitted revision requests for Spread 14',
        time: 'Just now',
        recent: true
      });
    }

    saveState();
    if (submitRevisionModal) submitRevisionModal.classList.remove('is-active');
    showToast('Revision requests sent to FrameHouse Studio!', '📬');
    renderClientAlbumProof();
  }

  function openApproveAlbumModal() {
    if (albumApproveModal) albumApproveModal.classList.add('is-active');
  }

  function approveAlbumFinal() {
    const signature = document.getElementById('approval-signature-input').value.trim() || 'Rahul Sharma & Priya Patel';

    APP_STATE.albumState.status = 'approved';
    APP_STATE.albumState.version = 'approved';
    APP_STATE.albumState.approvedAt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    APP_STATE.albumState.approvedBy = signature;
    APP_STATE.albumState.printLabOrderId = 'FH-ALBUM-8921';

    // Mark all comments as resolved
    APP_STATE.albumState.spreads.forEach(s => {
      s.comments.forEach(c => c.resolved = true);
    });

    // Advance Studio project stage to Delivery
    const rp = STUDIO_PROJECTS.find(p => p.id === 'rahul-priya');
    if (rp) {
      rp.currentStage = 'Delivery';
      rp.statusText = 'Album Approved • Sent to Print Lab';
      rp.albumStatus = 'Signed Off • Archival Lab Order #FH-ALBUM-8921';
      rp.activity.unshift({
        text: `<strong>Rahul & Priya</strong> officially approved final album for print (${signature})`,
        time: 'Just now',
        recent: true
      });
    }

    saveState();
    if (albumApproveModal) albumApproveModal.classList.remove('is-active');
    showToast('Album officially approved! Sent to fine-art print lab.', '🎉');
    renderClientAlbumProof();
  }

  // =========================================================================
  // 9. STUDIO ALBUM PROOF MANAGEMENT (Studio Perspective)
  // =========================================================================

  function studioResolveSpreadComment(spreadIdx, commentIdx) {
    const spread = APP_STATE.albumState.spreads[spreadIdx];
    if (spread && spread.comments[commentIdx]) {
      spread.comments[commentIdx].resolved = true;
      spread.comments[commentIdx].studioReply = 'Photo swapped to black & white candidate portrait (WED-014) as requested. — Kabir Mehta';
    }
    saveState();
    showToast('Spread revision resolved with studio note', '✓');
    renderProjectDetail('rahul-priya');
  }

  function studioPublishRevisedProofV2() {
    APP_STATE.albumState.version = 'v2';
    APP_STATE.albumState.status = 'studio_updated';

    // Mark comments as resolved
    APP_STATE.albumState.spreads.forEach(s => {
      s.comments.forEach(c => {
        c.resolved = true;
        if (!c.studioReply) {
          c.studioReply = 'Layout adjusted and master color grade updated. — Kabir';
        }
      });
    });

    const rp = STUDIO_PROJECTS.find(p => p.id === 'rahul-priya');
    if (rp) {
      rp.statusText = 'Album Draft v2 Published';
      rp.albumStatus = 'Draft v2 in Client Review';
      rp.activity.unshift({
        text: '<strong>Studio</strong> published revised album proof (Draft v2)',
        time: 'Just now',
        recent: true
      });
    }

    saveState();
    showToast('Draft v2 published! Client has been notified to review.', '🚀');
    renderProjectDetail('rahul-priya');
  }

  function openPrintLabHandoverModal() {
    if (printLabModal) printLabModal.classList.add('is-active');
  }

  // =========================================================================
  // 10. CLIENT PHOTO GALLERY WORKSPACE (Prompt 2 Preserved)
  // =========================================================================

  function togglePhotoSelection(photoId) {
    const isSelected = APP_STATE.selectedPhotoIds.includes(photoId);
    if (!isSelected) {
      if (APP_STATE.selectedPhotoIds.length >= APP_STATE.maxSelections) {
        showToast(`Selection limit reached: You've selected the maximum ${APP_STATE.maxSelections} photographs.`, '⚠️');
        return false;
      }
      APP_STATE.selectedPhotoIds.push(photoId);
      showToast(`Photo added to final selection (${APP_STATE.selectedPhotoIds.length}/${APP_STATE.maxSelections})`, '✓');
    } else {
      APP_STATE.selectedPhotoIds = APP_STATE.selectedPhotoIds.filter(id => id !== photoId);
      showToast(`Photo removed from selection (${APP_STATE.selectedPhotoIds.length}/${APP_STATE.maxSelections})`, '✕');
    }
    saveState();
    renderClientPhotoGallery();
    updateLightboxUI();
    return true;
  }

  function renderClientPhotoGallery() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const selectedCount = APP_STATE.selectedPhotoIds.length;
    const maxLimit = APP_STATE.maxSelections;
    const remaining = Math.max(0, maxLimit - selectedCount);
    const percent = Math.min(100, Math.round((selectedCount / maxLimit) * 100));
    const categoryCounts = calculateCategoryCounts();

    const eventCounts = { 'All Photos': 2843, 'Haldi': 486, 'Mehendi': 531, 'Sangeet': 612, 'Wedding': 781, 'Reception': 433 };
    const currentEvent = APP_STATE.clientEventFilter;
    const visiblePhotos = GALLERY_PHOTOS.filter(photo => currentEvent === 'All Photos' || photo.event === currentEvent);

    let html = `
      <div class="view-enter">
        <header class="client-navbar">
          <div class="client-brand-group">
            <div class="client-brand-logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3.2"/></svg>
            </div>
            <div>
              <div class="client-brand-title">StudioFlow</div>
              <div class="client-brand-subtext">Private Client Gallery</div>
            </div>
          </div>

          <div class="client-nav-center">
            <button class="client-workspace-tab active" id="tab-goto-gallery">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>Photo Gallery (237)</span>
            </button>
            <button class="client-workspace-tab" id="tab-goto-album">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span>Album Proof (20 Spreads)</span>
            </button>
          </div>

          <div class="client-nav-right">
            <button class="client-switch-studio-btn" id="client-back-to-studio-btn">← Return to Studio View</button>
          </div>
        </header>

        <main class="client-main-content">
          <section class="client-hero-section">
            <h1 class="client-hero-couple-title">Rahul & Priya</h1>
            <div class="client-hero-collection-name">Your Wedding Collection</div>
            <div class="client-hero-studio-meta">
              <span>FrameHouse Studio</span> • <span>September 2026</span> • <span>Hyderabad</span>
            </div>
          </section>

          <section class="client-intro-card">
            <div class="client-intro-header">
              <div>
                <h2 class="client-intro-title">Choose your favorite moments</h2>
                <p class="client-intro-desc">Select the photographs you'd like FrameHouse Studio to include in your final wedding collection.</p>
              </div>
              <div class="client-selection-status-badge">
                <div class="client-selected-number-display">${selectedCount} <span>/ ${maxLimit} selected</span></div>
                <div class="client-remaining-pill">${remaining === 0 ? '✓ Maximum reached' : `${remaining} selections remaining`}</div>
              </div>
            </div>
            <div class="client-progress-track">
              <div class="client-progress-fill" style="width: ${percent}%;"></div>
            </div>
          </section>

          <section class="client-reqs-container">
            <div class="client-reqs-header">
              <div class="client-reqs-title-group"><h3>Your Selection Breakdown</h3></div>
              <div class="client-reqs-limits-summary">
                <span>Min: <strong>${APP_STATE.minSelections}</strong></span> • <span>Max: <strong>${maxLimit}</strong></span> • <span>Selected: <strong>${selectedCount}</strong></span>
              </div>
            </div>
            <div class="client-category-cards-grid">
              ${Object.keys(CATEGORY_REQUIREMENTS).map(catName => {
                const req = CATEGORY_REQUIREMENTS[catName];
                const count = categoryCounts[catName] || 0;
                const isComplete = count >= req.target;
                const catPercent = Math.min(100, Math.round((count / req.target) * 100));
                return `
                  <div class="category-req-card ${isComplete ? 'is-complete' : ''}">
                    <div class="category-card-top">
                      <span class="category-card-name">${catName}</span>
                      ${isComplete ? '<span class="category-card-check">✓</span>' : ''}
                    </div>
                    <div class="category-card-counts">${count} <span>/ ${req.target}</span></div>
                    <div class="category-card-mini-bar"><div class="category-card-mini-fill" style="width: ${catPercent}%;"></div></div>
                    <div class="category-card-status-text">${isComplete ? 'Complete' : `${req.target - count} more needed`}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>

          <nav class="client-event-nav-bar">
            ${['All Photos', 'Haldi', 'Mehendi', 'Sangeet', 'Wedding', 'Reception'].map(evtName => `
              <button class="client-event-tab-btn ${currentEvent === evtName ? 'active' : ''}" data-event="${evtName}">
                <span>${evtName}</span>
                <span class="client-event-tab-count">${formatNumber(eventCounts[evtName])}</span>
              </button>
            `).join('')}
          </nav>

          <div class="client-photo-gallery-grid">
            ${visiblePhotos.map((photo) => {
              const isSelected = APP_STATE.selectedPhotoIds.includes(photo.id);
              const selectionIndex = APP_STATE.selectedPhotoIds.indexOf(photo.id) + 1;
              return `
                <div class="client-photo-card ${isSelected ? 'is-selected' : ''}" data-photo-id="${photo.id}">
                  <div class="client-photo-img-wrap" data-action="open-lightbox" data-photo-id="${photo.id}">
                    <img class="client-photo-img" src="${photo.image}" alt="${photo.title}" loading="lazy">
                    <span class="client-photo-cat-badge">${photo.category}</span>
                    <button class="client-photo-select-control" data-action="toggle-select" data-photo-id="${photo.id}">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSelected ? '#FFFFFF' : 'none'}" stroke="currentColor" stroke-width="${isSelected ? '0' : '2.5'}"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                    <span class="client-photo-index-tag">✓ #${selectionIndex}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </main>

        <aside class="client-sticky-selection-bar">
          <div class="client-sticky-bar-inner">
            <div class="sticky-bar-left">
              <div class="sticky-bar-counter">${selectedCount} <span>/ ${maxLimit} selected</span></div>
              <div class="sticky-bar-remaining">${remaining === 0 ? '✓ Ready' : `${remaining} remaining`}</div>
            </div>
            <div class="sticky-bar-actions">
              <button class="btn btn-secondary btn-sm" id="client-review-selection-btn"><span>Review Selection (${selectedCount})</span></button>
              <button class="btn btn-accent btn-sm" id="client-goto-proof-btn"><span>Review Album Proof (20 Spreads) →</span></button>
            </div>
          </div>
        </aside>
      </div>
    `;

    clientLayout.innerHTML = html;

    const returnStudioBtn = document.getElementById('client-back-to-studio-btn');
    if (returnStudioBtn) returnStudioBtn.addEventListener('click', () => setAppMode('studio'));

    const albumTab = document.getElementById('tab-goto-album');
    if (albumTab) {
      albumTab.addEventListener('click', () => {
        APP_STATE.clientActiveWorkspace = 'album';
        saveState();
        renderClientView();
      });
    }

    const gotoProofBtn = document.getElementById('client-goto-proof-btn');
    if (gotoProofBtn) {
      gotoProofBtn.addEventListener('click', () => {
        APP_STATE.clientActiveWorkspace = 'album';
        saveState();
        renderClientView();
      });
    }

    document.querySelectorAll('.client-event-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        APP_STATE.clientEventFilter = e.currentTarget.getAttribute('data-event');
        saveState();
        renderClientPhotoGallery();
      });
    });

    document.querySelectorAll('.client-photo-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const selectBtn = e.target.closest('[data-action="toggle-select"]');
        const photoId = card.getAttribute('data-photo-id');
        if (selectBtn) {
          e.stopPropagation();
          togglePhotoSelection(photoId);
        } else {
          openLightbox(photoId);
        }
      });
    });

    const reviewBtn = document.getElementById('client-review-selection-btn');
    if (reviewBtn) reviewBtn.addEventListener('click', openReviewSelectionModal);
  }

  // =========================================================================
  // 11. Lightbox / Photo Viewer
  // =========================================================================

  function openLightbox(photoId) {
    let index = GALLERY_PHOTOS.findIndex(p => p.id === photoId);
    if (index === -1) index = 0;
    APP_STATE.lightboxIndex = index;
    updateLightboxUI();
    if (lightboxModal) lightboxModal.classList.add('is-active');
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove('is-active');
  }

  function updateLightboxUI() {
    const photo = GALLERY_PHOTOS[APP_STATE.lightboxIndex];
    if (!photo) return;

    const img = document.getElementById('lightbox-img');
    const title = document.getElementById('lightbox-title');
    const eventTag = document.getElementById('lightbox-event');
    const catTag = document.getElementById('lightbox-category');
    const toggleBtnText = document.getElementById('lightbox-select-btn-text');
    const statusIndicator = document.getElementById('lightbox-status-indicator');

    if (img) img.src = photo.image;
    if (title) title.textContent = photo.title;
    if (eventTag) eventTag.textContent = photo.event;
    if (catTag) catTag.textContent = photo.category;

    const isSelected = APP_STATE.selectedPhotoIds.includes(photo.id);
    const selectionIdx = APP_STATE.selectedPhotoIds.indexOf(photo.id) + 1;

    if (toggleBtnText) toggleBtnText.textContent = isSelected ? 'Remove Selection' : 'Select Photo';
    if (statusIndicator) {
      statusIndicator.innerHTML = isSelected 
        ? `<span style="color: #FBBF24; font-weight: 700;">✓ Selected • #${selectionIdx} of ${APP_STATE.maxSelections}</span>`
        : `<span style="color: #9CA3AF;">○ Not in selection</span>`;
    }
  }

  function nextLightboxPhoto() {
    APP_STATE.lightboxIndex = (APP_STATE.lightboxIndex + 1) % GALLERY_PHOTOS.length;
    updateLightboxUI();
  }

  function prevLightboxPhoto() {
    APP_STATE.lightboxIndex = (APP_STATE.lightboxIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
    updateLightboxUI();
  }

  function openReviewSelectionModal() {
    const selectedCount = APP_STATE.selectedPhotoIds.length;
    const categoryCounts = calculateCategoryCounts();

    const subtitle = document.getElementById('review-modal-subtitle');
    if (subtitle) subtitle.textContent = `${selectedCount} photographs currently selected out of ${APP_STATE.maxSelections}`;

    const reqStrip = document.getElementById('review-requirements-summary');
    if (reqStrip) {
      reqStrip.innerHTML = Object.keys(CATEGORY_REQUIREMENTS).map(catName => {
        const req = CATEGORY_REQUIREMENTS[catName];
        const count = categoryCounts[catName] || 0;
        const isComplete = count >= req.target;
        return `<div class="review-req-chip ${isComplete ? 'is-complete' : ''}">${catName}: <strong>${count}/${req.target}</strong> ${isComplete ? '✓' : ''}</div>`;
      }).join('');
    }

    const grid = document.getElementById('review-photos-grid');
    if (grid) {
      const selectedGalleryPhotos = GALLERY_PHOTOS.filter(p => APP_STATE.selectedPhotoIds.includes(p.id));
      let gridHtml = selectedGalleryPhotos.map((photo) => {
        const idx = APP_STATE.selectedPhotoIds.indexOf(photo.id) + 1;
        return `
          <div class="review-photo-item" data-photo-id="${photo.id}">
            <div class="review-photo-img-wrap">
              <img src="${photo.image}" alt="${photo.title}">
              <button class="review-photo-remove-btn" data-action="remove-selected" data-photo-id="${photo.id}" title="Remove">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div class="review-photo-footer">
              <span style="font-weight: 600;">#${idx}</span>
              <span>${photo.event}</span>
            </div>
          </div>
        `;
      }).join('');

      if (selectedCount > selectedGalleryPhotos.length) {
        gridHtml += `
          <div class="review-photo-item" style="display: flex; align-items: center; justify-content: center; background-color: var(--bg-subtle); padding: 1.5rem; text-align: center;">
            <div style="font-size: 0.85rem; color: var(--text-secondary);">
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">+${selectedCount - selectedGalleryPhotos.length} more</div>
              <span>Additional curated wedding selections</span>
            </div>
          </div>
        `;
      }
      grid.innerHTML = gridHtml;

      grid.querySelectorAll('[data-action="remove-selected"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const pId = e.currentTarget.getAttribute('data-photo-id');
          togglePhotoSelection(pId);
          openReviewSelectionModal();
        });
      });
    }

    if (reviewSelectionModal) reviewSelectionModal.classList.add('is-active');
  }

  function closeReviewSelectionModal() {
    if (reviewSelectionModal) reviewSelectionModal.classList.remove('is-active');
  }

  // =========================================================================
  // 12. Studio Selected Photos View & Export
  // =========================================================================

  function openStudioSelectedPhotosModal() {
    const selectedCount = APP_STATE.selectedPhotoIds.length;
    const subtitle = document.getElementById('studio-selected-subtitle');
    if (subtitle) subtitle.textContent = `${selectedCount} photos selected by client • Ready for Master Lightroom Catalog`;

    const grid = document.getElementById('studio-selected-photos-grid');
    if (grid) {
      const selectedGalleryPhotos = GALLERY_PHOTOS.filter(p => APP_STATE.selectedPhotoIds.includes(p.id));
      let gridHtml = selectedGalleryPhotos.map((photo) => {
        const idx = APP_STATE.selectedPhotoIds.indexOf(photo.id) + 1;
        return `
          <div class="review-photo-item">
            <div class="review-photo-img-wrap"><img src="${photo.image}" alt="${photo.title}"></div>
            <div class="review-photo-footer">
              <span style="font-weight: 700; color: var(--accent-primary);">#${idx}</span>
              <span>${photo.event} • ${photo.category}</span>
            </div>
          </div>
        `;
      }).join('');
      grid.innerHTML = gridHtml;
    }

    if (studioSelectedModal) studioSelectedModal.classList.add('is-active');
  }

  function closeStudioSelectedPhotosModal() {
    if (studioSelectedModal) studioSelectedModal.classList.remove('is-active');
  }

  function exportSelectionFile() {
    const selectedCount = APP_STATE.selectedPhotoIds.length;
    let content = `==========================================================\n`;
    content += `FrameHouse Studio — Client Photo Selection Export\n`;
    content += `Project: Rahul & Priya (Wedding Collection)\n`;
    content += `Project ID: FH-2026-0918\n`;
    content += `Total Selected: ${selectedCount} / 250 photos\n`;
    content += `Export Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    content += `==========================================================\n\n`;

    APP_STATE.selectedPhotoIds.forEach((id, idx) => {
      const photo = GALLERY_PHOTOS.find(p => p.id === id);
      const title = photo ? photo.title : 'Curated Wedding Select';
      const eventName = photo ? photo.event : 'Wedding Ceremony';
      const category = photo ? photo.category : 'General';
      content += `${String(idx + 1).padStart(3, '0')}. ID: ${id} | Event: ${eventName} | Category: ${category} | Title: ${title}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FH-2026-0918_Rahul_Priya_Selections_${selectedCount}_photos.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Export file downloaded: ${selectedCount} selected photos`, '📄');
  }

  // =========================================================================
  // 13. STUDIO PERSPECTIVE RENDERERS
  // =========================================================================

  function renderDashboard() {
    APP_STATE.currentStudioPage = 'dashboard';
    saveState();
    breadcrumb.innerHTML = '<span class="breadcrumb-current">Dashboard</span>';

    const rp = STUDIO_PROJECTS.find(p => p.id === 'rahul-priya');
    if (rp) {
      rp.selectedPhotos = APP_STATE.selectedPhotoIds.length;
      if (APP_STATE.albumState.status === 'approved') {
        rp.currentStage = 'Delivery';
        rp.statusText = 'Album Approved • Sent to Print Lab';
      } else if (APP_STATE.albumState.version === 'v2') {
        rp.currentStage = 'Album';
        rp.statusText = 'Draft v2 in Client Review';
      } else if (APP_STATE.albumState.status === 'revisions_requested') {
        rp.currentStage = 'Album';
        rp.statusText = 'Revision requested';
      }
    }

    let html = `
      <div class="view-enter">
        <header class="page-header">
          <div class="page-title-group">
            <h1>Good evening, FrameHouse Studio</h1>
            <p class="page-subtitle">Here's what needs your attention today.</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" id="dash-new-project-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>New Project</span>
            </button>
          </div>
        </header>

        <section class="summary-grid" aria-label="Studio Metrics">
          <div class="summary-card">
            <div class="summary-card-header">
              <span class="summary-title">Active Projects</span>
              <div class="summary-icon-wrap"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg></div>
            </div>
            <div class="summary-value">12</div>
            <div class="summary-meta"><span class="summary-meta-highlight">3 updated today</span></div>
          </div>

          <div class="summary-card">
            <div class="summary-card-header">
              <span class="summary-title">Awaiting Selection</span>
              <div class="summary-icon-wrap"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg></div>
            </div>
            <div class="summary-value">4</div>
            <div class="summary-meta"><span class="summary-meta-highlight">2 need attention</span></div>
          </div>

          <div class="summary-card">
            <div class="summary-card-header">
              <span class="summary-title">Album Reviews</span>
              <div class="summary-icon-wrap"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></div>
            </div>
            <div class="summary-value">${APP_STATE.albumState.status === 'approved' ? '2' : '3'}</div>
            <div class="summary-meta"><span class="summary-meta-highlight">${APP_STATE.albumState.status === 'approved' ? '1 approved today' : '1 revision requested'}</span></div>
          </div>

          <div class="summary-card">
            <div class="summary-card-header">
              <span class="summary-title">Upcoming Deliveries</span>
              <div class="summary-icon-wrap"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            </div>
            <div class="summary-value">${APP_STATE.albumState.status === 'approved' ? '7' : '6'}</div>
            <div class="summary-meta"><span>Next delivery Friday</span></div>
          </div>
        </section>

        <div class="dashboard-content-layout">
          <div class="dashboard-main-col">
            <div class="section-header-row">
              <h2 class="section-heading">Recent Projects</h2>
              <a href="#projects" class="section-link" id="view-all-projects-link"><span>View all projects</span> →</a>
            </div>

            <div class="recent-projects-list">
              ${STUDIO_PROJECTS.slice(0, 4).map(project => `
                <div class="project-card-row ${project.isMainDemo ? 'is-featured' : ''}" data-project-id="${project.id}">
                  <div class="project-thumbnail-box">
                    <img class="project-thumbnail-img" src="${project.coverImage}" alt="${project.clientNames}" loading="lazy">
                  </div>
                  <div class="project-info-main">
                    <div class="project-names"><span>${project.clientNames}</span></div>
                    <div class="project-details-line">
                      <span>${project.eventType}</span> • <span>${formatNumber(project.totalPhotos)} photos</span> • <span>${project.location}</span>
                    </div>
                  </div>
                  <div class="project-status-col">
                    <span class="status-pill ${getStatusClass(project.currentStage || 'album')}">
                      <span class="status-dot"></span>
                      ${project.statusText || 'Album review'}
                    </span>
                    <span class="project-update-time">Updated ${project.updatedAt || 'Recently'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="dashboard-aside-panel">
            <div class="activity-card">
              <div class="section-header-row" style="margin-bottom: 0.5rem;">
                <h3 class="section-heading" style="font-size: 1rem;">Live Studio Activity</h3>
                <span class="status-pill status-shoot" style="font-size: 0.7rem;">Realtime</span>
              </div>
              <div class="activity-feed">
                ${rp.activity.map(item => `
                  <div class="activity-item">
                    <div class="activity-bullet ${item.recent ? 'is-recent' : ''}">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12"></circle></svg>
                    </div>
                    <div class="activity-content">
                      <p class="activity-text">${item.text}</p>
                      <span class="activity-timestamp">${item.time}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="activity-card" style="background-color: var(--accent-primary-light); border-color: var(--accent-primary-subtle);">
              <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 0.35rem;">
                ${APP_STATE.albumState.status === 'approved' ? 'ALBUM APPROVED FOR PRINT' : (APP_STATE.albumState.status === 'revisions_requested' ? 'ALBUM REVISION REQUESTED' : 'ALBUM PROOF READY')}
              </h4>
              <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 0.85rem;">
                ${APP_STATE.albumState.status === 'approved' 
                  ? 'Rahul & Priya signed off on all 20 spreads. Archival print lab order ready.'
                  : (APP_STATE.albumState.status === 'revisions_requested' 
                      ? 'Client requested 1 photo swap on Spread 14 (Mandap Emotions).' 
                      : '20-spread album proof is live in the client portal for review.')}
              </p>
              <button class="btn btn-sm btn-accent" id="dash-open-project-btn" style="width: 100%;">
                Open Project Workspace
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    appView.innerHTML = html;

    document.querySelectorAll('.project-card-row').forEach(card => {
      card.addEventListener('click', () => {
        const pId = card.getAttribute('data-project-id');
        navigateToProject(pId);
      });
    });

    const newProjBtn = document.getElementById('dash-new-project-btn');
    if (newProjBtn) newProjBtn.addEventListener('click', openNewProjectModal);

    const openProjBtn = document.getElementById('dash-open-project-btn');
    if (openProjBtn) openProjBtn.addEventListener('click', () => navigateToProject('rahul-priya'));
  }

  function renderProjects() {
    APP_STATE.currentStudioPage = 'projects';
    saveState();
    breadcrumb.innerHTML = '<span class="breadcrumb-current">Projects</span>';

    const filter = APP_STATE.projectFilter;
    const query = APP_STATE.searchQuery.toLowerCase().trim();

    let filteredProjects = STUDIO_PROJECTS.filter(p => {
      if (filter !== 'all') {
        if (filter === 'selection' && p.currentStage.toLowerCase() !== 'selection') return false;
        if (filter === 'editing' && p.currentStage.toLowerCase() !== 'editing') return false;
        if (filter === 'album' && !['album', 'album review'].includes(p.currentStage.toLowerCase())) return false;
        if (filter === 'delivery' && p.currentStage.toLowerCase() !== 'delivery') return false;
      }
      if (query) {
        return p.clientNames.toLowerCase().includes(query) || p.location.toLowerCase().includes(query) || p.projectId.toLowerCase().includes(query);
      }
      return true;
    });

    let html = `
      <div class="view-enter">
        <header class="page-header">
          <div class="page-title-group">
            <h1>Projects</h1>
            <p class="page-subtitle">Manage your shoots, client selections, albums and deliveries.</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" id="proj-new-project-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>New Project</span>
            </button>
          </div>
        </header>

        <div class="projects-toolbar">
          <div class="filters-pill-group" role="tablist">
            <button class="filter-btn ${filter === 'all' ? 'active' : ''}" data-filter="all">All (${STUDIO_PROJECTS.length})</button>
            <button class="filter-btn ${filter === 'selection' ? 'active' : ''}" data-filter="selection">Selection</button>
            <button class="filter-btn ${filter === 'editing' ? 'active' : ''}" data-filter="editing">Editing</button>
            <button class="filter-btn ${filter === 'album' ? 'active' : ''}" data-filter="album">Album Review</button>
            <button class="filter-btn ${filter === 'delivery' ? 'active' : ''}" data-filter="delivery">Delivery</button>
          </div>

          <div class="projects-search-input-wrap">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="projects-search-field" value="${APP_STATE.searchQuery}" placeholder="Filter by couple, city or ID...">
          </div>
        </div>

        <div class="projects-cards-grid">
          ${filteredProjects.map(project => `
            <div class="project-grid-card" data-project-id="${project.id}">
              <div class="project-grid-cover-wrap">
                <img class="project-grid-cover-img" src="${project.coverImage}" alt="${project.clientNames}" loading="lazy">
                <div class="project-grid-cover-badge">
                  <span class="status-pill ${getStatusClass(project.currentStage || 'album')}">
                    <span class="status-dot"></span>
                    ${project.statusText || 'Album review'}
                  </span>
                </div>
                <div class="project-grid-photo-count">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>${formatNumber(project.totalPhotos)} photos</span>
                </div>
              </div>
              <div class="project-grid-body">
                <h3 class="project-grid-title">${project.clientNames}</h3>
                <div class="project-grid-meta-row">
                  <span>${project.eventType}</span> • <span>${project.location}</span>
                </div>
                <div class="project-grid-footer">
                  <span>${project.eventDate}</span>
                  <span style="font-family: monospace; font-size: 0.72rem; color: var(--text-tertiary);">${project.projectId}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    appView.innerHTML = html;

    document.querySelectorAll('.project-grid-card').forEach(card => {
      card.addEventListener('click', () => {
        const pId = card.getAttribute('data-project-id');
        navigateToProject(pId);
      });
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        APP_STATE.projectFilter = e.currentTarget.getAttribute('data-filter');
        renderProjects();
      });
    });

    const searchField = document.getElementById('projects-search-field');
    if (searchField) {
      searchField.addEventListener('input', (e) => {
        APP_STATE.searchQuery = e.target.value;
        renderProjects();
      });
    }

    const newProjBtn = document.getElementById('proj-new-project-btn');
    if (newProjBtn) newProjBtn.addEventListener('click', openNewProjectModal);
  }

  function renderProjectDetail(projectId) {
    APP_STATE.currentStudioPage = 'projectDetail';
    APP_STATE.selectedProjectId = projectId;
    saveState();

    const project = STUDIO_PROJECTS.find(p => p.id === projectId) || STUDIO_PROJECTS[0];

    // Synchronize current stage
    let currentStage = project.currentStage || 'Album';
    let statusText = project.statusText || 'Album review';
    if (APP_STATE.albumState.status === 'approved') {
      currentStage = 'Approval';
      statusText = 'Album Approved • Sent to Print Lab';
    } else if (APP_STATE.albumState.version === 'v2') {
      currentStage = 'Album';
      statusText = 'Draft v2 in Client Review';
    } else if (APP_STATE.albumState.status === 'revisions_requested') {
      currentStage = 'Album';
      statusText = 'Revision requested on Spread 14';
    }

    breadcrumb.innerHTML = `
      <span class="breadcrumb-parent" id="breadcrumb-projects-link">Projects</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">${project.clientNames}</span>
    `;

    const stageIndexMap = { 'Shoot': 0, 'Selection': 1, 'Editing': 2, 'Album': 3, 'Approval': 4, 'Delivery': 5 };
    const currentStageIdx = stageIndexMap[currentStage] !== undefined ? stageIndexMap[currentStage] : 3;

    let html = `
      <div class="view-enter">
        <section class="project-detail-header">
          <div class="project-detail-topbar">
            <button class="back-to-projects-btn" id="back-to-projects-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              <span>Back to Projects</span>
            </button>
            
            <div class="project-detail-actions">
              <button class="btn btn-secondary btn-sm" id="detail-open-client-portal-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                <span>View Client Portal</span>
              </button>
              ${APP_STATE.albumState.status === 'approved' ? `
                <button class="btn btn-accent btn-sm" id="detail-open-print-lab-btn" style="background-color: #059669; border-color: #059669;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  <span>Print Lab Handover Pack</span>
                </button>
              ` : ''}
            </div>
          </div>

          <div class="project-title-hero">
            <div class="project-title-hero-left">
              <h1>${project.clientNames}</h1>
              <div class="project-tag-pill">${project.projectName}</div>

              <div class="project-meta-pills-row">
                <div class="meta-pill-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>Event Date: <strong>${project.eventDate}</strong></span>
                </div>
                <div class="meta-pill-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>Location: <strong>${project.location}</strong></span>
                </div>
                <div class="meta-pill-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  <span>Project ID: <strong style="font-family: monospace;">${project.projectId}</strong></span>
                </div>
                <div class="meta-pill-item">
                  <span class="status-pill ${getStatusClass(currentStage)}">
                    <span class="status-dot"></span>
                    ${statusText}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Horizontal Workflow Timeline -->
          <div class="workflow-section-wrap">
            <div class="workflow-label-row">
              <span class="workflow-section-title">Production Workflow Status</span>
              <span class="workflow-stage-status">Current Stage: ${currentStage}</span>
            </div>

            <div class="workflow-steps-track" role="progressbar" aria-valuenow="${currentStageIdx + 1}" aria-valuemin="1" aria-valuemax="6">
              ${WORKFLOW_STAGES.map((stage, idx) => {
                let nodeClass = 'is-upcoming';
                let iconContent = idx + 1;

                if (idx < currentStageIdx) {
                  nodeClass = 'is-completed';
                  iconContent = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
                } else if (idx === currentStageIdx) {
                  nodeClass = 'is-active';
                  iconContent = `●`;
                }

                return `
                  <div class="workflow-step-node ${nodeClass}">
                    <div class="step-indicator-bubble">${iconContent}</div>
                    <span class="step-name-text">${stage.label}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </section>

        <!-- Project Detail Grid -->
        <div class="project-detail-grid">
          <!-- Left: Album Proofing Live Studio Workspace -->
          <div class="events-section-container">
            <!-- Studio Album Proofing Management Card -->
            <div class="selection-summary-card" style="border-color: #D6C4B8; background: #FFFFFF;">
              <div class="selection-card-header">
                <div>
                  <h3 class="selection-card-title">Digital Album Proof (20 Spreads / 40 Pages)</h3>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
                    12x18 Flushmount Archival Format • Fuji Crystal Silk Paper
                  </p>
                </div>
                <span class="album-draft-badge ${APP_STATE.albumState.status === 'approved' ? 'draft-approved' : (APP_STATE.albumState.version === 'v2' ? 'draft-v2' : 'draft-v1')}">
                  ${APP_STATE.albumState.status === 'approved' ? 'Approved for Print ✓' : (APP_STATE.albumState.version === 'v2' ? 'Draft v2 Published' : 'Draft v1 Live')}
                </span>
              </div>

              <!-- Spread 14 Client Feedback Callout -->
              <div style="background-color: var(--bg-subtle); border-radius: var(--radius-md); padding: 1.15rem; margin-bottom: 1.25rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">
                    Spread 14 (pp. 26-27): Mandap Candid Emotions
                  </span>
                  <span class="status-pill ${APP_STATE.albumState.spreads[13].comments.every(c => c.resolved) ? 'status-delivery' : 'status-selection'}">
                    ${APP_STATE.albumState.spreads[13].comments.every(c => c.resolved) ? '✓ Resolved' : 'Client Revision Flagged'}
                  </span>
                </div>
                
                <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 0.75rem;">
                  "On the right page, could we swap the candid laughing shot with the black and white portrait from the Mandap series?" — <strong>Rahul Sharma</strong>
                </p>

                ${APP_STATE.albumState.spreads[13].comments.every(c => c.resolved) ? `
                  <div style="font-size: 0.8rem; color: #065F46; background-color: #ECFDF5; padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid #A7F3D0;">
                    ✓ <strong>Studio Resolution:</strong> Photo swapped to B&W candidate portrait (WED-014). Included in Draft v2.
                  </div>
                ` : `
                  <button class="btn btn-secondary btn-sm" id="studio-resolve-spread-14-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Swap Photo & Mark Spread Resolved</span>
                  </button>
                `}
              </div>

              <!-- Studio Album Action Buttons -->
              <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                <button class="btn btn-primary btn-sm" id="studio-open-client-album-view-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                  <span>Open Album Proof Workspace</span>
                </button>

                ${APP_STATE.albumState.version !== 'v2' && APP_STATE.albumState.status !== 'approved' ? `
                  <button class="btn btn-accent btn-sm" id="studio-publish-v2-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Publish Revised Proof (Draft v2)</span>
                  </button>
                ` : ''}

                ${APP_STATE.albumState.status === 'approved' ? `
                  <button class="btn btn-accent btn-sm" id="studio-handover-lab-btn" style="background-color: #059669; border-color: #059669;">
                    <span>Download Archival Print Pack</span>
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Event Breakdown Cards -->
            <div class="section-header-row" style="margin-top: 1rem;">
              <h2 class="section-heading">5 Shoot Events Included</h2>
              <span class="status-pill status-shoot">2,843 RAW Photos</span>
            </div>

            <div class="events-cards-grid">
              ${(project.events || []).map(evt => `
                <div class="event-breakdown-card ${evt.featured ? 'is-featured-event' : ''}">
                  <div class="event-card-cover-wrap"><img class="event-card-cover-img" src="${evt.cover}" alt="${evt.name}"></div>
                  <div class="event-card-body">
                    <h3 class="event-card-title">${evt.name}</h3>
                    <div class="event-card-datetime"><span>${evt.dateTime}</span></div>
                    <div class="event-card-footer">
                      <span style="font-size: 0.78rem; font-weight: 600;">${formatNumber(evt.photoCount)} photos</span>
                      <span class="event-status-tag">${APP_STATE.albumState.status === 'approved' ? 'Archived' : 'In Album'}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right Column: Project Overview Specs & Activity -->
          <div class="project-detail-sidebar">
            <!-- Selected Photos Card -->
            <div class="selection-summary-card">
              <div class="selection-card-header">
                <h3 class="selection-card-title">Client Selection</h3>
                <span class="status-pill status-delivery">
                  <span class="status-dot"></span>
                  Completed (${APP_STATE.selectedPhotoIds.length} Photos)
                </span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem;">
                All 237 curated photos mapped across 20 album spreads.
              </p>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <button class="btn btn-secondary btn-sm" id="view-selected-photos-btn" style="width: 100%;">
                  <span>View Selected Photos (${APP_STATE.selectedPhotoIds.length})</span>
                </button>
                <button class="btn btn-secondary btn-sm" id="export-selection-manifest-btn" style="width: 100%;">
                  <span>Export Selection Manifest (TXT)</span>
                </button>
              </div>
            </div>

            <!-- Specs Overview Card -->
            <div class="specs-overview-card">
              <h3 class="specs-title">Project Overview</h3>
              <div class="specs-list">
                <div class="spec-item"><span class="spec-label">Client</span><span class="spec-value">${project.clientNames}</span></div>
                <div class="spec-item"><span class="spec-label">Lead Photographer</span><span class="spec-value">${project.photographer}</span></div>
                <div class="spec-item"><span class="spec-label">Album Format</span><span class="spec-value">12x18 Flushmount (20 Spreads)</span></div>
                <div class="spec-item"><span class="spec-label">Total Photos</span><span class="spec-value">${formatNumber(project.totalPhotos)}</span></div>
                <div class="spec-item"><span class="spec-label">Selected Photos</span><span class="spec-value">${APP_STATE.selectedPhotoIds.length} / 250</span></div>
                <div class="spec-item"><span class="spec-label">Album Proof Status</span><span class="spec-value">${statusText}</span></div>
                <div class="spec-item"><span class="spec-label">Delivery Target</span><span class="spec-value">15 Oct 2026</span></div>
              </div>
            </div>

            <!-- Activity Feed -->
            <div class="activity-card">
              <h3 class="specs-title" style="margin-bottom: 0.5rem;">Recent Activity</h3>
              <div class="activity-feed">
                ${rp.activity.map(item => `
                  <div class="activity-item">
                    <div class="activity-bullet ${item.recent ? 'is-recent' : ''}">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12"></circle></svg>
                    </div>
                    <div class="activity-content">
                      <p class="activity-text">${item.text}</p>
                      <span class="activity-timestamp">${item.time}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    appView.innerHTML = html;

    // Attach Studio Project detail listeners
    const backBtn = document.getElementById('back-to-projects-btn');
    if (backBtn) backBtn.addEventListener('click', () => navigateToStudioPage('projects'));

    const breadcrumbLink = document.getElementById('breadcrumb-projects-link');
    if (breadcrumbLink) breadcrumbLink.addEventListener('click', () => navigateToStudioPage('projects'));

    const clientPortalBtn = document.getElementById('detail-open-client-portal-btn');
    if (clientPortalBtn) clientPortalBtn.addEventListener('click', () => setAppMode('client'));

    const openAlbumViewBtn = document.getElementById('studio-open-client-album-view-btn');
    if (openAlbumViewBtn) {
      openAlbumViewBtn.addEventListener('click', () => {
        APP_STATE.clientActiveWorkspace = 'album';
        setAppMode('client');
      });
    }

    const resolveSpread14Btn = document.getElementById('studio-resolve-spread-14-btn');
    if (resolveSpread14Btn) {
      resolveSpread14Btn.addEventListener('click', () => studioResolveSpreadComment(13, 0));
    }

    const publishV2Btn = document.getElementById('studio-publish-v2-btn');
    if (publishV2Btn) {
      publishV2Btn.addEventListener('click', studioPublishRevisedProofV2);
    }

    const handoverBtn = document.getElementById('detail-open-print-lab-btn') || document.getElementById('studio-handover-lab-btn');
    if (handoverBtn) handoverBtn.addEventListener('click', openPrintLabHandoverModal);

    const viewSelectedBtn = document.getElementById('view-selected-photos-btn');
    if (viewSelectedBtn) viewSelectedBtn.addEventListener('click', openStudioSelectedPhotosModal);

    const exportManifestBtn = document.getElementById('export-selection-manifest-btn');
    if (exportManifestBtn) exportManifestBtn.addEventListener('click', exportSelectionFile);
  }

  function renderClients() {
    APP_STATE.currentStudioPage = 'clients';
    saveState();
    breadcrumb.innerHTML = '<span class="breadcrumb-current">Clients</span>';

    let html = `
      <div class="view-enter">
        <header class="page-header">
          <div class="page-title-group">
            <h1>Clients CRM</h1>
            <p class="page-subtitle">Client records, portal access permissions and project history.</p>
          </div>
        </header>
        <div class="crm-table-wrap">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Client / Couple</th>
                <th>Contact</th>
                <th>Active Project</th>
                <th>Location</th>
                <th>Workflow Stage</th>
                <th>Portal Access</th>
              </tr>
            </thead>
            <tbody>
              ${STUDIO_PROJECTS.map(p => `
                <tr style="cursor: pointer;" onclick="window.StudioApp.navigateToProject('${p.id}')">
                  <td><strong>${p.clientNames}</strong></td>
                  <td style="color: var(--text-secondary); font-size: 0.8rem;">${p.clientEmail || 'contact@example.com'}</td>
                  <td>${p.eventType}</td>
                  <td>${p.location}</td>
                  <td><span class="status-pill ${getStatusClass(p.currentStage || 'album')}"><span class="status-dot"></span>${p.currentStage || 'Album'}</span></td>
                  <td><span style="color: #059669; font-weight: 600; font-size: 0.78rem;">● Active</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    appView.innerHTML = html;
  }

  function renderCalendar() {
    APP_STATE.currentStudioPage = 'calendar';
    saveState();
    breadcrumb.innerHTML = '<span class="breadcrumb-current">Calendar</span>';

    let html = `
      <div class="view-enter">
        <header class="page-header">
          <div class="page-title-group">
            <h1>Studio Calendar & Shoots</h1>
            <p class="page-subtitle">Shoot dates, client selection deadlines and album proofing targets.</p>
          </div>
        </header>
        <div class="placeholder-view-card">
          <div class="placeholder-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <h3 class="placeholder-title">Your studio schedule will appear here.</h3>
          <p class="placeholder-desc">Track upcoming shoot itineraries, selection review milestones, and album print lab turnaround schedules.</p>
          <button class="btn btn-secondary" onclick="window.StudioApp.navigateToStudioPage('projects')">Explore Active Projects</button>
        </div>
      </div>
    `;
    appView.innerHTML = html;
  }

  function renderDeliveries() {
    APP_STATE.currentStudioPage = 'deliveries';
    saveState();
    breadcrumb.innerHTML = '<span class="breadcrumb-current">Deliveries</span>';

    let html = `
      <div class="view-enter">
        <header class="page-header">
          <div class="page-title-group">
            <h1>Album & Gallery Deliveries</h1>
            <p class="page-subtitle">Print lab fulfillment, courier tracking and client digital master downloads.</p>
          </div>
        </header>
        <div class="placeholder-view-card">
          <div class="placeholder-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <h3 class="placeholder-title">Physical Album Packaging & Digital Handover</h3>
          <p class="placeholder-desc">${APP_STATE.albumState.status === 'approved' ? 'Rahul & Priya album order FH-ALBUM-8921 is queued at Fuji Print Lab.' : '6 upcoming deliveries scheduled this month.'}</p>
          <button class="btn btn-secondary" onclick="window.StudioApp.navigateToStudioPage('projects')">View Project Pipeline</button>
        </div>
      </div>
    `;
    appView.innerHTML = html;
  }

  function renderSettings() {
    APP_STATE.currentStudioPage = 'settings';
    saveState();
    breadcrumb.innerHTML = '<span class="breadcrumb-current">Settings</span>';

    let html = `
      <div class="view-enter">
        <header class="page-header">
          <div class="page-title-group">
            <h1>Studio Settings</h1>
            <p class="page-subtitle">Configure FrameHouse Studio profile, branding, watermarks and album proofing defaults.</p>
          </div>
        </header>
        <div class="specs-overview-card" style="max-width: 720px; margin-top: 1rem;">
          <h3 class="specs-title">Studio Profile & Proofing Configuration</h3>
          <div class="specs-list">
            <div class="spec-item"><span class="spec-label">Studio Name</span><span class="spec-value">FrameHouse Studio</span></div>
            <div class="spec-item"><span class="spec-label">Lead Photographer</span><span class="spec-value">Kabir Mehta</span></div>
            <div class="spec-item"><span class="spec-label">Album Format</span><span class="spec-value">12x18 Panoramic Flushmount</span></div>
            <div class="spec-item"><span class="spec-label">Album Spreads</span><span class="spec-value">20 Spreads (40 Pages)</span></div>
            <div class="spec-item"><span class="spec-label">Album Proof Version</span><span class="spec-value">${APP_STATE.albumState.version.toUpperCase()}</span></div>
            <div class="spec-item"><span class="spec-label">Approval Status</span><span class="spec-value">${APP_STATE.albumState.status.replace('_', ' ').toUpperCase()}</span></div>
          </div>
          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
            <button class="btn btn-primary btn-sm" onclick="window.StudioApp.showToast('Preferences saved', '✓')">Save Preferences</button>
            <button class="btn btn-secondary btn-sm" onclick="window.StudioApp.resetDemoState()">Reset Full Demo State</button>
          </div>
        </div>
      </div>
    `;
    appView.innerHTML = html;
  }

  function navigateToStudioPage(page) {
    APP_STATE.currentStudioPage = page;
    saveState();
    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === page);
    });
    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (page) {
      case 'dashboard': renderDashboard(); break;
      case 'projects': renderProjects(); break;
      case 'clients': renderClients(); break;
      case 'calendar': renderCalendar(); break;
      case 'deliveries': renderDeliveries(); break;
      case 'settings': renderSettings(); break;
      default: renderDashboard();
    }
  }

  function navigateToProject(projectId) {
    APP_STATE.currentStudioPage = 'projectDetail';
    APP_STATE.selectedProjectId = projectId;
    saveState();

    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === 'projects');
    });

    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderProjectDetail(projectId);
  }

  function resetDemoState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    location.reload();
  }

  // =========================================================================
  // 14. Global Event Bindings
  // =========================================================================

  function openNewProjectModal() { if (newProjectModal) newProjectModal.classList.add('is-active'); }
  function closeNewProjectModal() { if (newProjectModal) newProjectModal.classList.remove('is-active'); }
  function openMobileSidebar() { if (sidebar) sidebar.classList.add('is-open'); if (sidebarBackdrop) sidebarBackdrop.classList.add('is-open'); }
  function closeMobileSidebar() { if (sidebar) sidebar.classList.remove('is-open'); if (sidebarBackdrop) sidebarBackdrop.classList.remove('is-open'); }

  function initGlobalEvents() {
    if (switchToStudioBtn) switchToStudioBtn.addEventListener('click', () => setAppMode('studio'));
    if (switchToClientBtn) switchToClientBtn.addEventListener('click', () => setAppMode('client'));

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        navigateToStudioPage(page);
      });
    });

    if (mobileNavToggle) mobileNavToggle.addEventListener('click', openMobileSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

    if (globalSearchInput) {
      globalSearchInput.addEventListener('input', (e) => {
        APP_STATE.searchQuery = e.target.value;
        if (APP_STATE.viewMode === 'studio') {
          if (APP_STATE.currentStudioPage !== 'projects') {
            navigateToStudioPage('projects');
          } else {
            renderProjects();
          }
        }
      });
    }

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (lightboxModal && lightboxModal.classList.contains('is-active')) {
        if (e.key === 'ArrowRight') nextLightboxPhoto();
        if (e.key === 'ArrowLeft') prevLightboxPhoto();
        if (e.key === 'Escape') closeLightbox();
      } else if (APP_STATE.viewMode === 'client' && APP_STATE.clientActiveWorkspace === 'album') {
        if (e.key === 'ArrowRight' && APP_STATE.albumState.currentSpreadIdx < APP_STATE.albumState.spreads.length - 1) {
          APP_STATE.albumState.currentSpreadIdx++;
          saveState();
          renderClientAlbumProof();
        } else if (e.key === 'ArrowLeft' && APP_STATE.albumState.currentSpreadIdx > 0) {
          APP_STATE.albumState.currentSpreadIdx--;
          saveState();
          renderClientAlbumProof();
        }
      } else if (e.key === 'Escape') {
        closeLightbox();
        closeReviewSelectionModal();
        if (submitConfirmModal) submitConfirmModal.classList.remove('is-active');
        if (submitRevisionModal) submitRevisionModal.classList.remove('is-active');
        if (albumApproveModal) albumApproveModal.classList.remove('is-active');
        closeStudioSelectedPhotosModal();
        if (printLabModal) printLabModal.classList.remove('is-active');
        if (resetDemoModal) resetDemoModal.classList.remove('is-active');
        closeNewProjectModal();
        closeMobileSidebar();
      }
    });

    // Reset Demo Modal Handlers
    const demoResetBtn = document.getElementById('demo-reset-btn');
    if (demoResetBtn) {
      demoResetBtn.addEventListener('click', () => {
        if (resetDemoModal) resetDemoModal.classList.add('is-active');
      });
    }
    const closeResetBtn = document.getElementById('close-reset-modal');
    if (closeResetBtn) closeResetBtn.addEventListener('click', () => {
      if (resetDemoModal) resetDemoModal.classList.remove('is-active');
    });
    const cancelResetBtn = document.getElementById('cancel-reset-modal-btn');
    if (cancelResetBtn) cancelResetBtn.addEventListener('click', () => {
      if (resetDemoModal) resetDemoModal.classList.remove('is-active');
    });
    const confirmResetBtn = document.getElementById('confirm-reset-modal-btn');
    if (confirmResetBtn) {
      confirmResetBtn.addEventListener('click', () => {
        if (resetDemoModal) resetDemoModal.classList.remove('is-active');
        resetDemoState();
      });
    }

    // Lightbox handlers
    const lbCloseBtn = document.getElementById('lightbox-close-btn');
    if (lbCloseBtn) lbCloseBtn.addEventListener('click', closeLightbox);
    const lbNextBtn = document.getElementById('lightbox-next-btn');
    if (lbNextBtn) lbNextBtn.addEventListener('click', nextLightboxPhoto);
    const lbPrevBtn = document.getElementById('lightbox-prev-btn');
    if (lbPrevBtn) lbPrevBtn.addEventListener('click', prevLightboxPhoto);
    const lbToggleBtn = document.getElementById('lightbox-toggle-select-btn');
    if (lbToggleBtn) {
      lbToggleBtn.addEventListener('click', () => {
        const p = GALLERY_PHOTOS[APP_STATE.lightboxIndex];
        if (p) togglePhotoSelection(p.id);
      });
    }

    // Modal dismiss buttons
    const closeReviewBtn = document.getElementById('close-review-modal');
    if (closeReviewBtn) closeReviewBtn.addEventListener('click', closeReviewSelectionModal);
    const contBrowsingBtn = document.getElementById('review-continue-browsing-btn');
    if (contBrowsingBtn) contBrowsingBtn.addEventListener('click', closeReviewSelectionModal);

    const closeConfirmBtn = document.getElementById('close-confirm-modal');
    if (closeConfirmBtn) closeConfirmBtn.addEventListener('click', () => submitConfirmModal.classList.remove('is-active'));
    const cancelConfirmBtn = document.getElementById('confirm-cancel-btn');
    if (cancelConfirmBtn) cancelConfirmBtn.addEventListener('click', () => submitConfirmModal.classList.remove('is-active'));

    const closeRevisionBtn = document.getElementById('close-revision-modal');
    if (closeRevisionBtn) closeRevisionBtn.addEventListener('click', () => submitRevisionModal.classList.remove('is-active'));
    const cancelRevisionBtn = document.getElementById('cancel-send-revisions-btn');
    if (cancelRevisionBtn) cancelRevisionBtn.addEventListener('click', () => submitRevisionModal.classList.remove('is-active'));
    const confirmSendRevBtn = document.getElementById('confirm-send-revisions-btn');
    if (confirmSendRevBtn) confirmSendRevBtn.addEventListener('click', submitRevisionsToStudio);

    const closeApproveBtn = document.getElementById('close-approve-modal');
    if (closeApproveBtn) closeApproveBtn.addEventListener('click', () => albumApproveModal.classList.remove('is-active'));
    const cancelApproveBtn = document.getElementById('cancel-approve-album-btn');
    if (cancelApproveBtn) cancelApproveBtn.addEventListener('click', () => albumApproveModal.classList.remove('is-active'));
    const confirmApproveBtn = document.getElementById('confirm-approve-album-btn');
    if (confirmApproveBtn) confirmApproveBtn.addEventListener('click', approveAlbumFinal);

    const closeStudioSelBtn = document.getElementById('close-studio-selected-modal');
    if (closeStudioSelBtn) closeStudioSelBtn.addEventListener('click', closeStudioSelectedPhotosModal);
    const dismissStudioSelBtn = document.getElementById('dismiss-studio-selected-modal');
    if (dismissStudioSelBtn) dismissStudioSelBtn.addEventListener('click', closeStudioSelectedPhotosModal);
    const exportBtn = document.getElementById('studio-export-selection-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportSelectionFile);

    const closePrintLabBtn = document.getElementById('close-print-lab-modal');
    if (closePrintLabBtn) closePrintLabBtn.addEventListener('click', () => printLabModal.classList.remove('is-active'));
    const dismissPrintLabBtn = document.getElementById('dismiss-print-lab-btn');
    if (dismissPrintLabBtn) dismissPrintLabBtn.addEventListener('click', () => printLabModal.classList.remove('is-active'));
    const downloadLabBtn = document.getElementById('download-lab-manifest-btn');
    if (downloadLabBtn) {
      downloadLabBtn.addEventListener('click', () => {
        showToast('Print lab production package (FH-ALBUM-8921.zip) generated', '📦');
      });
    }

    const closeNewProjBtn = document.getElementById('close-new-project-modal');
    if (closeNewProjBtn) closeNewProjBtn.addEventListener('click', closeNewProjectModal);
    const cancelNewProjBtn = document.getElementById('cancel-new-project-modal');
    if (cancelNewProjBtn) cancelNewProjBtn.addEventListener('click', closeNewProjectModal);

    const newProjForm = document.getElementById('new-project-form');
    if (newProjForm) {
      newProjForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const clientNames = document.getElementById('input-client-names').value.trim();
        const projectType = document.getElementById('input-project-type').value;
        const eventDate = document.getElementById('input-event-date').value;
        const location = document.getElementById('input-location').value.trim() || 'Hyderabad, India';
        const photoCount = parseInt(document.getElementById('input-photo-count').value, 10) || 2000;

        const newId = clientNames.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newProj = {
          id: newId,
          clientNames: clientNames,
          clientEmail: `${newId}@example.com`,
          projectName: projectType,
          eventType: projectType,
          eventDate: eventDate || '20 Nov 2026',
          location: location,
          projectId: `FH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          totalPhotos: photoCount,
          selectedPhotos: 0,
          selectionLimit: 250,
          currentStage: 'Selection',
          statusText: 'Selection in progress',
          updatedAt: 'Just now',
          isMainDemo: false,
          coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          photographer: 'FrameHouse Studio (Lead: Kabir Mehta)',
          albumStatus: 'Awaiting client review',
          deliveryStatus: 'Pending',
          events: [
            { id: 'main-event', name: 'Ceremony & Reception', dateTime: eventDate || '20 Nov 2026', photoCount: photoCount, cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', status: 'Selection Open', featured: true }
          ],
          activity: [{ text: `Project created for <strong>${clientNames}</strong>`, time: 'Just now', recent: true }]
        };

        STUDIO_PROJECTS.unshift(newProj);
        const countBadge = document.getElementById('nav-project-count');
        if (countBadge) countBadge.textContent = STUDIO_PROJECTS.length;

        closeNewProjectModal();
        newProjForm.reset();
        showToast(`Project created for ${clientNames}`, '🎉');
        navigateToProject(newProj.id);
      });
    }

    const notifBtn = document.getElementById('notifications-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        showToast('Rahul & Priya revision resolved and published', '🔔');
      });
    }
  }

  // =========================================================================
  // 15. App Bootstrap
  // =========================================================================

  function init() {
    initGlobalEvents();
    if (APP_STATE.viewMode === 'client') {
      setAppMode('client');
    } else {
      setAppMode('studio');
    }
  }

  window.StudioApp = {
    setAppMode,
    navigateToStudioPage,
    navigateToProject,
    togglePhotoSelection,
    openLightbox,
    openReviewSelectionModal,
    openStudioSelectedPhotosModal,
    exportSelectionFile,
    studioResolveSpreadComment,
    studioPublishRevisedProofV2,
    approveAlbumFinal,
    resetDemoState,
    showToast,
    getState: () => APP_STATE
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
