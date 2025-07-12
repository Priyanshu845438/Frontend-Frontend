
import React, { useState, useEffect, useCallback } from 'react';
import CampaignCard from '../components/CampaignCard.tsx';
import SectionWrapper from '../components/SectionWrapper.tsx';
import { campaignAPI } from '../services/api.ts';
import type { Campaign } from '../types.ts';
import { FiSearch, FiLoader } from 'react-icons/fi';
import Button from '../components/Button.tsx';

const ExplorePage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [availableFilters, setAvailableFilters] = useState<{ categories: string[], locations: string[] }>({ categories: [], locations: [] });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
    status: 'active',
    search: '',
    sortBy: 'newest',
    page: 1,
    limit: 12,
  });
  
  // Separate state for debounced search input to avoid re-fetching on every keystroke
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCampaigns = useCallback(async (isNewFilter: boolean) => {
    if (isNewFilter) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const apiFilters = { ...filters };
      if (apiFilters.category === 'All') delete (apiFilters as any).category;
      if (apiFilters.location === 'All') delete (apiFilters as any).location;

      const data = await campaignAPI.getPublic(apiFilters);
      
      setPagination(data.pagination);

      if (isNewFilter) {
          setCampaigns(data.campaigns);
      } else {
          setCampaigns(prev => [...prev, ...data.campaigns]);
      }
      
      // Only update available filters on the first load to avoid them changing
      if (data.filters && (!availableFilters.categories.length || !availableFilters.locations.length)) {
          setAvailableFilters(data.filters);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, availableFilters]);

  // Effect for fetching data when filters change (but not on page change for 'load more')
  useEffect(() => {
    // A change in any filter except 'page' triggers a full reset.
    fetchCampaigns(true);
  }, [filters.search, filters.category, filters.location, filters.status, filters.sortBy]);
  
  // Effect for debouncing search term
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== searchTerm) {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [searchTerm, filters.search]);


  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }
  
  const handleLoadMore = () => {
    if (pagination.hasNext && !loadingMore) {
      const newPage = filters.page + 1;
      setFilters(prev => ({ ...prev, page: newPage }));
      // Directly call fetch for 'load more' scenario
      fetchCampaigns(false);
    }
  };
  
  const locations = ['All', ...(availableFilters.locations || [])];
  const categories = ['All', ...(availableFilters.categories || [])];

  return (
    <div className="bg-brand-light dark:bg-brand-dark font-sans min-h-screen">
      <div className="bg-white dark:bg-brand-dark-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-extrabold text-navy-blue dark:text-white font-serif">Explore Causes</h1>
          <p className="mt-2 text-lg text-warm-gray-600 dark:text-gray-400">Find a cause that resonates with you and make a difference today.</p>

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 relative">
                <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"/>
                <input type="text" name="search" placeholder="Search by keyword..." onChange={handleSearchChange} value={searchTerm} className="pl-10 w-full pr-3 py-2 text-base border-gray-300 dark:bg-brand-dark dark:border-gray-600 focus:outline-none focus:ring-sky-blue focus:border-sky-blue sm:text-sm rounded-md"/>
              </div>
              <div>
                <label htmlFor="category" className="sr-only">Category</label>
                <select id="category" name="category" onChange={handleFilterChange} value={filters.category} className="w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-brand-dark dark:border-gray-600 focus:outline-none focus:ring-sky-blue focus:border-sky-blue sm:text-sm rounded-md">
                  {categories.map((cat: string) => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="location" className="sr-only">Location</label>
                <select id="location" name="location" onChange={handleFilterChange} value={filters.location} className="w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-brand-dark dark:border-gray-600 focus:outline-none focus:ring-sky-blue focus:border-sky-blue sm:text-sm rounded-md">
                  {locations.map((loc: string) => <option key={loc}>{loc}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="sortBy" className="sr-only">Sort By</label>
                <select id="sortBy" name="sortBy" onChange={handleFilterChange} value={filters.sortBy} className="w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-brand-dark dark:border-gray-600 focus:outline-none focus:ring-sky-blue focus:border-sky-blue sm:text-sm rounded-md">
                  <option value="newest">Sort by: Newest</option>
                  <option value="ending_soon">Sort by: Ending Soon</option>
                  <option value="most_funded">Sort by: Most Funded</option>
                  <option value="target_amount">Sort by: Target Amount</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionWrapper>
            {loading ? (
                 <div className="text-center py-16">
                    <FiLoader className="animate-spin h-10 w-10 text-brand-gold mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-navy-blue dark:text-white">Finding Campaigns...</h2>
                 </div>
            ) : campaigns.length > 0 ? (
              <>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map(campaign => (
                        <CampaignCard key={campaign._id} campaign={campaign} />
                    ))}
                </div>
                {pagination && pagination.hasNext && (
                    <div className="text-center mt-12">
                        <Button onClick={handleLoadMore} disabled={loadingMore} variant="secondary">
                            {loadingMore ? (
                                <><FiLoader className="animate-spin mr-2"/> Loading...</>
                            ) : (
                                'Load More'
                            )}
                        </Button>
                    </div>
                )}
              </>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-xl font-semibold text-navy-blue dark:text-white">No Campaigns Found</h2>
                    <p className="mt-2 text-warm-gray-600 dark:text-gray-400">Try adjusting your filters or check back later!</p>
                </div>
            )}
        </SectionWrapper>
      </div>
    </div>
  );
};

export default ExplorePage;
