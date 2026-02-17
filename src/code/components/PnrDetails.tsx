import * as React from 'react';

export interface PnrDetailsProps {
  pnr: {
    locator: string;
    createdDate: string;
    agentId: string;
    pcc: string;
    pax: Array<{
      firstName: string;
      lastName: string;
      phone: string;
    }>;
    segments: Array<{
      origin: string;
      destination: string;
      depDate: string;
      arrDate: string;
      flightNo: string;
      carrier: string;
      carrierName: string;
      duration: string;
      equipment: string;
      class: string;
      cabin: string;
      status: string;
      meal: string;
    }>;
    remarks: string[];
  };
}

export const PnrDetails: React.FC<PnrDetailsProps> = ({ pnr }) => {
  return (
    <>
      <div className='pnr-header'>
        <div className='header-left'>
          <div className='pnr-locator'>PNR No: {pnr.locator ?? 'N/A'}</div>
          <div className='booking-date'>
            Created Date: {pnr.createdDate ? new Date(pnr.createdDate).toLocaleDateString() : 'N/A'}
          </div>
        </div>
        <div className='header-right'>
          <div className='agency-info'>PCC: {pnr.pcc ?? 'N/A'}</div>
          <div className='agent-id'>Agent: {pnr.agentId ?? 'N/A'}</div>
        </div>
      </div>

      <div className='section-title'>Travelers</div>
      <div className='passenger-section'>
        {pnr.pax.map((p, idx) => (
          <div
            key={idx}
            className='passenger-item'
          >
            <span className='pax-name'>
              {p.firstName ?? 'N/A'} {p.lastName ?? 'N/A'}
            </span>
            <span className='pax-contact'>{p.phone ?? 'N/A'}</span>
          </div>
        ))}
      </div>

      <div className='section-title'>Itinerary</div>
      {pnr.segments.map((seg, idx) => (
        <div
          key={idx}
          className='flight-segment'
        >
          <div className='flight-main'>
            <div className='airline-logo'>{seg.carrier}</div>
            <div className='route-info'>
              <div className='stations'>
                {seg.origin} ➝ {seg.destination}
              </div>
              <div className='duration'>
                {seg.carrierName} #{seg.flightNo} • {seg.duration ? seg.duration.replace('.', 'h ') + 'm' : ''}
              </div>
            </div>
          </div>
          <div className='flight-details-grid'>
            <div className='detail-item'>
              <span className='label'>Date</span> {new Date(seg.depDate).toLocaleDateString()}
            </div>
            <div className='detail-item'>
              <span className='label'>Time</span>{' '}
              {new Date(seg.depDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className='detail-item'>
              <span className='label'>Class</span> {seg.class} ({seg.cabin || 'Eco'})
            </div>
            <div className='detail-item'>
              <span className='label'>Equip</span> {seg.equipment}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span className='flight-status-badge'>{seg.status === 'HK' ? 'CONFIRMED' : seg.status}</span>
            </div>
          </div>
        </div>
      ))}

      {pnr.remarks.length > 0 && (
        <>
          <div className='section-title'>Remarks</div>
          <div className='remarks-section'>
            {pnr.remarks.map((rem, idx) => (
              <div
                key={idx}
                className='remark-item'
              >
                {rem}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};
