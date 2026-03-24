<script>
  import { onMount } from 'svelte';
  import { fetchListings, getUniqueCountries, currentEnv, environments } from './lib/api.js';
  import ListingCard from './lib/ListingCard.svelte';
  import FilterPanel from './lib/FilterPanel.svelte';

  let listings = [];
  let filteredListings = [];
  let countries = [];
  let loading = true;
  let error = null;
  let currentFilter = {};
  let currentPage = 0;
  const pageSize = 20;
  let selectedEnv;
  currentEnv.subscribe(v => selectedEnv = v);

  onMount(async () => {
    await loadListings();
  });

  async function switchEnv(env) {
    currentEnv.set(env);
    await loadListings();
  }

  async function loadListings(filter = {}) {
    loading = true;
    error = null;
    try {
      listings = await fetchListings(filter, 0, 100);
      countries = getUniqueCountries(listings);
      applyLocalFilters(filter);
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function applyLocalFilters(filter = {}) {
    let result = [...listings];

    if (filter.country) {
      result = result.filter(l => l.country === filter.country);
    }
    if (filter.status) {
      result = result.filter(l => l.status === filter.status);
    }
    if (filter.min_cores) {
      result = result.filter(l => (l.total_resources?.cru || 0) >= filter.min_cores);
    }
    if (filter.min_ram_gb) {
      const minBytes = filter.min_ram_gb * 1024 * 1024 * 1024;
      result = result.filter(l => (l.total_resources?.mru || 0) >= minBytes);
    }
    if (filter.max_price_hourly) {
      result = result.filter(l => (l.pricing?.on_demand_hourly || 0) <= filter.max_price_hourly);
    }

    filteredListings = result;
    currentPage = 0;
  }

  function handleFilter(event) {
    currentFilter = event.detail;
    applyLocalFilters(currentFilter);
  }

  $: paginatedListings = filteredListings.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  $: totalPages = Math.ceil(filteredListings.length / pageSize);
</script>

<div class="app">
  <header class="header">
    <div class="header-content">
      <a href="/" class="logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12" stroke="#34d399" stroke-width="2"/>
          <circle cx="14" cy="14" r="6" fill="#34d399"/>
        </svg>
        <span class="logo-text">Marketplace</span>
      </a>
      <nav class="nav">
        <a href="/" class="nav-link active">Browse</a>
        <a href="/" class="nav-link">Docs</a>
      </nav>
    </div>
  </header>

  <main class="main">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-line">Choose</span>
          <span class="title-line accent">Decent.</span>
        </h1>
        <p class="hero-subtitle">
          Decentralized compute infrastructure. Verifiable deployment. 
          No extraction.
        </p>
      </div>
      <div class="hero-grid"></div>
    </section>

    <section class="listings-section">
      <div class="listings-layout">
        <FilterPanel 
          {countries} 
          totalCount={filteredListings.length}
          on:filter={handleFilter}
        />

        <div class="listings-content">
          {#if loading}
            <div class="loading">
              <div class="loading-spinner"></div>
              <span>Loading listings...</span>
            </div>
          {:else if error}
            <div class="error">
              <span>Error: {error}</span>
              <button on:click={() => loadListings(currentFilter)}>Retry</button>
            </div>
          {:else if filteredListings.length === 0}
            <div class="empty">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="#6b7280" stroke-width="2" stroke-dasharray="4 4"/>
                <path d="M18 24h12M24 18v12" stroke="#6b7280" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <p>No listings match your filters</p>
            </div>
          {:else}
            <div class="listings-grid">
              {#each paginatedListings as listing (listing.listing_id)}
                <ListingCard {listing} />
              {/each}
            </div>

            {#if totalPages > 1}
              <nav class="pagination">
                <button 
                  class="page-btn" 
                  disabled={currentPage === 0}
                  on:click={() => currentPage--}
                >
                  Previous
                </button>
                
                <span class="page-info">
                  Page {currentPage + 1} of {totalPages}
                </span>
                
                <button 
                  class="page-btn"
                  disabled={currentPage >= totalPages - 1}
                  on:click={() => currentPage++}
                >
                  Next
                </button>
              </nav>
            {/if}
          {/if}
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-content">
      <div class="env-switcher">
        <span class="env-label">Source:</span>
        <div class="env-buttons">
          <button 
            class="env-btn" 
            class:active={selectedEnv === 'dev'}
            on:click={() => switchEnv('dev')}
          >dev</button>
          <button 
            class="env-btn" 
            class:active={selectedEnv === 'test'}
            on:click={() => switchEnv('test')}
          >test</button>
          <button 
            class="env-btn" 
            class:active={selectedEnv === 'prod'}
            on:click={() => switchEnv('prod')}
          >prod</button>
        </div>
      </div>
      <span class="footer-sep">|</span>
      <span class="footer-text">Built on Holochain</span>
      <span class="footer-sep">|</span>
      <span class="footer-text">MIT Licensed</span>
    </div>
  </footer>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0f;
    color: #e5e7eb;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    border-bottom: 1px solid rgba(55, 65, 81, 0.4);
    background: rgba(10, 10, 15, 0.9);
    backdrop-filter: blur(12px);
  }

  .header-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .logo-text {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 18px;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .nav {
    display: flex;
    gap: 24px;
  }

  .nav-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #9ca3af;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .nav-link:hover,
  .nav-link.active {
    color: #34d399;
  }

  .main {
    flex: 1;
    padding-top: 56px;
  }

  .hero {
    position: relative;
    padding: 80px 20px 60px;
    overflow: hidden;
    border-bottom: 1px solid rgba(55, 65, 81, 0.3);
  }

  .hero-content {
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(48px, 10vw, 80px);
    line-height: 1;
    margin-bottom: 20px;
  }

  .title-line {
    display: block;
    color: #ffffff;
  }

  .title-line.accent {
    font-style: italic;
    color: #34d399;
  }

  .hero-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 18px;
    color: #9ca3af;
    max-width: 500px;
    line-height: 1.6;
  }

  .hero-grid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 1px 1px, rgba(52, 211, 153, 0.08) 1px, transparent 0);
    background-size: 32px 32px;
    mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
  }

  .listings-section {
    padding: 40px 20px 60px;
  }

  .listings-layout {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 32px;
  }

  @media (max-width: 900px) {
    .listings-layout {
      grid-template-columns: 1fr;
    }
  }

  .listings-content {
    min-height: 400px;
  }

  .listings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .loading,
  .error,
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 80px 20px;
    text-align: center;
  }

  .loading {
    color: #9ca3af;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(52, 211, 153, 0.2);
    border-top-color: #34d399;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error {
    color: #f87171;
  }

  .error button {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    padding: 8px 16px;
    background: rgba(248, 113, 113, 0.2);
    border: 1px solid #f87171;
    border-radius: 6px;
    color: #f87171;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .error button:hover {
    background: rgba(248, 113, 113, 0.3);
  }

  .empty {
    color: #6b7280;
  }

  .empty p {
    font-size: 14px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(55, 65, 81, 0.3);
  }

  .page-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 10px 20px;
    background: rgba(31, 41, 55, 0.6);
    border: 1px solid rgba(55, 65, 81, 0.5);
    border-radius: 6px;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-btn:hover:not(:disabled) {
    border-color: #34d399;
    color: #34d399;
  }

  .page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .page-info {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #6b7280;
  }

  .footer {
    border-top: 1px solid rgba(55, 65, 81, 0.4);
    padding: 24px 20px;
  }

  .footer-content {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .env-switcher {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .env-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #4b5563;
  }

  .env-buttons {
    display: flex;
    gap: 4px;
    background: rgba(17, 24, 39, 0.6);
    padding: 3px;
    border-radius: 5px;
  }

  .env-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 4px 10px;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .env-btn:hover {
    color: #9ca3af;
  }

  .env-btn.active {
    background: rgba(52, 211, 153, 0.15);
    color: #34d399;
  }

  .footer-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7280;
  }

  .footer-sep {
    color: #374151;
  }
</style>
