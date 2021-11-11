import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells Apollo we'll take care if stuff
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      // Ask the read function for these items
      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      // What page are we on?
      const page = skip / first + 1;
      // How many pages in total?
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      // Filter out undefined cases
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // If there are items + not enough items to satisfy how many were
      // requested + we are on the last page - just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      // If there are no items in the cache, return false and make
      // the network request
      if (items.length !== first) {
        return false;
      }
      if (items.length) {
        console.log(`There are ${items.length} in the cache,
        gonna send them to Apollo`);
        return items;
      }

      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when the data comes back from the network request
      // Defines how we want to put these items in the cache
      console.log(`merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log(merged);
      return merged;
      // Once this is returned it will go back to the read function
      // and try again
    },
  };
}
