import { Scissors, Bell } from "lucide-react";
const SalonHeader = () => (
    <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scissors className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Silverscisor Admin</h1>
              <p className="text-sm opacity-90">सैलून डैशबोर्ड</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 cursor-pointer" />
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold">
              A
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  export default SalonHeader;