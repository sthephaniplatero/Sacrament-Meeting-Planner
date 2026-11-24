import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Imagen que aparece al compartir el enlace (WhatsApp, Facebook, Slack, etc.)
// Se genera una vez en el build y queda en caché.
export const alt =
  'Pioneer 1st Ward Sacrament Meeting Planner: weekly agendas, speakers, and hymns';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/church-symbol.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#003057',
          color: '#ffffff',
        }}
      >
        {/* Barra de acento (azul → dorado), igual que en las tarjetas */}
        <div
          style={{
            height: 16,
            width: '100%',
            display: 'flex',
            background: 'linear-gradient(90deg, #003057 0%, #006184 55%, #b3884d 100%)',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 56,
            padding: '0 88px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={160} height={224} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column', width: 780 }}>
            <div
              style={{
                fontSize: 28,
                letterSpacing: 6,
                textTransform: 'uppercase',
                color: '#e2c48f',
              }}
            >
              Pioneer 1st Ward
            </div>
            <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, marginTop: 12 }}>
              Sacrament Meeting Planner
            </div>
            <div style={{ fontSize: 32, marginTop: 24, color: '#d7e3ee' }}>
              Weekly agendas, speakers, hymns &amp; printable bulletins
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
