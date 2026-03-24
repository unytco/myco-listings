<script>
  import { formatBytes, formatCurrency } from './api.js';

  export let listing;

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'active': return '#34d399';
      case 'reserved': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  }
</script>

<article class="listing-card">
  <header class="card-header">
    <div class="status-badge" style="--status-color: {getStatusColor(listing.status)}">
      <span class="status-dot"></span>
      {listing.status || 'Unknown'}
    </div>
    <span class="grid-version">{listing.grid_version || 'V3'}</span>
  </header>

  <div class="card-body">
    <div class="location">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.49-2.01-4.5-4.5-4.5zM8 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/>
      </svg>
      <span>{listing.country || 'Unknown'}</span>
    </div>

    <div class="resources">
      <div class="resource-row">
        <span class="resource-label">CPU</span>
        <span class="resource-value">{listing.total_resources?.cru || 0} cores</span>
      </div>
      <div class="resource-row">
        <span class="resource-label">RAM</span>
        <span class="resource-value">{formatBytes(listing.total_resources?.mru || 0)}</span>
      </div>
      <div class="resource-row">
        <span class="resource-label">SSD</span>
        <span class="resource-value">{formatBytes(listing.total_resources?.sru || 0)}</span>
      </div>
      <div class="resource-row">
        <span class="resource-label">HDD</span>
        <span class="resource-value">{formatBytes(listing.total_resources?.hru || 0)}</span>
      </div>
    </div>

    <div class="slices-info">
      <div class="slice-stat">
        <span class="slice-number">{listing.total_slices || 0}</span>
        <span class="slice-label">Total Slices</span>
      </div>
      <div class="slice-stat available">
        <span class="slice-number">{listing.available_slices || 0}</span>
        <span class="slice-label">Available</span>
      </div>
      <div class="slice-stat reserved">
        <span class="slice-number">{listing.reserved_slices || 0}</span>
        <span class="slice-label">Reserved</span>
      </div>
    </div>
  </div>

  <footer class="card-footer">
    <div class="pricing">
      <div class="price-item">
        <span class="price-label">On-Demand</span>
        <span class="price-value">{formatCurrency(listing.pricing?.on_demand_hourly)}<span class="price-unit">/hr</span></span>
      </div>
    </div>
    <button class="deploy-btn">Deploy</button>
  </footer>
</article>

<style>
  .listing-card {
    background: rgba(15, 23, 15, 0.6);
    border: 1px solid rgba(55, 65, 81, 0.5);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .listing-card:hover {
    border-color: rgba(52, 211, 153, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(31, 41, 55, 0.3);
    border-bottom: 1px solid rgba(55, 65, 81, 0.3);
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--status-color);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--status-color);
    box-shadow: 0 0 6px var(--status-color);
  }

  .grid-version {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7280;
    padding: 4px 8px;
    background: rgba(55, 65, 81, 0.3);
    border-radius: 4px;
  }

  .card-body {
    padding: 16px;
  }

  .location {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #d1d5db;
    margin-bottom: 16px;
  }

  .location svg {
    color: #34d399;
  }

  .resources {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 16px;
  }

  .resource-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    background: rgba(17, 24, 39, 0.5);
    border-radius: 6px;
  }

  .resource-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
  }

  .resource-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #e5e7eb;
  }

  .slices-info {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    background: rgba(17, 24, 39, 0.5);
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .slice-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .slice-number {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    color: #e5e7eb;
  }

  .slice-stat.available .slice-number {
    color: #34d399;
  }

  .slice-stat.reserved .slice-number {
    color: #f59e0b;
  }

  .slice-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7280;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-top: 1px solid rgba(55, 65, 81, 0.3);
    background: rgba(17, 24, 39, 0.3);
  }

  .pricing {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .price-item {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .price-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7280;
  }

  .price-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 16px;
    font-weight: 500;
    color: #34d399;
  }

  .price-unit {
    font-size: 11px;
    color: #6b7280;
  }

  .deploy-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 10px 20px;
    background: linear-gradient(135deg, #059669 0%, #34d399 100%);
    color: #0a0a0f;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .deploy-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(52, 211, 153, 0.3);
  }
</style>
