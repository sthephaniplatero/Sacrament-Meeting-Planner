// Si una página define su propio `openGraph`, REEMPLAZA el del layout raíz
// (incluida la imagen). Por eso las páginas reutilizan esta imagen.
export const defaultOgImage = {
  url: '/opengraph-image', // generada por app/opengraph-image.tsx
  width: 1200,
  height: 630,
  alt: 'Pioneer 1st Ward Sacrament Meeting Planner: weekly agendas, speakers, and hymns',
};
