const RangeBar = ({ highHeading, lowHeading, low, high, current }) => {
    const percent = ((current - low) / (high - low)) * 100;

    return (
        <div style={{ width: '100%', padding: '10px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px', color: '#333' }}>
                <div>
                    <div>{lowHeading}</div>
                    <strong>{low}</strong>
                </div>
                <div style={{ position: 'relative', marginTop: '10px', height: '2px', width: '70%', background: '#f0f0f0', borderRadius: '4px' }}>
                    <div style={{
                        position: 'absolute',
                        left: `${percent}%`,
                        top: '4px',
                        transform: 'translateX(-50%)',
                        width: '0',
                        height: '0',
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderBottom: '8px solid #555'
                    }} />
                </div>
                <div>
                    <div>{highHeading}</div>
                    <strong>{high}</strong>
                </div>
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            </div>
        </div>
    );
};

export default RangeBar;