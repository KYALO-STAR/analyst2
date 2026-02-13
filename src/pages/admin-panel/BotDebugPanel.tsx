import React, { useEffect, useState } from 'react';
import { getAllBots, getBotXmlPublicUrl, getBotXmlSignedUrl } from '@/services/adminSupabase';
import Button from '@/components/shared_ui/button';

type BotRow = {
    id: string;
    name: string;
    file?: string;
    publicUrl?: string | null;
    signedUrl?: string | null;
    fetchStatus?: 'idle' | 'ok' | 'not-found' | 'error' | 'ok-signed';
};

const BotDebugPanel: React.FC = () => {
    const [bots, setBots] = useState<BotRow[]>([]);
    const [loading, setLoading] = useState(false);

    const loadBots = async () => {
        setLoading(true);
        try {
            const data = await getAllBots();
            const rows: BotRow[] = (data || []).map(b => ({ id: b.id, name: b.name, file: b.file }));
            setBots(rows);
        } catch (e) {
            console.error('BotDebugPanel: failed to fetch bots', e);
        } finally {
            setLoading(false);
        }
    };

    const checkUrls = async () => {
        const updated = await Promise.all(
            bots.map(async bot => {
                const publicUrl = getBotXmlPublicUrl(bot.file || '');
                let fetchStatus: BotRow['fetchStatus'] = 'idle';
                let signedUrl: string | null = null;

                // Try public URL first
                if (publicUrl) {
                    try {
                        const res = await fetch(publicUrl, { method: 'GET' });
                        if (res.ok) {
                            fetchStatus = 'ok';
                            return { ...bot, publicUrl, signedUrl: null, fetchStatus };
                        }
                        if (res.status !== 404) {
                            // Non-404 error - we'll still attempt signed URL as fallback
                        }
                    } catch (e) {
                        // fallthrough to signed URL attempt
                    }
                }

                // If public URL missing or failed, try signed URL
                try {
                    signedUrl = await getBotXmlSignedUrl(bot.file || '');
                    if (signedUrl) {
                        try {
                            const res2 = await fetch(signedUrl, { method: 'GET' });
                            if (res2.ok) {
                                fetchStatus = publicUrl ? 'ok-signed' : 'ok';
                            } else if (res2.status === 404) {
                                fetchStatus = 'not-found';
                            } else {
                                fetchStatus = 'error';
                            }
                        } catch (e) {
                            fetchStatus = 'error';
                        }
                    } else {
                        fetchStatus = 'not-found';
                    }
                } catch (e) {
                    fetchStatus = 'error';
                }

                return { ...bot, publicUrl: publicUrl || null, signedUrl, fetchStatus };
            })
        );
        setBots(updated);
    };

    useEffect(() => {
        loadBots();
    }, []);

    return (
        <div style={{ padding: '1rem', border: '1px solid #eee', marginTop: '1rem' }}>
            <h3>Bot Debug Panel</h3>
            <div style={{ marginBottom: '0.5rem' }}>
                <Button onClick={loadBots} secondary size='s'>Refresh Bots</Button>
                <Button onClick={checkUrls} style={{ marginLeft: 8 }} size='s'>Check XML URLs</Button>
            </div>

            {loading ? (
                <div>Loading bots...</div>
            ) : bots.length === 0 ? (
                <div>No bots found.</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Name</th>
                            <th style={{ textAlign: 'left' }}>File</th>
                            <th style={{ textAlign: 'left' }}>Public URL</th>
                            <th style={{ textAlign: 'left' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bots.map(b => (
                            <tr key={b.id} style={{ borderTop: '1px solid #f2f2f2' }}>
                                <td>{b.name}</td>
                                <td>{b.file || '-'}</td>
                                <td style={{ wordBreak: 'break-all' }}>{b.publicUrl || '-'}</td>
                                <td>{b.fetchStatus || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BotDebugPanel;
