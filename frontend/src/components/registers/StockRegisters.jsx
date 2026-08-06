import React, { useState } from 'react';
import { Search, Filter, Download, Plus, ArrowUpDown, ChevronDown } from 'lucide-react';

export default function StockRegisters() {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [sortField, setSortField] = useState('stockWeight');
  const [sortAsc, setSortAsc] = useState(false);

  // High-density MSME steel pipe inventory registers dataset
  const registerItems = [
    { id: 'REG-1001', code: 'SP-304-89-4.5', category: 'Seamless Pipe', grade: 'SS 304', od: '89.0 mm', wall: '4.50 mm', pcs: 420, stockWeight: 42.50, ratePerMt: 182000, totalVal: 7735000, loc: 'Yard A-12', status: 'In Stock' },
    { id: 'REG-1002', code: 'ERW-201-114-6', category: 'ERW Structure', grade: 'SS 201', od: '114.0 mm', wall: '6.00 mm', pcs: 180, stockWeight: 18.00, ratePerMt: 68500, totalVal: 1233000, loc: 'Yard B-04', status: 'Low Stock' },
    { id: 'REG-1003', code: 'HS-MS-50-50-3', category: 'Hollow Section', grade: 'MS Grade A', od: '50x50 mm', wall: '3.00 mm', pcs: 1250, stockWeight: 85.20, ratePerMt: 56200, totalVal: 4788240, loc: 'Yard A-01', status: 'In Stock' },
    { id: 'REG-1004', code: 'SP-316-60-5.0', category: 'Seamless Pipe', grade: 'SS 316L', od: '60.0 mm', wall: '5.00 mm', pcs: 95, stockWeight: 8.40, ratePerMt: 245000, totalVal: 2058000, loc: 'Yard B-08', status: 'Critical' },
    { id: 'REG-1005', code: 'SW-CS-400-8.0', category: 'Spiral Welded', grade: 'Carbon Steel', od: '400.0 mm', wall: '8.00 mm', pcs: 60, stockWeight: 112.00, ratePerMt: 62000, totalVal: 6944000, loc: 'Yard C-02', status: 'In Stock' },
    { id: 'REG-1006', code: 'SP-304-60-3.5', category: 'Seamless Pipe', grade: 'SS 304', od: '60.0 mm', wall: '3.50 mm', pcs: 310, stockWeight: 26.80, ratePerMt: 180000, totalVal: 4824000, loc: 'Yard A-08', status: 'In Stock' },
    { id: 'REG-1007', code: 'ERW-304-76-2.0', category: 'ERW Structure', grade: 'SS 304', od: '76.0 mm', wall: '2.00 mm', pcs: 540, stockWeight: 21.40, ratePerMt: 175000, totalVal: 3745000, loc: 'Yard B-11', status: 'In Stock' },
    { id: 'REG-1008', code: 'HS-MS-100-100', category: 'Hollow Section', grade: 'MS Grade A', od: '100x100 mm', wall: '5.00 mm', pcs: 280, stockWeight: 45.60, ratePerMt: 55800, totalVal: 2544480, loc: 'Yard A-03', status: 'In Stock' },
  ];

  const filtered = registerItems.filter(item => {
    const matchesSearch = item.code.toLowerCase().includes(search.toLowerCase()) || 
                          item.category.toLowerCase().includes(search.toLowerCase()) ||
                          item.grade.toLowerCase().includes(search.toLowerCase()) ||
                          item.loc.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = gradeFilter === 'ALL' || item.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  }).sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
  });

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const totalStockWeight = filtered.reduce((acc, curr) => acc + curr.stockWeight, 0);
  const totalValuation = filtered.reduce((acc, curr) => acc + curr.totalVal, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Steel Pipe Stock Registers
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Master physical inventory data, MT weights, rate schedules, and yard locations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-terminal btn-secondary" style={{ fontSize: '12px' }}>
            <Download size={14} />
            Export CSV
          </button>
          <button className="btn-terminal" style={{ fontSize: '12px' }}>
            <Plus size={14} />
            Add Stock Entry
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search code, grade, HSN, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-terminal"
              style={{ width: '100%', paddingLeft: '32px' }}
            />
          </div>

          {/* Grade Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="input-terminal"
              style={{ fontSize: '12px' }}
            >
              <option value="ALL">All Grades</option>
              <option value="SS 304">SS 304</option>
              <option value="SS 316L">SS 316L</option>
              <option value="SS 201">SS 201</option>
              <option value="MS Grade A">MS Grade A</option>
              <option value="Carbon Steel">Carbon Steel</option>
            </select>
          </div>
        </div>

        {/* Summary Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
          <div>
            <span style={{ color: 'var(--text-tertiary)' }}>Total Weight: </span>
            <strong className="font-mono-tabular" style={{ color: 'var(--text-primary)' }}>{totalStockWeight.toFixed(2)} MT</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-tertiary)' }}>Valuation: </span>
            <strong className="font-mono-tabular" style={{ color: 'var(--semantic-success)' }}>₹ {(totalValuation / 100000).toFixed(2)} L</strong>
          </div>
        </div>
      </div>

      {/* High-Density Data Table */}
      <div className="data-table-container" style={{ flex: 1 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('code')} style={{ cursor: 'pointer' }}>
                Item Code <ArrowUpDown size={11} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th>Category</th>
              <th>Grade</th>
              <th>Outer Diam.</th>
              <th>Wall Thick.</th>
              <th style={{ textAlign: 'right' }}>Pcs</th>
              <th onClick={() => handleSort('stockWeight')} style={{ textAlign: 'right', cursor: 'pointer' }}>
                Stock (MT) <ArrowUpDown size={11} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th onClick={() => handleSort('ratePerMt')} style={{ textAlign: 'right', cursor: 'pointer' }}>
                Rate (₹/MT) <ArrowUpDown size={11} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th onClick={() => handleSort('totalVal')} style={{ textAlign: 'right', cursor: 'pointer' }}>
                Total Val. (₹) <ArrowUpDown size={11} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th>Yard Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td className="font-mono-tabular" style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>
                  {item.code}
                </td>
                <td>{item.category}</td>
                <td>
                  <span className="badge badge-info" style={{ fontSize: '10px' }}>{item.grade}</span>
                </td>
                <td className="font-mono-tabular">{item.od}</td>
                <td className="font-mono-tabular">{item.wall}</td>
                <td className="font-mono-tabular" style={{ textAlign: 'right' }}>{item.pcs}</td>
                <td className="font-mono-tabular" style={{ textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {item.stockWeight.toFixed(2)}
                </td>
                <td className="font-mono-tabular" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                  ₹ {item.ratePerMt.toLocaleString('en-IN')}
                </td>
                <td className="font-mono-tabular" style={{ textAlign: 'right', fontWeight: '600', color: 'var(--semantic-success)' }}>
                  ₹ {item.totalVal.toLocaleString('en-IN')}
                </td>
                <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.loc}</td>
                <td>
                  <span className={`badge ${item.status === 'In Stock' ? 'badge-success' : item.status === 'Low Stock' ? 'badge-warning' : 'badge-danger'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
