import React, { useState } from 'react';
import axios from 'axios';

// Sample service names list
const services = [
  'Gaming UI',
  'Auth',
  'Login Service',
  'Matchmaking Service',
  'User Profile DB',
  'Gaming Service',
];

const ServiceMap = () => {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [selectedService, setSelectedService] = useState(null); 

  // Fetch data based on the selected service
  const fetchData = (serviceName) => {
    setLoading(true);
    setError(null); 
    setSelectedService(serviceName); 

    const requestBody = {
      database: 'testdb',
      networkCollection: 'testcollectionB',
      serviceName: serviceName, 
    };

    axios
      .post('http://localhost:8080/TrafficService', requestBody, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        setData(response.data); 
        setLoading(false); 
      })
      .catch((error) => {
        setError('Failed to fetch data'); 
        setLoading(false); 
        console.error('Error fetching data:', error);
      });
  };

  // Handle click or hover on service names
  const handleServiceClick = (serviceName) => {
    fetchData(serviceName); 
  };

  const handleServiceHover = (serviceName) => {
    fetchData(serviceName); 
  };

  // Function to get the highest priority status (Critical > Warning > OK)
  const getServiceStatusColor = (serviceData) => {
    if (!serviceData || !Array.isArray(serviceData)) {
      return 'gray';  // Default to gray if there's no data or it's not an array
    }
  
    // Determine the highest status from multiple entries
    const statusPriority = {
      'Critical': 3,
      'Warning': 2,
      'OK': 1,
    };
  
    const maxStatus = serviceData.reduce((max, item) => {
      return Math.max(max, statusPriority[item.status] || 0);
    }, 0);
  
    if (maxStatus === 3) return 'red';    // Critical
    if (maxStatus === 2) return 'orange'; // Warning
    return 'green';                       // OK
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f4f7fa', minHeight: '100vh' }}>
      {/* Service List - Display each service in cards */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {services.map((service) => (
          <div
            key={service}
            onClick={() => handleServiceClick(service)} 
            onMouseEnter={() => handleServiceHover(service)} 
            style={{
              padding: '20px',
              borderRadius: '10px',
              border: '2px solid #ddd',
              backgroundColor: '#fff',
              cursor: 'pointer',
              width: '200px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              backgroundColor: getServiceStatusColor(data) === 'red' ? 'rgba(255, 0, 0, 0.1)' : getServiceStatusColor(data) === 'orange' ? 'rgba(255, 165, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)', // Dynamically change color based on status
            }}
            onMouseLeave={() => setSelectedService(null)} 
          >
            <div
              style={{
                fontWeight: 'bold',
                color: getServiceStatusColor(data), 
              }}
            >
              {service}
            </div>
          </div>
        ))}
      </div>

      {/* Show loading, error, or data */}
      {loading && <div style={{ textAlign: 'center', fontSize: '18px', color: '#777' }}>Loading...</div>}
      {error && <div style={{ textAlign: 'center', fontSize: '18px', color: 'red' }}>{error}</div>}

      {/* Show detailed data for the selected service */}
      {data && selectedService && (
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h2 style={{ color: '#333', fontSize: '24px' }}>Details for {selectedService}</h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            {data.map((item) => (
              <div key={item._id} style={{ fontSize: '16px', color: '#555' }}>
                <p><strong>Status:</strong> <span style={{ color: getServiceStatusColor([item]) }}>{item.status}</span></p>
                <p><strong>Source IP:</strong> {item.source_ip}</p>
                <p><strong>Destination IP:</strong> {item.destination_ip}</p>
                <p><strong>Service IP:</strong> {item.service_ip.join(', ') || 'N/A'}</p>
                <p><strong>Source Port:</strong> {item.source_port}</p>
                <p><strong>Destination Port:</strong> {item.destination_port}</p>
                <p><strong>Service Port:</strong> {item.service_port.join(', ') || 'N/A'}</p>
                <p><strong>_ID:</strong> {item._id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceMap;
