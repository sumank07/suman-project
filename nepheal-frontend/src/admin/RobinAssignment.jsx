import React, { useState } from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';

const RobinAssignment = () => {
    // Mock data to visualize the algorithm
    const [assignments] = useState([
        { id: 101, doctor: 'Dr. Suman (Cardio)', load: 5, status: 'Full' },
        { id: 102, doctor: 'Dr. John (Cardio)', load: 2, status: 'Available' },
        { id: 103, doctor: 'Dr. Amit (Cardio)', load: 4, status: 'Available' },
    ]);

    const [logs] = useState([
        { time: '10:30 AM', msg: 'Incoming request for Cardiology', type: 'info' },
        { time: '10:30 AM', msg: 'Analyzing load: Dr. Suman(5), Dr. John(2), Dr. Amit(4)', type: 'process' },
        { time: '10:30 AM', msg: 'Dr. John selected (Least Load: 2)', type: 'success' },
    ]);

    return (
        <div>
            <h2>Round Robin Assignment Monitor</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Real-time visualization of the appointment scheduling algorithm.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Visualizer */}
                <div className="card">
                    <h3>Doctor Load (Cardiology)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {assignments.map(doc => (
                            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '150px', fontWeight: 500 }}>{doc.doctor}</div>
                                <div style={{ flex: 1, display: 'flex', gap: '2px', height: '24px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                    {[...Array(doc.load)].map((_, i) => (
                                        <div key={i} style={{ width: '20px', backgroundColor: doc.id === 102 ? '#10b981' : '#64748b' }}></div>
                                    ))}
                                </div>
                                <div style={{ fontWeight: 'bold' }}>{doc.load}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 'bold' }}>
                            <CheckCircle size={20} /> Next Assignment: Dr. John
                        </div>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#15803d' }}>
                            Based on current load, the next patient will be assigned to Dr. John.
                        </p>
                    </div>
                </div>

                {/* Algorithm Log */}
                <div className="card" style={{ backgroundColor: '#1e293b', color: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Algorithm Logs</h3>
                        <RefreshCw size={16} color="#94a3b8" />
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {logs.map((log, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                                <span style={{ color: '#64748b' }}>[{log.time}]</span>
                                <span style={{
                                    color: log.type === 'success' ? '#4ade80' : log.type === 'process' ? '#60a5fa' : '#e2e8f0'
                                }}>
                                    {log.msg}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RobinAssignment;
