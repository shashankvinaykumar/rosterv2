import { useState, useEffect, useMemo } from 'react'
import { Search, Users, Mail, Calendar, MapPin, Briefcase, TrendingUp, ArrowUpRight, X } from 'lucide-react'
import rosterData from '../merged_roster.json'

// Status mapping
const STATUS_MAP = {
  1: { label: 'Still at Google', color: 'bg-green-100 text-green-800 border-green-200', icon: '🟢' },
  2: { label: 'Left Google', color: 'bg-pink-100 text-pink-800 border-pink-200', icon: '🔴' },
  3: { label: 'Boomerang', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🟠' }
}

function deriveStatus(person) {
  // If status is explicitly set, use it (only 1 or 2)
  if (person && [1, 2].includes(person.status)) return person.status
  
  const hasLastDay = typeof person?.lastDay === 'string' && person.lastDay.trim().length > 0
  
  // If they have a lastDay, they left
  if (hasLastDay) return 2
  
  // Default: still at Google
  return 1
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [displayedCount, setDisplayedCount] = useState(50)
  const [stats, setStats] = useState({ total: 0, stillHere: 0, left: 0 })
  const [selectedPerson, setSelectedPerson] = useState(null)

  // Calculate statistics
  useEffect(() => {
    const total = rosterData.length
    const stillHere = rosterData.filter(p => deriveStatus(p) === 1).length
    const left = rosterData.filter(p => deriveStatus(p) === 2).length
    setStats({ total, stillHere, left })
  }, [])

  // Get unique class years
  const classYears = useMemo(() => {
    const years = [...new Set(rosterData.map(p => p.classYear))].filter(Boolean).sort((a, b) => b - a)
    return years
  }, [])

  // Filter and search
  const filteredData = useMemo(() => {
    let filtered = rosterData

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(p => deriveStatus(p) === parseInt(selectedStatus))
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(p => p.classYear === parseInt(selectedYear))
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(person => {
        const searchableText = [
          person.name,
          person.email,
          person.currentRole,
          person.linkedin_details?.headline,
          person.linkedin_details?.location?.linkedinText,
          ...(person.linkedin_details?.experience || []).map(exp => 
            `${exp.companyName} ${exp.position} ${exp.description || ''}`
          ),
          ...(person.linkedin_details?.education || []).map(edu => edu.schoolName),
        ].filter(Boolean).join(' ').toLowerCase()

        return searchableText.includes(query)
      })
    }

    return filtered
  }, [searchQuery, selectedStatus, selectedYear])

  // Displayed data (for pagination)
  const displayedData = filteredData.slice(0, displayedCount)

  const loadMore = () => {
    setDisplayedCount(prev => prev + 50)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
          {/* Title Section */}
          <div className="mb-4 sm:mb-6 lg:mb-10 relative">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 mb-1 sm:mb-2">APM Roster</h1>
                <p className="text-sm sm:text-base lg:text-lg text-slate-500 font-light">Google's Associate Product Manager Directory</p>
              </div>
              <div className="text-left md:text-right hidden sm:block">
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Made with ❤️<br />
                  by Shashank Vinay Kumar<br />
                  <span className="text-slate-500">APM Class of 2025</span>
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
            <StatCard label="Total APMs" value={stats.total} color="from-blue-500 to-blue-600" />
            <StatCard label="Still Here" value={stats.stillHere} color="from-emerald-500 to-emerald-600" />
            <StatCard label="Alumni" value={stats.left} color="from-rose-500 to-rose-600" />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-2 sm:gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, role, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:border-slate-300/80 transition-all duration-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 sm:px-5 py-2.5 sm:py-3.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:border-slate-300/80 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base text-slate-900 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="1">Still Here</option>
              <option value="2">Left</option>
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 sm:px-5 py-2.5 sm:py-3.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:border-slate-300/80 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base text-slate-900 cursor-pointer"
            >
              <option value="all">All Years</option>
              {classYears.map(year => (
                <option key={year} value={year}>Class of {year}</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-3 sm:mt-5 text-xs sm:text-sm text-slate-500 font-light">
            Showing <span className="font-medium text-slate-700">{displayedData.length}</span> of{' '}
            <span className="font-medium text-slate-700">{filteredData.length}</span> results
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-12">
        {filteredData.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-slate-100/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-light text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-500 font-light">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayedData.map((person, index) => (
                <PersonCard key={index} person={person} onSelect={() => setSelectedPerson(person)} />
              ))}
            </div>

            {/* Load More Button */}
            {displayedCount < filteredData.length && (
              <div className="text-center mt-16">
                <button
                  onClick={loadMore}
                  className="px-8 py-3.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-700 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-200 font-light text-sm tracking-wide"
                >
                  Load More ({filteredData.length - displayedCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Person Detail Modal */}
      {selectedPerson && (
        <PersonModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/50 mt-12 sm:mt-16 lg:mt-24 py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-500 text-xs sm:text-sm font-light">Tracking {stats.total} APMs since 2002</p>
            </div>
            <a
              href="mailto:shvinaykumar@google.com?subject=Feedback%20for%20APM%20Roster"
              className="group flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white rounded-xl sm:rounded-2xl hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-lg font-light text-xs sm:text-sm tracking-wide"
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Share Feedback</span>
              <span className="sm:hidden">Feedback</span>
            </a>
          </div>
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-slate-400 text-[10px] sm:text-xs font-light">Made with ❤️ by Shashank Vinay Kumar, APM Class of 2025</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Stat Card Component
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-slate-500 text-[10px] sm:text-xs font-light tracking-wide uppercase mb-0.5 sm:mb-1.5 truncate">{label}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-light text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ml-2`}>
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
        </div>
      </div>
    </div>
  )
}

// Person Card Component
function PersonCard({ person, onSelect }) {
  const status = deriveStatus(person)
  const statusInfo = STATUS_MAP[status] || STATUS_MAP[1]
  const linkedinDetails = person.linkedin_details || {}
  const currentPosition = linkedinDetails.currentPosition?.[0]
  const topEducation = linkedinDetails.profileTopEducation?.[0]
  const experience = linkedinDetails.experience || []
  const mostRecentExp = experience[0]
  const [imageError, setImageError] = useState(false)

  return (
    <button onClick={onSelect} className="text-left bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-slate-300/50">
      {/* Card Header with Photo */}
      <div className="relative h-32 sm:h-36 lg:h-40 bg-gradient-to-br from-slate-100 to-slate-200/50">
        <div className="absolute -bottom-12 sm:-bottom-14 left-4 sm:left-6">
          {linkedinDetails.photo && !imageError ? (
            <img
              src={linkedinDetails.photo}
              alt={person.name}
              className="w-24 h-24 sm:w-26 sm:h-26 lg:w-28 lg:h-28 rounded-full border-3 sm:border-4 border-white shadow-xl object-cover"
              onError={() => setImageError(true)}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-24 h-24 sm:w-26 sm:h-26 lg:w-28 lg:h-28 rounded-full border-3 sm:border-4 border-white shadow-xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
              <Users className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 text-white" />
            </div>
          )}
        </div>
        {/* Status Badge */}
        <div className="absolute top-3 sm:top-4 lg:top-5 right-3 sm:right-4 lg:right-5">
          <span className={`px-2.5 sm:px-3 lg:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-light tracking-wide border ${statusInfo.color} flex items-center gap-1 sm:gap-1.5 backdrop-blur-md shadow-sm`}>
            <span>{statusInfo.icon}</span>
            <span className="hidden sm:inline">{statusInfo.label}</span>
            <span className="sm:hidden">{statusInfo.label.split(' ')[0]}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="pt-12 sm:pt-14 lg:pt-16 px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6">
        {/* Name and Headline */}
        <div className="mb-4 sm:mb-5">
          <h3 className="text-lg sm:text-xl font-light text-slate-900 mb-1.5 sm:mb-2 tracking-tight line-clamp-1">{person.name}</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-light line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-relaxed">
            {linkedinDetails.headline || person.currentRole || 'Product Manager'}
          </p>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 mb-6">
          {/* Class Year */}
          {person.classYear && (
            <InfoRow icon={Calendar} label="Class Year" value={person.classYear} />
          )}

          {/* Location */}
          {linkedinDetails.location?.parsed?.city && (
            <InfoRow 
              icon={MapPin} 
              label="Location" 
              value={`${linkedinDetails.location.parsed.city}, ${linkedinDetails.location.parsed.state || linkedinDetails.location.parsed.country}`} 
            />
          )}

          {/* Current Company */}
          {mostRecentExp?.companyName && (
            <InfoRow 
              icon={Briefcase} 
              label="Current" 
              value={`${mostRecentExp.position} at ${mostRecentExp.companyName}`}
              truncate
            />
          )}

          {/* Education */}
          {topEducation?.schoolName && (
            <InfoRow 
              icon={TrendingUp} 
              label="Education" 
              value={topEducation.schoolName} 
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-2.5 pt-4 sm:pt-5 border-t border-slate-100/80">
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-100 transition-all duration-200 font-light text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 group shadow-sm hover:shadow"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Email</span>
              <span className="sm:hidden">Mail</span>
            </a>
          )}
          {person.linkedIn && (
            <a
              href={person.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900 text-white rounded-lg sm:rounded-xl hover:bg-slate-800 transition-all duration-200 font-light text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 group shadow-sm hover:shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="hidden sm:inline">LinkedIn</span>
              <span className="sm:hidden">In</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </button>
  )
}

// Info Row Component
function InfoRow({ icon: Icon, label, value, truncate = false }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className={`text-sm text-slate-600 font-light ${truncate ? 'line-clamp-1' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

// Modal with full work history
function PersonModal({ person, onClose }) {
  const linkedinDetails = person.linkedin_details || {}
  const experience = (linkedinDetails.experience || []).slice()
  const [imageError, setImageError] = useState(false)
  
  // Combine and deduplicate education sources
  const topEducation = linkedinDetails.profileTopEducation || []
  const detailedEducation = linkedinDetails.education || []
  
  // Combine and deduplicate by school name
  const allEducation = [...topEducation, ...detailedEducation]
    .filter(edu => edu && edu.schoolName && edu.schoolName.trim())
    .reduce((acc, current) => {
      const existing = acc.find(edu => edu.schoolName === current.schoolName)
      if (!existing) {
        acc.push(current)
      } else {
        // Merge data if current has more details
        if (current.degree || current.fieldOfStudy || current.startDate || current.endDate) {
          Object.assign(existing, current)
        }
      }
      return acc
    }, [])
  
  const status = deriveStatus(person)
  const statusInfo = STATUS_MAP[status] || STATUS_MAP[1]

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-slate-200/60 overflow-hidden min-h-screen sm:min-h-0 my-0 sm:my-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 border-b border-slate-200/50 bg-gradient-to-br from-slate-50 to-white sticky top-0 z-10 relative">
          {/* Close Button - Top Right */}
          <button 
            onClick={onClose} 
            className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300/50 transition-all duration-200 flex-shrink-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pr-10 sm:pr-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 mb-3 sm:mb-4">
                {linkedinDetails.photo && !imageError ? (
                  <img
                    src={linkedinDetails.photo}
                    alt={person.name}
                    className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full border-3 sm:border-4 border-white shadow-xl object-cover flex-shrink-0"
                    onError={() => setImageError(true)}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full border-3 sm:border-4 border-white shadow-xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-slate-900 tracking-tight mb-1 truncate">{person.name}</h2>
                  <p className="text-sm sm:text-base text-slate-500 font-light line-clamp-2">{linkedinDetails.headline || person.currentRole || 'Product Manager'}</p>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                {person.email && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 font-light truncate max-w-full">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{person.email}</span>
                  </div>
                )}
                {person.classYear && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 font-light">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span>Class of {person.classYear}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-light tracking-wide border ${statusInfo.color} flex items-center gap-1.5 shadow-sm`}>
                    <span>{statusInfo.icon}</span>
                    <span className="hidden sm:inline">{statusInfo.label}</span>
                    <span className="sm:hidden">{statusInfo.label.split(' ')[0]}</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* LinkedIn Button */}
            {person.linkedIn && (
              <div className="flex items-center flex-shrink-0">
                <a
                  href={person.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 sm:px-5 py-2.5 sm:py-2.5 bg-slate-900 text-white rounded-lg sm:rounded-xl hover:bg-slate-800 transition-all duration-200 font-light text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:shadow-lg"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Work History */}
            <section>
              <h3 className="text-xl sm:text-2xl font-light text-slate-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 tracking-tight">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                Work History
              </h3>
              {experience.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-base sm:text-lg font-light">No work history available</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="group p-4 sm:p-5 lg:p-6 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-200">
                      <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-light text-slate-900 text-lg sm:text-xl mb-1 sm:mb-2 tracking-tight">
                              {exp.position || 'Role'}
                            </h4>
                            {exp.companyName && (
                              <p className="text-slate-700 font-light text-base sm:text-lg mb-1 sm:mb-2">{exp.companyName}</p>
                            )}
                            {exp.location && (
                              <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 font-light">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                                <span className="truncate">{exp.location}</span>
                              </p>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-600 flex-shrink-0 bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-light border border-slate-200/60">
                            {exp.startDate?.text || (exp.startDate?.month && exp.startDate?.year ? `${exp.startDate.month} ${exp.startDate.year}` : '')}
                            {exp.endDate?.text ? ` — ${exp.endDate.text}` : ''}
                            {!exp.endDate && !exp.endDate?.text && exp.duration ? ` • ${exp.duration}` : ''}
                          </div>
                        </div>
                        {exp.description && (
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100/80">
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line font-light text-sm sm:text-base">
                              {exp.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Education */}
            {allEducation.length > 0 && (
              <section>
                <h3 className="text-xl sm:text-2xl font-light text-slate-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 tracking-tight">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  Education
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {allEducation.map((edu, idx) => (
                    <div key={idx} className="p-4 sm:p-5 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl sm:rounded-2xl hover:bg-white/80 hover:shadow-sm transition-all duration-200">
                      <div className="flex flex-col gap-2 sm:gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-light text-slate-900 text-base sm:text-lg tracking-tight">
                              {edu.schoolName}
                            </h4>
                            {(edu.degree || edu.fieldOfStudy) && (
                              <p className="text-slate-600 font-light text-sm sm:text-base mt-1">
                                {edu.degree && edu.fieldOfStudy 
                                  ? `${edu.degree} in ${edu.fieldOfStudy}`
                                  : edu.degree || edu.fieldOfStudy
                                }
                              </p>
                            )}
                          </div>
                          {(edu.startDate || edu.endDate || edu.period) && (
                            <div className="text-xs sm:text-sm text-slate-500 flex-shrink-0 bg-slate-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-slate-200/60 font-light">
                              {edu.period || 
                               (edu.startDate?.text && edu.endDate?.text 
                                 ? `${edu.startDate.text} - ${edu.endDate.text}`
                                 : edu.startDate?.text || edu.endDate?.text || ''
                               )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

