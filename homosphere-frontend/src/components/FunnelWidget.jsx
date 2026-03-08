import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserProperties, fetchPropertyStats } from '@services/analyticsAPI.js';
import '../styles/FunnelWidget.css'
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    Cell 
} from 'recharts';

const FunnelWidget = () => {
    const { token } = useAuth();
    const [properties, setProperties] = useState([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [insight, setInsight] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user properties on mount
    useEffect(() => {
        const loadProperties = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const userProperties = await fetchUserProperties(token);
                setProperties(userProperties);
                
                // Select first property by default
                if (userProperties.length > 0) {
                    setSelectedPropertyId(userProperties[0].id);
                }
            } catch (err) {
                setError('Failed to load properties');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProperties();
    }, [token]);

    // Fetch stats when property is selected
    useEffect(() => {
        const loadStats = async () => {
            if (!selectedPropertyId || !token) return;

            try {
                const stats = await fetchPropertyStats(selectedPropertyId, token);
                
                // Format data for Recharts
                const formattedData = [
                    { name: 'Impressions', value: stats.impressions, color: '#99BC85' },
                    { name: 'Clicks', value: stats.clicks, color: '#7a9a6a' },
                    { name: 'Leads', value: stats.leads, color: '#5a7a4a' }
                ];
                
                setChartData(formattedData);
                generateInsight(stats);
            } catch (err) {
                setError('Failed to load property stats');
                console.error(err);
            }
        };

        loadStats();
    }, [selectedPropertyId, token]);


    const generateInsight = (stats) => {
        const ctr = stats.clicks / stats.impressions; // Click Through Rate
        const conv = stats.leads / stats.clicks;      // Conversion Rate

        if (ctr < 0.10) {
            setInsight("Low Clicks: Your main photo might not be attractive. Try changing it.");
        } else if (conv < 0.05) {
            setInsight("Low Leads: People click but don't contact. Check your Price or Description.");
        } else {
            setInsight("Great Job! This property is performing well.");
        }
    };

    if (loading) {
        return (
            <div className='main-funnel-widget'>
                <div className="widget-header">
                    <h3>Performance Funnel</h3>
                </div>
                <p style={{ textAlign: 'center', color: '#99BC85' }}>Loading...</p>
            </div>
        );
    }

    if (error || !token) {
        return (
            <div className='main-funnel-widget'>
                <div className="widget-header">
                    <h3>Performance Funnel</h3>
                </div>
                <p style={{ textAlign: 'center', color: '#d32f2f' }}>
                    {error || 'Please sign in to view analytics'}
                </p>
            </div>
        );
    }

    if (properties.length === 0) {
        return (
            <div className='main-funnel-widget'>
                <div className="widget-header">
                    <h3>Performance Funnel</h3>
                </div>
                <p style={{ textAlign: 'center', color: '#99BC85' }}>
                    No properties found. Create a property to see analytics.
                </p>
            </div>
        );
    }


    return(
        <div className='main-funnel-widget'>
            {/* Header Section */}
            <div className="widget-header">
                <h3>Performance Funnel</h3>
                <select 
                    value={selectedPropertyId} 
                    onChange={(e) => setSelectedPropertyId(Number(e.target.value))}
                    className="property-selector"
                >
                    {properties.map(prop => (
                        <option key={prop.id} value={prop.id}>
                            {prop.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Chart Section */}
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" barSize={30} radius={[0, 10, 10, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={'cell-' + index} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Insight/Footer Section */}
            <div className="widget-footer">
                <p className="insight-text">{insight}</p>
                <div className="stats-row">
                    <span>{chartData[0]?.value || 0} Views</span>
                    <span>{chartData[1]?.value || 0} Clicks</span>
                    <span>{chartData[2]?.value || 0} Leads</span>
                </div>
            </div>
        </div>
    );
}

export default FunnelWidget;