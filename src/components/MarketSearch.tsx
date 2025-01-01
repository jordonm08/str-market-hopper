import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { useDebounce } from '@/hooks/useDebounce';
import { airdnaApi, type MarketSearchResult } from '@/services/airdna';
import axios from 'axios';

interface MarketSearchProps {
  onMarketSelect: (market: MarketSearchResult) => void;
}

export function MarketSearch({ onMarketSelect }: MarketSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<MarketSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting search for term:', term);
      const searchResults = await airdnaApi.searchMarkets(term);
      console.log('Raw search results:', searchResults);
      
      if (Array.isArray(searchResults) && searchResults.length > 0) {
        console.log('Found', searchResults.length, 'results');
        setResults(searchResults);
      } else {
        console.log('No results found for term:', term);
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching markets:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Search for a market..."
        value={searchTerm}
        onValueChange={handleSearch}
      />
      {searchTerm.length > 0 && (
        <>
          <CommandEmpty>
            {isLoading ? 'Searching...' : 'No markets found.'}
          </CommandEmpty>
          <CommandGroup>
            {results.map((market) => (
              <CommandItem
                key={market.id}
                value={market.name}
                onSelect={() => {
                  onMarketSelect(market);
                  setSearchTerm('');
                  setIsOpen(false);
                }}
              >
                <span>{market.location_name} ({market.listing_count.toLocaleString()} listings)</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </>
      )}
    </Command>
  );
}