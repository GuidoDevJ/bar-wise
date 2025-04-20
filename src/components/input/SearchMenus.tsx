/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';



const SearchBar = ({ posts }: any) => {
  const navigate = useRouter();

  const [query, setQuery] = useState<string>('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>(
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setQuery(userInput);

    if (userInput) {
      const filtered = posts.filter((post: any) =>
        post.title.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string, post: any) => {
    setQuery(suggestion);
    setFilteredSuggestions([]);
    navigate.push(`/post/${post.postId}*${post.id}`);
  };

  return (
    <div className="w-[250px] mr-2 text-white">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="w-full p-2 bg-[#EFEAF3] border rounded-md text-[#1B1A1A] focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-none"
        placeholder="¿Que deseas buscar?"
      />
      {query && filteredSuggestions.length === 0 ? (
        <ul className="absolute w-full bg-[#EFEAF3] border border-t-0 rounded-b-md shadow-lg dark:bg-[#121212] dark:text-white dark:border-none z-10">
          <li className="p-2 text-gray-500">No hay resultados</li>
        </ul>
      ) : (
        filteredSuggestions.length > 0 && (
          <ul className="absolute w-full bg-[#EFEAF3] border border-t-0 rounded-b-md shadow-lg dark:bg-[#121212] dark:text-white dark:border-none z-10">
            {filteredSuggestions.map((post, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(post.title, post)}
                className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-inherit"
              >
                {post.title}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default SearchBar;
