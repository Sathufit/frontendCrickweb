import React from "react";
import { Link } from "react-router-dom";

const Analyst = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Analyst Section</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Performance */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Top Performance</h2>
          <div className="flex items-center space-x-4">
            <img src="/images/1.4.JPG" alt="Player 1" className="w-16 h-16 rounded-full" />
            <div>
              <h3 className="font-bold">Dulshan Thanoj</h3>
              <p>Most dropped catches: <span className="font-bold">6</span></p>
            </div>
          </div>
        </div>

        {/* Highest Runs */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Highest Runs</h2>
          <div className="flex items-center space-x-4">
            <img src="/images/1.2.JPG" alt="Player 2" className="w-16 h-16 rounded-full" />
            <div>
              <h3 className="font-bold">Chanuka de Silva</h3>
              <p>Runs: <span className="font-bold">132*</span></p>
            </div>
          </div>
        </div>

        {/* Highest Wickets */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Highest Wickets</h2>
          <div className="flex items-center space-x-4">
            <img src="/images/1.3.jpg" alt="Player 3" className="w-16 h-16 rounded-full" />
            <div>
              <h3 className="font-bold">Dihindu Nimsath</h3>
              <p>Wickets: <span className="font-bold">30</span></p>
            </div>
          </div>
        </div>

        {/* Away Performance */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Away Performance</h2>
          <div className="flex items-center space-x-4">
            <img src="/images/5.JPG" alt="Player 4" className="w-16 h-16 rounded-full" />
            <div>
              <h3 className="font-bold">Yamila Dilhara</h3>
              <p>50s: <span className="font-bold">2</span></p>
            </div>
          </div>
        </div>

        {/* Highest Partnership */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Highest Partnership</h2>
          <div className="flex items-center space-x-4">
            <img src="/images/5.JPG" alt="Player 5" className="w-16 h-16 rounded-full" />
            <div>
              <h3 className="font-bold">Yamila Dilhara & Dulshan Thanoj</h3>
              <p>Total Runs: <span className="font-bold">147</span></p>
            </div>
          </div>
        </div>

        {/* Most 100s */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Most 100s</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <img src="/images/2.png" alt="Player 6" className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="font-bold">Sathush Nanayakkara</h3>
                <p>100s: <span className="font-bold">3</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <img src="/images/1.2.JPG" alt="Player 7" className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="font-bold">Chanuka de Silva</h3>
                <p>100s: <span className="font-bold">2</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Most 50s */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Most 50s</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <img src="/images/5.JPG" alt="Player 8" className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="font-bold">Yamila Dilhara</h3>
                <p>50s: <span className="font-bold">24</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <img src="/images/2.png" alt="Player 9" className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="font-bold">Sathush Nanayakkara</h3>
                <p>50s: <span className="font-bold">14</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <img src="/images/3.jpeg" alt="Player 10" className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="font-bold">Savindu Weerarathna</h3>
                <p>50s: <span className="font-bold">3</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyst;
