export const sectors = [
  { id: '1', name: 'Detailhandel en diensten' },
  {
    id: '2',
    name: 'Horeca',
  },
  {
    id: '3',
    name: 'Ambulante activiteiten',
  },
];

export const TRANSLATION_STATUS = {
  PARTIALLY_TRANSLATED: { id: '1', label: 'Niet vertaalde velden' },
  TRANSLATED: { id: '2', label: 'Vertaald' },
};

export const PUBLICATION_STATUS = {
  DRAFT: { id: '1', label: 'Ontwerp' },
  PUBLISHED: { id: '2', label: 'Gepubliceerd' },
};

export const mockPublicServices = [
  {
    id: '100',
    pid: '1922',
    name: 'Omgevingsvergunning voor kleinhandelsactiviteiten ',
    sector: sectors[0],
  },
  {
    id: '101',
    pid: '1923',
    name: 'Vestigingsvergunning nachtwinkels - phoneshops',
    sector: sectors[0],
  },
  {
    id: '102',
    pid: '1925',
    name: 'Vergunning voor het uitstallen van koopwaar op openbaar domein',
    sector: sectors[0],
  },
  {
    id: '200',
    pid: '1932',
    name: 'Terrasvergunning - inname openbaar domein',
    sector: sectors[1],
  },
  {
    id: '201',
    pid: '1933',
    name: 'Drankvergunning vaste drankgelegenheid ',
    sector: sectors[1],
  },
  {
    id: '300',
    pid: '2123',
    name: 'Vaste standplaats op een openbare markt (abonnement)',
    sector: sectors[2],
  },
];

export let addedMockPublicServices = [
  {
    ...mockPublicServices[0],
    dateModified: new Date(2022, 1, 11, 11, 37),
    translationStatus: TRANSLATION_STATUS.TRANSLATED,
    publicationStatus: PUBLICATION_STATUS.PUBLISHED,
  },
];

export function addPublicService(publicService) {
  addedMockPublicServices.push({
    ...publicService,
    dateModified: new Date(),
    translationStatus: TRANSLATION_STATUS.PARTIALLY_TRANSLATED,
    publicationStatus: PUBLICATION_STATUS.DRAFT,
  });
}
