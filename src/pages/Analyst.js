import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Award, Target, Plane, Users, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

const Analyst = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header with responsive navigation */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
                  Cricket Analytics
                </h1>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-800 hover:text-blue-600 hover:bg-blue-100 transition duration-150"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-blue-800 hover:text-blue-600 font-medium">Dashboard</Link>
              <Link to="/matches" className="text-blue-800 hover:text-blue-600 font-medium">Matches</Link>
              <Link to="/players" className="text-blue-800 hover:text-blue-600 font-medium">Players</Link>
              <Link to="/settings" className="text-blue-800 hover:text-blue-600 font-medium">Settings</Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-blue-800 hover:text-blue-600 hover:bg-blue-100">Dashboard</Link>
            <Link to="/matches" className="block px-3 py-2 rounded-md text-base font-medium text-blue-800 hover:text-blue-600 hover:bg-blue-100">Matches</Link>
            <Link to="/players" className="block px-3 py-2 rounded-md text-base font-medium text-blue-800 hover:text-blue-600 hover:bg-blue-100">Players</Link>
            <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-blue-800 hover:text-blue-600 hover:bg-blue-100">Settings</Link>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-900">Team Statistics</h2>
          <p className="mt-2 text-gray-600">Season highlights and player performances</p>
        </div>
        
        {/* Stats cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Performance */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 flex items-center space-x-2">
              <Trophy className="text-white" size={20} />
              <h2 className="text-lg font-semibold text-white">Top Performance</h2>
            </div>
            <div className="p-5">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src="/api/placeholder/64/64" alt="Dulshan Thanoj" className="w-16 h-16 rounded-full object-cover ring-2 ring-red-400" />
                  <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Dulshan Thanoj</h3>
                  <p className="text-gray-600">Most dropped catches: <span className="font-bold text-red-600">6</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Highest Runs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 flex items-center space-x-2">
              <Award className="text-white" size={20} />
              <h2 className="text-lg font-semibold text-white">Highest Runs</h2>
            </div>
            <div className="p-5">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src="/api/placeholder/64/64" alt="Chanuka de Silva" className="w-16 h-16 rounded-full object-cover ring-2 ring-green-400" />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Chanuka de Silva</h3>
                  <p className="text-gray-600">Runs: <span className="font-bold text-green-600">132*</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Highest Wickets */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center space-x-2">
              <Target className="text-white" size={20} />
              <h2 className="text-lg font-semibold text-white">Highest Wickets</h2>
            </div>
            <div className="p-5">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src="/api/placeholder/64/64" alt="Dihindu Nimsath" className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-400" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Dihindu Nimsath</h3>
                  <p className="text-gray-600">Wickets: <span className="font-bold text-blue-600">30</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Away Performance */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 flex items-center space-x-2">
              <Plane className="text-white" size={20} />
              <h2 className="text-lg font-semibold text-white">Away Performance</h2>
            </div>
            <div className="p-5">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src="/api/placeholder/64/64" alt="Yamila Dilhara" className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Yamila Dilhara</h3>
                  <p className="text-gray-600">50s: <span className="font-bold text-purple-600">2</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Highest Partnership */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-3 flex items-center space-x-2">
              <Users className="text-white" size={20} />
              <h2 className="text-lg font-semibold text-white">Highest Partnership</h2>
            </div>
            <div className="p-5">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-3">
                  <img src="/api/placeholder/64/64" alt="Yamila Dilhara" className="w-16 h-16 rounded-full object-cover ring-2 ring-white" />
                  <img src="/api/placeholder/64/64" alt="Dulshan Thanoj" className="w-16 h-16 rounded-full object-cover ring-2 ring-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Yamila & Dulshan</h3>
                  <p className="text-gray-600">Total Runs: <span className="font-bold text-yellow-600">147</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Most 100s */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 flex items-center space-x-2">
              <Award className="text-white" size={20} />
              <h2 className="text-lg font-semibold text-white">Most 100s</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src="/api/placeholder/64/64" alt="Sathush Nanayakkara" className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-400" />
                  <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Sathush Nanayakkara</h3>
                  <p className="text-gray-600">100s: <span className="font-bold text-indigo-600">3</span></p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src="/api/placeholder/64/64" alt="Chanuka de Silva" className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-400" />
                  <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Chanuka de Silva</h3>
                  <p className="text-gray-600">100s: <span className="font-bold text-indigo-600">2</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Most 50s */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden sm:col-span-2 lg:col-span-1 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-3 flex items-center space-x-2">
              <Award className="text-white" size={20} />
              <h2 className="text-lg font-semibold text-white">Most 50s</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src="/api/placeholder/64/64" alt="Yamila Dilhara" className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-400" />
                  <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Yamila Dilhara</h3>
                  <p className="text-gray-600">50s: <span className="font-bold text-pink-600">24</span></p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src="/api/placeholder/64/64" alt="Sathush Nanayakkara" className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-400" />
                  <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Sathush Nanayakkara</h3>
                  <p className="text-gray-600">50s: <span className="font-bold text-pink-600">14</span></p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src="/api/placeholder/64/64" alt="Savindu Weerarathna" className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-400" />
                  <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Savindu Weerarathna</h3>
                  <p className="text-gray-600">50s: <span className="font-bold text-pink-600">3</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <button className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <ChevronLeft size={20} className="mr-2" />
            Previous Season
          </button>
          <button className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Next Season
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 Cricket Analytics. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/about" className="text-sm text-blue-200 hover:text-white">About</Link>
              <Link to="/contact" className="text-sm text-blue-200 hover:text-white">Contact</Link>
              <Link to="/privacy" className="text-sm text-blue-200 hover:text-white">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Analyst;