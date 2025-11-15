'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InternshipCard from '@/components/InternshipCard';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';

interface InternshipsClientProps {
  initialInternships: any[];
}

export default function InternshipsClient({ initialInternships }: InternshipsClientProps) {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [minStipend, setMinStipend] = useState<string>('');
  const [skillsFilter, setSkillsFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredInternships = useMemo(() => {
    return initialInternships.filter((internship) => {
      const matchesSearch =
        !search ||
        internship.title.toLowerCase().includes(search.toLowerCase()) ||
        internship.company.toLowerCase().includes(search.toLowerCase()) ||
        internship.description.toLowerCase().includes(search.toLowerCase());

      const matchesLocation = locationFilter === 'all' || internship.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesType = typeFilter === 'all' || internship.type === typeFilter;

      const matchesStipend = !minStipend || internship.stipend >= Number(minStipend);

      const matchesSkills = skillsFilter.length === 0 || 
        skillsFilter.some(skill => 
          internship.skills?.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
        );

      return matchesSearch && matchesLocation && matchesType && matchesStipend && matchesSkills;
    });
  }, [initialInternships, search, locationFilter, typeFilter, minStipend, skillsFilter]);

  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);
  const paginatedInternships = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInternships.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInternships, currentPage, itemsPerPage]);

  const allSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    initialInternships.forEach((internship) => {
      internship.skills?.forEach((skill: string) => {
        skillsSet.add(skill);
      });
    });
    return Array.from(skillsSet).sort();
  }, [initialInternships]);

  const toggleSkill = (skill: string) => {
    setSkillsFilter(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setLocationFilter('all');
    setTypeFilter('all');
    setMinStipend('');
    setSkillsFilter([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = search || locationFilter !== 'all' || typeFilter !== 'all' || minStipend || skillsFilter.length > 0;

  const uniqueLocations = useMemo(() => {
    const locations = new Set(initialInternships.map((i) => i.location));
    return Array.from(locations).sort();
  }, [initialInternships]);

  return (
    <div className="container py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Browse Internships</h1>
        <p className="text-muted-foreground">Discover amazing internship opportunities</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search internships..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select value={locationFilter} onValueChange={(value) => {
              setLocationFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Min Stipend (₹)"
              value={minStipend}
              onChange={(e) => {
                setMinStipend(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {allSkills.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Skills</p>
              <div className="flex flex-wrap gap-2">
                {allSkills.slice(0, 20).map((skill) => (
                  <Badge
                    key={skill}
                    variant={skillsFilter.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {skillsFilter.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredInternships.length} internship{filteredInternships.length !== 1 ? 's' : ''} found
            {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>
        {filteredInternships.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No internships found matching your criteria.</p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedInternships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <span className="px-2">...</span>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

