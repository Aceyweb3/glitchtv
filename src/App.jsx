import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Bell, BookOpen, Check,
  ChevronLeft, ChevronRight, CircleDollarSign, Clock3, Compass, Copy, Disc3, Flame,
  Gamepad2, Headphones, Heart, Home, Info, LockKeyhole, LogOut, Menu, Minus, Play, Plus, Radio,
  Scissors, Search, Send, Share2, Shield, ShoppingBag, ShoppingCart, Sparkles,
  Trash2, Trophy, Users, Video, X,
} from 'lucide-react';

const achievements = [
  { id: 'first_watch', name: 'Signal acquired', description: 'Watch your first title', points: 10, icon: '▶', category: 'watch' },
  { id: 'first_read', name: 'Page one', description: 'Read your first chapter', points: 10, icon: '▤', category: 'read' },
  { id: 'discover_10', name: 'Off the map', description: 'Discover 10 titles', points: 25, icon: '⌖', category: 'watch' },
  { id: 'vote_monthly', name: 'Monthly voter', description: 'Vote in the monthly Top 15', points: 20, icon: '▲', category: 'vote' },
  { id: 'vote_5', name: 'Power ballot', description: 'Cast 5 votes lifetime', points: 30, icon: '✳', category: 'vote' },
  { id: 'party_host', name: 'Room operator', description: 'Host a watch or read party', points: 40, icon: '◉', category: 'social' },
  { id: 'party_join', name: 'On the guest list', description: 'Join a party', points: 15, icon: '↗', category: 'social' },
  { id: 'first_post', name: 'Broadcast live', description: 'Publish your first short, comic, or video', points: 20, icon: '⌁', category: 'create' },
  { id: 'creator_1k', name: 'First thousand', description: 'Reach 1,000 views on a piece', points: 100, icon: '◌', category: 'create', comingSoon: true },
  { id: 'swish_linked', name: 'Street connected', description: 'Link a SWISH profile', points: 50, icon: '⌘', category: 'swish' },
  { id: 'swish_first_win', name: 'First blood', description: 'Win your first SWISH match', points: 30, icon: '✦', category: 'swish', comingSoon: true },
];

const initialScore = {
  userId: 'operator-001', handle: '@nightshift', gamerScore: 0, tier: 'Bronze',
  achievements: [], monthlyVotes: 0, voteMonth: new Date().toISOString().slice(0, 7),
  stats: { titlesWatched: 0, chaptersRead: 0, votesCast: 0, partiesHosted: 0, postsCreated: 0 },
  discovered: [], linkedSwish: false,
};

const titles = [
  { id: 'neon-veil', title: 'NEON VEIL', creator: 'Mika Sato', type: 'SERIES · 8 EP', genre: 'Sci-fi', image: 'photo-1519608487953-e999c86e7455', progress: 62, label: 'CONTINUE' },
  { id: 'afterimage', title: 'AFTERIMAGE', creator: 'Juno Vale', type: 'COMIC · 12 CH', genre: 'Thriller', image: 'photo-1519608487953-e999c86e7455', progress: 0, label: 'NEW SIGNAL' },
  { id: 'ghostline', title: 'GHOSTLINE 09', creator: 'K. Mori', type: 'SHORT · 18 MIN', genre: 'Action', image: 'photo-1500530855697-b586d89ba3ee', progress: 0, label: 'TRENDING' },
  { id: 'soft-reset', title: 'SOFT RESET', creator: 'Mina Cho', type: 'COMIC · 24 CH', genre: 'Drama', image: 'photo-1518837695005-2083093ee35b', progress: 0, label: 'RECOMMENDED' },
  { id: 'dead-air', title: 'DEAD AIR FM', creator: 'Static Youth', type: 'SERIES · 6 EP', genre: 'Mystery', image: 'photo-1519608487953-e999c86e7455', progress: 0, label: 'JUST DROPPED' },
  { id: 'paper-moon', title: 'PAPER MOON', creator: 'Rin Okada', type: 'COMIC · 9 CH', genre: 'Fantasy', image: 'photo-1534796636912-3b95b3ab5986', progress: 0, label: 'RECOMMENDED' },
  { id: 'blue-hour', title: 'BLUE HOUR', creator: 'Lena Park', type: 'SHORT · 22 MIN', genre: 'Sci-fi', image: 'photo-1500530855697-b586d89ba3ee', progress: 0, label: 'NEW SIGNAL' },
  { id: 'zero-sum', title: 'ZERO SUM', creator: 'Ari Tanaka', type: 'SERIES · 5 EP', genre: 'Thriller', image: 'photo-1519608487953-e999c86e7455', progress: 0, label: 'UNDERGROUND' },
  { id: 'soft-focus', title: 'SOFT FOCUS', creator: 'Ciel Hara', type: 'COMIC · 16 CH', genre: 'Drama', image: 'photo-1518837695005-2083093ee35b', progress: 0, label: 'JUST DROPPED' },
  { id: 'last-light', title: 'LAST LIGHT', creator: 'Noah Kade', type: 'SHORT · 14 MIN', genre: 'Mystery', image: 'photo-1534796636912-3b95b3ab5986', progress: 0, label: 'TRENDING' },
];

const merchProducts = [
  { id: 'veil-jacket', title: 'NEON VEIL / Signal jacket', creator: 'Mika Sato', price: 88, category: 'APPAREL', image: 'photo-1551028719-00167b16eac5', description: 'Reflective stitchwork. Limited creator drop.' },
  { id: 'afterimage-print', title: 'AFTERIMAGE / Panel 04', creator: 'Juno Vale', price: 32, category: 'PRINT', image: 'photo-1579783902614-a3fb3927b6a5', description: 'Archival art print, signed by the creator.' },
  { id: 'ghostline-tape', title: 'GHOSTLINE / Field tape', creator: 'K. Mori', price: 24, category: 'OBJECTS', image: 'photo-1523275335684-37898b6baf30', description: 'Analog field notes from the Ghostline unit.' },
  { id: 'soft-reset-zine', title: 'SOFT RESET / Issue zero', creator: 'Mina Cho', price: 18, category: 'PRINT', image: 'photo-1544947950-fa07a98d237f', description: 'A small-format collection of early panels.' },
];

const voteEntries = {
  comic: [
    { id: 'afterimage', title: 'Afterimage', creator: 'Juno Vale', image: titles[1].image },
    { id: 'soft-reset', title: 'Soft Reset', creator: 'Mina Cho', image: titles[3].image },
    { id: 'paper-moon', title: 'Paper Moon', creator: 'Rin Okada', image: 'photo-1534796636912-3b95b3ab5986' },
  ],
  short: [
    { id: 'ghostline', title: 'Ghostline 09', creator: 'K. Mori', image: titles[2].image },
    { id: 'dead-air', title: 'Dead Air FM', creator: 'Static Youth', image: titles[4].image },
    { id: 'blue-hour', title: 'Blue Hour Protocol', creator: 'Lena Park', image: 'photo-1519608487953-e999c86e7455' },
  ],
};

const seedRooms = [
  { id: 'room-neon', title: 'Neon Veil · S01E04', type: 'WATCH PARTY', host: 'KIRA.exe', color: 'cyan', members: 12, capacity: 20, joined: false },
  { id: 'room-afterimage', title: 'Afterimage · Chapter 04', type: 'READ PARTY', host: 'junovale', color: 'pink', members: 6, capacity: 12, joined: false },
  { id: 'room-ghostline', title: 'Ghostline 09 · Premiere', type: 'WATCH PARTY', host: 'Mori_K', color: 'orange', members: 18, capacity: 24, joined: false },
];

const initialAppData = {
  posts: [], rooms: seedRooms, watchedTitles: [], readTitles: [], progress: {}, likedPosts: [], waitlistEmail: '',
  cart: [], orders: [], clips: [], readProgress: {},
};

const initialVoteCounts = Object.fromEntries(
  Object.values(voteEntries).flat().map((entry, index) => [entry.id, 1420 - index * 217]),
);

const tiers = [
  { name: 'Bronze', min: 0 }, { name: 'Silver', min: 100 }, { name: 'Gold', min: 300 },
  { name: 'Platinum', min: 750 }, { name: 'Diamond', min: 1500 },
];

const navItems = [
  { label: 'Home', icon: Home }, { label: 'Watch', icon: Play }, { label: 'Read', icon: BookOpen },
  { label: 'Social', icon: Users }, { label: 'Parties', icon: Headphones },
  { label: 'Marketplace', icon: ShoppingBag },
];

function getTier(score) {
  return [...tiers].reverse().find((tier) => score >= tier.min) ?? tiers[0];
}

function loadScore() {
  try {
    const saved = JSON.parse(localStorage.getItem('glitchtv-score'));
    if (saved && saved.stats && Array.isArray(saved.achievements)) {
      const voteMonth = new Date().toISOString().slice(0, 7);
      return {
        ...initialScore, ...saved,
        monthlyVotes: saved.voteMonth === voteMonth ? saved.monthlyVotes : 0,
        voteMonth,
        stats: { ...initialScore.stats, ...saved.stats },
      };
    }
  } catch {
    // Start with a clean local profile if stored data is invalid.
  }
  return { ...initialScore };
}

function loadAppData() {
  try {
    const saved = JSON.parse(localStorage.getItem('glitchtv-app-data'));
    if (saved && typeof saved === 'object') return { ...initialAppData, ...saved };
  } catch {
    // Start with a clean local app state if stored data is invalid.
  }
  return { ...initialAppData, rooms: seedRooms.map((room) => ({ ...room })) };
}

function loadVoteCounts(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved === 'object') return { ...initialVoteCounts, ...saved };
  } catch {
    // Keep the demo leaderboard available if stored counts are invalid.
  }
  return { ...initialVoteCounts };
}

function App() {
  const [score, setScore] = useState(loadScore);
  const [appData, setAppData] = useState(loadAppData);
  const [activeTab, setActiveTab] = useState('Home');
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('For you');
  const [showAllTrophies, setShowAllTrophies] = useState(false);
  const [modal, setModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);
  const searchRef = useRef(null);
  const seenUnlocks = useRef(new Set(score.achievements.map((item) => item.achievementId)));
  const month = new Date().toLocaleString('en', { month: 'long' });
  const monthKey = new Date().toISOString().slice(0, 7);
  const votesKey = `glitchtv-votes-${monthKey}`;
  const voteCountsKey = `glitchtv-vote-counts-${monthKey}`;
  const [votes, setVotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(votesKey)) ?? {}; } catch { return {}; }
  });
  const [voteCounts, setVoteCounts] = useState(() => loadVoteCounts(voteCountsKey));

  useEffect(() => localStorage.setItem('glitchtv-score', JSON.stringify(score)), [score]);
  useEffect(() => localStorage.setItem('glitchtv-app-data', JSON.stringify(appData)), [appData]);
  useEffect(() => localStorage.setItem(votesKey, JSON.stringify(votes)), [votes, votesKey]);
  useEffect(() => localStorage.setItem(voteCountsKey, JSON.stringify(voteCounts)), [voteCounts, voteCountsKey, votesKey]);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoading(false);
      setGuideOpen(localStorage.getItem('glitchtv-guide-seen') !== 'true');
    }, 950);
    return () => window.clearTimeout(timeout);
  }, []);
  useEffect(() => {
    score.achievements.forEach((unlock) => {
      if (seenUnlocks.current.has(unlock.achievementId)) return;
      seenUnlocks.current.add(unlock.achievementId);
      const achievement = achievements.find((item) => item.id === unlock.achievementId);
      if (achievement) setToast(`+${achievement.points} GS  ·  ${achievement.name}`);
    });
  }, [score.achievements]);
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    const handleKeys = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setModal(null);
        setGuideOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, []);
  useEffect(() => {
    const openSharedPost = () => {
      const sharedId = window.location.hash.slice(1);
      if (sharedId.startsWith('post-')) setActiveTab('Social');
      if (sharedId.startsWith('clip-')) setActiveTab('Clipping');
    };
    openSharedPost();
    window.addEventListener('hashchange', openSharedPost);
    return () => window.removeEventListener('hashchange', openSharedPost);
  }, []);
  useEffect(() => {
    const sharedId = window.location.hash.slice(1);
    const isSharedPost = activeTab === 'Social' && sharedId.startsWith('post-');
    const isSharedClip = activeTab === 'Clipping' && sharedId.startsWith('clip-');
    if (!isSharedPost && !isSharedClip) return undefined;
    const timeout = window.setTimeout(() => document.getElementById(sharedId)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
    return () => window.clearTimeout(timeout);
  }, [activeTab, appData.posts]);

  const announce = (message) => setToast(message);
  const award = (achievementId) => {
    const achievement = achievements.find((item) => item.id === achievementId);
    if (!achievement) return;
    setScore((current) => {
      if (current.achievements.some((item) => item.achievementId === achievementId)) return current;
      const nextScore = current.gamerScore + achievement.points;
      return {
        ...current, gamerScore: nextScore, tier: getTier(nextScore).name,
        achievements: [...current.achievements, { achievementId, unlockedAt: new Date().toISOString() }],
      };
    });
  };

  const incrementStat = (name) => setScore((current) => ({ ...current, stats: { ...current.stats, [name]: current.stats[name] + 1 } }));
  const discover = (id) => {
    setScore((current) => {
      if (current.discovered.includes(id)) return current;
      const discovered = [...current.discovered, id];
      if (discovered.length >= 10) window.setTimeout(() => award('discover_10'), 0);
      return { ...current, discovered };
    });
  };

  const openTitle = (item, mode) => {
    discover(item.id);
    setModal({ type: `media-${mode}`, item });
  };

  const completeTitle = (item, mode) => {
    const listKey = mode === 'watch' ? 'watchedTitles' : 'readTitles';
    const alreadyComplete = appData[listKey].includes(item.id);
    setAppData((current) => ({
      ...current,
      [listKey]: current[listKey].includes(item.id) ? current[listKey] : [...current[listKey], item.id],
      progress: mode === 'watch' ? { ...current.progress, [item.id]: 100 } : current.progress,
      readProgress: mode === 'read' ? { ...current.readProgress, [item.id]: 3 } : current.readProgress,
    }));
    if (!alreadyComplete) {
      incrementStat(mode === 'watch' ? 'titlesWatched' : 'chaptersRead');
      award(mode === 'watch' ? 'first_watch' : 'first_read');
    }
    announce(mode === 'watch' ? `TITLE COMPLETE  ·  ${item.title}` : `CHAPTER COMPLETE  ·  ${item.title}`);
    setModal(null);
  };

  const castVote = (category, entry) => {
    if (votes[category]) return;
    setVotes((current) => ({ ...current, [category]: entry.id }));
    setVoteCounts((current) => ({ ...current, [entry.id]: (current[entry.id] ?? 0) + 1 }));
    incrementStat('votesCast');
    setScore((current) => ({ ...current, monthlyVotes: current.monthlyVotes + 1, voteMonth: monthKey }));
    award('vote_monthly');
    if (score.stats.votesCast + 1 >= 5) award('vote_5');
    announce(`VOTE LOCKED  ·  ${entry.title}`);
  };

  const publishPost = (content, mediaUrl) => {
    const post = { id: `post-${Date.now()}`, content, mediaUrl, createdAt: new Date().toISOString(), handle: score.handle };
    setAppData((current) => ({ ...current, posts: [post, ...current.posts] }));
    incrementStat('postsCreated');
    award('first_post');
    announce('YOUR SIGNAL IS LIVE');
  };

  const makeParty = (roomDetails) => {
    const room = { ...roomDetails, id: `room-${Date.now()}`, host: score.handle, color: 'purple', members: 1, joined: true };
    setAppData((current) => ({ ...current, rooms: [room, ...current.rooms] }));
    incrementStat('partiesHosted');
    award('party_host');
    announce('PARTY CHANNEL CREATED');
    setModal({ type: 'party-room', room });
  };

  const joinParty = (room) => {
    if (room.openOnly) {
      setModal({ type: 'party-room', room });
      return;
    }
    const alreadyJoined = room.joined;
    setAppData((current) => ({
      ...current,
      rooms: current.rooms.map((item) => item.id === room.id
        ? { ...item, joined: !item.joined, members: item.members + (item.joined ? -1 : 1) }
        : item),
    }));
    if (!alreadyJoined) {
      award('party_join');
      announce(`JOINED  ·  ${room.title}`);
      setModal({ type: 'party-room', room: { ...room, joined: true, members: room.members + 1 } });
    } else {
      setModal(null);
      announce(`LEFT  ·  ${room.title}`);
    }
  };

  const linkSwish = () => {
    if (!score.linkedSwish) {
      setScore((current) => ({ ...current, linkedSwish: true }));
      award('swish_linked');
    }
  };

  const toggleLike = (postId) => setAppData((current) => ({
    ...current,
    likedPosts: current.likedPosts.includes(postId)
      ? current.likedPosts.filter((id) => id !== postId)
      : [...current.likedPosts, postId],
  }));

  const joinWaitlist = (email) => {
    setAppData((current) => ({ ...current, waitlistEmail: email }));
    announce('YOU ARE ON THE DROP LIST');
    setModal(null);
  };

  const updateHandle = (handle) => {
    const normalized = handle.trim().replace(/^@+/, '').replace(/\s+/g, '').slice(0, 20);
    if (!normalized) return;
    setScore((current) => ({ ...current, handle: `@${normalized}` }));
    setModal(null);
    announce('OPERATOR PROFILE UPDATED');
  };

  const deletePost = (postId) => setAppData((current) => ({ ...current, posts: current.posts.filter((post) => post.id !== postId) }));
  const addToCart = (product) => {
    setAppData((current) => {
      const existing = current.cart.find((item) => item.productId === product.id);
      return {
        ...current,
        cart: existing
          ? current.cart.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...current.cart, { productId: product.id, quantity: 1 }],
      };
    });
    announce(`ADDED TO DROP BAG  ·  ${product.title}`);
  };

  const setCartQuantity = (productId, quantity) => setAppData((current) => ({
    ...current,
    cart: quantity < 1
      ? current.cart.filter((item) => item.productId !== productId)
      : current.cart.map((item) => item.productId === productId ? { ...item, quantity } : item),
  }));

  const checkout = () => {
    if (!appData.cart.length) return;
    const order = {
      id: `GT-${Date.now().toString().slice(-7)}`,
      items: appData.cart.map((line) => ({ ...line })),
      total: appData.cart.reduce((sum, line) => {
        const product = merchProducts.find((item) => item.id === line.productId);
        return sum + (product?.price ?? 0) * line.quantity;
      }, 0),
      createdAt: new Date().toISOString(),
    };
    setAppData((current) => ({ ...current, orders: [order, ...current.orders], cart: [] }));
    setModal({ type: 'order-confirmation', order });
  };

  const createClip = ({ titleId, start, end }) => {
    const clip = {
      id: `clip-${Date.now()}`, titleId, start: Number(start), end: Number(end),
      createdAt: new Date().toISOString(), status: 'READY TO SHARE',
    };
    setAppData((current) => ({ ...current, clips: [clip, ...current.clips] }));
    incrementStat('postsCreated');
    award('first_post');
    announce('CLIP CREATED  ·  READY TO SHARE');
  };

  const deleteClip = (clipId) => setAppData((current) => ({ ...current, clips: current.clips.filter((clip) => clip.id !== clipId) }));
  const shareClip = async (clipId) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/#${clipId}`);
      announce('CLIP LINK COPIED');
    } catch {
      announce('SHARE UNAVAILABLE IN THIS BROWSER');
    }
  };

  const finishGuide = () => {
    localStorage.setItem('glitchtv-guide-seen', 'true');
    setGuideOpen(false);
  };

  const sharePost = async (postId) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/#post-${postId}`);
      announce('POST LINK COPIED');
    } catch {
      announce('SHARE UNAVAILABLE IN THIS BROWSER');
    }
  };

  const goTo = (tab) => {
    setActiveTab(tab);
    setShowAllTrophies(tab === 'Trophies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleTitles = titles
    .map((item) => ({ ...item, progress: appData.progress[item.id] ?? item.progress }))
    .filter((item) => {
      const matchesSearch = `${item.title} ${item.creator} ${item.genre}`.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'For you'
        || (filter === 'Comics' && item.type.includes('COMIC'))
        || (filter === 'Shorts' && item.type.includes('SHORT'))
        || (filter === 'Series' && item.type.includes('SERIES'))
        || (filter === 'Underground' && (item.label === 'UNDERGROUND' || item.genre === 'Thriller'));
      return matchesSearch && matchesFilter;
    });
  const unlocked = new Set(score.achievements.map((item) => item.achievementId));
  const currentTier = getTier(score.gamerScore);
  const tierIndex = tiers.findIndex((tier) => tier.name === currentTier.name);
  const nextTier = tiers[tierIndex + 1];
  const progress = nextTier ? Math.min(100, ((score.gamerScore - currentTier.min) / (nextTier.min - currentTier.min)) * 100) : 100;
  const readingItems = visibleTitles
    .filter((item) => item.type.includes('COMIC') && (appData.readProgress[item.id] ?? 1) > 1 && !appData.readTitles.includes(item.id))
    .map((item) => ({ ...item, progress: Math.round(((appData.readProgress[item.id] - 1) / 2) * 100), label: 'CONTINUE READING' }));

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => goTo('Home')} aria-label="GLITCH TV home">
          <span className="brand-mark"><Disc3 size={19} strokeWidth={2.2} /></span>
          <span><span className="brand-wordmark" data-text="GLITCH">GLITCH</span><span className="brand-tv">TV</span><small>STORIES FROM THE EDGE</small></span>
        </button>
        <div className="topbar-search">
          <Search size={16} />
          <input ref={searchRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the signal" aria-label="Search titles" />
          <kbd>⌘ K</kbd>
        </div>
        <div className="topbar-actions">
          <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setModal({ type: 'notifications' })}><Bell size={18} /><i /></button>
          <button className="operator-chip" onClick={() => goTo('Profile')}>
            <span className="avatar avatar-small">{score.handle.slice(1, 2).toUpperCase()}</span><span className="operator-score">GS {score.gamerScore.toLocaleString()}</span>
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="side-nav" aria-label="Main navigation">
          <span className="nav-caption">YOUR FREQUENCIES</span>
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activeTab === label ? 'active' : ''}`} onClick={() => goTo(label)}><Icon size={17} /><span>{label}</span>{label === 'Social' && <span className="nav-live">LIVE</span>}</button>
          ))}
          <div className="nav-divider" />
          <button className={`nav-item ${activeTab === 'Monthly Vote' ? 'active' : ''}`} onClick={() => goTo('Monthly Vote')}><Trophy size={17} /><span>Monthly Top 15</span></button>
          <button className={`nav-item ${activeTab === 'Profile' || activeTab === 'Trophies' ? 'active' : ''}`} onClick={() => goTo('Profile')}><Shield size={17} /><span>Operator profile</span></button>
          <button className="nav-item guide-nav-item" onClick={() => setGuideOpen(true)}><Sparkles size={17} /><span>App guide</span></button>
          <div className="side-status"><span className="status-dot" /> SIGNAL ONLINE <span>v. 2.06</span></div>
        </aside>

        <main className="main-content">
          <div className="mobile-greeting"><span className="eyebrow"><span className="status-dot" /> SIGNAL DETECTED</span><button className="mobile-avatar" onClick={() => goTo('Profile')} aria-label="Open operator profile">{score.handle.slice(1, 2).toUpperCase()}</button></div>
          <div className="page-heading">
            <div><span className="eyebrow">{activeTab === 'Home' ? 'FRIDAY, OCTOBER 23' : 'GLITCH NETWORK / ' + activeTab.toUpperCase()}</span><h1>{activeTab === 'Home' ? <>Your next <em>obsession.</em></> : activeTab === 'Monthly Vote' ? <>Monthly <em>Top 15.</em></> : activeTab === 'Trophies' ? <>Trophy <em>case.</em></> : activeTab === 'Profile' ? <>Operator <em>profile.</em></> : <>{activeTab}<em>.</em></>}</h1></div>
            <button className="round-action" aria-label="Open navigation" onClick={() => setModal({ type: 'menu' })}><Menu size={18} /></button>
          </div>

          {(activeTab === 'Home' || activeTab === 'Watch' || activeTab === 'Read') && (
            <>
              {activeTab === 'Home' && <section className="hero-feature">
                <img src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1700&q=85" alt="Neon-lit city at night" />
                <div className="hero-scanline" />
                <div className="hero-copy"><span className="eyebrow"><Flame size={13} /> GLITCH ORIGINAL · NEW EPISODE</span><h2>NEON<br /><strong className="glitch-word" data-text="VEIL">VEIL</strong></h2><p>In a city that sells your memories, one signal refuses to disappear.</p><div className="hero-meta"><span>SCI-FI THRILLER</span><span>·</span><span>8 EPISODES</span><span className="rating">✦ 9.2</span></div><button className="button button-cyan" onClick={() => openTitle(titles[0], 'watch')}><Play size={15} fill="currentColor" /> RESUME EPISODE</button></div>
                <div className="hero-index"><span>01 / 04</span><span className="hero-bars"><i /><i /><i /><i /></span></div>
                <span className="corner-mark corner-one" /><span className="corner-mark corner-two" />
              </section>}

              {activeTab === 'Home' && <div className="filters"><span className="filters-label">TUNE IN</span>{['For you', 'Comics', 'Shorts', 'Series', 'Underground'].map((item) => <button key={item} className={`filter-chip ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)}>{item}</button>)}</div>}

              {activeTab === 'Home' && <div className="section-head"><div><span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span><h2>Continue watching</h2></div><button className="text-link" onClick={() => goTo('Watch')}>VIEW ALL <ArrowUpRight size={14} /></button></div>}
              {(activeTab === 'Home' || activeTab === 'Watch') && <div className="continue-grid">
                {visibleTitles.filter((item) => activeTab === 'Watch' || item.progress > 0).map((item) => <MediaCard key={item.id} item={item} onAction={() => openTitle(item, 'watch')} />)}
                {activeTab === 'Home' && visibleTitles.filter((item) => item.progress === 0).slice(0, 1).map((item) => <MediaCard key={item.id} item={item} onAction={() => openTitle(item, 'watch')} />)}
                {activeTab === 'Watch' && visibleTitles.length === 0 && <EmptyState title="No titles on this frequency" detail="Try another filter or search term." />}
              </div>}

              {activeTab === 'Home' && <><div className="section-head section-spaced"><div><span className="eyebrow">YOUR READING HISTORY</span><h2>Continue reading</h2></div><button className="text-link" onClick={() => goTo('Read')}>BROWSE COMICS <ArrowUpRight size={14} /></button></div><div className="continue-grid">{readingItems.map((item) => <MediaCard key={item.id} item={item} read onAction={() => openTitle(item, 'read')} />)}{readingItems.length === 0 && <EmptyState title="No chapters in progress" detail="Start a comic below and your place will be saved here." />}</div></>}

              {activeTab === 'Home' && <div className="section-head section-spaced"><div><span className="eyebrow">THE FEED IS MOVING</span><h2>Trending now <span className="live-pill"><span className="status-dot" /> LIVE</span></h2></div><button className="text-link" onClick={() => goTo('Watch')}>EXPLORE <ArrowUpRight size={14} /></button></div>}
              {activeTab === 'Home' && <div className="trending-row">{visibleTitles.slice(1, 4).map((item, index) => <div className="trend-item" key={item.id}><span className="trend-rank">0{index + 1}</span><div className="trend-thumb" style={{ backgroundImage: `url(https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=180&q=70)` }} /><div className="trend-info"><strong>{item.title}</strong><span>{item.type} <i>·</i> {item.creator}</span></div><span className="trend-change">↗ {98 - index * 11}%</span><button className="icon-button trend-play" aria-label={`Play ${item.title}`} onClick={() => openTitle(item, 'watch')}><Play size={15} /></button></div>)}</div>}

              {(activeTab === 'Home' || activeTab === 'Read') && <><div className="section-head section-spaced"><div><span className="eyebrow">FRESH FROM THE UNDERGROUND</span><h2>{activeTab === 'Read' ? 'Read next' : 'Stories worth your time'}</h2></div><button className="text-link" onClick={() => goTo('Read')}>BROWSE COMICS <ArrowUpRight size={14} /></button></div><div className="story-grid">{visibleTitles.filter((item) => item.type.includes('COMIC')).map((item) => <MediaCard key={item.id} item={{ ...item, progress: Math.max(0, Math.round((((appData.readProgress[item.id] ?? 1) - 1) / 2) * 100)), label: appData.readProgress[item.id] > 1 ? 'CONTINUE READING' : 'NEW CHAPTER' }} onAction={() => openTitle(item, 'read')} read />)}{activeTab === 'Read' && visibleTitles.filter((item) => item.type.includes('COMIC')).length === 0 && <EmptyState title="No chapters match" detail="Try another filter or search term." />}</div></>}

              {activeTab === 'Home' && <Leaderboard score={score} onOpen={() => goTo('Monthly Vote')} />}
            </>
          )}

          {activeTab === 'Social' && <SocialPage posts={appData.posts} likedPosts={appData.likedPosts} handle={score.handle} onPost={publishPost} onToggleLike={toggleLike} onDeletePost={deletePost} onShare={sharePost} onRead={() => openTitle(titles[1], 'read')} />}
          {activeTab === 'Parties' && <PartiesPage rooms={appData.rooms} onHost={() => setModal({ type: 'host-party' })} onJoin={joinParty} />}
          {activeTab === 'Marketplace' && <MarketplacePage cart={appData.cart} orders={appData.orders} onAdd={addToCart} onOpenCart={() => setModal({ type: 'market-cart' })} />}
          {activeTab === 'Clipping' && <ClippingPage clips={appData.clips} onCreate={() => setModal({ type: 'clip-maker' })} onDelete={deleteClip} onShare={shareClip} />}
          {activeTab === 'Monthly Vote' && <VotePage month={month} votes={votes} voteCounts={voteCounts} onVote={castVote} />}
          {(activeTab === 'Profile' || activeTab === 'Trophies') && <ProfilePage score={score} waitlistEmail={appData.waitlistEmail} currentTier={currentTier} nextTier={nextTier} progress={progress} unlocked={unlocked} onTrophies={() => goTo('Trophies')} onLinkSwish={linkSwish} onEditProfile={() => setModal({ type: 'edit-profile' })} onWaitlist={() => setModal({ type: 'waitlist' })} allTrophies={showAllTrophies || activeTab === 'Trophies'} />}

          <footer className="site-footer"><span>GLITCH TV <i>© 2026</i></span><span>INDEPENDENT STORIES. UNFILTERED SIGNAL.</span><span className="footer-online"><span className="status-dot" /> ALL SYSTEMS NOMINAL</span></footer>
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Mobile navigation">{[...navItems, { label: 'Profile', icon: Shield }].map(({ label, icon: Icon }) => <button key={label} className={activeTab === label ? 'active' : ''} onClick={() => goTo(label)}><Icon size={18} /><span>{label === 'Profile' ? 'YOU' : label === 'Marketplace' ? 'SHOP' : label}</span>{label === 'Profile' && <i className="bottom-gs">{score.gamerScore}</i>}</button>)}</nav>
      {toast && <div className="toast" role="status"><span className="toast-icon"><Check size={15} /></span><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15} /></button></div>}
      {modal && <Modal onClose={() => setModal(null)}>
        {modal.type === 'media-watch' && <MediaExperience item={modal.item} mode="watch" progress={appData.progress[modal.item.id] ?? modal.item.progress} onProgress={(value) => setAppData((current) => ({ ...current, progress: { ...current.progress, [modal.item.id]: value } }))} onComplete={() => completeTitle(modal.item, 'watch')} />}
        {modal.type === 'media-read' && <MediaExperience item={modal.item} mode="read" readProgress={appData.readProgress[modal.item.id] ?? 1} onReadProgress={(page) => setAppData((current) => ({ ...current, readProgress: { ...current.readProgress, [modal.item.id]: page } }))} completed={appData.readTitles.includes(modal.item.id)} onComplete={() => completeTitle(modal.item, 'read')} />}
        {modal.type === 'host-party' && <PartyForm onCancel={() => setModal(null)} onSubmit={makeParty} />}
        {modal.type === 'party-room' && <PartyRoom room={modal.room} onLeave={() => joinParty(modal.room)} />}
        {modal.type === 'waitlist' && <WaitlistForm email={appData.waitlistEmail} onSubmit={joinWaitlist} />}
        {modal.type === 'edit-profile' && <ProfileForm handle={score.handle} onSubmit={updateHandle} />}
        {modal.type === 'notifications' && <Notifications score={score} posts={appData.posts} onClose={() => setModal(null)} />}
        {modal.type === 'market-cart' && <MarketCart cart={appData.cart} onQuantity={setCartQuantity} onCheckout={checkout} onClose={() => setModal(null)} />}
        {modal.type === 'order-confirmation' && <OrderConfirmation order={modal.order} onDone={() => { setModal(null); goTo('Marketplace'); }} />}
        {modal.type === 'clip-maker' && <ClipMaker onCancel={() => setModal(null)} onCreate={(clip) => { createClip(clip); setModal(null); }} />}
        {modal.type === 'menu' && <NavigationMenu onNavigate={(tab) => { setModal(null); if (tab === 'Guide') setGuideOpen(true); else goTo(tab); }} />}
      </Modal>}
      {isLoading && <LoadingScreen />}
      {guideOpen && !isLoading && <WelcomeGuide onClose={finishGuide} />}
    </div>
  );
}

function MediaCard({ item, onAction, read = false }) {
  return <article className="media-card">
    <div className="media-art" style={{ backgroundImage: `url(https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=700&q=80)` }}>
      <span className="media-tag">{item.label}</span><button className="card-play" aria-label={`${read ? 'Read' : 'Watch'} ${item.title}`} onClick={() => onAction(item)}><Play size={18} fill="currentColor" /></button>
      {item.progress > 0 && <div className="progress-track"><i style={{ width: `${item.progress}%` }} /></div>}
    </div>
    <div className="media-info"><div><h3>{item.title}</h3><p>{item.type} <i>·</i> {item.creator}</p></div><button className="card-arrow" aria-label={`${read ? 'Read' : 'Watch'} ${item.title}`} onClick={() => onAction(item)}><ArrowDownRight size={15} /></button></div>
  </article>;
}

function Leaderboard({ score, onOpen }) {
  return <section className="leaderboard-strip"><div className="leaderboard-icon"><Trophy size={17} /></div><div className="leaderboard-copy"><span className="eyebrow">MONTHLY OPERATOR BOARD</span><strong>Climb the signal.</strong><span>Top 15 creators split the monthly prize pool.</span></div><div className="leaderboard-score"><span>YOUR GS</span><strong>{score.gamerScore.toLocaleString()}</strong></div><button className="text-link" onClick={onOpen}>CAST A VOTE <ChevronRight size={15} /></button></section>;
}

function ProfilePage({ score, waitlistEmail, currentTier, nextTier, progress, unlocked, onTrophies, onLinkSwish, onEditProfile, onWaitlist, allTrophies }) {
  const recent = [...score.achievements].reverse().slice(0, 3).map((item) => achievements.find((achievement) => achievement.id === item.achievementId)).filter(Boolean);
  return <div className="profile-page">
    {!allTrophies && <>
      <section className="profile-hero panel-frame">
        <div className="profile-identity"><div className="avatar avatar-large">{score.handle.slice(1, 2).toUpperCase()}<span className="avatar-presence" /></div><div><span className="eyebrow">OPERATOR ID · 00841</span><h2>{score.handle}</h2><p>Broadcasting from the edge of the feed.</p></div><button className="text-link edit-profile" onClick={onEditProfile}>EDIT PROFILE</button></div>
        <div className="score-display"><span className="score-label">GAMER SCORE</span><strong>{score.gamerScore.toLocaleString()}<i> GS</i></strong><span className={`tier-badge tier-${currentTier.name.toLowerCase()}`}><Shield size={13} /> {currentTier.name.toUpperCase()} OPERATOR</span></div>
        <div className="tier-progress"><div className="tier-progress-label"><span>TIER PROGRESS</span><span>{nextTier ? `${score.gamerScore} / ${nextTier.min} GS` : 'MAX TIER'}</span></div><div className="tier-track"><i style={{ width: `${progress}%` }} /></div><div className="tier-next"><span>{currentTier.name}</span><span>{nextTier ? `${nextTier.name} · ${nextTier.min - score.gamerScore} GS TO GO` : 'DIAMOND ACHIEVED'}</span></div></div>
        <div className="profile-stats">{[['TITLES WATCHED', score.stats.titlesWatched], ['CHAPTERS READ', score.stats.chaptersRead], ['VOTES CAST', score.stats.votesCast], ['PARTIES', score.stats.partiesHosted]].map(([label, value]) => <div key={label}><strong>{value.toString().padStart(2, '0')}</strong><span>{label}</span></div>)}</div>
        <span className="corner-mark corner-one" /><span className="corner-mark corner-two" />
      </section>

      <section className="profile-section"><div className="section-head"><div><span className="eyebrow">PROOF OF PLAY</span><h2>Recent trophies</h2></div><button className="text-link" onClick={onTrophies}>ALL TROPHIES <ArrowUpRight size={14} /></button></div>
        {recent.length ? <div className="recent-trophies">{recent.map((item) => <TrophyCard key={item.id} item={item} unlocked />)}</div> : <div className="empty-trophies"><span className="empty-trophy-icon"><Trophy size={20} /></span><div><strong>No trophies on the board yet.</strong><span>Watch a title, finish a chapter, or cast a monthly vote to earn your first GS.</span></div><span className="empty-zero">0 / {achievements.length}</span></div>}
      </section>

      <section className="bridge-grid"><div className="bridge-card swish-card"><div className="bridge-top"><span className="swish-mark">S</span><span className="eyebrow">CROSS-SIGNAL BRIDGE</span><span className={`link-status ${score.linkedSwish ? 'linked' : ''}`}><i /> {score.linkedSwish ? 'LINKED' : 'NOT LINKED'}</span></div><h3>SWISH <span>·</span> Street Tactics</h3><p>Wins and reads will feed Operator score.</p><button className="button button-outline" onClick={() => { onLinkSwish(); window.open('https://swish-orpin-eight.vercel.app/', '_blank', 'noopener,noreferrer'); }}><Gamepad2 size={15} /> OPEN SWISH <ArrowUpRight size={13} /></button><span className="bridge-orbit">S</span></div>
        <div className="bridge-card store-card"><span className="eyebrow">COMING ONLINE</span><div className="store-glyph"><Disc3 size={22} /><span>DROP_01</span></div><h3>Creator drops.</h3><p>Merch tied to the titles you love. The first drop is in the works.</p><button className="button button-outline" onClick={onWaitlist}>{waitlistEmail ? <><Check size={14} /> ON THE WAITLIST</> : <><Plus size={14} /> JOIN THE WAITLIST</>}</button><span className="store-stripe" /></div></section>
    </>}
    {allTrophies && <section className="trophies-page"><div className="trophy-total"><div><span className="eyebrow">ACHIEVEMENT ARCHIVE</span><h2>Every signal leaves a trace.</h2></div><div><strong>{score.achievements.length}<i> / {achievements.length}</i></strong><span>UNLOCKED</span></div></div><div className="trophy-grid">{achievements.map((item) => <TrophyCard key={item.id} item={item} unlocked={unlocked.has(item.id)} />)}</div><div className="trophy-footnote"><LockKeyhole size={13} /> {achievements.filter((item) => item.comingSoon).length} achievements tied to features coming online.</div></section>}
  </div>;
}

function TrophyCard({ item, unlocked }) {
  return <article className={`trophy-card ${unlocked ? 'unlocked' : 'locked'}`}><span className="trophy-symbol">{unlocked ? item.icon : <LockKeyhole size={18} />}</span><div className="trophy-details"><span className="trophy-category">{item.category}{item.comingSoon && <i> · COMING SOON</i>}</span><h3>{item.name}</h3><p>{item.description}</p></div><strong className="trophy-points">+{item.points}<i> GS</i></strong>{unlocked && <span className="unlock-mark"><Check size={12} /></span>}</article>;
}

function VotePage({ month, votes, voteCounts, onVote }) {
  return <div className="vote-page"><div className="vote-intro"><span className="eyebrow"><span className="status-dot" /> COMMUNITY SIGNAL</span><h2>Put the spotlight<br />where it <em>belongs.</em></h2><p>One vote per category, every month. Back the creators making the signal worth tuning into.</p><div className="vote-prize"><Trophy size={17} /><span><strong>Top 15 creators split the monthly prize pool.</strong><small>Winners announced at the end of {month}.</small></span></div></div>
    {Object.entries(voteEntries).map(([category, entries]) => <section className="vote-category" key={category}><div className="section-head"><div><span className="eyebrow">{month.toUpperCase()} · CATEGORY 0{category === 'comic' ? 1 : 2}</span><h2>{category === 'comic' ? 'Top comics' : 'Top shorts'}</h2></div><span className={`vote-status ${votes[category] ? 'submitted' : ''}`}>{votes[category] ? <><Check size={13} /> VOTE CAST</> : '1 VOTE AVAILABLE'}</span></div><div className="vote-list">{[...entries].sort((a, b) => (voteCounts[b.id] ?? 0) - (voteCounts[a.id] ?? 0)).map((entry, index) => <article className="vote-entry" key={entry.id}><span className="vote-rank">{String(index + 1).padStart(2, '0')}</span><div className="vote-art" style={{ backgroundImage: `url(https://images.unsplash.com/${entry.image}?auto=format&fit=crop&w=220&q=75)` }} /><div className="vote-entry-copy"><strong>{entry.title}</strong><span>by {entry.creator}</span></div><span className="vote-count">{(voteCounts[entry.id] ?? 0).toLocaleString()} <i>VOTES</i></span><button className={`button vote-button ${votes[category] === entry.id ? 'voted' : ''}`} disabled={Boolean(votes[category])} onClick={() => onVote(category, entry)}>{votes[category] === entry.id ? <><Check size={14} /> VOTED</> : 'VOTE'}</button></article>)}</div></section>)}
    <div className="top15-note"><span>01—15</span><p><strong>Top 15 · {month}</strong><br />Creators split the monthly prize pool. Every vote pushes the work forward.</p><Sparkles size={17} /></div>
  </div>;
}

function SocialPage({ posts, likedPosts, handle, onPost, onToggleLike, onDeletePost, onShare, onRead }) {
  const [draft, setDraft] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMedia, setShowMedia] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onPost(draft.trim(), mediaUrl.trim());
    setDraft('');
    setMediaUrl('');
    setShowMedia(false);
  };
  const feedItems = [
    ...posts.map((post) => ({ ...post, sample: false })),
    { id: 'sample-afterimage', content: 'Panels from chapter 04 are finally out in the world. Took three rewrites to get the silence right. Hope it finds you. #Afterimage', createdAt: new Date(Date.now() - 7200000).toISOString(), handle: '@junovale', sample: true, mediaUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80', likes: 248 },
  ];
  return <div className="social-page"><div className="social-banner"><div><span className="eyebrow">OPEN FREQUENCY / COMMUNITY FEED</span><h2>Broadcast <em>something.</em></h2><p>Shorts, panels, field notes. Make a little noise.</p></div><span className="social-wave">〰</span></div>
    <form className="composer panel-frame" onSubmit={submit}><span className="avatar">{handle.slice(1, 2).toUpperCase()}</span><div className="composer-body"><span className="eyebrow">NEW TRANSMISSION</span><textarea value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 500))} placeholder="What are you making?" aria-label="Write a post" maxLength={500} required /><div className="composer-actions"><button type="button" className={`text-link ${showMedia ? 'media-active' : ''}`} onClick={() => setShowMedia((value) => !value)}><Video size={15} /> {showMedia ? 'REMOVE MEDIA' : 'ADD MEDIA'}</button><span className="composer-counter">{draft.length} / 500</span><button className="button button-cyan" disabled={!draft.trim()}><Send size={14} /> PUBLISH SIGNAL</button></div>{showMedia && <input className="media-url-input" type="url" value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} placeholder="Paste an image URL (optional)" aria-label="Image URL" />}</div></form>
    {feedItems.map((post) => {
      const liked = likedPosts.includes(post.id);
      const ownPost = !post.sample && post.handle === handle;
      return <article className="feed-post" id={`post-${post.id}`} key={post.id}><div className="post-head"><span className="avatar avatar-small">{post.handle.slice(1, 2).toUpperCase()}</span><div><strong>{post.handle} {post.sample && <span>✦</span>}</strong><small>{post.sample ? 'CREATOR · ' : 'YOU · '}{new Date(post.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</small></div>{ownPost && <button className="icon-button delete-post" aria-label="Delete post" onClick={() => onDeletePost(post.id)}><X size={15} /></button>}</div><p className="post-copy">{post.content}</p>{post.mediaUrl && <img className="post-image" src={post.mediaUrl} alt="Attached creator media" loading="lazy" />}
        <div className="post-actions"><button className={liked ? 'liked' : ''} onClick={() => onToggleLike(post.id)} aria-pressed={liked}><Heart size={15} fill={liked ? 'currentColor' : 'none'} /> {(post.likes ?? 0) + (liked ? 1 : 0)}</button><button onClick={onRead}><BookOpen size={15} /> READ CHAPTER</button><button onClick={() => onShare(post.id)}><Share2 size={14} /> SHARE</button><span>{post.sample ? 'AFTERIMAGE · CH 04' : 'OPERATOR POST'}</span></div>
      </article>;
    })}
  </div>;
}

function PartiesPage({ rooms, onHost, onJoin }) {
  return <div className="parties-page"><div className="social-banner party-banner"><div><span className="eyebrow">WATCH TOGETHER / READ TOGETHER</span><h2>Same story.<br /><em>Shared signal.</em></h2><p>Drop into a room and make a night of it.</p></div><Users size={78} strokeWidth={1} /></div><div className="party-toolbar"><div><span className="status-dot" /> {rooms.length.toString().padStart(2, '0')} ROOMS ACTIVE</div><button className="button button-cyan" onClick={onHost}><Plus size={15} /> HOST A PARTY</button></div><div className="party-list">{rooms.map((room) => <article className="party-row" key={room.id}><div className={`party-live-icon ${room.color}`}><Headphones size={18} /></div><div className="party-row-main"><span className="eyebrow">{room.type} <i>·</i> HOSTED BY {room.host}</span><h3>{room.title}</h3></div><span className="party-occupancy"><Users size={14} /> {room.members} / {room.capacity}</span><button className="button button-outline" disabled={!room.joined && room.members >= room.capacity} onClick={() => room.joined ? onJoin({ ...room, openOnly: true }) : onJoin(room)}>{room.joined ? 'OPEN ROOM' : room.members >= room.capacity ? 'ROOM FULL' : 'JOIN ROOM'} <ArrowUpRight size={13} /></button></article>)}</div></div>;
}

function EmptyState({ title, detail }) {
  return <div className="empty-state"><Compass size={20} /><strong>{title}</strong><span>{detail}</span></div>;
}

function Modal({ children, onClose }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal-shell" role="dialog" aria-modal="true" aria-label="GLITCH TV dialog"><button className="modal-close icon-button" onClick={onClose} aria-label="Close dialog"><X size={17} /></button>{children}</section></div>;
}

function MediaExperience({ item, mode, progress = 0, readProgress = 1, onReadProgress, completed = false, onProgress, onComplete }) {
  const isRead = mode === 'read';
  const [page, setPage] = useState(readProgress);
  useEffect(() => setPage(readProgress), [readProgress, item.id]);
  const changePage = (nextPage) => {
    const boundedPage = Math.max(1, Math.min(3, nextPage));
    setPage(boundedPage);
    onReadProgress?.(boundedPage);
  };
  const pages = [
    `${item.title} opens on a city that never learned how to sleep. Above the transit line, a single signal blinks out of rhythm with every other light.`,
    `The message has no sender, no timestamp, no trace in the network. Only a route through the old district, where the cameras stopped watching years ago.`,
    `At the edge of the frame, someone looks up. The signal changes. For the first time tonight, the city goes quiet.`,
  ];
  return <div className={`media-experience ${isRead ? 'reader-experience' : ''}`}><span className="eyebrow">{isRead ? 'READING MODE / CHAPTER 01' : 'PLAYBACK MODE / DEMO TITLE'}</span><h2>{item.title}</h2><p className="media-byline">{item.type} <i>·</i> {item.creator}</p>
    {isRead ? <div className="reader-content"><span className="reader-page-count">PAGE {String(page).padStart(2, '0')} / 03</span><p>{pages[page - 1]}</p><div className="reader-controls"><button className="button button-outline" disabled={page === 1} onClick={() => changePage(page - 1)}>PREVIOUS</button><button className="button button-outline" disabled={page === pages.length} onClick={() => changePage(page + 1)}>NEXT PAGE <ChevronRight size={13} /></button></div></div>
      : <div className="playback-preview" style={{ backgroundImage: `linear-gradient(0deg, #08080ed9, #09091016), url(https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=1100&q=80)` }}><span className="playback-label"><Radio size={14} /> GLITCH ORIGINAL / PREVIEW</span><span className="playback-title">{item.title}</span></div>}
    {!isRead && <div className="playback-progress"><div className="tier-progress-label"><span>PLAYBACK POSITION</span><span>{progress}%</span></div><input aria-label="Playback position" type="range" min="0" max="100" step="5" value={progress} onChange={(event) => onProgress(Number(event.target.value))} /></div>}
    <div className="experience-footer"><span>{isRead ? (completed ? 'CHAPTER PREVIOUSLY COMPLETED' : `PAGE ${page} OF ${pages.length}`) : 'DEMO CONTENT · PROGRESS SAVES LOCALLY'}</span><button className="button button-cyan" onClick={onComplete} disabled={isRead && completed}>{isRead ? completed ? <><Check size={14} /> COMPLETED</> : <><BookOpen size={14} /> MARK CHAPTER READ</> : <><Check size={14} /> COMPLETE TITLE</>}</button></div>
  </div>;
}

function PartyForm({ onCancel, onSubmit }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('WATCH PARTY');
  const [capacity, setCapacity] = useState('12');
  return <form className="dialog-form" onSubmit={(event) => { event.preventDefault(); onSubmit({ title: title.trim(), type, capacity: Number(capacity) }); }}><span className="eyebrow">NEW ROOM / PARTY CHANNEL</span><h2>Host a party.</h2><label>ROOM TITLE<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Neon Veil · Episode 04" maxLength={60} required /></label><div className="form-row"><label>ROOM TYPE<select value={type} onChange={(event) => setType(event.target.value)}><option>WATCH PARTY</option><option>READ PARTY</option></select></label><label>CAPACITY<select value={capacity} onChange={(event) => setCapacity(event.target.value)}><option value="8">8 operators</option><option value="12">12 operators</option><option value="20">20 operators</option></select></label></div><div className="form-actions"><button type="button" className="button button-outline" onClick={onCancel}>CANCEL</button><button className="button button-cyan"><Plus size={14} /> CREATE ROOM</button></div></form>;
}

function PartyRoom({ room, onLeave }) {
  return <div className="party-room-dialog"><span className="eyebrow"><span className="status-dot" /> PARTY CHANNEL / LIVE</span><h2>{room.title}</h2><p>Hosted by {room.host}. The room is ready for your crew.</p><div className="room-details"><div><Users size={16} /><span>{room.members} / {room.capacity} operators</span></div><div><Headphones size={16} /><span>{room.type === 'READ PARTY' ? 'Shared reading room' : 'Watch party room'}</span></div><div><Radio size={16} /><span>Local demo room · no audio/video sync</span></div></div><button className="button button-outline" onClick={onLeave}><LogOut size={14} /> LEAVE ROOM</button></div>;
}

function WaitlistForm({ email, onSubmit }) {
  const [value, setValue] = useState(email);
  return <form className="dialog-form" onSubmit={(event) => { event.preventDefault(); onSubmit(value.trim()); }}><span className="eyebrow">CREATOR DROPS / EARLY ACCESS</span><h2>{email ? 'Update your signal.' : 'Get on the list.'}</h2><p>We’ll save your interest on this device for now. No payment or account connection.</p><label>EMAIL ADDRESS<input autoFocus type="email" value={value} onChange={(event) => setValue(event.target.value)} placeholder="you@example.com" required /></label><div className="form-actions"><button className="button button-cyan"><Check size={14} /> {email ? 'UPDATE WAITLIST' : 'JOIN WAITLIST'}</button></div></form>;
}

function ProfileForm({ handle, onSubmit }) {
  const [value, setValue] = useState(handle);
  return <form className="dialog-form" onSubmit={(event) => { event.preventDefault(); onSubmit(value); }}><span className="eyebrow">OPERATOR SETTINGS</span><h2>Edit profile.</h2><label>HANDLE<input autoFocus value={value} onChange={(event) => setValue(event.target.value)} placeholder="@yourhandle" maxLength={21} required /></label><p>Your handle is stored in this browser’s local profile.</p><div className="form-actions"><button className="button button-cyan"><Check size={14} /> SAVE PROFILE</button></div></form>;
}

function Notifications({ score, posts, onClose }) {
  const recentUnlocks = [...score.achievements].reverse().slice(0, 3).map((unlock) => achievements.find((item) => item.id === unlock.achievementId)).filter(Boolean);
  return <div className="notifications-dialog"><span className="eyebrow">INBOX / SYSTEM SIGNALS</span><h2>Notifications.</h2><div className="notification-list">{recentUnlocks.map((item) => <div className="notification-item" key={item.id}><Trophy size={16} /><span><strong>Trophy unlocked · {item.name}</strong><small>+{item.points} Gamer Score added to your profile.</small></span></div>)}{posts.length > 0 && <div className="notification-item"><Radio size={16} /><span><strong>Your transmission is live</strong><small>{posts.length} {posts.length === 1 ? 'post' : 'posts'} published from this operator.</small></span></div>}{recentUnlocks.length === 0 && posts.length === 0 && <EmptyState title="All clear" detail="Your operator activity will appear here." />}</div><button className="button button-outline" onClick={onClose}>CLOSE INBOX</button></div>;
}

function NavigationMenu({ onNavigate }) {
  return <div className="navigation-dialog"><span className="eyebrow">QUICK ACCESS</span><h2>Choose a frequency.</h2><div className="navigation-menu-items">{[...navItems, { label: 'Monthly Vote', icon: Trophy }, { label: 'Profile', icon: Shield }, { label: 'Guide', icon: Sparkles }].map(({ label, icon: Icon }) => <button key={label} onClick={() => onNavigate(label)}><Icon size={17} />{label}<ChevronRight size={14} /></button>)}</div></div>;
}

function LoadingScreen() {
  return <div className="boot-screen" role="status" aria-label="Loading GLITCH TV"><div className="boot-brand"><Disc3 size={34} /><span>GLITCH<span>TV</span></span></div><div className="boot-signal"><i /></div><div className="boot-caption"><span>ESTABLISHING SIGNAL</span><span>GLITCH NETWORK / 01</span></div></div>;
}

const guideSlides = [
  { eyebrow: 'WELCOME TO THE UNDERGROUND', title: <>Stories break<br />through here.</>, body: 'GLITCH is an independent story network for comics, short films, and original series from creators working outside the usual channels.', image: 'photo-1519608487953-e999c86e7455', label: 'INDEPENDENT STORIES · ONE SIGNAL' },
  { eyebrow: '01 / DISCOVER', title: <>Find your next<br />rabbit hole.</>, body: 'Explore the watch and read catalog, follow what is trending, pick up where you stopped, and discover new voices by genre.', image: 'photo-1535223289827-42f1e9919769', label: 'WATCH · READ · FOLLOW' },
  { eyebrow: '02 / MAKE & SHARE', title: <>Make noise.<br />Bring people in.</>, body: 'Post a signal, follow creator updates, and host a watch or read party with the community.', image: 'photo-1516280440614-37939bbacd81', label: 'SOCIAL · PARTIES' },
  { eyebrow: '03 / SUPPORT CREATORS', title: <>Your attention<br />has a signal.</>, body: 'Vote for monthly favorites, earn Gamer Score, and shop creator-linked drops. Future sponsor-funded programs could send more value back to the creators.', image: 'photo-1513364776144-60967b0f800f', label: 'VOTE · EARN · SHOP' },
];

function WelcomeGuide({ onClose }) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef(null);
  const slide = guideSlides[index];
  const previous = () => setIndex((current) => Math.max(0, current - 1));
  const next = () => index === guideSlides.length - 1 ? onClose() : setIndex((current) => current + 1);
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') next();
    if (event.key === 'ArrowLeft') previous();
  };
  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 50) delta < 0 ? next() : previous();
    touchStart.current = null;
  };
  return <div className="guide-backdrop" onKeyDown={handleKeyDown} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={handleTouchEnd}>
    <section className="guide-panel" aria-label="GLITCH TV getting started guide">
      <div className="guide-visual" style={{ backgroundImage: `linear-gradient(0deg, #09070fc9, #09070f13 80%), url(https://images.unsplash.com/${slide.image}?auto=format&fit=crop&w=1300&q=85)` }}><span className="guide-visual-label">{slide.label}</span><span className="guide-orbit">G</span></div>
      <div className="guide-content"><div className="guide-topline"><span className="eyebrow">{slide.eyebrow}</span><button className="guide-close" onClick={onClose}>SKIP <X size={14} /></button></div><div className="guide-copy" key={index}><h2>{slide.title}</h2><p>{slide.body}</p></div><div className="guide-footer"><div className="guide-pagination"><span>{String(index + 1).padStart(2, '0')}</span><div>{guideSlides.map((item, slideIndex) => <button key={item.eyebrow} className={slideIndex === index ? 'active' : ''} onClick={() => setIndex(slideIndex)} aria-label={`Go to guide page ${slideIndex + 1}`} />)}</div><span>{String(guideSlides.length).padStart(2, '0')}</span></div><div className="guide-controls">{index > 0 && <button className="guide-arrow guide-back" onClick={previous} aria-label="Previous guide page"><ChevronLeft size={19} /></button>}<button className="button button-cyan guide-next" onClick={next}>{index === guideSlides.length - 1 ? 'ENTER GLITCH' : 'NEXT'} {index === guideSlides.length - 1 ? <ArrowRight size={15} /> : <ChevronRight size={15} />}</button></div></div></div>
    </section>
  </div>;
}

function MarketplacePage({ cart, orders, onAdd, onOpenCart }) {
  const [category, setCategory] = useState('ALL DROPS');
  const categories = ['ALL DROPS', 'APPAREL', 'PRINT', 'OBJECTS'];
  const products = category === 'ALL DROPS' ? merchProducts : merchProducts.filter((item) => item.category === category);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  return <div className="marketplace-page"><section className="market-hero"><div><span className="eyebrow">GLITCH MARKET / CREATOR-LED GOODS</span><h2>Keep a piece<br />of the <em>signal.</em></h2><p>Limited drops connected to the stories and creators you follow.</p></div><div className="market-bag"><ShoppingBag size={26} /><span>DROP_01 / NO CHECKOUT GATE</span></div></section>
    <div className="market-toolbar"><div className="market-filters">{categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><button className="button button-outline market-cart-button" onClick={onOpenCart}><ShoppingCart size={15} /> DROP BAG <span>{cartCount}</span></button></div>
    <div className="market-grid">{products.map((product, index) => { const quantity = cart.find((item) => item.productId === product.id)?.quantity ?? 0; return <article className="product-card" key={product.id}><div className={`product-art product-art-${index % 4}`} style={{ backgroundImage: `linear-gradient(0deg, #08070bd0, #08070b08 62%), url(https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=900&q=80)` }}><span>{product.category}</span><span className="product-edition">GLITCH DROP / 0{index + 1}</span></div><div className="product-info"><div><span className="eyebrow">BY {product.creator.toUpperCase()}</span><h3>{product.title}</h3><p>{product.description}</p></div><div className="product-purchase"><strong>${product.price}</strong><button className="button button-cyan" onClick={() => onAdd(product)}>{quantity ? <><Check size={13} /> IN BAG · {quantity}</> : <><Plus size={13} /> ADD TO BAG</>}</button></div></div></article>; })}</div>
    <section className="market-terms"><CircleDollarSign size={19} /><div><strong>Creator-linked by design.</strong><span>Each drop is presented with its creator. Orders and checkout are local demos; no payment is collected and nothing ships in this preview.</span></div><Sparkles size={15} /></section>
    {orders.length > 0 && <section className="market-orders"><span className="eyebrow">LOCAL DEMO RECEIPTS</span><h3>Your recent orders</h3>{orders.slice(0, 3).map((order) => <div key={order.id}><span>{order.id}</span><span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span><strong>${order.total.toFixed(2)}</strong></div>)}</section>}
  </div>;
}

function MarketCart({ cart, onQuantity, onCheckout, onClose }) {
  const lines = cart.map((line) => ({ ...line, product: merchProducts.find((product) => product.id === line.productId) })).filter((line) => line.product);
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  return <div className="market-cart-dialog"><span className="eyebrow">GLITCH MARKET / YOUR BAG</span><h2>Drop bag.</h2>{lines.length ? <div className="cart-lines">{lines.map((line) => <div className="cart-line" key={line.productId}><div className="cart-thumb" style={{ backgroundImage: `url(https://images.unsplash.com/${line.product.image}?auto=format&fit=crop&w=200&q=75)` }} /><div className="cart-description"><strong>{line.product.title}</strong><span>${line.product.price} · {line.product.creator}</span><div className="cart-quantity"><button onClick={() => onQuantity(line.productId, line.quantity - 1)} aria-label="Decrease quantity"><Minus size={12} /></button><span>{line.quantity}</span><button onClick={() => onQuantity(line.productId, line.quantity + 1)} aria-label="Increase quantity"><Plus size={12} /></button></div></div><strong className="cart-line-total">${(line.product.price * line.quantity).toFixed(2)}</strong></div>)}</div> : <div className="cart-empty"><ShoppingBag size={22} /><strong>Your drop bag is empty.</strong><span>Explore the latest creator drops.</span></div>}
    <div className="cart-total"><span>DEMO ORDER TOTAL</span><strong>${total.toFixed(2)}</strong></div><p className="cart-disclaimer">Preview only. No payment details are requested and no order will be fulfilled.</p><div className="form-actions"><button className="button button-outline" onClick={onClose}>KEEP BROWSING</button><button className="button button-cyan" onClick={onCheckout} disabled={!lines.length}><Check size={14} /> PLACE DEMO ORDER</button></div></div>;
}

function OrderConfirmation({ order, onDone }) {
  return <div className="order-confirmation"><span className="order-check"><Check size={22} /></span><span className="eyebrow">LOCAL DEMO RECEIPT</span><h2>Drop secured.</h2><p>Order <strong>{order.id}</strong> is saved in this browser.</p><div><span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span><strong>${order.total.toFixed(2)}</strong></div><small>No charge was made. This preview does not ship products.</small><button className="button button-cyan" onClick={onDone}>BACK TO MARKET <ArrowRight size={14} /></button></div>;
}

function ClippingPage({ clips, onCreate, onDelete, onShare }) {
  return <div className="clipping-page"><section className="clip-hero"><div><span className="eyebrow">GLITCH CLIPS / CREATOR ECONOMY</span><h2>Make the moment<br /><em>travel.</em></h2><p>Find a scene worth sharing. Set the in and out points. Give the story a second life in the feed.</p><button className="button button-cyan" onClick={onCreate}><Scissors size={15} /> CREATE A CLIP</button></div><div className="clip-frame"><img src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=750&q=85" alt="Abstract signal lights used as a demo clipping frame" /><span className="clip-frame-label"><Radio size={13} /> CLIP PREVIEW</span><span className="clip-timeline"><i /><i /><i /></span></div></section>
    <section className="clip-how"><div className="section-head"><div><span className="eyebrow">THREE STEPS TO A SIGNAL BOOST</span><h2>How clipping works</h2></div><span className="clip-beta">BETA / LOCAL DEMO</span></div><div className="clip-steps"><article><span>01</span><Scissors size={18} /><h3>Pick a title</h3><p>Choose a GLITCH story and find the scene you want people to discover.</p></article><article><span>02</span><Clock3 size={18} /><h3>Mark the moment</h3><p>Set in and out points for a short excerpt. Keep it focused and credit the source.</p></article><article><span>03</span><Share2 size={18} /><h3>Publish & track</h3><p>Share a clip card that links back to the original. Future attribution can track views and watch-through.</p></article></div></section>
    <section className="clip-economy"><div className="economy-heading"><span className="eyebrow">ILLUSTRATIVE MODEL / NOT LIVE PAYOUTS</span><h2>Good clips should<br />send value back.</h2><p>A future campaign pool could be funded by sponsors or platform revenue, then split among the people who made and moved the story.</p></div><div className="revenue-split"><div className="split-total"><span>EXAMPLE CAMPAIGN POOL</span><strong>$1,000</strong></div><div className="split-row"><span><i className="split-clipper" />CLIP CREATOR</span><strong>70%</strong></div><div className="split-meter"><i style={{ width: '70%' }} /></div><div className="split-row"><span><i className="split-rights" />ORIGINAL CREATOR / RIGHTS</span><strong>20%</strong></div><div className="split-meter"><i className="rights-meter" style={{ width: '20%' }} /></div><div className="split-row"><span><i className="split-platform" />PLATFORM OPERATIONS</span><strong>10%</strong></div><div className="split-meter"><i className="platform-meter" style={{ width: '10%' }} /></div><small>Example split only. Real rates, rights permissions, and payouts would require contracts and a backend.</small></div></section>
    <section className="clip-library"><div className="section-head"><div><span className="eyebrow">YOUR CLIPBOARD</span><h2>Published clips <span className="clip-count">{clips.length.toString().padStart(2, '0')}</span></h2></div></div>{clips.length ? <div className="clip-list">{clips.map((clip) => { const title = titles.find((item) => item.id === clip.titleId); return <article id={clip.id} className="clip-item" key={clip.id}><div className="clip-item-art" style={{ backgroundImage: `url(https://images.unsplash.com/${title?.image ?? titles[0].image}?auto=format&fit=crop&w=420&q=75)` }}><span>{Math.floor(clip.start / 60).toString().padStart(2, '0')}:{(clip.start % 60).toString().padStart(2, '0')} — {Math.floor(clip.end / 60).toString().padStart(2, '0')}:{(clip.end % 60).toString().padStart(2, '0')}</span></div><div className="clip-item-copy"><span className="eyebrow">{clip.status} · {new Date(clip.createdAt).toLocaleDateString()}</span><h3>{title?.title ?? 'GLITCH TITLE'}</h3><span>CLIP / {clip.id.slice(-7).toUpperCase()}</span></div><button className="icon-button" onClick={() => onShare(clip.id)} aria-label="Share clip"><Share2 size={15} /></button><button className="icon-button" onClick={() => onDelete(clip.id)} aria-label="Delete clip"><Trash2 size={15} /></button></article>; })}</div> : <div className="clip-empty"><Scissors size={21} /><div><strong>No clips yet.</strong><span>Make your first clip card from a title in the catalog.</span></div><button className="text-link" onClick={onCreate}>CREATE CLIP <ArrowRight size={14} /></button></div>}</section>
    <p className="clip-limit-note"><Info size={13} /> Current clips save time markers and a share card only. Source media, rendering, rights verification, and payouts are not connected in this MVP.</p>
  </div>;
}

function ClipMaker({ onCancel, onCreate }) {
  const [titleId, setTitleId] = useState(titles.find((item) => item.type.includes('SHORT'))?.id ?? titles[0].id);
  const [start, setStart] = useState('12');
  const [end, setEnd] = useState('42');
  const [error, setError] = useState('');
  const options = titles.filter((item) => item.type.includes('SHORT') || item.type.includes('SERIES'));
  const submit = (event) => {
    event.preventDefault();
    const startValue = Number(start);
    const endValue = Number(end);
    if (startValue < 0 || endValue <= startValue) return setError('End time must be after the clip start.');
    if (endValue - startValue > 60) return setError('Keep clips to 60 seconds or less.');
    setError('');
    onCreate({ titleId, start: startValue, end: endValue });
  };
  return <form className="dialog-form clip-maker-form" onSubmit={submit}><span className="eyebrow">CLIP STUDIO / NEW CLIP</span><h2>Mark the moment.</h2><p>Choose a source and set a clip range. This demo saves clip metadata only; it does not download or render video.</p><label>SOURCE TITLE<select value={titleId} onChange={(event) => setTitleId(event.target.value)}>{options.map((item) => <option key={item.id} value={item.id}>{item.title} · {item.type}</option>)}</select></label><div className="clip-maker-preview"><Scissors size={18} /><span>IN/OUT MARKERS ONLY</span><div><i style={{ left: `${Math.min(Number(start), 100)}%` }} /><b style={{ left: `${Math.min(Number(end), 100)}%` }} /></div></div><div className="form-row"><label>IN POINT · SECONDS<input type="number" min="0" max="599" value={start} onChange={(event) => setStart(event.target.value)} required /></label><label>OUT POINT · SECONDS<input type="number" min="1" max="600" value={end} onChange={(event) => setEnd(event.target.value)} required /></label></div>{error && <span className="form-error" role="alert">{error}</span>}<div className="form-actions"><button type="button" className="button button-outline" onClick={onCancel}>CANCEL</button><button className="button button-cyan"><Scissors size={14} /> SAVE CLIP CARD</button></div></form>;
}

export default App;