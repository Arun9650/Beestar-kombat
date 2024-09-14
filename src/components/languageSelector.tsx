"use client";

import useLanguageStore from "@/store/uselanguageStore";
import React, { useState, useEffect, useRef } from "react";
import { CircleFlag } from "react-circle-flags";

const languages = [
  { id: 1, name: "English", code: "GB" },
  { id: 2, name: "Italian", code: "IT" },
  { id: 3, name: "Finnish", code: "FI" },
  { id: 4, name: "Bulgarian", code: "BG" },
  { id: 5, name: "Japanese", code: "JP" },
  { id: 6, name: "Korean", code: "KR" },
  { id: 7, name: "Chinese", code: "CN" },
  { id: 8, name: "Portuguese", code: "PT" },
  { id: 9, name: "Greek", code: "GR" },
  { id: 10, name: "French", code: "FR" },
  { id: 11, name: "German", code: "DE" },
  { id: 12, name: "Hindi", code: "IN" },
  { id: 13, name: "Czech", code: "CZ" },
  { id: 14, name: "Polish", code: "PL" },
  { id: 15, name: "Indonesian", code: "ID" },
  { id: 16, name: "Danish", code: "DK" },
  { id: 17, name: "Russian", code: "RU" },
  { id: 18, name: "Swedish", code: "SE" },
  { id: 19, name: "Romanian", code: "RO" },
  { id: 20, name: "Turkish", code: "TR" },
  { id: 21, name: "Ukrainian", code: "UA" },
];

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(1); // Default to English
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [filteredLanguages, setFilteredLanguages] = useState(languages); // Filtered languages

  const {  setLanguage } = useLanguageStore();

  const handleLanguageChange = (newLanguage: string, newLanguageCode: string, newImage: string) => {
    setLanguage(newLanguage, newLanguageCode, newImage);
  };


  const handleChange = (name:string, code:string, id:number) => {
    setSelectedLanguage(id);
    handleLanguageChange(name, code, id.toString());
  }

  // Set the type of the ref to NodeJS.Timeout | null to handle the Timeout correctly in Node.js environment
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debouncing search input
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const filtered = languages.filter((language) =>
        language.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLanguages(filtered);
    }, 300); // 300ms debounce delay

    // Cleanup on unmount
    return () => clearTimeout(debounceTimeoutRef.current as NodeJS.Timeout);
  }, [searchTerm]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-black rounded-lg w-full max-w-lg mx-auto">
      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search language..."
        className="w-full p-3 mb-4 text-white bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
      />

      <div className="grid grid-cols-3 gap-2">
        {filteredLanguages.map((language) => (
          <div
            className={`my-1 flex items-center justify-between border rounded-md p-2 ${
              selectedLanguage === language.id
                ? "border-custom-orange"
                : "border-[#504949]"
            }`}
            key={language.id}
          >
            <div className="flex items-center gap-2 justify-between">
              <CircleFlag
                countryCode={language.code.toLocaleLowerCase()}
                height={5}
                width={12}
              />
              <label
                htmlFor={`radio-${language.id}`}
                className="flex items-center cursor-pointer text-[0.5rem] text-gray-400 peer-checked:text-white peer-focus:text-white"
              >
                {language.name}
              </label>
            </div>
            <span
              className={`h-3 w-3 flex justify-center items-center border border-gray-400 rounded-full transition-colors duration-300 ease-in-out ${
                selectedLanguage === language.id
                  ? "bg-custom-orange border-custom-orange"
                  : " "
              }`}
            >
              {selectedLanguage === language.id && (
                <span className="block w-1.5 h-1.5 bg-white rounded-full"></span>
              )}
            </span>
            <input
              type="radio"
              id={`radio-${language.id}`}
              name="language"
              value={language.id}
              checked={selectedLanguage === language.id}
              onChange={() => handleChange(language.name, language.code, language.id)}
              className="sr-only peer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
