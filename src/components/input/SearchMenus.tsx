'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { SearchableItem } from '@/hooks/useSearchMenu';

interface SearchBarProps {
  items: SearchableItem[];
}

const SearchBar = ({ items }: SearchBarProps) => {
  const navigate = useRouter();

  const [query, setQuery] = useState<string>('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchableItem[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setQuery(userInput);

    if (userInput) {
      const filtered = items.filter((item) =>
        item.title.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (item: SearchableItem) => {
    setQuery(item.title);
    setFilteredSuggestions([]);
    navigate.push(item.href);
  };

  return (
    <div className="w-[250px] mr-2 text-white">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="w-full p-2 bg-[#EFEAF3] border rounded-md text-[#1B1A1A] focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Que deseas buscar?"
      />
      {query && filteredSuggestions.length === 0 ? (
        <ul className="absolute w-[250px] bg-[#EFEAF3] border border-t-0 rounded-b-md shadow-lg z-10">
          <li className="p-2 text-gray-500">No hay resultados</li>
        </ul>
      ) : (
        filteredSuggestions.length > 0 && (
          <ul className="absolute w-[250px] bg-[#EFEAF3] border border-t-0 rounded-b-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {filteredSuggestions.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                onClick={() => handleSuggestionClick(item)}
                className="p-2 cursor-pointer hover:bg-gray-200 text-[#1B1A1A]"
              >
                {item.title}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default SearchBar;
