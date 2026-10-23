import React from 'react';

export const ReportsPage = () => {
  const exportCSV = (type) => {
    let content = '';
    let filename = '';

    if (type === 'payroll') {
      content = 'Employee ID,Name,Department,Designation,Monthly Base,Annual Salary\n' +
                'EMP001,Alexander Wright,Engineering,Chief Technology Officer,$13750,$165000\n' +
                'EMP002,Sarah Jenkins,Human Resources,Head of People Operations,$9166,$110000\n' +
                'EMP003,Liam Vance,Engineering,Engineering Lead,$10416,$125000\n' +
                'EMP004,Emily Davis,Engineering,Senior Frontend Engineer,$7666,$92000\n';
      filename = 'NEXORA_HR_Payroll_Summary_2026.csv';
    } else if (type === 'attendance') {
      content = 'Date,Employee,Status,Check In,Check Out,Hours\n' +
                '2026-10-23,Emily Davis,Present,09:05 AM,05:45 PM,8.5\n' +
                '2026-10-23,Noah Patel,Late,09:42 AM,--,7.2\n' +
                '2026-10-22,Liam Vance,Present,08:50 AM,06:10 PM,9.0\n';
      filename = 'NEXORA_HR_Attendance_Audit_Report.csv';
    } else {
      content = 'Employee,Cycle,Goal,Rating,Progress\n' +
                'Emily Davis,Q1-2026,UI Architecture Modernization,5/5,92%\n' +
                'Noah Patel,Q1-2026,Product User Journey Mapping,4/5,75%\n';
      filename = 'NEXORA_HR_Performance_Evaluations.csv';
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      <div className="card-header-flex">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Executive HR Reports & Data Export</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Generate and export operational, attendance, and payroll compliance data in CSV format.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.25rem' }}>
        <div className="content-card">
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💵</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.35rem' }}>Workforce Payroll Distribution</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Consolidated breakdown of active department salary bands, bonuses, and standard monthly allowances.
          </p>
          <button className="btn btn-primary" onClick={() => exportCSV('payroll')}>
            📥 Download Payroll CSV
          </button>
        </div>

        <div className="content-card">
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏱️</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.35rem' }}>Attendance & Time-Tracking Audit</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Daily check-in / check-out records, punctuality rates, and recorded overtime hours.
          </p>
          <button className="btn btn-primary" onClick={() => exportCSV('attendance')}>
            📥 Download Attendance CSV
          </button>
        </div>

        <div className="content-card">
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⭐</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.35rem' }}>Performance & Review Ratings</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Quarterly milestone scores, manager review assessments, and team KPI attainment percentages.
          </p>
          <button className="btn btn-primary" onClick={() => exportCSV('performance')}>
            📥 Download Performance CSV
          </button>
        </div>
      </div>
    </div>
  );
};
