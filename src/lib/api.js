import { writable } from 'svelte/store';

export const environments = {
  dev: 'https://ledger.dev.projectmycelium.com/rpc',
  test: 'https://ledger.test.projectmycelium.com/rpc',
  prod: 'https://ledger.projectmycelium.com/rpc'
};

export const currentEnv = writable('dev');

export function getEndpoint() {
  let env;
  currentEnv.subscribe(v => env = v)();
  return environments[env] || environments.dev;
}

export async function fetchListings(filter = {}, offset = 0, limit = 20) {
  const params = { ...filter };
  if (offset > 0) params.offset = offset;
  if (limit) params.limit = limit;

  const response = await fetch(getEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'marketplace.listListings',
      params,
      id: 1
    })
  });

  const data = await response.json();
  return data.result || [];
}

export async function fetchListingCount(filter = {}) {
  const response = await fetch(getEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'marketplace.getListingCount',
      params: filter,
      id: 1
    })
  });

  const data = await response.json();
  return data.result || 0;
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatCurrency(amount) {
  if (amount === 0) return '$0.00';
  return '$' + (amount / 1e7).toFixed(4);
}

export function getUniqueCountries(listings) {
  return [...new Set(listings.map(l => l.country).filter(Boolean))].sort();
}
