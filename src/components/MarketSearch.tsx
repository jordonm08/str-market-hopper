import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchMarkets } from "@/services/airdna";
import { Market } from "@/types/airdna";
import { useToast } from "@/components/ui/use-toast";

interface MarketSearchProps {
  onSearch: (market: Market) => void;
}

export const MarketSearch = ({ onSearch }: MarketSearchProps) => {
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['markets', query],
    queryFn: () => searchMarkets({ term: query }),
    enabled: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      await refetch();
      if (data?.markets?.length) {
        onSearch(data.markets[0]);
      } else {
        toast({
          title: "No markets found",
          description: "Try a different search term",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to search markets. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <Input
        placeholder="Search markets (e.g., Miami, FL)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" className="bg-primary" disabled={isLoading}>
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};