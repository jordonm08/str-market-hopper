import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface MarketSearchProps {
  onSearch: (query: string) => void;
}

export const MarketSearch = ({ onSearch }: MarketSearchProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <Input
        placeholder="Search markets (e.g., Miami, FL)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" className="bg-primary">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};