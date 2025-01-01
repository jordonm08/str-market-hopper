import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { useDebounce } from '@/hooks/useDebounce';
import { airdnaApi, type MarketSearchResult } from '@/services/airdna';

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
      const searchResults = await airdnaApi.searchMarkets(term);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching markets:', error);
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
                <span>{market.location_name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </>
      )}
    </Command>
  );
}