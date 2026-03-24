<script>
  import { createEventDispatcher } from 'svelte';

  export let countries = [];
  export let totalCount = 0;

  const dispatch = createEventDispatcher();

  let filters = {
    country: '',
    status: '',
    minCores: '',
    minRam: '',
    maxPrice: ''
  };

  function applyFilters() {
    const filterObj = {};

    if (filters.country) {
      filterObj.country = filters.country;
    }
    if (filters.status) {
      filterObj.status = filters.status;
    }
    if (filters.minCores) {
      filterObj.min_cores = parseInt(filters.minCores);
    }
    if (filters.minRam) {
      filterObj.min_ram_gb = parseInt(filters.minRam);
    }
    if (filters.maxPrice) {
      filterObj.max_price_hourly = parseFloat(filters.maxPrice) * 1e7;
    }

    dispatch('filter', filterObj);
  }

  function clearFilters() {
    filters = {
      country: '',
      status: '',
      minCores: '',
      minRam: '',
      maxPrice: ''
    };
    dispatch('filter', {});
  }

  $: hasFilters = filters.country || filters.status || filters.minCores || filters.minRam || filters.maxPrice;
</script>

<aside class="filter-panel">
  <header class="filter-header">
    <h2 class="filter-title">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      Filters
    </h2>
    {#if hasFilters}
      <button class="clear-btn" on:click={clearFilters}>Clear</button>
    {/if}
  </header>

  <div class="filter-group">
    <label class="filter-label" for="country">Location</label>
    <select id="country" class="filter-select" bind:value={filters.country} on:change={applyFilters}>
      <option value="">All Countries</option>
      {#each countries as country}
        <option value={country}>{country}</option>
      {/each}
    </select>
  </div>

  <div class="filter-group">
    <label class="filter-label" for="status">Status</label>
    <select id="status" class="filter-select" bind:value={filters.status} on:change={applyFilters}>
      <option value="">Any Status</option>
      <option value="Active">Active</option>
      <option value="Reserved">Reserved</option>
      <option value="Offline">Offline</option>
    </select>
  </div>

  <div class="filter-divider"></div>

  <div class="filter-group">
    <label class="filter-label" for="minCores">Min CPU Cores</label>
    <input 
      type="number" 
      id="minCores" 
      class="filter-input" 
      placeholder="Any" 
      bind:value={filters.minCores} 
      on:change={applyFilters}
    />
  </div>

  <div class="filter-group">
    <label class="filter-label" for="minRam">Min RAM (GB)</label>
    <input 
      type="number" 
      id="minRam" 
      class="filter-input" 
      placeholder="Any" 
      bind:value={filters.minRam} 
      on:change={applyFilters}
    />
  </div>

  <div class="filter-divider"></div>

  <div class="filter-group">
    <label class="filter-label" for="maxPrice">Max Price ($/hr)</label>
    <input 
      type="number" 
      id="maxPrice" 
      class="filter-input" 
      placeholder="Any" 
      step="0.01"
      bind:value={filters.maxPrice} 
      on:change={applyFilters}
    />
  </div>

  <footer class="filter-footer">
    <span class="result-count">
      {totalCount.toLocaleString()} {totalCount === 1 ? 'listing' : 'listings'}
    </span>
  </footer>
</aside>

<style>
  .filter-panel {
    background: rgba(15, 23, 15, 0.8);
    border: 1px solid rgba(55, 65, 81, 0.5);
    border-radius: 12px;
    padding: 20px;
    height: fit-content;
    position: sticky;
    top: 80px;
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .filter-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #d1d5db;
    margin: 0;
  }

  .filter-title svg {
    color: #34d399;
  }

  .clear-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7280;
    background: none;
    border: 1px solid rgba(107, 114, 128, 0.5);
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .clear-btn:hover {
    color: #e5e7eb;
    border-color: #e5e7eb;
  }

  .filter-group {
    margin-bottom: 16px;
  }

  .filter-label {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7280;
    margin-bottom: 6px;
  }

  .filter-select,
  .filter-input {
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #e5e7eb;
    background: rgba(17, 24, 39, 0.6);
    border: 1px solid rgba(55, 65, 81, 0.5);
    border-radius: 6px;
    padding: 10px 12px;
    transition: all 0.2s ease;
  }

  .filter-select:focus,
  .filter-input:focus {
    outline: none;
    border-color: #34d399;
    box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.2);
  }

  .filter-select option {
    background: #1f2937;
    color: #e5e7eb;
  }

  .filter-divider {
    height: 1px;
    background: rgba(55, 65, 81, 0.3);
    margin: 20px 0;
  }

  .filter-footer {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid rgba(55, 65, 81, 0.3);
  }

  .result-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #6b7280;
  }
</style>
