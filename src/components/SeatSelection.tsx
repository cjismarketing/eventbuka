import React, { useState } from 'react';
import { X, Check, Info } from 'lucide-react';

interface SeatSelectionProps {
  onClose: () => void;
  onSeatSelect: (seats: string[]) => void;
}

function SeatSelection({ onClose, onSeatSelect }: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState('vip');

  const sections = {
    vip: {
      name: 'VIP Section',
      price: 25000,
      color: 'bg-purple-600',
      seats: generateSeats('VIP', 5, 10)
    },
    regular: {
      name: 'Regular Section',
      price: 15000,
      color: 'bg-blue-600',
      seats: generateSeats('REG', 10, 20)
    },
    table: {
      name: 'Table Section',
      price: 40000,
      color: 'bg-green-600',
      seats: generateTableSeats('TBL', 4, 8)
    }
  };

  function generateSeats(prefix: string, rows: number, seatsPerRow: number) {
    const seats = [];
    const bookedSeats = new Set(['VIP-A-3', 'VIP-A-4', 'REG-C-7', 'REG-C-8', 'TBL-1-A']);
    
    for (let row = 0; row < rows; row++) {
      const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatId = `${prefix}-${rowLetter}-${seat}`;
        seats.push({
          id: seatId,
          row: rowLetter,
          number: seat,
          isBooked: bookedSeats.has(seatId),
          isSelected: selectedSeats.includes(seatId)
        });
      }
    }
    return seats;
  }

  function generateTableSeats(prefix: string, tables: number, seatsPerTable: number) {
    const seats = [];
    const bookedSeats = new Set(['TBL-1-A', 'TBL-1-B', 'TBL-3-C']);
    
    for (let table = 1; table <= tables; table++) {
      for (let seat = 0; seat < seatsPerTable; seat++) {
        const seatLetter = String.fromCharCode(65 + seat);
        const seatId = `${prefix}-${table}-${seatLetter}`;
        seats.push({
          id: seatId,
          table: table,
          position: seatLetter,
          isBooked: bookedSeats.has(seatId),
          isSelected: selectedSeats.includes(seatId)
        });
      }
    }
    return seats;
  }

  const handleSeatClick = (seatId: string, isBooked: boolean) => {
    if (isBooked) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const sectionKey = seatId.startsWith('VIP') ? 'vip' : 
                        seatId.startsWith('REG') ? 'regular' : 'table';
      return total + sections[sectionKey as keyof typeof sections].price;
    }, 0);
  };

  const getSeatStatus = (seat: any) => {
    if (seat.isBooked) return 'booked';
    if (seat.isSelected) return 'selected';
    return 'available';
  };

  const getSeatColor = (seat: any) => {
    const status = getSeatStatus(seat);
    switch (status) {
      case 'booked': return 'bg-gray-400 cursor-not-allowed';
      case 'selected': return 'bg-purple-600 text-white';
      default: return 'bg-gray-200 hover:bg-gray-300 cursor-pointer';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Select Your Seats</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Seat Map */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Stage */}
            <div className="bg-gray-800 text-white py-4 px-8 rounded-lg text-center mb-8">
              <h3 className="text-xl font-bold">STAGE</h3>
            </div>

            {/* Section Tabs */}
            <div className="flex space-x-4 mb-6">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setCurrentSection(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentSection === key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </div>

            {/* Current Section Display */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {sections[currentSection as keyof typeof sections].name}
              </h3>
              <p className="text-gray-600">
                ₦{sections[currentSection as keyof typeof sections].price.toLocaleString()} per seat
              </p>
            </div>

            {/* Seat Grid */}
            <div className="space-y-4">
              {currentSection === 'table' ? (
                // Table Layout
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {Array.from({ length: 4 }, (_, tableIndex) => (
                    <div key={tableIndex} className="border border-gray-300 rounded-lg p-4">
                      <div className="text-center font-semibold text-gray-900 mb-3">
                        Table {tableIndex + 1}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {sections.table.seats
                          .filter(seat => seat.table === tableIndex + 1)
                          .map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat.id, seat.isBooked)}
                              className={`w-8 h-8 rounded text-xs font-medium transition-colors ${getSeatColor(seat)}`}
                              disabled={seat.isBooked}
                            >
                              {seat.position}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Regular Seat Layout
                <div className="space-y-2">
                  {Array.from({ length: currentSection === 'vip' ? 5 : 10 }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex items-center space-x-2">
                      <div className="w-8 text-center font-semibold text-gray-600">
                        {String.fromCharCode(65 + rowIndex)}
                      </div>
                      <div className="flex space-x-1">
                        {sections[currentSection as keyof typeof sections].seats
                          .filter(seat => seat.row === String.fromCharCode(65 + rowIndex))
                          .map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat.id, seat.isBooked)}
                              className={`w-8 h-8 rounded text-xs font-medium transition-colors ${getSeatColor(seat)}`}
                              disabled={seat.isBooked}
                            >
                              {seat.number}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-8 flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <span className="text-sm text-gray-600">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span className="text-sm text-gray-600">Booked</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 border-l border-gray-200 p-6">
            <div className="space-y-6">
              {/* Selected Seats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Seats</h3>
                {selectedSeats.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No seats selected
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedSeats.map(seatId => {
                      const sectionKey = seatId.startsWith('VIP') ? 'vip' : 
                                        seatId.startsWith('REG') ? 'regular' : 'table';
                      const section = sections[sectionKey as keyof typeof sections];
                      
                      return (
                        <div key={seatId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{seatId}</div>
                            <div className="text-sm text-gray-600">{section.name}</div>
                          </div>
                          <div className="text-purple-600 font-semibold">
                            ₦{section.price.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Total */}
              {selectedSeats.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-purple-600">
                      ₦{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Seats will be held for 15 minutes during checkout
                    </p>
                  </div>
                  
                  <button
                    onClick={() => onSeatSelect(selectedSeats)}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Confirm Selection
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;