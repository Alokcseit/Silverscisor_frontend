 import { Search } from "lucide-react";
 const CustomerHeroSection = () => (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">अपना स्लॉट बुक करें</h2>
          <p className="text-lg text-gray-600">अपनी सुविधा के अनुसार समय चुनें और आएं</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="अपने क्षेत्र में सैलून खोजें..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700">
              खोजें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  export default CustomerHeroSection;