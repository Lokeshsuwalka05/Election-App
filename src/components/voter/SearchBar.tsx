import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

// Fallback transliteration mapping in case API fails
const englishToHindi: Record<string, string> = {
  'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ee': 'ई', 'u': 'उ', 'oo': 'ऊ',
  'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ',
  'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ', 'ng': 'ङ',
  'ch': 'च', 'chh': 'छ', 'j': 'ज', 'jh': 'झ', 'ny': 'ञ',
  't': 'ट', 'th': 'ठ', 'd': 'ड', 'dh': 'ढ', 'n1': 'ण',
  'ta': 'त', 'tha': 'थ', 'da': 'द', 'dha': 'ध', 'na': 'न',
  'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
  'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व',
  'sh': 'श', 's': 'स', 'h': 'ह',
  'ksh': 'क्ष', 'tr': 'त्र', 'gya': 'ज्ञ',
  'shiv': 'शिव', 'ram': 'राम', 'sita': 'सीता',
  'am': 'म्', 'ah': 'ः',
};

// Fallback transliteration function
const fallbackTransliterate = (text: string): string => {
  if (!text) return '';
  
  // Check for direct matches of common names and words
  if (englishToHindi[text.toLowerCase()]) {
    return englishToHindi[text.toLowerCase()];
  }
  
  // Otherwise try to match parts of the text
  let result = '';
  let remaining = text.toLowerCase();
  
  while (remaining.length > 0) {
    let matched = false;
    
    // Try to match 2-3 letter combinations first
    for (let len = Math.min(3, remaining.length); len > 0; len--) {
      const chunk = remaining.substring(0, len);
      if (englishToHindi[chunk]) {
        result += englishToHindi[chunk];
        remaining = remaining.substring(len);
        matched = true;
        break;
      }
    }
    
    // If no match found, keep the original character
    if (!matched) {
      result += remaining[0];
      remaining = remaining.substring(1);
    }
  }
  
  return result;
};

// Google Input Tools API function
const transliterateToHindi = async (text: string): Promise<string> => {
  if (!text) return '';
  
  try {
    // Google Input Tools API endpoint
    const response = await fetch(
      `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=hi-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`,
      {
        method: 'GET',
      }
    );
    
    const data = await response.json();
    
    // Check if response has the expected structure
    if (data && Array.isArray(data) && data.length >= 2 && 
        Array.isArray(data[1]) && data[1].length > 0 && 
        Array.isArray(data[1][0]) && data[1][0].length >= 2) {
      
      // Return the first suggestion
      return data[1][0][1][0] || text;
    }
    
    // Fallback to basic transliteration if API format is unexpected
    return fallbackTransliterate(text);
  } catch (error) {
    console.error('Transliteration API error:', error);
    toast.error("Transliteration API error", {
      description: "Falling back to basic transliteration"
    });
    return fallbackTransliterate(text);
  }
};

const SearchBar = ({ onSearch, placeholder = "Search by name, father's name, or ID..." }: SearchBarProps) => {
  const [englishTerm, setEnglishTerm] = useState('');
  const [hindiTerm, setHindiTerm] = useState('');
  const [useTransliteration, setUseTransliteration] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);

  // Transliterate to Hindi when English term changes
  useEffect(() => {
    if (!useTransliteration || !englishTerm) {
      return;
    }

    const translateText = async () => {
      setIsTranslating(true);
      const transliterated = await transliterateToHindi(englishTerm);
      setHindiTerm(transliterated);
      setIsTranslating(false);
    };

    // Use debounce to avoid too many API calls
    const timer = setTimeout(() => {
      translateText();
    }, 500);

    return () => clearTimeout(timer);
  }, [englishTerm, useTransliteration]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(useTransliteration ? hindiTerm : englishTerm);
  };

  const handleClear = () => {
    setEnglishTerm('');
    setHindiTerm('');
    onSearch('');
  };

  const toggleTransliteration = () => {
    setUseTransliteration(!useTransliteration);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative w-full">
        <div className="relative flex">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            value={useTransliteration ? englishTerm : hindiTerm}
            onChange={(e) => {
              if (useTransliteration) {
                setEnglishTerm(e.target.value);
              } else {
                setHindiTerm(e.target.value);
              }
            }}
            placeholder={placeholder}
            className="pl-10 pr-20 py-6 text-lg w-full rounded-l-lg border-r-0 focus-visible:ring-2 focus-visible:ring-primary"
          />
          <div className="absolute right-24 top-1/2 -translate-y-1/2 flex gap-2">
            {(englishTerm || hindiTerm) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={toggleTransliteration}
              className={`text-gray-400 hover:text-gray-600 ${useTransliteration ? 'text-primary' : ''}`}
              title={useTransliteration ? "Hindi transliteration on" : "Hindi transliteration off"}
            >
              <Globe className="h-5 w-5" />
            </button>
          </div>
          <Button 
            type="submit" 
            className="px-6 py-6 h-full text-lg rounded-l-none bg-primary hover:bg-primary/90"
            disabled={isTranslating}
          >
            Search
          </Button>
        </div>
        
        {useTransliteration && englishTerm && (
          <div className="mt-2 text-sm text-muted-foreground">
            Hindi: <span className="font-medium">{isTranslating ? 'Transliterating...' : hindiTerm}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;